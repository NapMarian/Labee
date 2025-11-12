import { ReactNode } from 'react';
import { useSwipe } from '../../hooks/useSwipe';

interface SwipeCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export const SwipeCard = ({ children, onSwipeLeft, onSwipeRight, className = '' }: SwipeCardProps) => {
  const { swipeState, handlers, cardRef } = useSwipe({
    onSwipeLeft,
    onSwipeRight,
    threshold: 100,
  });

  const { x, y, rotation, opacity, isDragging } = swipeState;

  return (
    <div
      ref={cardRef}
      className={`swipe-card ${className}`}
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
        opacity,
        transition: isDragging ? 'none' : 'all 0.3s ease-out',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      {...handlers}
    >
      {/* Indicador visual de "Like" (azul, derecha) */}
      {x > 50 && (
        <div
          className="absolute top-8 right-8 text-blue-500 dark:text-blue-400 font-bold text-4xl border-4 border-blue-500 dark:border-blue-400 px-4 py-2 rounded-lg rotate-12 pointer-events-none"
          style={{ opacity: Math.min(x / 150, 1) }}
        >
          LIKE
        </div>
      )}

      {/* Indicador visual de "Nope" (gris, izquierda) */}
      {x < -50 && (
        <div
          className="absolute top-8 left-8 text-gray-500 dark:text-gray-400 font-bold text-4xl border-4 border-gray-500 dark:border-gray-400 px-4 py-2 rounded-lg -rotate-12 pointer-events-none"
          style={{ opacity: Math.min(Math.abs(x) / 150, 1) }}
        >
          NOPE
        </div>
      )}

      {children}
    </div>
  );
};
