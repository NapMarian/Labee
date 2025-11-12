import { Request, Response, NextFunction } from 'express';
import { SwipeService } from '../services/swipe.service';

export const createSwipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const swiperId = req.user!.userId;
    const { targetId, jobOfferId, swipeType } = req.body;

    // Validar swipeType
    if (!['LIKE', 'PASS'].includes(swipeType)) {
      return res.status(400).json({
        success: false,
        message: 'SwipeType inválido. Debe ser LIKE o PASS',
      });
    }

    // Convertir swipeType a boolean
    const liked = swipeType === 'LIKE';

    const result = await SwipeService.createSwipe(
      swiperId,
      targetId || null,
      jobOfferId || null,
      liked
    );

    res.status(201).json({
      success: true,
      data: result,
      message: result.match ? '¡Match! 🎉' : 'Swipe registrado',
    });
  } catch (error) {
    next(error);
  }
};

export const getPotentialMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const userType = req.user!.userType;
    const { jobOfferId } = req.query;

    let potentialMatches;

    if (userType === 'RECRUITER') {
      potentialMatches = await SwipeService.getPotentialCandidates(
        userId,
        jobOfferId as string | undefined
      );
    } else {
      potentialMatches = await SwipeService.getPotentialOffers(userId);
    }

    res.json({
      success: true,
      data: potentialMatches,
    });
  } catch (error) {
    next(error);
  }
};

export const getMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;

    const matches = await SwipeService.getUserMatches(userId);

    res.json({
      success: true,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

export const unmatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { matchId } = req.params;

    const match = await SwipeService.unmatch(userId, matchId);

    res.json({
      success: true,
      data: match,
      message: 'Match eliminado',
    });
  } catch (error) {
    next(error);
  }
};
