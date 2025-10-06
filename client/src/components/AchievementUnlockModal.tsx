import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Award, Flame, Zap, Crown, Check, TrendingUp, Calendar, Target, Rocket, Mountain, Gem, Sun, Moon, RotateCcw, Grid, Settings, CheckCircle, Repeat, Sparkles, Medal } from "lucide-react";
import type { Achievement } from "@shared/schema";
import { motion } from "framer-motion";

const iconMap: Record<string, any> = {
  Sparkles, Star, Crown, Check, TrendingUp, Zap, Award, Flame, Trophy, Medal,
  Target, Rocket, Calendar, Mountain, Gem, Sun, Moon, RotateCcw, Grid,
  Settings, CheckCircle, Repeat,
};

interface AchievementUnlockModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementUnlockModal({ achievement, onClose }: AchievementUnlockModalProps) {
  if (!achievement) return null;
  
  const Icon = iconMap[achievement.icon] || Trophy;
  
  return (
    <Dialog open={!!achievement} onOpenChange={onClose}>
      <DialogContent className="max-w-sm border-0 bg-gradient-to-br from-background via-background to-primary/5" data-testid="dialog-achievement-unlock">
        {/* Animated background rays */}
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-1/2 bg-gradient-to-b from-primary/30 to-transparent origin-top"
              style={{
                transform: `rotate(${i * 45}deg)`,
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{
                delay: 0.2 + i * 0.05,
                duration: 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-center py-6 relative z-10"
        >
          {/* Icon with pulsing rings */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Pulsing rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-primary"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5 + i * 0.3, opacity: 0 }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}
            
            {/* Main icon */}
            <motion.div
              initial={{ rotate: -180 }}
              animate={{ rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center"
            >
              <Icon className="w-16 h-16 text-primary-foreground" />
            </motion.div>
            
            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${20 + Math.cos(i * 60 * Math.PI / 180) * 60}%`,
                  left: `${50 + Math.sin(i * 60 * Math.PI / 180) * 60}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.3 + i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Achievement Unlocked!
            </h2>
            <h3 className="text-xl font-semibold mb-2 text-primary">
              {achievement.title}
            </h3>
            <p className="text-muted-foreground mb-6">
              {achievement.description}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              onClick={onClose} 
              data-testid="button-close-achievement" 
              className="w-full bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/30"
              size="lg"
            >
              Awesome!
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
