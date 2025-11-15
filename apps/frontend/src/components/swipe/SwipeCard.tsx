import { ReactNode, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from 'framer-motion';

interface SwipeCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export const SwipeCard = ({ children, onSwipeLeft, onSwipeRight, className = '' }: SwipeCardProps) => {
  const [exitX, setExitX] = useState(0);
  const controls = useAnimation();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transformaciones basadas en la posición X
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Indicadores de like/nope
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  // Resetear cuando cambian los children (nueva tarjeta)
  useEffect(() => {
    setExitX(0);
    x.set(0);
    y.set(0);
    controls.start({ x: 0, y: 0, opacity: 1, rotate: 0 });
  }, [children, x, y, controls]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 150;

    if (Math.abs(info.offset.x) > threshold) {
      // Determinar dirección
      const direction = info.offset.x > 0 ? 1 : -1;
      performSwipe(direction);
    }
  };

  // Función para ejecutar el swipe (manual o programático)
  const performSwipe = useCallback((direction: number) => {
    setExitX(direction * 1000);

    // Llamar callback después de la animación
    setTimeout(() => {
      if (direction > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
      // Resetear después de llamar el callback
      setExitX(0);
    }, 200);
  }, [onSwipeLeft, onSwipeRight]);

  // Exponer métodos para swipe programático
  useEffect(() => {
    (window as any).__swipeCard = {
      swipeLeft: () => performSwipe(-1),
      swipeRight: () => performSwipe(1),
    };
    return () => {
      delete (window as any).__swipeCard;
    };
  }, [performSwipe]);

  return (
    <motion.div
      className={`swipe-card ${className}`}
      style={{
        x,
        y,
        rotate,
        opacity,
        cursor: 'grab',
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX, opacity: 0 } : controls}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      whileTap={{ cursor: 'grabbing' }}
    >
      {/* Indicador visual de "LIKE" (azul, derecha) */}
      <motion.div
        className="absolute top-8 right-8 text-blue-500 dark:text-blue-400 font-bold text-4xl border-4 border-blue-500 dark:border-blue-400 px-4 py-2 rounded-lg rotate-12 pointer-events-none z-10"
        style={{ opacity: likeOpacity }}
      >
        LIKE
      </motion.div>

      {/* Indicador visual de "NOPE" (gris, izquierda) */}
      <motion.div
        className="absolute top-8 left-8 text-gray-500 dark:text-gray-400 font-bold text-4xl border-4 border-gray-500 dark:border-gray-400 px-4 py-2 rounded-lg -rotate-12 pointer-events-none z-10"
        style={{ opacity: nopeOpacity }}
      >
        NOPE
      </motion.div>

      {children}
    </motion.div>
  );
};
