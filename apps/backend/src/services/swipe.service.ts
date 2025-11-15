import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

export class SwipeService {
  /**
   * Crear un swipe y verificar si hay match
   */
  static async createSwipe(
    swiperId: string,
    targetUserId: string | null,
    jobOfferId: string | null,
    liked: boolean
  ) {
    // Determinar si es candidato swipeando oferta o reclutador swipeando candidato
    const whereClause = jobOfferId
      ? { swiperId, jobOfferId }
      : { swiperId, targetUserId };

    // Verificar que no exista ya un swipe
    const existingSwipe = await prisma.swipe.findFirst({
      where: whereClause,
    });

    if (existingSwipe) {
      throw new AppError('Ya has dado swipe a este perfil/oferta', 409);
    }

    // Crear el swipe
    const swipe = await prisma.swipe.create({
      data: {
        swiperId,
        targetUserId,
        jobOfferId,
        liked,
      },
      include: {
        swiper: {
          include: {
            profile: true,
          },
        },
        targetUser: {
          include: {
            profile: true,
          },
        },
        jobOffer: {
          include: {
            recruiter: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    // Si es LIKE, verificar si hay match recíproco
    let match = null;
    if (liked) {
      match = await this.checkAndCreateMatch(swiperId, targetUserId, jobOfferId);
    }

    return {
      swipe,
      match,
    };
  }

  /**
   * Verificar si existe un swipe recíproco y crear match
   */
  private static async checkAndCreateMatch(
    swiperId: string,
    targetUserId: string | null,
    jobOfferId: string | null
  ) {
    let reciprocalSwipe = null;

    if (jobOfferId) {
      // Candidato dio like a una oferta, buscar si el reclutador dio like al candidato
      const offer = await prisma.jobOffer.findUnique({
        where: { id: jobOfferId },
        select: { recruiterId: true },
      });

      if (!offer) return null;

      reciprocalSwipe = await prisma.swipe.findFirst({
        where: {
          swiperId: offer.recruiterId,
          targetUserId: swiperId,
          liked: true,
        },
      });

      // Si hay match, crear con ambos usuarios
      if (reciprocalSwipe) {
        return await this.createMatchRecord(
          swiperId,
          offer.recruiterId,
          jobOfferId
        );
      }
    } else if (targetUserId) {
      // Reclutador dio like a un candidato, buscar si el candidato dio like a alguna oferta del reclutador
      const recruiterOffers = await prisma.jobOffer.findMany({
        where: { recruiterId: swiperId },
        select: { id: true },
      });

      const offerIds = recruiterOffers.map(o => o.id);

      reciprocalSwipe = await prisma.swipe.findFirst({
        where: {
          swiperId: targetUserId,
          jobOfferId: { in: offerIds },
          liked: true,
        },
      });

      // Si hay match, crear con la oferta específica que el candidato dio like
      if (reciprocalSwipe && reciprocalSwipe.jobOfferId) {
        return await this.createMatchRecord(
          targetUserId,
          swiperId,
          reciprocalSwipe.jobOfferId
        );
      }
    }

    return null;
  }

  /**
   * Crear el registro de match
   */
  private static async createMatchRecord(
    candidateId: string,
    recruiterId: string,
    jobOfferId: string
  ) {
    // Verificar si ya existe un match
    const existingMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { user1Id: candidateId, user2Id: recruiterId, jobOfferId },
          { user1Id: recruiterId, user2Id: candidateId, jobOfferId },
        ],
      },
    });

    if (existingMatch) {
      return existingMatch;
    }

    // Crear el match
    try {
      const match = await prisma.match.create({
        data: {
          user1Id: candidateId,
          user2Id: recruiterId,
          jobOfferId,
          active: true,
        },
        include: {
          user1: {
            include: {
              profile: true,
            },
          },
          user2: {
            include: {
              profile: true,
            },
          },
          jobOffer: true,
        },
      });
      return match;
    } catch (error: any) {
      // Si el error es por duplicado (P2002), buscar y retornar el match existente
      if (error.code === 'P2002') {
        const match = await prisma.match.findFirst({
          where: {
            OR: [
              { user1Id: candidateId, user2Id: recruiterId, jobOfferId },
              { user1Id: recruiterId, user2Id: candidateId, jobOfferId },
            ],
          },
          include: {
            user1: {
              include: {
                profile: true,
              },
            },
            user2: {
              include: {
                profile: true,
              },
            },
            jobOffer: true,
          },
        });

        if (match) {
          return match;
        }
      }
      throw error;
    }
  }

  /**
   * Obtener candidatos potenciales para un reclutador
   */
  static async getPotentialCandidates(recruiterId: string, jobOfferId?: string) {
    // Obtener el perfil del reclutador
    const recruiter = await prisma.user.findUnique({
      where: { id: recruiterId },
      include: { profile: true },
    });

    if (!recruiter || recruiter.userType !== 'RECRUITER') {
      throw new AppError('Usuario no es reclutador', 403);
    }

    // Obtener IDs de candidatos ya swipeados
    const swipedCandidates = await prisma.swipe.findMany({
      where: {
        swiperId: recruiterId,
        targetUserId: { not: null },
      },
      select: { targetUserId: true },
    });

    const swipedIds = swipedCandidates
      .map((s) => s.targetUserId)
      .filter((id): id is string => id !== null);

    // Buscar candidatos que no hayan sido swipeados
    const candidates = await prisma.user.findMany({
      where: {
        id: { notIn: [recruiterId, ...swipedIds] },
        userType: 'CANDIDATE',
        active: true,
      },
      include: {
        profile: true,
      },
      take: 50, // Límite de candidatos por request
    });

    return candidates;
  }

  /**
   * Obtener ofertas potenciales para un candidato
   */
  static async getPotentialOffers(candidateId: string) {
    // Obtener el perfil del candidato
    const candidate = await prisma.user.findUnique({
      where: { id: candidateId },
      include: { profile: true },
    });

    if (!candidate || candidate.userType !== 'CANDIDATE') {
      throw new AppError('Usuario no es candidato', 403);
    }

    // Obtener ofertas ya swipeadas
    const swipedOffers = await prisma.swipe.findMany({
      where: {
        swiperId: candidateId,
        jobOfferId: { not: null },
      },
      select: { jobOfferId: true },
    });

    const swipedIds = swipedOffers
      .map((s) => s.jobOfferId)
      .filter((id): id is string => id !== null);

    // Buscar ofertas que no hayan sido swipeadas y estén activas
    const offers = await prisma.jobOffer.findMany({
      where: {
        id: { notIn: swipedIds },
        active: true,
      },
      include: {
        recruiter: {
          include: {
            profile: true,
          },
        },
      },
      take: 50, // Límite de ofertas por request
      orderBy: {
        createdAt: 'desc',
      },
    });

    return offers;
  }

  /**
   * Obtener matches de un usuario
   */
  static async getUserMatches(userId: string) {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        active: true,
      },
      include: {
        user1: {
          include: {
            profile: true,
          },
        },
        user2: {
          include: {
            profile: true,
          },
        },
        jobOffer: true,
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1, // Solo el último mensaje
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return matches;
  }

  /**
   * Deshacer un match (unmatch)
   */
  static async unmatch(userId: string, matchId: string) {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new AppError('Match no encontrado', 404);
    }

    // Verificar que el usuario sea parte del match
    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new AppError('No tienes permiso para eliminar este match', 403);
    }

    // Marcar como inactivo en lugar de eliminar
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: { active: false },
    });

    return updatedMatch;
  }
}
