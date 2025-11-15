import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  Briefcase,
  Users,
  Heart,
  MessageCircle,
  FileText,
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Card from '@/components/ui/Card';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const isRecruiter = user?.userType === 'RECRUITER';
  const isCandidate = user?.userType === 'CANDIDATE';

  const recruiterActions = [
    {
      icon: FileText,
      title: 'Gestionar Ofertas',
      description: 'Creá, editá o eliminá tus ofertas de trabajo activas',
      action: () => navigate('/dashboard/job-offers'),
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: Users,
      title: 'Buscar Candidatos',
      description: 'Explorá perfiles de candidatos y dale like a los que te interesan',
      action: () => navigate('/dashboard/swipes'),
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/10',
      borderColor: 'border-purple-500/20'
    },
    {
      icon: Heart,
      title: 'Ver Matches',
      description: 'Revisá tus matches y conectá con candidatos interesados',
      action: () => navigate('/dashboard/matches'),
      gradient: 'from-pink-500 to-pink-600',
      bgGradient: 'from-pink-500/10 to-pink-600/10',
      borderColor: 'border-pink-500/20'
    },
    {
      icon: MessageCircle,
      title: 'Mensajes',
      description: 'Chateá en tiempo real con tus matches',
      action: () => navigate('/dashboard/messages'),
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-500/10 to-green-600/10',
      borderColor: 'border-green-500/20'
    }
  ];

  const candidateActions = [
    {
      icon: Briefcase,
      title: 'Explorar Ofertas',
      description: 'Descubrí ofertas de trabajo que se ajustan a tu perfil',
      action: () => navigate('/dashboard/swipes'),
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: Heart,
      title: 'Mis Matches',
      description: 'Empresas que también te dieron like',
      action: () => navigate('/dashboard/matches'),
      gradient: 'from-pink-500 to-pink-600',
      bgGradient: 'from-pink-500/10 to-pink-600/10',
      borderColor: 'border-pink-500/20'
    },
    {
      icon: MessageCircle,
      title: 'Conversaciones',
      description: 'Chateá con reclutadores y coordiná entrevistas',
      action: () => navigate('/dashboard/messages'),
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-500/10 to-green-600/10',
      borderColor: 'border-green-500/20'
    },
    {
      icon: FileText,
      title: 'Mi Perfil',
      description: 'Actualizá tu CV, skills y experiencia',
      action: () => navigate('/dashboard/profile'),
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/10',
      borderColor: 'border-purple-500/20'
    }
  ];

  const actions = isRecruiter ? recruiterActions : candidateActions;

  const quickStats = isRecruiter
    ? [
        { label: 'Ofertas Activas', value: '3', icon: Briefcase },
        { label: 'Candidatos Vistos', value: '45', icon: Users },
        { label: 'Matches', value: '12', icon: Heart }
      ]
    : [
        { label: 'Ofertas Vistas', value: '28', icon: Briefcase },
        { label: 'Likes Dados', value: '15', icon: Heart },
        { label: 'Matches', value: '5', icon: Heart }
      ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="relative">
        <Card className="backdrop-blur-xl bg-gradient-to-r from-blue-500 to-blue-600 border-none p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-white" />
              <span className="text-white/90 font-medium">
                {new Date().getHours() < 12 ? 'Buenos días' : new Date().getHours() < 19 ? 'Buenas tardes' : 'Buenas noches'}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              ¡Hola, {user?.profile?.name || 'Usuario'}!
            </h1>
            <p className="text-xl text-white/90">
              {isRecruiter
                ? '¿Qué querés hacer hoy? Gestioná tus ofertas o buscá nuevos talentos.'
                : '¿Listo para encontrar tu próxima oportunidad?'}
            </p>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <Card
            key={index}
            className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10 p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          ¿Qué querés hacer?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {actions.map((action, index) => (
            <Card
              key={index}
              className={`backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border ${action.borderColor} p-6 cursor-pointer hover:scale-105 transition-all group`}
              onClick={action.action}
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {action.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Ir ahora
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 dark:border-purple-400/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              💡 Tip del día
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {isRecruiter
                ? 'Las ofertas con salario definido tienen 3x más probabilidades de recibir matches. ¡Sé transparente!'
                : 'Completá tu perfil al 100% para aparecer en más búsquedas. Un perfil completo tiene 5x más matches.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
