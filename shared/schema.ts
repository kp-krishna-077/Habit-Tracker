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
  reminderTime: z.string().optional(),
  reminderDate: z.string().optional(),
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

export const priorityLevels = ["High", "Medium", "Low"] as const;
export const todoCategories = ["Work", "Personal", "Shopping"] as const;

export const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  priority: z.enum(priorityLevels),
  category: z.string(),
  completed: z.boolean().default(false),
  completedAt: z.string().optional(),
  createdAt: z.string(),
});

export const insertTodoSchema = todoSchema.omit({
  id: true,
  completed: true,
  completedAt: true,
  createdAt: true,
});

export type Habit = z.infer<typeof habitSchema>;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Completion = z.infer<typeof completionSchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type FrequencyType = typeof frequencyTypes[number];
export type Todo = z.infer<typeof todoSchema>;
export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type PriorityLevel = typeof priorityLevels[number];
export type TodoCategory = typeof todoCategories[number];
