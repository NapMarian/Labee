import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Zap } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Fondo con gradientes grises modernos */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-200/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Efectos de luz sutiles */}
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gray-300/20 dark:bg-gray-700/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gray-400/15 dark:bg-gray-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-primary-400/5 dark:bg-primary-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 rounded-3xl mb-4 shadow-2xl shadow-gray-500/30">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 dark:from-gray-200 dark:via-gray-300 dark:to-gray-400 bg-clip-text text-transparent mb-3">
            Labee
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Encuentra tu trabajo ideal</p>
        </div>

        {/* Card con glassmorphism */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Iniciar Sesión</h2>

          {error && (
            <div className="mb-4 p-4 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-blue-700 dark:text-blue-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-gray-600 dark:text-gray-400">Recordarme</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 font-semibold underline decoration-gray-400"
              >
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials con glassmorphism */}
        <div className="mt-6 p-5 backdrop-blur-md bg-gray-100/80 dark:bg-gray-800/40 border border-gray-300/50 dark:border-gray-700/30 rounded-xl">
          <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold mb-3">🔑 Usuarios de prueba:</p>
          <div className="space-y-1.5">
            <p className="text-xs text-gray-700 dark:text-gray-300">
              <span className="font-medium">Candidato:</span> maria.garcia@example.com
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              <span className="font-medium">Reclutador:</span> hr@techcorp.com
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-2">
              <span className="font-medium">Contraseña:</span> Password123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
