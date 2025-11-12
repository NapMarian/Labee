import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

export class MessageService {
  /**
   * Obtener mensajes de un match específico
   */
  static async getMatchMessages(matchId: string, userId: string) {
    // Verificar que el usuario sea parte del match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new AppError('Match no encontrado', 404);
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new AppError('No tienes permiso para ver estos mensajes', 403);
    }

    // Obtener mensajes del match
    const messages = await prisma.message.findMany({
      where: { matchId },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages;
  }

  /**
   * Enviar un mensaje
   */
  static async sendMessage(
    matchId: string,
    senderId: string,
    content: string
  ) {
    // Verificar que el usuario sea parte del match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new AppError('Match no encontrado', 404);
    }

    if (match.user1Id !== senderId && match.user2Id !== senderId) {
      throw new AppError('No tienes permiso para enviar mensajes en este match', 403);
    }

    if (!match.active) {
      throw new AppError('Este match ya no está activo', 400);
    }

    // Validar contenido
    if (!content || content.trim().length === 0) {
      throw new AppError('El mensaje no puede estar vacío', 400);
    }

    if (content.length > 5000) {
      throw new AppError('El mensaje es demasiado largo (máximo 5000 caracteres)', 400);
    }

    // Crear mensaje
    const message = await prisma.message.create({
      data: {
        matchId,
        senderId,
        content: content.trim(),
      },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
      },
    });

    return message;
  }

  /**
   * Marcar mensajes como leídos
   */
  static async markMessagesAsRead(matchId: string, userId: string) {
    // Verificar que el usuario sea parte del match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new AppError('Match no encontrado', 404);
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new AppError('No tienes permiso para marcar estos mensajes', 403);
    }

    // Marcar como leídos todos los mensajes que NO fueron enviados por el usuario
    const result = await prisma.message.updateMany({
      where: {
        matchId,
        senderId: { not: userId },
        read: false,
      },
      data: {
        read: true,
      },
    });

    return result;
  }

  /**
   * Obtener conversaciones (matches con último mensaje)
   */
  static async getConversations(userId: string) {
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
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calcular mensajes no leídos para cada conversación
    const conversationsWithUnread = await Promise.all(
      matches.map(async (match) => {
        const unreadCount = await prisma.message.count({
          where: {
            matchId: match.id,
            senderId: { not: userId },
            read: false,
          },
        });

        return {
          ...match,
          unreadCount,
        };
      })
    );

    return conversationsWithUnread;
  }
}
