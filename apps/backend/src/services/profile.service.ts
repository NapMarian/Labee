import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

interface UpdateProfileData {
  // Común
  name?: string;
  bio?: string;
  location?: string;
  phone?: string;
  avatar?: string;

  // Candidato
  headline?: string;
  currentPosition?: string;
  skills?: string[];
  education?: string;
  yearsExperience?: number;
  workTypes?: string[];
  categories?: string[];

  // Preferencias de trabajo del candidato
  workModality?: string;
  availableFrom?: Date | string;
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  salaryCurrency?: string;

  // Información adicional del candidato
  languages?: any;
  certifications?: string[];
  portfolio?: string;
  linkedin?: string;
  github?: string;

  // Reclutador
  companyName?: string;
  companyWebsite?: string;
  position?: string;
  companyLogo?: string;

  // Información adicional de la empresa (reclutador)
  companyDescription?: string;
  companySize?: string;
  industry?: string;
  foundedYear?: number;
  companyLinkedin?: string;
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
    if (data.avatar !== undefined) updateData.avatar = data.avatar;

    // Campos de candidato
    if (data.headline !== undefined) updateData.headline = data.headline;
    if (data.currentPosition !== undefined) updateData.currentPosition = data.currentPosition;
    if (data.skills !== undefined) updateData.skills = data.skills;
    if (data.education !== undefined) updateData.education = data.education;
    if (data.yearsExperience !== undefined) updateData.yearsExperience = data.yearsExperience;
    if (data.workTypes !== undefined) updateData.workTypes = data.workTypes;
    if (data.categories !== undefined) updateData.categories = data.categories;

    // Preferencias de trabajo del candidato
    if (data.workModality !== undefined) updateData.workModality = data.workModality;
    if (data.availableFrom !== undefined) updateData.availableFrom = data.availableFrom;
    if (data.expectedSalaryMin !== undefined) updateData.expectedSalaryMin = data.expectedSalaryMin;
    if (data.expectedSalaryMax !== undefined) updateData.expectedSalaryMax = data.expectedSalaryMax;
    if (data.salaryCurrency !== undefined) updateData.salaryCurrency = data.salaryCurrency;

    // Información adicional del candidato
    if (data.languages !== undefined) updateData.languages = data.languages;
    if (data.certifications !== undefined) updateData.certifications = data.certifications;
    if (data.portfolio !== undefined) updateData.portfolio = data.portfolio;
    if (data.linkedin !== undefined) updateData.linkedin = data.linkedin;
    if (data.github !== undefined) updateData.github = data.github;

    // Campos de reclutador
    if (data.companyName !== undefined) updateData.companyName = data.companyName;
    if (data.companyWebsite !== undefined) updateData.companyWebsite = data.companyWebsite;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.companyLogo !== undefined) updateData.companyLogo = data.companyLogo;

    // Información adicional de la empresa (reclutador)
    if (data.companyDescription !== undefined) updateData.companyDescription = data.companyDescription;
    if (data.companySize !== undefined) updateData.companySize = data.companySize;
    if (data.industry !== undefined) updateData.industry = data.industry;
    if (data.foundedYear !== undefined) updateData.foundedYear = data.foundedYear;
    if (data.companyLinkedin !== undefined) updateData.companyLinkedin = data.companyLinkedin;

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
