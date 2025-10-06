import type { Habit, Completion, Achievement } from "@shared/schema";

const HABITS_KEY = "habit-tracker-habits";
const COMPLETIONS_KEY = "habit-tracker-completions";
const ACHIEVEMENTS_KEY = "habit-tracker-achievements";

export const localStorageService = {
  getHabits(): Habit[] {
    const data = localStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveHabits(habits: Habit[]): void {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  },

  getCompletions(): Completion[] {
    const data = localStorage.getItem(COMPLETIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveCompletions(completions: Completion[]): void {
    localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
  },

  getAchievements(): Achievement[] {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAchievements(achievements: Achievement[]): void {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  },
};
