import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuthStore } from '@/store/authStore';
import { ProfileService } from '@/services/profile.service';
import { UploadService } from '@/services/upload.service';
import { getImageUrl } from '@/lib/api';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ImageCropModal } from '@/components/ImageCropModal';
import { User, Building2, MapPin, Phone, Briefcase, Award, Save, Loader2, X, Plus, Camera, Trash2 } from 'lucide-react';

// Predefined skills list
const AVAILABLE_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
  'HTML/CSS', 'Angular', 'Vue.js', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker',
  'Kubernetes', 'Git', 'Agile', 'Scrum', 'REST APIs', 'GraphQL', 'Testing', 'CI/CD',
  'Marketing Digital', 'SEO', 'SEM', 'Redes Sociales', 'Análisis de Datos', 'Excel',
  'Power BI', 'Tableau', 'Ventas', 'Atención al Cliente', 'Liderazgo', 'Comunicación',
  'Trabajo en Equipo', 'Gestión de Proyectos', 'Resolución de Problemas', 'Creatividad'
];

const WORK_TYPES = [
  { value: 'FULL_TIME', label: 'Tiempo Completo' },
  { value: 'PART_TIME', label: 'Medio Tiempo' },
  { value: 'FREELANCE', label: 'Freelance' },
  { value: 'INTERNSHIP', label: 'Pasantía' }
];

const JOB_CATEGORIES = [
  { value: 'TECHNOLOGY', label: 'Tecnología' },
  { value: 'SALES', label: 'Ventas' },
  { value: 'ADMINISTRATION', label: 'Administración' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'DESIGN', label: 'Diseño' },
  { value: 'FINANCE', label: 'Finanzas' },
  { value: 'HR', label: 'Recursos Humanos' },
  { value: 'OPERATIONS', label: 'Operaciones' },
  { value: 'HEALTHCARE', label: 'Salud' },
  { value: 'EDUCATION', label: 'Educación' },
  { value: 'CONSTRUCTION', label: 'Construcción' },
  { value: 'HOSPITALITY', label: 'Hospitalidad' },
  { value: 'MANUFACTURING', label: 'Manufactura' },
  { value: 'LOGISTICS', label: 'Logística' },
  { value: 'LEGAL', label: 'Legal' },
  { value: 'MEDIA', label: 'Medios' },
  { value: 'OTHER', label: 'Otro' }
];

const WORK_MODALITIES = [
  { value: 'REMOTE', label: 'Remoto' },
  { value: 'ONSITE', label: 'Presencial' },
  { value: 'HYBRID', label: 'Híbrido' }
];

const COMPANY_SIZES = [
  { value: 'STARTUP', label: 'Startup (1-10)' },
  { value: 'SMALL', label: 'Pequeña (11-50)' },
  { value: 'MEDIUM', label: 'Mediana (51-200)' },
  { value: 'LARGE', label: 'Grande (201-1000)' },
  { value: 'ENTERPRISE', label: 'Empresa (1000+)' }
];

const LANGUAGE_LEVELS = [
  { value: 'BASIC', label: 'Básico' },
  { value: 'INTERMEDIATE', label: 'Intermedio' },
  { value: 'ADVANCED', label: 'Avanzado' },
  { value: 'NATIVE', label: 'Nativo' }
];

export default function Profile() {
  const { user } = useAuthStore();
  const isCandidate = user?.userType === 'CANDIDATE';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for image upload
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for skill selector
  const [skillInput, setSkillInput] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const skillInputRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Datos del perfil
  const [formData, setFormData] = useState({
    // Común
    name: user?.profile?.name || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    phone: user?.profile?.phone || '',

    // Candidato
    headline: user?.profile?.headline || '',
    currentPosition: user?.profile?.currentPosition || '',
    skills: user?.profile?.skills || [],
    education: user?.profile?.education || '',
    yearsExperience: user?.profile?.yearsExperience || '',
    workTypes: user?.profile?.workTypes || [],
    categories: user?.profile?.categories || [],

    // Preferencias de trabajo del candidato
    workModality: user?.profile?.workModality || '',
    availableFrom: user?.profile?.availableFrom || '',
    expectedSalaryMin: user?.profile?.expectedSalaryMin || '',
    expectedSalaryMax: user?.profile?.expectedSalaryMax || '',
    salaryCurrency: user?.profile?.salaryCurrency || 'USD',

    // Información adicional del candidato
    certifications: user?.profile?.certifications || [],
    portfolio: user?.profile?.portfolio || '',
    linkedin: user?.profile?.linkedin || '',
    github: user?.profile?.github || '',

    // Reclutador
    companyName: user?.profile?.companyName || '',
    companyWebsite: user?.profile?.companyWebsite || '',
    position: user?.profile?.position || '',

    // Información adicional de la empresa (reclutador)
    companyDescription: user?.profile?.companyDescription || '',
    companySize: user?.profile?.companySize || '',
    industry: user?.profile?.industry || '',
    foundedYear: user?.profile?.foundedYear || '',
    companyLinkedin: user?.profile?.companyLinkedin || '',
  });

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        name: user.profile.name || '',
        bio: user.profile.bio || '',
        location: user.profile.location || '',
        phone: user.profile.phone || '',
        headline: user.profile.headline || '',
        currentPosition: user.profile.currentPosition || '',
        skills: user.profile.skills || [],
        education: user.profile.education || '',
        yearsExperience: user.profile.yearsExperience || '',
        workTypes: user.profile.workTypes || [],
        categories: user.profile.categories || [],
        workModality: user.profile.workModality || '',
        availableFrom: user.profile.availableFrom || '',
        expectedSalaryMin: user.profile.expectedSalaryMin || '',
        expectedSalaryMax: user.profile.expectedSalaryMax || '',
        salaryCurrency: user.profile.salaryCurrency || 'USD',
        certifications: user.profile.certifications || [],
        portfolio: user.profile.portfolio || '',
        linkedin: user.profile.linkedin || '',
        github: user.profile.github || '',
        companyName: user.profile.companyName || '',
        companyWebsite: user.profile.companyWebsite || '',
        position: user.profile.position || '',
        companyDescription: user.profile.companyDescription || '',
        companySize: user.profile.companySize || '',
        industry: user.profile.industry || '',
        foundedYear: user.profile.foundedYear || '',
        companyLinkedin: user.profile.companyLinkedin || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Skills handlers
  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setSkillInput('');
    setShowSkillDropdown(false);
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const filteredSkills = AVAILABLE_SKILLS.filter(
    skill => skill.toLowerCase().includes(skillInput.toLowerCase()) && !formData.skills.includes(skill)
  );

  // Certification handlers
  const [certInput, setCertInput] = useState('');

  const addCertification = () => {
    if (certInput && !formData.certifications.includes(certInput)) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certInput]
      }));
      setCertInput('');
    }
  };

  const removeCertification = (certToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== certToRemove)
    }));
  };

  // Image upload handlers
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar archivo
    const validation = UploadService.validateImage(file);
    if (!validation.valid) {
      setError(validation.error || 'Error al validar la imagen');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Crear URL temporal para mostrar en el modal de crop
    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);

    // Resetear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setShowCropModal(false);
    setImageToCrop(null);
    setUploading(true);
    setError(null);

    try {
      // Convertir el blob a File para subirlo
      const croppedFile = new File([croppedImageBlob], 'profile-image.jpg', {
        type: 'image/jpeg',
      });

      const response = await UploadService.uploadProfileImage(croppedFile);

      // Actualizar el store con el nuevo perfil
      await useAuthStore.getState().fetchUser();

      // Construir URL de la imagen
      const imageUrl = response.imageUrl;
      const fullUrl = imageUrl.startsWith('http')
        ? imageUrl
        : `http://localhost:3000${imageUrl}`;
      setImagePreview(fullUrl);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageToCrop(null);
  };

  const handleDeleteImage = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu imagen de perfil?')) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await UploadService.deleteProfileImage();

      // Actualizar el store
      await useAuthStore.getState().fetchUser();

      setImagePreview(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error deleting image:', err);
      setError(err.response?.data?.message || 'Error al eliminar la imagen');
    } finally {
      setUploading(false);
    }
  };

  // Update image preview when user profile loads
  useEffect(() => {
    if (user?.profile) {
      const currentImage = isCandidate ? user.profile.avatar : user.profile.companyLogo;
      const imageUrl = getImageUrl(currentImage);
      setImagePreview(imageUrl);
    }
  }, [user?.profile?.avatar, user?.profile?.companyLogo, isCandidate]);

  // Update dropdown position
  const updateDropdownPosition = () => {
    if (skillInputRef.current) {
      const rect = skillInputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  // Update dropdown position whenever it should be shown
  useEffect(() => {
    if (showSkillDropdown && skillInputRef.current) {
      updateDropdownPosition();
    }
  }, [showSkillDropdown, skillInput]);

  // Work types handler
  const toggleWorkType = (workType: string) => {
    setFormData(prev => ({
      ...prev,
      workTypes: prev.workTypes.includes(workType)
        ? prev.workTypes.filter(wt => wt !== workType)
        : [...prev.workTypes, workType]
    }));
  };

  // Categories handler (max 3)
  const toggleCategory = (category: string) => {
    setFormData(prev => {
      if (prev.categories.includes(category)) {
        return {
          ...prev,
          categories: prev.categories.filter(c => c !== category)
        };
      } else if (prev.categories.length < 3) {
        return {
          ...prev,
          categories: [...prev.categories, category]
        };
      }
      return prev;
    });
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
        dataToSend.headline = formData.headline || null;
        dataToSend.currentPosition = formData.currentPosition || null;
        dataToSend.skills = formData.skills;
        dataToSend.education = formData.education || null;
        dataToSend.yearsExperience = formData.yearsExperience
          ? parseInt(formData.yearsExperience.toString())
          : null;
        dataToSend.workTypes = formData.workTypes;
        dataToSend.categories = formData.categories;

        // Preferencias de trabajo
        dataToSend.workModality = formData.workModality || null;
        dataToSend.availableFrom = formData.availableFrom || null;
        dataToSend.expectedSalaryMin = formData.expectedSalaryMin
          ? parseInt(formData.expectedSalaryMin.toString())
          : null;
        dataToSend.expectedSalaryMax = formData.expectedSalaryMax
          ? parseInt(formData.expectedSalaryMax.toString())
          : null;
        dataToSend.salaryCurrency = formData.salaryCurrency;

        // Información adicional
        dataToSend.certifications = formData.certifications;
        dataToSend.portfolio = formData.portfolio || null;
        dataToSend.linkedin = formData.linkedin || null;
        dataToSend.github = formData.github || null;
      } else {
        dataToSend.companyName = formData.companyName || null;
        dataToSend.companyWebsite = formData.companyWebsite || null;
        dataToSend.position = formData.position || null;

        // Información adicional de la empresa
        dataToSend.companyDescription = formData.companyDescription || null;
        dataToSend.companySize = formData.companySize || null;
        dataToSend.industry = formData.industry || null;
        dataToSend.foundedYear = formData.foundedYear
          ? parseInt(formData.foundedYear.toString())
          : null;
        dataToSend.companyLinkedin = formData.companyLinkedin || null;
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

            {/* Profile Image Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      {isCandidate ? (
                        <User className="w-16 h-16 text-gray-400" />
                      ) : (
                        <Building2 className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>

                {/* Upload button overlay */}
                <button
                  type="button"
                  onClick={handleImageClick}
                  disabled={uploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <Camera className="w-8 h-8 text-white" />
                  )}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleImageClick}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
                >
                  <Camera className="w-4 h-4" />
                  {imagePreview ? 'Cambiar imagen' : 'Subir imagen'}
                </Button>

                {imagePreview && (
                  <Button
                    type="button"
                    onClick={handleDeleteImage}
                    disabled={uploading}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </Button>
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                JPG, PNG o WEBP. Máximo 5MB
              </p>
            </div>

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
          <>
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10">
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Información Profesional
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título profesional
                  </label>
                  <Input
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    placeholder="Ej: Desarrollador Full Stack | Especialista en React y Node.js"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Un título corto que describa tu rol y especialización
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Posición actual
                    </label>
                    <Input
                      name="currentPosition"
                      value={formData.currentPosition}
                      onChange={handleChange}
                      placeholder="Ej: Desarrollador Full Stack"
                    />
                  </div>

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

                  <div className="md:col-span-2">
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

                {/* Skills selector with tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Habilidades
                  </label>

                  {/* Selected skills as tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.skills.map(skill => (
                      <div
                        key={skill}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 text-white rounded-lg text-sm"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Skill input */}
                  <div ref={skillInputRef}>
                    <Input
                      value={skillInput}
                      onChange={(e) => {
                        setSkillInput(e.target.value);
                        setShowSkillDropdown(true);
                      }}
                      onFocus={() => {
                        setShowSkillDropdown(true);
                      }}
                      onBlur={() => setTimeout(() => setShowSkillDropdown(false), 200)}
                      placeholder="Buscar y agregar habilidades..."
                    />
                  </div>

                  {/* Dropdown - Rendered via Portal */}
                  {showSkillDropdown && filteredSkills.length > 0 && typeof document !== 'undefined' && createPortal(
                    <div
                      className="fixed bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl max-h-48 overflow-y-auto"
                      style={{
                        top: `${dropdownPosition.top + 4}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`,
                        zIndex: 99999
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {filteredSkills.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>,
                    document.body
                  )}
                </div>
              </div>
            </Card>

            {/* Work Type Preferences */}
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10">
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Tipo de trabajo que buscas
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Selecciona uno o más tipos de trabajo
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {WORK_TYPES.map(workType => (
                    <button
                      key={workType.value}
                      type="button"
                      onClick={() => toggleWorkType(workType.value)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all ${
                        formData.workTypes.includes(workType.value)
                          ? 'bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 text-white border-gray-700 dark:border-gray-500 shadow-lg'
                          : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400'
                      }`}
                    >
                      {workType.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Job Categories */}
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10">
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Categorías de trabajo
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Selecciona hasta 3 categorías que te interesan
                  <span className="ml-2 font-semibold">
                    ({formData.categories.length}/3)
                  </span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {JOB_CATEGORIES.map(category => {
                    const isSelected = formData.categories.includes(category.value);
                    const isDisabled = !isSelected && formData.categories.length >= 3;

                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => toggleCategory(category.value)}
                        disabled={isDisabled}
                        className={`px-4 py-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 text-white border-gray-700 dark:border-gray-500 shadow-lg'
                            : isDisabled
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                            : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400'
                        }`}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Work Preferences */}
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10">
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Preferencias de Trabajo
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Modalidad de trabajo preferida
                    </label>
                    <select
                      name="workModality"
                      value={formData.workModality}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Selecciona modalidad</option>
                      {WORK_MODALITIES.map(modality => (
                        <option key={modality.value} value={modality.value}>
                          {modality.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Disponibilidad para empezar
                    </label>
                    <Input
                      type="date"
                      name="availableFrom"
                      value={formData.availableFrom}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Salario esperado mínimo
                    </label>
                    <Input
                      type="number"
                      name="expectedSalaryMin"
                      value={formData.expectedSalaryMin}
                      onChange={handleChange}
                      placeholder="40000"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Salario esperado máximo
                    </label>
                    <Input
                      type="number"
                      name="expectedSalaryMax"
                      value={formData.expectedSalaryMax}
                      onChange={handleChange}
                      placeholder="60000"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Moneda
                    </label>
                    <select
                      name="salaryCurrency"
                      value={formData.salaryCurrency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-gray-900 dark:text-gray-100"
                    >
                      <option value="USD">USD</option>
                      <option value="ARS">ARS</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Additional Information */}
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10">
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Información Adicional
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Portafolio / Sitio web
                    </label>
                    <Input
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="https://mi-portafolio.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      LinkedIn
                    </label>
                    <Input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/tu-perfil"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GitHub
                    </label>
                    <Input
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/tu-usuario"
                    />
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Certificaciones
                  </label>

                  {/* Selected certifications as tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.certifications.map(cert => (
                      <div
                        key={cert}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 text-white rounded-lg text-sm"
                      >
                        <span>{cert}</span>
                        <button
                          type="button"
                          onClick={() => removeCertification(cert)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Certification input */}
                  <div className="flex gap-2">
                    <Input
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCertification();
                        }
                      }}
                      placeholder="Ej: AWS Certified Developer"
                    />
                    <Button
                      type="button"
                      onClick={addCertification}
                      className="flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tamaño de la empresa
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Selecciona tamaño</option>
                    {COMPANY_SIZES.map(size => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Industria / Sector
                  </label>
                  <Input
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="Ej: Tecnología, Finanzas, Salud"
                  />
                </div>

                <div>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn de la empresa
                  </label>
                  <Input
                    name="companyLinkedin"
                    value={formData.companyLinkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/company/empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Año de fundación
                  </label>
                  <Input
                    type="number"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    placeholder="2010"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción de la empresa
                  </label>
                  <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    placeholder="Describe tu empresa, su misión, cultura y lo que la hace especial..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm"
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

      {/* Image Crop Modal */}
      {showCropModal && imageToCrop && (
        <ImageCropModal
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
