import { Request, Response, NextFunction } from 'express';
import { JobOfferService } from '../services/jobOffer.service';
import { AppError } from '../middlewares/error.middleware';

/**
 * Crear una nueva oferta de trabajo
 */
export const createJobOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recruiterId = req.user!.userId;
    const {
      title,
      description,
      requirements,
      workType,
      category,
      location,
      remote,
      salaryMin,
      salaryMax,
      salaryCurrency,
      companyName,
      companyVisible,
    } = req.body;

    // Validaciones
    if (!title || title.trim().length < 3) {
      throw new AppError('El título debe tener al menos 3 caracteres', 400);
    }

    if (!description || description.trim().length < 10) {
      throw new AppError('La descripción debe tener al menos 10 caracteres', 400);
    }

    if (!workType) {
      throw new AppError('El tipo de trabajo es requerido', 400);
    }

    if (!category) {
      throw new AppError('La categoría es requerida', 400);
    }

    const jobOffer = await JobOfferService.createJobOffer(recruiterId, {
      title,
      description,
      requirements: requirements || [],
      workType,
      category,
      location,
      remote: remote ?? false,
      salaryMin,
      salaryMax,
      salaryCurrency,
      companyName,
      companyVisible,
    });

    res.status(201).json({
      success: true,
      data: jobOffer,
      message: 'Oferta creada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener todas las ofertas del reclutador autenticado
 */
export const getMyJobOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recruiterId = req.user!.userId;
    const jobOffers = await JobOfferService.getRecruiterJobOffers(recruiterId);

    res.json({
      success: true,
      data: jobOffers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener una oferta específica
 */
export const getJobOfferById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user?.userId;

    const jobOffer = await JobOfferService.getJobOfferById(id, recruiterId);

    if (!jobOffer) {
      throw new AppError('Oferta no encontrada', 404);
    }

    res.json({
      success: true,
      data: jobOffer,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar una oferta de trabajo
 */
export const updateJobOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user!.userId;
    const {
      title,
      description,
      requirements,
      workType,
      category,
      location,
      remote,
      salaryMin,
      salaryMax,
      salaryCurrency,
      companyName,
      companyVisible,
      active,
    } = req.body;

    const updatedOffer = await JobOfferService.updateJobOffer(id, recruiterId, {
      title,
      description,
      requirements,
      workType,
      category,
      location,
      remote,
      salaryMin,
      salaryMax,
      salaryCurrency,
      companyName,
      companyVisible,
      active,
    });

    res.json({
      success: true,
      data: updatedOffer,
      message: 'Oferta actualizada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar (desactivar) una oferta de trabajo
 */
export const deleteJobOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user!.userId;

    await JobOfferService.deleteJobOffer(id, recruiterId);

    res.json({
      success: true,
      message: 'Oferta eliminada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Activar/desactivar una oferta
 */
export const toggleJobOfferStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user!.userId;

    const updatedOffer = await JobOfferService.toggleJobOfferStatus(
      id,
      recruiterId
    );

    res.json({
      success: true,
      data: updatedOffer,
      message: `Oferta ${updatedOffer.active ? 'activada' : 'desactivada'} exitosamente`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener ofertas activas (público - para candidatos)
 */
export const getActiveJobOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobOffers = await JobOfferService.getActiveJobOffers();

    res.json({
      success: true,
      data: jobOffers,
    });
  } catch (error) {
    next(error);
  }
};
