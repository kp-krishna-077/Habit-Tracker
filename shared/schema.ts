import { z } from "zod";

export const frequencyTypes = ["daily", "weekly", "custom"] as const;

export const habitSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  frequencyType: z.enum(frequencyTypes),
  customDays: z.array(z.number().min(0).max(6)).optional(),
  currentStreak: z.number().default(0),
  bestStreak: z.number().default(0),
  createdAt: z.string(),
});

export const insertHabitSchema = habitSchema.omit({
  id: true,
  currentStreak: true,
  bestStreak: true,
  createdAt: true,
});

export const completionSchema = z.object({
  habitId: z.string(),
  date: z.string(),
  completed: z.boolean(),
});

export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  requirement: z.number(),
  category: z.enum(["streak", "completion", "habit", "consistency"]),
  unlocked: z.boolean().default(false),
  unlockedAt: z.string().optional(),
});

export type Habit = z.infer<typeof habitSchema>;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Completion = z.infer<typeof completionSchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type FrequencyType = typeof frequencyTypes[number];
