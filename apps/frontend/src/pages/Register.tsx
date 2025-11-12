import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { UserType } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Briefcase, User, Building2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [userType, setUserType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    location: '',
    companyName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!userType) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        userType,
        name: formData.name,
        location: formData.location || undefined,
        companyName: userType === UserType.RECRUITER ? formData.companyName : undefined,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Vista de selección de tipo de usuario
  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/30 to-gray-200/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 rounded-2xl mb-4 shadow-xl">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Únete a Labee
            </h1>
            <p className="text-gray-600 dark:text-gray-400">¿Qué tipo de cuenta deseas crear?</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Candidato */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-gray-400 dark:hover:border-gray-500"
              onClick={() => setUserType(UserType.CANDIDATE)}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4">
                  <User className="w-8 h-8 text-gray-700 dark:text-gray-200" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Soy Candidato
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Busco oportunidades laborales y quiero conectar con empresas
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full mr-2" />
                    Crea tu perfil profesional
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full mr-2" />
                    Encuentra ofertas que te interesen
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full mr-2" />
                    Conecta directamente con reclutadores
                  </li>
                </ul>
                <Button className="mt-6" fullWidth>
                  Continuar como Candidato
                </Button>
              </div>
            </Card>

            {/* Reclutador */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-gray-400 dark:hover:border-gray-500"
              onClick={() => setUserType(UserType.RECRUITER)}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4">
                  <Building2 className="w-8 h-8 text-gray-700 dark:text-gray-200" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Soy Reclutador
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Represento a una empresa y busco talento para mi equipo
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full mr-2" />
                    Publica ofertas de trabajo
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full mr-2" />
                    Encuentra candidatos calificados
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full mr-2" />
                    Gestiona entrevistas fácilmente
                  </li>
                </ul>
                <Button className="mt-6" fullWidth>
                  Continuar como Reclutador
                </Button>
              </div>
            </Card>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 font-semibold underline decoration-gray-400"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de registro
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/30 to-gray-200/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 rounded-2xl mb-4 shadow-xl">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Crear Cuenta</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {userType === UserType.CANDIDATE ? 'Candidato' : 'Reclutador'}
            {' • '}
            <button
              onClick={() => setUserType(null)}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
            >
              Cambiar
            </button>
          </p>
        </div>

        <Card>
          {error && (
            <div className="mb-4 p-4 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-blue-700 dark:text-blue-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre completo"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={
                userType === UserType.CANDIDATE ? 'Juan Pérez' : 'Ana López'
              }
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              autoComplete="email"
            />

            <Input
              label="Ubicación"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Buenos Aires, Argentina"
            />

            {userType === UserType.RECRUITER && (
              <Input
                label="Nombre de la empresa"
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Mi Empresa SA"
                required
              />
            )}

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              helperText="Mínimo 8 caracteres, incluyendo mayúsculas, números y símbolos"
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />

            <div className="text-xs text-gray-600 dark:text-gray-400">
              Al registrarte, aceptas nuestros{' '}
              <Link to="/terms" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 underline">
                Términos de Servicio
              </Link>{' '}
              y{' '}
              <Link to="/privacy" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 underline">
                Política de Privacidad
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Crear Cuenta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 font-semibold underline decoration-gray-400"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
