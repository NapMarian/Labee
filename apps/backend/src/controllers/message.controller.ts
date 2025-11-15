import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/message.service';
import { getIO } from '../config/socket';

export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;

    const conversations = await MessageService.getConversations(userId);

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const getMatchMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { matchId } = req.params;

    const messages = await MessageService.getMatchMessages(matchId, userId);

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { matchId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'El contenido del mensaje es requerido',
      });
    }

    const message = await MessageService.sendMessage(matchId, userId, content);

    // Emit real-time message event to match room
    try {
      const io = getIO();
      io.to(`match:${matchId}`).emit('new_message', {
        message,
        matchId,
      });
      console.log(`📤 Emitted new_message to match:${matchId}`);
    } catch (socketError) {
      console.error('Error emitting socket event:', socketError);
      // Continue anyway - message was saved to DB
    }

    res.status(201).json({
      success: true,
      data: message,
      message: 'Mensaje enviado',
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { matchId } = req.params;

    const result = await MessageService.markMessagesAsRead(matchId, userId);

    // Emit read status update to match room
    try {
      const io = getIO();
      io.to(`match:${matchId}`).emit('messages_read', {
        matchId,
        userId,
        count: result.count,
      });
      console.log(`✅ Emitted messages_read to match:${matchId}`);
    } catch (socketError) {
      console.error('Error emitting socket event:', socketError);
    }

    res.json({
      success: true,
      data: result,
      message: 'Mensajes marcados como leídos',
    });
  } catch (error) {
    next(error);
  }
};
