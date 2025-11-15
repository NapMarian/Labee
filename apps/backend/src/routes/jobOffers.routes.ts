import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createJobOffer,
  getMyJobOffers,
  getJobOfferById,
  updateJobOffer,
  deleteJobOffer,
  toggleJobOfferStatus,
} from '../controllers/jobOffer.controller';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener todas las ofertas del reclutador autenticado
router.get('/my-offers', getMyJobOffers);

// Crear una nueva oferta
router.post('/', createJobOffer);

// Obtener una oferta específica
router.get('/:id', getJobOfferById);

// Actualizar una oferta
router.put('/:id', updateJobOffer);

// Eliminar (desactivar) una oferta
router.delete('/:id', deleteJobOffer);

// Activar/desactivar una oferta
router.patch('/:id/toggle-status', toggleJobOfferStatus);

export default router;
