import { useState, useRef, useCallback, useEffect } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // Píxeles mínimos para considerar swipe
}

interface SwipeState {
  x: number;
  y: number;
  isDragging: boolean;
  rotation: number;
  opacity: number;
}

export const useSwipe = (config: SwipeConfig) => {
  const { onSwipeLeft, onSwipeRight, threshold = 80 } = config;

  const [swipeState, setSwipeState] = useState<SwipeState>({
    x: 0,
    y: 0,
    isDragging: false,
    rotation: 0,
    opacity: 1,
  });

  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const resetPosition = useCallback(() => {
    setSwipeState({
      x: 0,
      y: 0,
      isDragging: false,
      rotation: 0,
      opacity: 1,
    });
    isDraggingRef.current = false;
  }, []);

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    startPos.current = { x: clientX, y: clientY };
    isDraggingRef.current = true;
    setSwipeState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;

    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;

    // Calcular rotación basada en posición X (más suave)
    const rotation = deltaX * 0.08;

    // Calcular opacidad basada en distancia
    const distance = Math.abs(deltaX);
    const opacity = Math.max(0.5, 1 - distance / 400);

    setSwipeState({
      x: deltaX,
      y: deltaY,
      isDragging: true,
      rotation,
      opacity,
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;

    setSwipeState(current => {
      const { x } = current;

      // Si superó el threshold hacia la izquierda
      if (x < -threshold) {
        // Animar salida hacia la izquierda
        setTimeout(() => {
          onSwipeLeft?.();
          resetPosition();
        }, 250);

        return {
          x: -1000,
          y: current.y,
          isDragging: false,
          rotation: -30,
          opacity: 0,
        };
      }
      // Si superó el threshold hacia la derecha
      else if (x > threshold) {
        // Animar salida hacia la derecha
        setTimeout(() => {
          onSwipeRight?.();
          resetPosition();
        }, 250);

        return {
          x: 1000,
          y: current.y,
          isDragging: false,
          rotation: 30,
          opacity: 0,
        };
      }
      // No alcanzó threshold, volver a posición inicial
      else {
        isDraggingRef.current = false;
        return {
          x: 0,
          y: 0,
          isDragging: false,
          rotation: 0,
          opacity: 1,
        };
      }
    });
  }, [threshold, onSwipeLeft, onSwipeRight, resetPosition]);

  // Event listeners globales para mouse
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        e.preventDefault();
        handleDragMove(e.clientX, e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        handleDragEnd();
      }
    };

    if (isDraggingRef.current) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [handleDragMove, handleDragEnd]);

  // Handlers para mouse (inicio)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  }, [handleDragStart]);

  // Handlers para touch
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  }, [handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Función para programáticamente hacer swipe
  const swipe = useCallback((direction: 'left' | 'right') => {
    const targetX = direction === 'left' ? -1000 : 1000;
    const targetRotation = direction === 'left' ? -30 : 30;

    setSwipeState({
      x: targetX,
      y: 0,
      isDragging: false,
      rotation: targetRotation,
      opacity: 0,
    });

    setTimeout(() => {
      if (direction === 'left') {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
      resetPosition();
    }, 250);
  }, [onSwipeLeft, onSwipeRight, resetPosition]);

  return {
    swipeState,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    cardRef,
    swipe,
  };
};
