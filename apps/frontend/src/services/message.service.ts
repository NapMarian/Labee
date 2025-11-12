import api from '@/lib/api';

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender: {
    id: string;
    email: string;
    userType: string;
    profile: {
      name: string;
      avatar?: string;
    };
  };
}

export interface Conversation {
  id: string;
  user1Id: string;
  user2Id: string;
  jobOfferId: string;
  active: boolean;
  createdAt: string;
  unreadCount: number;
  user1: {
    id: string;
    email: string;
    userType: string;
    profile: {
      name: string;
      avatar?: string;
    };
  };
  user2: {
    id: string;
    email: string;
    userType: string;
    profile: {
      name: string;
      avatar?: string;
    };
  };
  jobOffer: {
    id: string;
    title: string;
    companyName?: string;
  };
  messages: Message[];
}

export class MessageService {
  /**
   * Obtener todas las conversaciones del usuario
   */
  static async getConversations(): Promise<Conversation[]> {
    const response = await api.get('/messages', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    return response.data;
  }

  /**
   * Obtener mensajes de un match específico
   */
  static async getMatchMessages(matchId: string): Promise<Message[]> {
    const response = await api.get(`/messages/${matchId}`);
    return response.data;
  }

  /**
   * Enviar un mensaje
   */
  static async sendMessage(matchId: string, content: string): Promise<Message> {
    const response = await api.post(`/messages/${matchId}`, { content });
    return response.data;
  }

  /**
   * Marcar mensajes como leídos
   */
  static async markAsRead(matchId: string): Promise<void> {
    await api.put(`/messages/${matchId}/read`);
  }
}
