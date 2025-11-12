import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/message.service';

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

    res.json({
      success: true,
      data: result,
      message: 'Mensajes marcados como leídos',
    });
  } catch (error) {
    next(error);
  }
};
