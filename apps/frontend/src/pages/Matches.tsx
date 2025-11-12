import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { SwipeService } from '@/services/swipe.service';
import { MatchCard } from '@/components/matches/MatchCard';
import { Match } from '@/types';
import { Heart, Loader2, RefreshCw } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function Matches() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SwipeService.getMatches();
      setMatches(data);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Error al cargar los matches. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnmatch = async (matchId: string) => {
    try {
      await SwipeService.unmatch(matchId);
      // Remover el match de la lista
      setMatches(matches.filter(m => m.id !== matchId));
    } catch (err) {
      console.error('Error removing match:', err);
      alert('Error al eliminar el match. Intenta nuevamente.');
    }
  };

  const handleMessage = (matchId: string) => {
    // Navegar a la página de mensajes con el match seleccionado
    navigate(`/dashboard/messages?match=${matchId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-gray-700 dark:text-gray-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-4">
              <RefreshCw className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Error al cargar matches
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={loadMatches}
            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <RefreshCw className="w-5 h-5 inline mr-2" />
            Reintentar
          </button>
        </Card>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 rounded-2xl mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Aún no tienes matches
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {user?.userType === 'CANDIDATE'
              ? 'Explora ofertas de trabajo y da like para encontrar tu próxima oportunidad.'
              : 'Explora candidatos y da like para encontrar el talento que buscas.'}
          </p>
          <button
            onClick={() => navigate('/dashboard/swipes')}
            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Comenzar a explorar
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Tus Matches
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tienes {matches.length} {matches.length === 1 ? 'conexión' : 'conexiones'}
          </p>
        </div>
        <button
          onClick={loadMatches}
          className="p-3 backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border border-white/20 dark:border-white/10 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/50 transition-all"
          title="Actualizar matches"
        >
          <RefreshCw className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onUnmatch={handleUnmatch}
            onMessage={handleMessage}
          />
        ))}
      </div>

      {/* Info Card */}
      <Card className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/30 border border-white/20 dark:border-white/10">
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Tip:</span> Envía un mensaje para comenzar una conversación
          </p>
        </div>
      </Card>
    </div>
  );
}
