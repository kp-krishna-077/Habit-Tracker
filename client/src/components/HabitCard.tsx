import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Flame, Edit2, Trash2 } from "lucide-react";
import type { Habit } from "@shared/schema";
import { motion } from "framer-motion";

interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function HabitCard({
  habit,
  isCompletedToday,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const getFrequencyLabel = () => {
    if (habit.frequencyType === "daily") return "Daily";
    if (habit.frequencyType === "weekly") return "Weekly";
    if (habit.customDays) {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return habit.customDays.map(d => days[d]).join(", ");
    }
    return "Custom";
  };

  const streakPercentage = habit.bestStreak > 0 
    ? Math.min((habit.currentStreak / habit.bestStreak) * 100, 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden hover-elevate active-elevate-2 transition-all duration-300">
        {/* Accent stripe */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
          isCompletedToday 
            ? 'bg-gradient-to-b from-primary via-primary to-primary/70' 
            : 'bg-muted'
        }`} />
        
        {/* Subtle background gradient for completed habits */}
        {isCompletedToday && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        )}
        
        <div className="flex items-center gap-3 p-4 pl-5">
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              size="icon"
              variant={isCompletedToday ? "default" : "outline"}
              onClick={onToggleComplete}
              data-testid={`button-toggle-${habit.id}`}
              className={`min-h-12 min-w-12 rounded-full shadow-sm transition-all duration-300 ${
                isCompletedToday 
                  ? 'bg-gradient-to-br from-primary to-primary/80 shadow-primary/20' 
                  : ''
              }`}
            >
              {isCompletedToday && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Check className="w-5 h-5" />
                </motion.div>
              )}
            </Button>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate" data-testid={`text-habit-title-${habit.id}`}>
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-sm text-muted-foreground truncate mt-0.5" data-testid={`text-habit-description-${habit.id}`}>
                {habit.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="secondary" className="text-xs font-medium" data-testid={`badge-frequency-${habit.id}`}>
                {getFrequencyLabel()}
              </Badge>
              {habit.currentStreak > 0 && (
                <div className="flex items-center gap-1.5" data-testid={`text-streak-${habit.id}`}>
                  <div className="relative">
                    <Flame className="w-4 h-4 text-primary" />
                    {habit.currentStreak >= 7 && (
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Flame className="w-4 h-4 text-primary" />
                      </motion.div>
                    )}
                  </div>
                  <span className="font-mono font-semibold text-sm text-foreground">
                    {habit.currentStreak}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={onEdit}
              data-testid={`button-edit-${habit.id}`}
              className="h-9 w-9"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onDelete}
              data-testid={`button-delete-${habit.id}`}
              className="h-9 w-9"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {habit.bestStreak > 0 && (
          <div className="px-4 pb-4 pt-0">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Streak Progress</span>
              <span className="font-mono font-medium" data-testid={`text-best-streak-${habit.id}`}>
                Best: {habit.bestStreak} {habit.bestStreak === 1 ? "day" : "days"}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${streakPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
