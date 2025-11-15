import { PrismaClient, WorkType, JobCategory } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateJobOfferDTO {
  title: string;
  description: string;
  requirements: string[];
  workType: WorkType;
  category: JobCategory;
  location?: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  companyName?: string;
  companyVisible?: boolean;
}

export interface UpdateJobOfferDTO {
  title?: string;
  description?: string;
  requirements?: string[];
  workType?: WorkType;
  category?: JobCategory;
  location?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  companyName?: string;
  companyVisible?: boolean;
  active?: boolean;
}

export class JobOfferService {
  /**
   * Crear una nueva oferta de trabajo
   */
  static async createJobOffer(recruiterId: string, data: CreateJobOfferDTO) {
    const jobOffer = await prisma.jobOffer.create({
      data: {
        recruiterId,
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        workType: data.workType,
        category: data.category,
        location: data.location,
        remote: data.remote,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        salaryCurrency: data.salaryCurrency || 'USD',
        companyName: data.companyName,
        companyVisible: data.companyVisible ?? true,
        active: true,
      },
      include: {
        recruiter: {
          include: {
            profile: true,
          },
        },
      },
    });

    return jobOffer;
  }

  /**
   * Obtener todas las ofertas de un reclutador
   */
  static async getRecruiterJobOffers(recruiterId: string) {
    const jobOffers = await prisma.jobOffer.findMany({
      where: {
        recruiterId,
      },
      include: {
        recruiter: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            swipes: true,
            matches: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jobOffers;
  }

  /**
   * Obtener una oferta específica
   */
  static async getJobOfferById(jobOfferId: string, recruiterId?: string) {
    const jobOffer = await prisma.jobOffer.findUnique({
      where: {
        id: jobOfferId,
      },
      include: {
        recruiter: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            swipes: true,
            matches: true,
          },
        },
      },
    });

    // Verificar que el reclutador sea el dueño si se proporciona recruiterId
    if (jobOffer && recruiterId && jobOffer.recruiterId !== recruiterId) {
      throw new Error('No tienes permiso para ver esta oferta');
    }

    return jobOffer;
  }

  /**
   * Actualizar una oferta de trabajo
   */
  static async updateJobOffer(
    jobOfferId: string,
    recruiterId: string,
    data: UpdateJobOfferDTO
  ) {
    // Verificar que la oferta pertenezca al reclutador
    const existingOffer = await prisma.jobOffer.findUnique({
      where: { id: jobOfferId },
    });

    if (!existingOffer) {
      throw new Error('Oferta no encontrada');
    }

    if (existingOffer.recruiterId !== recruiterId) {
      throw new Error('No tienes permiso para actualizar esta oferta');
    }

    const updatedOffer = await prisma.jobOffer.update({
      where: { id: jobOfferId },
      data: {
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        workType: data.workType,
        category: data.category,
        location: data.location,
        remote: data.remote,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        salaryCurrency: data.salaryCurrency,
        companyName: data.companyName,
        companyVisible: data.companyVisible,
        active: data.active,
      },
      include: {
        recruiter: {
          include: {
            profile: true,
          },
        },
      },
    });

    return updatedOffer;
  }

  /**
   * Eliminar (desactivar) una oferta de trabajo
   */
  static async deleteJobOffer(jobOfferId: string, recruiterId: string) {
    // Verificar que la oferta pertenezca al reclutador
    const existingOffer = await prisma.jobOffer.findUnique({
      where: { id: jobOfferId },
    });

    if (!existingOffer) {
      throw new Error('Oferta no encontrada');
    }

    if (existingOffer.recruiterId !== recruiterId) {
      throw new Error('No tienes permiso para eliminar esta oferta');
    }

    // En lugar de eliminar, desactivamos la oferta
    const deletedOffer = await prisma.jobOffer.update({
      where: { id: jobOfferId },
      data: {
        active: false,
      },
    });

    return deletedOffer;
  }

  /**
   * Activar/desactivar una oferta
   */
  static async toggleJobOfferStatus(jobOfferId: string, recruiterId: string) {
    const existingOffer = await prisma.jobOffer.findUnique({
      where: { id: jobOfferId },
    });

    if (!existingOffer) {
      throw new Error('Oferta no encontrada');
    }

    if (existingOffer.recruiterId !== recruiterId) {
      throw new Error('No tienes permiso para modificar esta oferta');
    }

    const updatedOffer = await prisma.jobOffer.update({
      where: { id: jobOfferId },
      data: {
        active: !existingOffer.active,
      },
      include: {
        recruiter: {
          include: {
            profile: true,
          },
        },
      },
    });

    return updatedOffer;
  }

  /**
   * Obtener ofertas activas (para mostrar a candidatos)
   */
  static async getActiveJobOffers() {
    const jobOffers = await prisma.jobOffer.findMany({
      where: {
        active: true,
      },
      include: {
        recruiter: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jobOffers;
  }
}
