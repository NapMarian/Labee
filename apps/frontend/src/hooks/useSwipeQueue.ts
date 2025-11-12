import { useRef, useCallback, useEffect } from 'react';
import { SwipeService } from '@/services/swipe.service';

interface QueuedSwipe {
  targetId: string | undefined;
  swipeType: 'LIKE' | 'PASS';
  jobOfferId?: string;
  timestamp: number;
}

export const useSwipeQueue = (onMatch?: () => void) => {
  const queueRef = useRef<QueuedSwipe[]>([]);
  const processingRef = useRef(false);

  // Procesar la cola cada 2 segundos
  useEffect(() => {
    const interval = setInterval(async () => {
      if (processingRef.current || queueRef.current.length === 0) return;

      processingRef.current = true;
      const swipesToProcess = [...queueRef.current];
      queueRef.current = []; // Limpiar cola

      // Procesar todos los swipes en la cola
      for (const swipe of swipesToProcess) {
        try {
          const response = await SwipeService.createSwipe(
            swipe.targetId,
            swipe.swipeType,
            swipe.jobOfferId
          );

          // Si hay match, notificar
          if (response.match && onMatch) {
            onMatch();
          }
        } catch (error) {
          console.error('Error processing swipe:', error);
        }
      }

      processingRef.current = false;
    }, 2000); // Procesar cada 2 segundos

    return () => clearInterval(interval);
  }, [onMatch]);

  // Agregar swipe a la cola (no bloqueante)
  const queueSwipe = useCallback((
    targetId: string | undefined,
    swipeType: 'LIKE' | 'PASS',
    jobOfferId?: string
  ) => {
    queueRef.current.push({
      targetId,
      swipeType,
      jobOfferId,
      timestamp: Date.now(),
    });
  }, []);

  return { queueSwipe };
};
