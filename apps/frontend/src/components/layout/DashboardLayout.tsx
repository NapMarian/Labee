import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getImageUrl } from '@/lib/api';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  Zap,
  Home,
  Heart,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  Briefcase,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isCandidate = user?.userType === 'CANDIDATE';

  const navigation = [
    {
      name: 'Home',
      href: '/dashboard',
      icon: Home,
      description: 'Inicio',
    },
    {
      name: 'Explorar',
      href: '/dashboard/swipes',
      icon: Zap,
      description: isCandidate ? 'Buscar ofertas' : 'Buscar candidatos',
    },
    {
      name: 'Matches',
      href: '/dashboard/matches',
      icon: Heart,
      description: 'Ver conexiones',
    },
    {
      name: 'Mensajes',
      href: '/dashboard/messages',
      icon: MessageSquare,
      description: 'Chat',
    },
    // Solo mostrar "Mis Ofertas" para reclutadores
    ...(!isCandidate
      ? [
          {
            name: 'Mis Ofertas',
            href: '/dashboard/job-offers',
            icon: Briefcase,
            description: 'Gestionar ofertas',
          },
        ]
      : []),
    {
      name: 'Perfil',
      href: '/dashboard/profile',
      icon: User,
      description: 'Tu información',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-200/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col z-50">
        <div className="flex flex-col flex-grow backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border-r border-white/20 dark:border-white/10 shadow-2xl">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 px-6 py-6 border-b border-white/20 dark:border-white/10 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
              Labee
            </h1>
          </Link>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-white/20 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700 flex items-center justify-center overflow-hidden">
                {getImageUrl(isCandidate ? user?.profile?.avatar : user?.profile?.companyLogo) ? (
                  <img
                    src={getImageUrl(isCandidate ? user?.profile?.avatar : user?.profile?.companyLogo)!}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {user?.profile?.name?.charAt(0) || user?.email?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.profile?.name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {isCandidate ? 'Candidato' : 'Reclutador'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gray-200/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs opacity-75">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20 dark:border-white/10 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border-b border-white/20 dark:border-white/10 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
              Labee
            </h1>
          </Link>

          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        >
          <aside
            className="fixed inset-y-0 left-0 w-72 backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border-r border-white/20 dark:border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* User Info */}
              <div className="px-6 py-6 border-b border-white/20 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700 flex items-center justify-center overflow-hidden">
                    {getImageUrl(isCandidate ? user?.profile?.avatar : user?.profile?.companyLogo) ? (
                      <img
                        src={getImageUrl(isCandidate ? user?.profile?.avatar : user?.profile?.companyLogo)!}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold">
                        {user?.profile?.name?.charAt(0) || user?.email?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {user?.profile?.name || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {isCandidate ? 'Candidato' : 'Reclutador'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gray-200/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs opacity-75">{item.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-white/20 dark:border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Cerrar sesión</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:pl-72 pt-16 lg:pt-0">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between px-8 py-6 border-b border-white/10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard'}
          </h2>
          <ThemeToggle />
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-8">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border-t border-white/20 dark:border-white/10 shadow-lg">
        <div className="flex items-center justify-around py-2">
          {navigation.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
