import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { AppError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

export class UploadController {
  /**
   * Subir avatar de usuario (candidato) o logo de empresa (reclutador)
   */
  static async uploadProfileImage(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('Usuario no autenticado', 401);
      }

      if (!req.file) {
        throw new AppError('No se proporcionó ningún archivo', 400);
      }

      // Obtener usuario y perfil
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      if (!user || !user.profile) {
        throw new AppError('Perfil no encontrado', 404);
      }

      // Construir URL de la imagen
      const imageUrl = `/uploads/${req.file.filename}`;

      // Eliminar imagen anterior si existe
      const isCandidate = user.userType === 'CANDIDATE';
      const oldImage = isCandidate ? user.profile.avatar : user.profile.companyLogo;

      if (oldImage) {
        const oldImagePath = path.join(__dirname, '../../', oldImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Actualizar perfil con la nueva imagen
      const updateData = isCandidate
        ? { avatar: imageUrl }
        : { companyLogo: imageUrl };

      const updatedProfile = await prisma.profile.update({
        where: { userId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              userType: true,
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        message: 'Imagen subida exitosamente',
        data: {
          imageUrl,
          profile: updatedProfile
        }
      });
    } catch (error: any) {
      // Si hay error, eliminar el archivo subido
      if (req.file) {
        const filePath = path.join(__dirname, '../../uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      throw error;
    }
  }

  /**
   * Eliminar imagen de perfil
   */
  static async deleteProfileImage(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('Usuario no autenticado', 401);
      }

      // Obtener usuario y perfil
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      if (!user || !user.profile) {
        throw new AppError('Perfil no encontrado', 404);
      }

      const isCandidate = user.userType === 'CANDIDATE';
      const currentImage = isCandidate ? user.profile.avatar : user.profile.companyLogo;

      if (!currentImage) {
        throw new AppError('No hay imagen para eliminar', 400);
      }

      // Eliminar archivo físico
      const imagePath = path.join(__dirname, '../../', currentImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Actualizar perfil
      const updateData = isCandidate
        ? { avatar: null }
        : { companyLogo: null };

      const updatedProfile = await prisma.profile.update({
        where: { userId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              userType: true,
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        message: 'Imagen eliminada exitosamente',
        data: {
          profile: updatedProfile
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
