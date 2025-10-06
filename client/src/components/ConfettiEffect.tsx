import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiEffectProps {
  show: boolean;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

export default function ConfettiEffect({ show, onComplete }: ConfettiEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    if (show) {
      const colors = ["#4ade80", "#fbbf24", "#60a5fa", "#f472b6", "#a78bfa", "#34d399", "#fb923c"];
      const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 120 - 60,
        y: -20 - Math.random() * 20,
        rotation: Math.random() * 720 - 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 8,
        delay: Math.random() * 0.2,
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: "50vw", 
              y: "50vh", 
              scale: 0,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              x: `calc(50vw + ${particle.x}vw)`,
              y: `calc(50vh + ${particle.y}vh + 100vh)`,
              scale: 1,
              rotate: particle.rotation,
              opacity: [1, 1, 0.8, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2.5,
              delay: particle.delay,
              ease: [0.33, 1, 0.68, 1],
            }}
            className="absolute rounded-sm shadow-lg"
            style={{ 
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
