import api from '@/lib/api';

export class UploadService {
  /**
   * Subir imagen de perfil (avatar o logo)
   */
  static async uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }

  /**
   * Eliminar imagen de perfil
   */
  static async deleteProfileImage() {
    const response = await api.delete('/upload/profile-image');
    return response.data;
  }

  /**
   * Validar archivo antes de subir
   */
  static validateImage(file: File): { valid: boolean; error?: string } {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de archivo no permitido. Solo se aceptan JPG, PNG y WEBP'
      };
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'El archivo es demasiado grande. El tamaño máximo es 5MB'
      };
    }

    return { valid: true };
  }
}
