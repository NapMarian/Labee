import { Router, Request, Response, NextFunction } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST /api/upload/profile-image - Subir imagen de perfil
router.post(
  '/profile-image',
  upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    UploadController.uploadProfileImage(req, res).catch(next);
  }
);

// DELETE /api/upload/profile-image - Eliminar imagen de perfil
router.delete(
  '/profile-image',
  (req: Request, res: Response, next: NextFunction) => {
    UploadController.deleteProfileImage(req, res).catch(next);
  }
);

export default router;
