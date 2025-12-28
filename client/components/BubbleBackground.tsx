import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const BubbleBackground: React.FC = () => {
  // Create deterministic bubbles so they don't re-render randomly
  const bubbles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 100 + 40, // 40px to 140px
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 15 + 15, // 15s to 30s
      delay: Math.random() * 5,
      opacity: Math.random() * 0.15 + 0.05, // 0.05 to 0.2 opacity
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-br from-brand-orange/5 to-brand-red/5">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-brand-orange blur-xl"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.left,
            top: bubble.top,
            opacity: bubble.opacity,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, -50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: bubble.delay,
          }}
        />
      ))}
    </div>
  );
};

export default BubbleBackground;
