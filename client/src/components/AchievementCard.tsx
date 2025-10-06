import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Trophy, Flame, Zap, Crown, Check, TrendingUp, Calendar, Target, Rocket, Mountain, Gem, Sun, Moon, RotateCcw, Grid, Settings, CheckCircle, Repeat, Sparkles, Medal } from "lucide-react";
import type { Achievement } from "@shared/schema";
import { motion } from "framer-motion";

const iconMap: Record<string, any> = {
  Sparkles, Star, Crown, Check, TrendingUp, Zap, Award, Flame, Trophy, Medal,
  Target, Rocket, Calendar, Mountain, Gem, Sun, Moon, RotateCcw, Grid,
  Settings, CheckCircle, Repeat,
};

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const Icon = iconMap[achievement.icon] || Award;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`p-4 text-center transition-all duration-300 relative overflow-hidden ${
          achievement.unlocked 
            ? 'shadow-md hover-elevate' 
            : 'opacity-60'
        }`}
        data-testid={`card-achievement-${achievement.id}`}
      >
        {/* Background gradient for unlocked achievements */}
        {achievement.unlocked && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        )}
        
        {/* Shimmer effect for unlocked achievements */}
        {achievement.unlocked && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ width: "50%" }}
          />
        )}
        
        <div className="relative z-10">
          <div className="relative w-16 h-16 mx-auto mb-3">
            {/* Progress ring background */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="30"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-muted opacity-20"
              />
              {achievement.unlocked && (
                <motion.circle
                  cx="32"
                  cy="32"
                  r="30"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-primary"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 188.4" }}
                  animate={{ strokeDasharray: "188.4 188.4" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              )}
            </svg>
            
            {/* Icon container */}
            <div className={`absolute inset-2 rounded-full flex items-center justify-center ${
              achievement.unlocked 
                ? 'bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30' 
                : 'bg-muted'
            }`}>
              <Icon className={`w-7 h-7 ${
                achievement.unlocked ? 'text-primary-foreground' : 'text-muted-foreground'
              }`} />
            </div>
          </div>
          
          <h3 className="font-semibold text-sm mb-1 leading-tight" data-testid={`text-achievement-title-${achievement.id}`}>
            {achievement.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2 min-h-[2.5rem]">
            {achievement.description}
          </p>
          
          {achievement.unlocked && achievement.unlockedAt && (
            <Badge 
              variant="secondary" 
              className="text-xs bg-primary/10 text-primary border-primary/20"
            >
              Unlocked
            </Badge>
          )}
          {!achievement.unlocked && (
            <Badge variant="outline" className="text-xs">
              Locked
            </Badge>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
