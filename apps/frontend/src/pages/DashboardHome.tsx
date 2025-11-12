import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Card from '@/components/ui/Card';
import { Home, Heart, MessageSquare, User, Zap, Briefcase } from 'lucide-react';

export default function DashboardHome() {
  const { user } = useAuthStore();
  const isCandidate = user?.userType === 'CANDIDATE';

  const stats = [
    {
      name: 'Visitas al perfil',
      value: '0',
      icon: User,
      change: '+0%',
      changeType: 'neutral',
    },
    {
      name: 'Swipes hoy',
      value: '0',
      icon: Zap,
      change: '+0%',
      changeType: 'neutral',
    },
    {
      name: 'Matches totales',
      value: '0',
      icon: Heart,
      change: '+0%',
      changeType: 'neutral',
    },
    {
      name: 'Mensajes activos',
      value: '0',
      icon: MessageSquare,
      change: '+0%',
      changeType: 'neutral',
    },
  ];

  const quickActions = [
    {
      name: 'Explorar',
      description: isCandidate ? 'Buscar ofertas de trabajo' : 'Buscar candidatos',
      icon: Briefcase,
      href: '/dashboard/swipes',
      bgColor: 'bg-gray-200 dark:bg-gray-700',
      iconColor: 'text-gray-700 dark:text-gray-200',
    },
    {
      name: 'Ver Matches',
      description: 'Tus conexiones exitosas',
      icon: Heart,
      href: '/dashboard/matches',
      bgColor: 'bg-gray-200 dark:bg-gray-700',
      iconColor: 'text-gray-700 dark:text-gray-200',
    },
    {
      name: 'Mensajes',
      description: 'Chatea con tus matches',
      icon: MessageSquare,
      href: '/dashboard/messages',
      bgColor: 'bg-gray-200 dark:bg-gray-700',
      iconColor: 'text-gray-700 dark:text-gray-200',
    },
    {
      name: 'Mi Perfil',
      description: 'Edita tu información',
      icon: User,
      href: '/dashboard/profile',
      bgColor: 'bg-gray-200 dark:bg-gray-700',
      iconColor: 'text-gray-700 dark:text-gray-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          ¡Hola, {user?.profile?.name || 'Usuario'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isCandidate
            ? 'Encuentra tu próxima oportunidad laboral'
            : 'Encuentra el talento perfecto para tu equipo'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.name} to={action.href}>
              <Card className="text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${action.bgColor} rounded-xl mb-3`}>
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {action.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card>
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 rounded-2xl mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            ¡Bienvenido a Labee!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Este es tu dashboard principal. Desde aquí puedes explorar ofertas de trabajo,
            ver tus matches, chatear con conexiones y gestionar tu perfil.
          </p>
        </div>
      </Card>
    </div>
  );
}
