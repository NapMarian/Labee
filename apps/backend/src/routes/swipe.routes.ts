import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createSwipe,
  getPotentialMatches,
  getMatches,
  unmatch,
} from '../controllers/swipe.controller';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST /api/swipes - Crear un swipe (like o pass)
router.post('/', createSwipe);

// GET /api/swipes/potential - Obtener perfiles/ofertas para swipear
router.get('/potential', getPotentialMatches);

// GET /api/swipes/matches - Obtener matches del usuario
router.get('/matches', getMatches);

// DELETE /api/swipes/matches/:matchId - Eliminar un match
router.delete('/matches/:matchId', unmatch);

export default router;
