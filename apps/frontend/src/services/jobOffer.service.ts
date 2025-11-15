import api from '@/lib/api';

export interface JobOffer {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  requirements: string[];
  workType: string;
  category: string;
  location?: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  companyName?: string;
  companyVisible: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  recruiter?: any;
  _count?: {
    swipes: number;
    matches: number;
  };
}

export interface CreateJobOfferDTO {
  title: string;
  description: string;
  requirements: string[];
  workType: string;
  category: string;
  location?: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  companyName?: string;
  companyVisible?: boolean;
}

export interface UpdateJobOfferDTO {
  title?: string;
  description?: string;
  requirements?: string[];
  workType?: string;
  category?: string;
  location?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  companyName?: string;
  companyVisible?: boolean;
  active?: boolean;
}

export class JobOfferService {
  /**
   * Obtener todas las ofertas del reclutador autenticado
   */
  static async getMyJobOffers(): Promise<JobOffer[]> {
    const response = await api.get<JobOffer[]>('/job-offers/my-offers');
    return response.data;
  }

  /**
   * Crear una nueva oferta
   */
  static async createJobOffer(data: CreateJobOfferDTO): Promise<JobOffer> {
    const response = await api.post<JobOffer>('/job-offers', data);
    return response.data;
  }

  /**
   * Obtener una oferta específica
   */
  static async getJobOfferById(id: string): Promise<JobOffer> {
    const response = await api.get<JobOffer>(`/job-offers/${id}`);
    return response.data;
  }

  /**
   * Actualizar una oferta
   */
  static async updateJobOffer(id: string, data: UpdateJobOfferDTO): Promise<JobOffer> {
    const response = await api.put<JobOffer>(`/job-offers/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar (desactivar) una oferta
   */
  static async deleteJobOffer(id: string): Promise<void> {
    await api.delete(`/job-offers/${id}`);
  }

  /**
   * Activar/desactivar una oferta
   */
  static async toggleJobOfferStatus(id: string): Promise<JobOffer> {
    const response = await api.patch<JobOffer>(`/job-offers/${id}/toggle-status`);
    return response.data;
  }
}
