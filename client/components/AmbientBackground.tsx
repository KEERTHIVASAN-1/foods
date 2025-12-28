import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const AmbientBackground: React.FC = () => {
  // Generate floating particles - more on sides
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 10 + 5, // 5px to 15px
      // Distribute more particles on left and right sides
      left: i < 15 ? `${Math.random() * 25}%` : i >= 25 ? `${75 + Math.random() * 25}%` : `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 20 + 20, // 20s to 40s
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.15,
      color: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#e23744' : '#f5cd47',
    }));
  }, []);

  // Generate morphing blobs - more on sides
  const blobs = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      size: Math.random() * 400 + 250, // 250px to 650px
      // Distribute more blobs on left and right sides
      left: i < 4 ? `${Math.random() * 20}%` : i >= 8 ? `${80 + Math.random() * 20}%` : `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 15 + 20, // 20s to 35s
      delay: Math.random() * 5,
      opacity: Math.random() * 0.12 + 0.03,
      color: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#e23744' : '#f5cd47',
    }));
  }, []);

  // Generate floating lines
  const lines = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      width: Math.random() * 200 + 100, // 100px to 300px
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      rotation: Math.random() * 360,
      duration: Math.random() * 25 + 25, // 25s to 50s
      delay: Math.random() * 10,
      opacity: Math.random() * 0.15 + 0.05,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient background - enhanced for sides */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 10% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 60%), radial-gradient(circle at 90% 50%, rgba(226, 55, 68, 0.15) 0%, transparent 60%), radial-gradient(circle at 50% 50%, rgba(245, 205, 71, 0.08) 0%, transparent 50%), radial-gradient(circle at 5% 20%, rgba(249, 115, 22, 0.1) 0%, transparent 40%), radial-gradient(circle at 95% 80%, rgba(226, 55, 68, 0.1) 0%, transparent 40%)',
            'radial-gradient(circle at 90% 50%, rgba(226, 55, 68, 0.15) 0%, transparent 60%), radial-gradient(circle at 10% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 60%), radial-gradient(circle at 50% 30%, rgba(245, 205, 71, 0.1) 0%, transparent 50%), radial-gradient(circle at 95% 20%, rgba(226, 55, 68, 0.1) 0%, transparent 40%), radial-gradient(circle at 5% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 40%)',
            'radial-gradient(circle at 50% 30%, rgba(245, 205, 71, 0.12) 0%, transparent 50%), radial-gradient(circle at 15% 70%, rgba(249, 115, 22, 0.15) 0%, transparent 60%), radial-gradient(circle at 85% 60%, rgba(226, 55, 68, 0.15) 0%, transparent 60%), radial-gradient(circle at 8% 40%, rgba(249, 115, 22, 0.1) 0%, transparent 40%), radial-gradient(circle at 92% 60%, rgba(226, 55, 68, 0.1) 0%, transparent 40%)',
            'radial-gradient(circle at 10% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 60%), radial-gradient(circle at 90% 50%, rgba(226, 55, 68, 0.15) 0%, transparent 60%), radial-gradient(circle at 50% 50%, rgba(245, 205, 71, 0.08) 0%, transparent 50%), radial-gradient(circle at 5% 20%, rgba(249, 115, 22, 0.1) 0%, transparent 40%), radial-gradient(circle at 95% 80%, rgba(226, 55, 68, 0.1) 0%, transparent 40%)',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Morphing liquid blobs */}
      {blobs.map((blob) => (
        <motion.div
          key={`blob-${blob.id}`}
          className="absolute rounded-full blur-3xl"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.left,
            top: blob.top,
            opacity: blob.opacity,
            backgroundColor: blob.color,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            scale: [1, 1.3, 0.8, 1.2, 1],
            borderRadius: ['50%', '40% 60%', '60% 40%', '30% 70%', '50%'],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: blob.delay,
          }}
        />
      ))}

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            opacity: particle.opacity,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={{
            y: [0, -150, -300, -150, 0],
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            scale: [1, 1.5, 0.8, 1.2, 1],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity * 0.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}

      {/* Animated lines */}
      {lines.map((line) => (
        <motion.div
          key={`line-${line.id}`}
          className="absolute"
          style={{
            width: line.width,
            height: '2px',
            left: line.left,
            top: line.top,
            opacity: line.opacity,
            background: `linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.3), transparent)`,
            transform: `rotate(${line.rotation}deg)`,
          }}
          animate={{
            x: [0, Math.random() * 300 - 150, Math.random() * 300 - 150, 0],
            y: [0, Math.random() * 300 - 150, Math.random() * 300 - 150, 0],
            rotate: [line.rotation, line.rotation + 180, line.rotation + 360],
            scaleX: [1, 1.5, 0.8, 1.2, 1],
            opacity: [line.opacity, line.opacity * 1.5, line.opacity * 0.5, line.opacity],
          }}
          transition={{
            duration: line.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: line.delay,
          }}
        />
      ))}

      {/* Subtle grid pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0 0', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.02) 100%)',
        }}
      />
    </div>
  );
};

export default AmbientBackground;

