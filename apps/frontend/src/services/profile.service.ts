import api from '@/lib/api';

export interface UpdateProfileData {
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
   * Obtener perfil del usuario actual
   */
  static async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  }

  /**
   * Actualizar perfil del usuario actual
   */
  static async updateProfile(data: UpdateProfileData) {
    const response = await api.put('/profile', data);
    return response.data;
  }
}
