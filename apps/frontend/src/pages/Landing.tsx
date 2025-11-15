import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  Heart,
  Briefcase,
  MessageCircle,
  Zap,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle,
  Home
} from 'lucide-react';
import Card from '@/components/ui/Card';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: Heart,
      title: 'Swipe Inteligente',
      description: 'Encuentra la oportunidad perfecta o el candidato ideal con un simple swipe.'
    },
    {
      icon: MessageCircle,
      title: 'Chat en Tiempo Real',
      description: 'Conecta instantáneamente cuando hay match y comienza la conversación.'
    },
    {
      icon: Zap,
      title: 'Matching Instantáneo',
      description: 'Cuando ambos se dan like, ¡es un match! Comenzá a charlar de inmediato.'
    },
    {
      icon: TrendingUp,
      title: 'Perfiles Completos',
      description: 'CV detallado, skills, experiencia y toda la info que necesitás.'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Creá tu Perfil',
      description: 'Candidatos: cargá tu CV y experiencia. Reclutadores: definí qué buscás.'
    },
    {
      step: 2,
      title: 'Explorá y Dale Like',
      description: 'Navegá entre candidatos u ofertas de trabajo según tu tipo de usuario.'
    },
    {
      step: 3,
      title: 'Hacé Match',
      description: 'Cuando hay interés mutuo, ambos son notificados inmediatamente.'
    },
    {
      step: 4,
      title: 'Conectá',
      description: 'Comenzá a chatear en tiempo real y coordiná entrevistas.'
    }
  ];

  const stats = [
    { number: '100+', label: 'Matches Activos' },
    { number: '50+', label: 'Empresas' },
    { number: '200+', label: 'Candidatos' },
    { number: '95%', label: 'Satisfacción' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation - Floating Island Style */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
        <div className="backdrop-blur-2xl bg-white/80 dark:bg-gray-900/40 border border-gray-200/80 dark:border-white/10 rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/5">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Labee
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800/50 font-medium"
                  >
                    <Home className="w-4 h-4" />
                    <span className="hidden lg:inline">Home</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/swipes')}
                    className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800/50 font-medium"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="hidden lg:inline">Explorar</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/matches')}
                    className="hidden md:flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800/50 font-medium"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="hidden lg:inline">Matches</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/messages')}
                    className="hidden md:flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800/50 font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden lg:inline">Mensajes</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="sm:hidden px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-105 font-medium"
                  >
                    Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800/50 font-medium"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-105 font-medium"
                  >
                    Registrarse
                  </button>
                </>
              )}
              <div className="ml-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-2xl bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-blue-500/10 border border-blue-200 dark:border-white/20 rounded-full mb-8 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/5">
            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              El Tinder del Trabajo
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
            Encontrá tu próximo{' '}
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 dark:from-blue-400 dark:via-blue-500 dark:to-purple-400 bg-clip-text text-transparent">
              trabajo ideal
            </span>
            <br />o el{' '}
            <span className="bg-gradient-to-r from-purple-600 via-blue-700 to-blue-600 dark:from-purple-400 dark:via-blue-500 dark:to-blue-400 bg-clip-text text-transparent">
              talento perfecto
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto font-light">
            La plataforma que conecta candidatos y reclutadores de forma rápida e intuitiva.
            <br className="hidden sm:block" />
            Un swipe puede cambiar tu carrera.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/register')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all text-lg font-semibold flex items-center gap-2 hover:scale-105"
            >
              Comenzar Gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 backdrop-blur-2xl bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-gray-100 rounded-2xl hover:shadow-xl transition-all text-lg font-semibold hover:scale-105"
              >
                Ir al Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-20 relative">
          <div className="backdrop-blur-2xl bg-white/60 dark:bg-gray-900/20 border border-gray-200 dark:border-white/10 rounded-[3rem] p-12 max-w-5xl mx-auto shadow-2xl shadow-black/10 dark:shadow-black/5">
            <div className="flex items-center justify-center gap-12 flex-wrap">
              <div className="flex flex-col items-center gap-4 transform hover:scale-110 transition-transform">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/25 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  <Users className="w-20 h-20 text-white relative z-10" />
                </div>
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300">Candidatos</p>
              </div>
              <div className="animate-pulse">
                <Heart className="w-16 h-16 text-red-500 drop-shadow-lg" fill="currentColor" />
              </div>
              <div className="flex flex-col items-center gap-4 transform hover:scale-110 transition-transform">
                <div className="w-40 h-40 bg-gradient-to-br from-purple-600 via-blue-600 to-blue-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-purple-500/25 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  <Briefcase className="w-20 h-20 text-white relative z-10" />
                </div>
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300">Empresas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="backdrop-blur-2xl bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-white/10 rounded-3xl text-center p-8 hover:scale-105 transition-transform shadow-lg shadow-black/10 dark:shadow-black/5"
            >
              <div className="text-5xl font-bold bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            ¿Por qué elegir Labee?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light">
            Una experiencia moderna y eficiente para conectar talento con oportunidades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group backdrop-blur-2xl bg-white/70 dark:bg-gray-900/30 border border-gray-200 dark:border-white/10 rounded-3xl p-8 hover:scale-105 transition-all shadow-lg shadow-black/10 dark:shadow-black/5 hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow">
                <feature.icon className="w-9 h-9 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Cuatro pasos simples para tu próxima oportunidad laboral
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((item, index) => (
            <div key={index} className="relative">
              <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10 p-6 h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </Card>
              {index < howItWorks.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-blue-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 border border-white/20 rounded-[3rem] p-16 text-center shadow-2xl shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight">
              ¿Listo para dar el siguiente paso?
            </h2>
            <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto font-light">
              Uní a miles de profesionales y empresas que ya están haciendo match en Labee
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="group px-8 py-4 bg-white text-blue-600 rounded-2xl hover:shadow-2xl transition-all text-lg font-semibold flex items-center justify-center gap-2 hover:scale-105"
              >
                Crear Cuenta Gratis
                <CheckCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/30 text-white rounded-2xl hover:bg-white/20 transition-all text-lg font-semibold hover:scale-105"
                >
                  Ya tengo cuenta
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/10 backdrop-blur-2xl bg-white/60 dark:bg-gray-900/20 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Labee
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              &copy; 2025 Labee. El Tinder del Trabajo.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
