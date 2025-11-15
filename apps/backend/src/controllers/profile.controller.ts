import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service';

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const profile = await ProfileService.getProfile(userId);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const {
      name,
      bio,
      location,
      phone,
      currentPosition,
      skills,
      education,
      yearsExperience,
      workTypes,
      categories,
      companyName,
      companyWebsite,
      position,
    } = req.body;

    // Validaciones básicas
    if (name && name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'El nombre debe tener al menos 2 caracteres',
      });
    }

    const updatedProfile = await ProfileService.updateProfile(userId, {
      name,
      bio,
      location,
      phone,
      currentPosition,
      skills,
      education,
      yearsExperience: yearsExperience ? parseInt(yearsExperience) : undefined,
      workTypes,
      categories,
      companyName,
      companyWebsite,
      position,
    });

    res.json({
      success: true,
      data: updatedProfile,
      message: 'Perfil actualizado correctamente',
    });
  } catch (error) {
    next(error);
  }
};
