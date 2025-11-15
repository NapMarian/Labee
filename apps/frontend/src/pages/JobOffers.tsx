import { useState, useEffect } from 'react';
import { JobOfferService, JobOffer, CreateJobOfferDTO } from '@/services/jobOffer.service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, Briefcase, MapPin, DollarSign, Eye, EyeOff, Edit, Trash2, X, Loader2 } from 'lucide-react';

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

export default function JobOffers() {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<JobOffer | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateJobOfferDTO>({
    title: '',
    description: '',
    requirements: [],
    workType: 'FULL_TIME',
    category: 'TECHNOLOGY',
    location: '',
    remote: false,
    salaryMin: undefined,
    salaryMax: undefined,
    salaryCurrency: 'USD',
    companyName: '',
    companyVisible: true,
  });

  const [requirementInput, setRequirementInput] = useState('');

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await JobOfferService.getMyJobOffers();
      setOffers(data);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingOffer) {
        await JobOfferService.updateJobOffer(editingOffer.id, formData);
      } else {
        await JobOfferService.createJobOffer(formData);
      }

      // Reset form
      resetForm();
      await loadOffers();
    } catch (error: any) {
      console.error('Error saving offer:', error);
      alert(error.response?.data?.message || 'Error al guardar la oferta');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (offer: JobOffer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      requirements: offer.requirements,
      workType: offer.workType,
      category: offer.category,
      location: offer.location,
      remote: offer.remote,
      salaryMin: offer.salaryMin,
      salaryMax: offer.salaryMax,
      salaryCurrency: offer.salaryCurrency,
      companyName: offer.companyName,
      companyVisible: offer.companyVisible,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta oferta?')) return;

    try {
      await JobOfferService.deleteJobOffer(id);
      await loadOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
      alert('Error al eliminar la oferta');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await JobOfferService.toggleJobOfferStatus(id);
      await loadOffers();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Error al cambiar el estado de la oferta');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      requirements: [],
      workType: 'FULL_TIME',
      category: 'TECHNOLOGY',
      location: '',
      remote: false,
      salaryMin: undefined,
      salaryMax: undefined,
      salaryCurrency: 'USD',
      companyName: '',
      companyVisible: true,
    });
    setRequirementInput('');
    setEditingOffer(null);
    setShowForm(false);
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, requirementInput.trim()],
      });
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-gray-700 dark:text-gray-300" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mis Ofertas de Trabajo</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tus ofertas de trabajo activas e inactivas
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Oferta
          </Button>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editingOffer ? 'Editar Oferta' : 'Nueva Oferta'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título de la Posición *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ej. Desarrollador Full Stack Senior"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe la posición, responsabilidades, etc."
                  className="w-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  required
                />
              </div>

              {/* Work Type & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Trabajo *
                  </label>
                  <select
                    value={formData.workType}
                    onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                    className="w-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {WORK_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {JOB_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location & Remote */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ubicación
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="ej. Buenos Aires, Argentina"
                  />
                </div>

                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    id="remote"
                    checked={formData.remote}
                    onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="remote" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trabajo Remoto
                  </label>
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rango Salarial
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Input
                    type="number"
                    value={formData.salaryMin || ''}
                    onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Mínimo"
                  />
                  <Input
                    type="number"
                    value={formData.salaryMax || ''}
                    onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Máximo"
                  />
                  <select
                    value={formData.salaryCurrency}
                    onChange={(e) => setFormData({ ...formData, salaryCurrency: e.target.value })}
                    className="px-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="ARS">ARS</option>
                  </select>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requisitos
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    placeholder="Agregar un requisito"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  />
                  <Button type="button" onClick={addRequirement} variant="secondary">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.map((req, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 rounded-full text-sm flex items-center gap-2"
                    >
                      {req}
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button type="button" onClick={resetForm} variant="secondary">
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : editingOffer ? (
                    'Guardar Cambios'
                  ) : (
                    'Publicar Oferta'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* Offers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.length === 0 ? (
          <Card className="col-span-full text-center py-12">
            <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No tienes ofertas publicadas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Crea tu primera oferta de trabajo para empezar a recibir candidatos
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Crear Primera Oferta
            </Button>
          </Card>
        ) : (
          offers.map((offer) => (
            <Card
              key={offer.id}
              className={`backdrop-blur-xl border border-white/20 dark:border-white/10 ${
                offer.active
                  ? 'bg-white/70 dark:bg-gray-900/50'
                  : 'bg-gray-100/70 dark:bg-gray-800/50 opacity-75'
              }`}
            >
              <div className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">{offer.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {offer.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleStatus(offer.id)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                      title={offer.active ? 'Desactivar' : 'Activar'}
                    >
                      {offer.active ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(offer)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1 text-sm">
                  {offer.location && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {offer.location}
                      {offer.remote && ' • Remoto'}
                    </div>
                  )}
                  {(offer.salaryMin || offer.salaryMax) && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      {offer.salaryMin && offer.salaryMax
                        ? `${offer.salaryMin} - ${offer.salaryMax} ${offer.salaryCurrency}`
                        : offer.salaryMin
                        ? `Desde ${offer.salaryMin} ${offer.salaryCurrency}`
                        : `Hasta ${offer.salaryMax} ${offer.salaryCurrency}`}
                    </div>
                  )}
                </div>

                {/* Stats */}
                {offer._count && (
                  <div className="flex items-center gap-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 text-sm text-gray-600 dark:text-gray-400">
                    <span>{offer._count.swipes} vistas</span>
                    <span>{offer._count.matches} matches</span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="pt-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      offer.active
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {offer.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
