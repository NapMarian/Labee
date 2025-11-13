import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ProfileService } from '@/services/profile.service';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { User, Building2, MapPin, Phone, Briefcase, Award, Save, Loader2 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuthStore();
  const isCandidate = user?.userType === 'CANDIDATE';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Datos del perfil
  const [formData, setFormData] = useState({
    // Común
    name: user?.profile?.name || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    phone: user?.profile?.phone || '',

    // Candidato
    skills: user?.profile?.skills?.join(', ') || '',
    education: user?.profile?.education || '',
    yearsExperience: user?.profile?.yearsExperience || '',

    // Reclutador
    companyName: user?.profile?.companyName || '',
    companyWebsite: user?.profile?.companyWebsite || '',
    position: user?.profile?.position || '',
  });

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        name: user.profile.name || '',
        bio: user.profile.bio || '',
        location: user.profile.location || '',
        phone: user.profile.phone || '',
        skills: user.profile.skills?.join(', ') || '',
        education: user.profile.education || '',
        yearsExperience: user.profile.yearsExperience || '',
        companyName: user.profile.companyName || '',
        companyWebsite: user.profile.companyWebsite || '',
        position: user.profile.position || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Preparar datos para enviar
      const dataToSend: any = {
        name: formData.name,
        bio: formData.bio || null,
        location: formData.location || null,
        phone: formData.phone || null,
      };

      // Agregar campos específicos según el tipo de usuario
      if (isCandidate) {
        dataToSend.skills = formData.skills
          ? formData.skills.split(',').map(s => s.trim()).filter(s => s)
          : [];
        dataToSend.education = formData.education || null;
        dataToSend.yearsExperience = formData.yearsExperience
          ? parseInt(formData.yearsExperience.toString())
          : null;
      } else {
        dataToSend.companyName = formData.companyName || null;
        dataToSend.companyWebsite = formData.companyWebsite || null;
        dataToSend.position = formData.position || null;
      }

      // Actualizar perfil
      await ProfileService.updateProfile(dataToSend);

      // Recargar usuario en el store
      await useAuthStore.getState().fetchUser();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 rounded-xl">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Mi Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isCandidate ? 'Actualiza tu información profesional' : 'Actualiza la información de tu empresa'}
          </p>
        </div>
      </div>

      {/* Mensajes de éxito/error */}
      {success && (
        <Card className="backdrop-blur-xl bg-green-100/80 dark:bg-green-900/30 border border-green-300/50 dark:border-green-700/50">
          <div className="p-4 text-center text-green-700 dark:text-green-300">
            ✓ Perfil actualizado correctamente
          </div>
        </Card>
      )}

      {error && (
        <Card className="backdrop-blur-xl bg-red-100/80 dark:bg-red-900/30 border border-red-300/50 dark:border-red-700/50">
          <div className="p-4 text-center text-red-700 dark:text-red-300">
            {error}
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10">
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <User className="w-5 h-5" />
              Información Básica
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre completo *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Ubicación
                </label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ciudad, País"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Teléfono
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+54 11 1234-5678"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Biografía
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder={isCandidate ? "Cuéntanos sobre ti, tu experiencia y objetivos profesionales..." : "Describe tu empresa y lo que buscan en candidatos..."}
                rows={4}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm"
              />
            </div>
          </div>
        </Card>

        {/* Información de Candidato */}
        {isCandidate && (
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10">
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Información Profesional
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Award className="w-4 h-4 inline mr-1" />
                    Años de experiencia
                  </label>
                  <Input
                    type="number"
                    name="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleChange}
                    placeholder="5"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Educación
                  </label>
                  <Input
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="Universidad, Título"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Habilidades
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    (separadas por comas)
                  </span>
                </label>
                <Input
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="JavaScript, React, Node.js, TypeScript"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Información de Reclutador */}
        {!isCandidate && (
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10">
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Información de la Empresa
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre de la empresa *
                  </label>
                  <Input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="TechCorp"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tu posición
                  </label>
                  <Input
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="HR Manager"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sitio web de la empresa
                  </label>
                  <Input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://www.empresa.com"
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Botón de guardar */}
        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
