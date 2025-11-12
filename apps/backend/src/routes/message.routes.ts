import { Router } from 'express';
import {
  getConversations,
  getMatchMessages,
  sendMessage,
  markAsRead,
} from '../controllers/message.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/messages - Obtener todas las conversaciones del usuario
router.get('/', getConversations);

// GET /api/messages/:matchId - Obtener mensajes de un match específico
router.get('/:matchId', getMatchMessages);

// POST /api/messages/:matchId - Enviar un mensaje
router.post('/:matchId', sendMessage);

// PUT /api/messages/:matchId/read - Marcar mensajes como leídos
router.put('/:matchId/read', markAsRead);

export default router;
