import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

interface UpdateProfileData {
  // Común
  name?: string;
  bio?: string;
  location?: string;
  phone?: string;

  // Candidato
  skills?: string[];
  education?: string;
  yearsExperience?: number;

  // Reclutador
  companyName?: string;
  companyWebsite?: string;
  position?: string;
}

export class ProfileService {
  /**
   * Obtener perfil del usuario
   */
  static async getProfile(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            userType: true,
          },
        },
      },
    });

    if (!profile) {
      throw new AppError('Perfil no encontrado', 404);
    }

    return profile;
  }

  /**
   * Actualizar perfil del usuario
   */
  static async updateProfile(userId: string, data: UpdateProfileData) {
    // Verificar que el perfil existe
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new AppError('Perfil no encontrado', 404);
    }

    // Preparar datos para actualizar
    const updateData: any = {};

    // Campos comunes
    if (data.name !== undefined) updateData.name = data.name;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.phone !== undefined) updateData.phone = data.phone;

    // Campos de candidato
    if (data.skills !== undefined) updateData.skills = data.skills;
    if (data.education !== undefined) updateData.education = data.education;
    if (data.yearsExperience !== undefined) updateData.yearsExperience = data.yearsExperience;

    // Campos de reclutador
    if (data.companyName !== undefined) updateData.companyName = data.companyName;
    if (data.companyWebsite !== undefined) updateData.companyWebsite = data.companyWebsite;
    if (data.position !== undefined) updateData.position = data.position;

    // Actualizar perfil
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            userType: true,
          },
        },
      },
    });

    return updatedProfile;
  }
}
