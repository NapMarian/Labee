import api from '@/lib/api';
import { User, JobOffer, Match } from '@/types';

export interface SwipeResponse {
  swipe: any;
  match: Match | null;
}

export class SwipeService {
  /**
   * Obtener perfiles/ofertas potenciales para swipear
   * - Para candidatos: retorna ofertas de trabajo
   * - Para reclutadores: retorna candidatos
   */
  static async getPotentialMatches(jobOfferId?: string): Promise<User[] | JobOffer[]> {
    const params = jobOfferId ? { jobOfferId } : {};
    const response = await api.get<User[] | JobOffer[]>('/swipes/potential', { params });
    return response.data || [];
  }

  /**
   * Crear un swipe (LIKE o PASS)
   */
  static async createSwipe(
    targetId: string | undefined,
    swipeType: 'LIKE' | 'PASS',
    jobOfferId?: string
  ): Promise<SwipeResponse> {
    const response = await api.post<SwipeResponse>('/swipes', {
      targetId: targetId || null,
      jobOfferId: jobOfferId || null,
      swipeType,
    });
    return response.data!;
  }

  /**
   * Obtener matches del usuario
   */
  static async getMatches(): Promise<Match[]> {
    const response = await api.get<Match[]>('/swipes/matches');
    return response.data || [];
  }

  /**
   * Eliminar un match
   */
  static async unmatch(matchId: string): Promise<Match> {
    const response = await api.delete<Match>(`/swipes/matches/${matchId}`);
    return response.data!;
  }
}
