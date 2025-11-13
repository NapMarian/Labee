import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/profile - Obtener perfil del usuario actual
router.get('/', getProfile);

// PUT /api/profile - Actualizar perfil del usuario actual
router.put('/', updateProfile);

export default router;
