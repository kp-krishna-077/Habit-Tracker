import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ListChecks } from "lucide-react";
import HabitCard from "@/components/HabitCard";
import AddHabitDialog from "@/components/AddHabitDialog";
import EmptyState from "@/components/EmptyState";
import ConfettiEffect from "@/components/ConfettiEffect";
import AchievementUnlockModal from "@/components/AchievementUnlockModal";
import { localStorageService } from "@/lib/storage";
import { INITIAL_ACHIEVEMENTS } from "@/lib/achievements";
import type { Habit, Completion, Achievement, FrequencyType } from "@shared/schema";
import { format, startOfDay, isSameDay } from "date-fns";
import { motion } from "framer-motion";

interface HabitsPageProps {
  onTabChange: (tab: string) => void;
}

export default function HabitsPage({ onTabChange }: HabitsPageProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const savedHabits = localStorageService.getHabits();
    const savedCompletions = localStorageService.getCompletions();
    let savedAchievements = localStorageService.getAchievements();
    
    if (savedAchievements.length === 0) {
      savedAchievements = INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }));
      localStorageService.saveAchievements(savedAchievements);
    }
    
    setHabits(savedHabits);
    setCompletions(savedCompletions);
    setAchievements(savedAchievements);
  }, []);

  const checkAchievements = (updatedHabits: Habit[], updatedCompletions: Completion[]) => {
    const newAchievements = [...achievements];
    let hasNewAchievement = false;

    const unlockAchievement = (id: string) => {
      const achievement = newAchievements.find(a => a.id === id && !a.unlocked);
      if (achievement) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        hasNewAchievement = true;
        setUnlockedAchievement(achievement);
        setShowConfetti(true);
      }
    };

    if (updatedHabits.length >= 1) unlockAchievement("first-habit");
    if (updatedHabits.length >= 5) unlockAchievement("5-habits");
    if (updatedHabits.length >= 10) unlockAchievement("10-habits");

    const totalCompletions = updatedCompletions.filter(c => c.completed).length;
    if (totalCompletions >= 1) unlockAchievement("first-completion");
    if (totalCompletions >= 10) unlockAchievement("10-completions");
    if (totalCompletions >= 50) unlockAchievement("50-completions");
    if (totalCompletions >= 100) unlockAchievement("100-completions");
    if (totalCompletions >= 250) unlockAchievement("250-completions");
    if (totalCompletions >= 500) unlockAchievement("500-completions");
    if (totalCompletions >= 1000) unlockAchievement("1000-completions");

    updatedHabits.forEach(habit => {
      if (habit.currentStreak >= 3) unlockAchievement("3-day-streak");
      if (habit.currentStreak >= 7) unlockAchievement("7-day-streak");
      if (habit.currentStreak >= 14) unlockAchievement("14-day-streak");
      if (habit.currentStreak >= 30) unlockAchievement("30-day-streak");
      if (habit.currentStreak >= 50) unlockAchievement("50-day-streak");
      if (habit.currentStreak >= 100) unlockAchievement("100-day-streak");
      if (habit.currentStreak >= 365) unlockAchievement("365-day-streak");
    });

    const hasCustomFrequency = updatedHabits.some(h => h.frequencyType === "custom");
    if (hasCustomFrequency) unlockAchievement("custom-frequency");

    const hasAllFrequencies = updatedHabits.some(h => h.frequencyType === "daily") &&
                              updatedHabits.some(h => h.frequencyType === "weekly") &&
                              updatedHabits.some(h => h.frequencyType === "custom");
    if (hasAllFrequencies) unlockAchievement("diverse-habits");

    if (hasNewAchievement) {
      setAchievements(newAchievements);
      localStorageService.saveAchievements(newAchievements);
    }
  };

  const addHabit = (title: string, description: string, frequencyType: FrequencyType, customDays?: number[]) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      description,
      frequencyType,
      customDays,
      currentStreak: 0,
      bestStreak: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [...habits, newHabit];
    setHabits(updated);
    localStorageService.saveHabits(updated);
    checkAchievements(updated, completions);
  };

  const updateHabit = (id: string, title: string, description: string, frequencyType: FrequencyType, customDays?: number[]) => {
    const updated = habits.map(h =>
      h.id === id ? { ...h, title, description, frequencyType, customDays } : h
    );
    setHabits(updated);
    localStorageService.saveHabits(updated);
  };

  const deleteHabit = (id: string) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    localStorageService.saveHabits(updated);
    
    const updatedCompletions = completions.filter(c => c.habitId !== id);
    setCompletions(updatedCompletions);
    localStorageService.saveCompletions(updatedCompletions);
  };

  const calculateStreak = (habitId: string, newCompletions: Completion[]): { current: number; best: number } => {
    const habitCompletions = newCompletions
      .filter(c => c.habitId === habitId && c.completed)
      .map(c => new Date(c.date))
      .sort((a, b) => b.getTime() - a.getTime());

    if (habitCompletions.length === 0) return { current: 0, best: 0 };

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    const today = startOfDay(new Date());

    for (let i = 0; i < habitCompletions.length; i++) {
      const date = startOfDay(habitCompletions[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (isSameDay(date, expectedDate)) {
        tempStreak++;
        if (i === 0 || currentStreak > 0) currentStreak = tempStreak;
      } else {
        break;
      }
    }

    tempStreak = 1;
    for (let i = 1; i < habitCompletions.length; i++) {
      const current = startOfDay(habitCompletions[i]);
      const previous = startOfDay(habitCompletions[i - 1]);
      const diffDays = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak, currentStreak);

    return { current: currentStreak, best: bestStreak };
  };

  const toggleCompletion = (habitId: string) => {
    const today = format(new Date(), "yyyy-MM-dd");
    const existingIndex = completions.findIndex(
      c => c.habitId === habitId && c.date === today
    );

    let updated: Completion[];
    if (existingIndex >= 0) {
      updated = completions.map((c, i) =>
        i === existingIndex ? { ...c, completed: !c.completed } : c
      );
    } else {
      updated = [...completions, { habitId, date: today, completed: true }];
    }

    setCompletions(updated);
    localStorageService.saveCompletions(updated);

    const { current, best } = calculateStreak(habitId, updated);
    const updatedHabits = habits.map(h =>
      h.id === habitId ? { ...h, currentStreak: current, bestStreak: best } : h
    );
    setHabits(updatedHabits);
    localStorageService.saveHabits(updatedHabits);

    const completion = updated.find(c => c.habitId === habitId && c.date === today);
    if (completion?.completed) {
      setShowConfetti(true);
    }

    checkAchievements(updatedHabits, updated);
  };

  const isCompletedToday = (habitId: string) => {
    const today = format(new Date(), "yyyy-MM-dd");
    const completion = completions.find(c => c.habitId === habitId && c.date === today);
    return completion?.completed || false;
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setDialogOpen(true);
  };

  const handleDialogSave = (title: string, description: string, frequencyType: FrequencyType, customDays?: number[]) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, title, description, frequencyType, customDays);
      setEditingHabit(null);
    } else {
      addHabit(title, description, frequencyType, customDays);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingHabit(null);
  };

  const todayCompletions = habits.filter(h => isCompletedToday(h.id)).length;
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? (todayCompletions / totalHabits) * 100 : 0;

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b z-40 shadow-sm">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                My Habits
              </h1>
              {totalHabits > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {todayCompletions} of {totalHabits} completed today
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={() => onTabChange('todo')}
                  size="icon"
                  variant="outline"
                  className="shadow-lg"
                >
                  <ListChecks className="w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={() => setDialogOpen(true)}
                  size="icon"
                  data-testid="button-add-habit"
                  className="shadow-lg shadow-primary/20 bg-gradient-to-br from-primary to-primary/90"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
          
          {totalHabits > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Today's Progress</span>
                <span className="font-mono font-medium">{Math.round(completionPercentage)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {habits.length === 0 ? (
          <EmptyState type="habits" onAction={() => setDialogOpen(true)} />
        ) : (
          <div className="space-y-3">
            {habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <HabitCard
                  habit={habit}
                  isCompletedToday={isCompletedToday(habit.id)}
                  onToggleComplete={() => toggleCompletion(habit.id)}
                  onEdit={() => handleEdit(habit)}
                  onDelete={() => deleteHabit(habit.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AddHabitDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        initialTitle={editingHabit?.title}
        initialDescription={editingHabit?.description}
        initialFrequencyType={editingHabit?.frequencyType}
        initialCustomDays={editingHabit?.customDays}
      />

      <ConfettiEffect show={showConfetti} onComplete={() => setShowConfetti(false)} />
      <AchievementUnlockModal
        achievement={unlockedAchievement}
        onClose={() => setUnlockedAchievement(null)}
      />
    </div>
  );
}
