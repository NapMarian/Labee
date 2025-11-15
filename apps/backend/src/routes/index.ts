import { Router } from 'express';
import authRoutes from './auth.routes';
import swipeRoutes from './swipe.routes';
import messageRoutes from './message.routes';
import profileRoutes from './profile.routes';
import uploadRoutes from './upload.routes';
import jobOfferRoutes from './jobOffers.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
router.use('/auth', authRoutes);

// Profile routes
router.use('/profile', profileRoutes);

// Upload routes
router.use('/upload', uploadRoutes);

// Swipe routes
router.use('/swipes', swipeRoutes);

// Message routes
router.use('/messages', messageRoutes);

// Job offer routes
router.use('/job-offers', jobOfferRoutes);

export default router;
