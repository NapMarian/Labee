import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Swipes from './Swipes';
import Matches from './Matches';
import Messages from './Messages';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-200/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 dark:border-gray-400" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<Swipes />} />
        <Route path="matches" element={<Matches />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<div className="text-center py-12 text-gray-600 dark:text-gray-400">Profile - Coming Soon</div>} />
      </Routes>
    </DashboardLayout>
  );
}
