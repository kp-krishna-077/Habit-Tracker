import localforage from "localforage";
import type { Habit, Completion, Achievement, Todo } from "@shared/schema";

const HABITS_KEY = "habit-tracker-habits";
const COMPLETIONS_KEY = "habit-tracker-completions";
const ACHIEVEMENTS_KEY = "habit-tracker-achievements";
const TODOS_KEY = "habit-tracker-todos";
const THEME_KEY = "habit-tracker-theme";

export const storageService = {
  async getHabits(): Promise<Habit[]> {
    const data = await localforage.getItem<Habit[]>(HABITS_KEY);
    return data || [];
  },

  async saveHabits(habits: Habit[]): Promise<void> {
    await localforage.setItem(HABITS_KEY, habits);
  },

  async getCompletions(): Promise<Completion[]> {
    const data = await localforage.getItem<Completion[]>(COMPLETIONS_KEY);
    return data || [];
  },

  async saveCompletions(completions: Completion[]): Promise<void> {
    await localforage.setItem(COMPLETIONS_KEY, completions);
  },

  async getAchievements(): Promise<Achievement[]> {
    const data = await localforage.getItem<Achievement[]>(ACHIEVEMENTS_KEY);
    return data || [];
  },

  async saveAchievements(achievements: Achievement[]): Promise<void> {
    await localforage.setItem(ACHIEVEMENTS_KEY, achievements);
  },

  async getTodos(): Promise<Todo[]> {
    const data = await localforage.getItem<Todo[]>(TODOS_KEY);
    return data || [];
  },

  async saveTodos(todos: Todo[]): Promise<void> {
    await localforage.setItem(TODOS_KEY, todos);
  },

  async getTheme(): Promise<string | null> {
    return localforage.getItem<string>(THEME_KEY);
  },

  async saveTheme(theme: string): Promise<void> {
    await localforage.setItem(THEME_KEY, theme);
  },
};
