import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { SwipeService } from '@/services/swipe.service';
import { SwipeCard } from '@/components/swipe/SwipeCard';
import { JobOfferCard } from '@/components/swipe/JobOfferCard';
import { CandidateCard } from '@/components/swipe/CandidateCard';
import { useSwipeQueue } from '@/hooks/useSwipeQueue';
import { User, JobOffer } from '@/types';
import { X, Heart, RefreshCw, Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function Swipes() {
  const { user } = useAuthStore();
  const isCandidate = user?.userType === 'CANDIDATE';

  const [items, setItems] = useState<(User | JobOffer)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchFound, setMatchFound] = useState<boolean>(false);

  // Hook de cola para swipes
  const { queueSwipe } = useSwipeQueue(() => {
    setMatchFound(true);
    setTimeout(() => setMatchFound(false), 3000);
  });

  // Cargar perfiles/ofertas potenciales
  useEffect(() => {
    loadPotentialMatches();
  }, []);

  const loadPotentialMatches = async () => {
    try {
      setLoading(true);
      const data = await SwipeService.getPotentialMatches();
      setItems(data);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error loading potential matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (swipeType: 'LIKE' | 'PASS') => {
    if (currentIndex >= items.length) return;

    const currentItem = items[currentIndex];

    // Determinar targetId y jobOfferId según el tipo de usuario
    let targetId: string | undefined;
    let jobOfferId: string | undefined;

    if (isCandidate) {
      // Candidato swipeando una oferta - solo enviar jobOfferId
      const offer = currentItem as JobOffer;
      jobOfferId = offer.id;
      targetId = undefined;
    } else {
      // Reclutador swipeando un candidato - solo enviar targetId
      const candidate = currentItem as User;
      targetId = candidate.id;
      jobOfferId = undefined;
    }

    // Agregar a la cola (no bloqueante, se enviará en batch)
    queueSwipe(targetId, swipeType, jobOfferId);

    // Avanzar inmediatamente a la siguiente tarjeta
    setCurrentIndex(currentIndex + 1);
  };

  const handlePass = () => handleSwipe('PASS');
  const handleLike = () => handleSwipe('LIKE');

  // Obtener el item actual
  const currentItem = items[currentIndex];
  const hasMore = currentIndex < items.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-gray-700 dark:text-gray-300" />
      </div>
    );
  }

  if (!hasMore) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 rounded-2xl mb-4">
              <RefreshCw className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            ¡No hay más perfiles!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isCandidate
              ? 'Has visto todas las ofertas disponibles. Vuelve más tarde para ver nuevas oportunidades.'
              : 'Has visto todos los candidatos disponibles. Vuelve más tarde para ver nuevos perfiles.'}
          </p>
          <button
            onClick={loadPotentialMatches}
            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <RefreshCw className="w-5 h-5 inline mr-2" />
            Recargar
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Match notification */}
      {matchFound && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-2xl">
            <div className="flex items-center gap-3 p-4">
              <Heart className="w-6 h-6" />
              <div>
                <h3 className="font-bold">¡Match!</h3>
                <p className="text-sm text-blue-100">Tienes una nueva conexión</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Counter */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {currentIndex + 1} / {items.length}
        </p>
      </div>

      {/* Swipe Card Container */}
      <div className="relative" style={{ height: '600px' }}>
        {/* Stack effect - Próxima tarjeta */}
        {currentIndex + 1 < items.length && (
          <div className="absolute inset-0 top-4 scale-95 opacity-50 pointer-events-none">
            <Card className="h-full backdrop-blur-xl bg-white/50 dark:bg-gray-900/30" />
          </div>
        )}

        {/* Tarjeta actual */}
        <div className="absolute inset-0">
          <SwipeCard
            onSwipeLeft={handlePass}
            onSwipeRight={handleLike}
            className="h-full"
          >
            {isCandidate ? (
              <JobOfferCard offer={currentItem as JobOffer} />
            ) : (
              <CandidateCard candidate={currentItem as User} />
            )}
          </SwipeCard>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={handlePass}
          disabled={!hasMore}
          className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-8 h-8 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
        </button>

        <button
          onClick={handleLike}
          disabled={!hasMore}
          className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-2xl hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Heart className="w-10 h-10 text-white" />
        </button>
      </div>

      {/* Instructions */}
      <Card className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/30 border border-white/20 dark:border-white/10">
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Tip:</span> Desliza la tarjeta o usa los botones para dar like o pasar
          </p>
        </div>
      </Card>
    </div>
  );
}
