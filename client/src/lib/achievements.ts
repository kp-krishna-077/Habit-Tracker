import type { Achievement } from "@shared/schema";

export const INITIAL_ACHIEVEMENTS: Omit<Achievement, "unlocked" | "unlockedAt">[] = [
  { id: "first-habit", title: "Getting Started", description: "Add your first habit", icon: "Sparkles", requirement: 1, category: "habit" },
  { id: "5-habits", title: "Habit Collector", description: "Create 5 habits", icon: "Star", requirement: 5, category: "habit" },
  { id: "10-habits", title: "Habit Master", description: "Create 10 habits", icon: "Crown", requirement: 10, category: "habit" },
  
  { id: "first-completion", title: "First Step", description: "Complete your first habit", icon: "Check", requirement: 1, category: "completion" },
  { id: "10-completions", title: "Building Momentum", description: "Complete 10 habits", icon: "TrendingUp", requirement: 10, category: "completion" },
  { id: "50-completions", title: "Consistency Builder", description: "Complete 50 habits", icon: "Zap", requirement: 50, category: "completion" },
  { id: "100-completions", title: "Century Club", description: "Complete 100 habits", icon: "Award", requirement: 100, category: "completion" },
  { id: "250-completions", title: "Unstoppable", description: "Complete 250 habits", icon: "Flame", requirement: 250, category: "completion" },
  { id: "500-completions", title: "Habit Legend", description: "Complete 500 habits", icon: "Trophy", requirement: 500, category: "completion" },
  { id: "1000-completions", title: "Master of Habits", description: "Complete 1000 habits", icon: "Medal", requirement: 1000, category: "completion" },
  
  { id: "3-day-streak", title: "Three in a Row", description: "Maintain a 3-day streak", icon: "Flame", requirement: 3, category: "streak" },
  { id: "7-day-streak", title: "Week Warrior", description: "Maintain a 7-day streak", icon: "Target", requirement: 7, category: "streak" },
  { id: "14-day-streak", title: "Two Week Wonder", description: "Maintain a 14-day streak", icon: "Rocket", requirement: 14, category: "streak" },
  { id: "30-day-streak", title: "Monthly Milestone", description: "Maintain a 30-day streak", icon: "Calendar", requirement: 30, category: "streak" },
  { id: "50-day-streak", title: "Fifty Days Strong", description: "Maintain a 50-day streak", icon: "Mountain", requirement: 50, category: "streak" },
  { id: "100-day-streak", title: "Century Streak", description: "Maintain a 100-day streak", icon: "Gem", requirement: 100, category: "streak" },
  { id: "365-day-streak", title: "Year of Excellence", description: "Maintain a 365-day streak", icon: "Crown", requirement: 365, category: "streak" },
  
  { id: "perfect-day", title: "Perfect Day", description: "Complete all habits in one day", icon: "Sun", requirement: 1, category: "consistency" },
  { id: "perfect-week", title: "Perfect Week", description: "Complete all habits for 7 consecutive days", icon: "Award", requirement: 7, category: "consistency" },
  { id: "perfect-month", title: "Perfect Month", description: "Complete all habits for 30 consecutive days", icon: "Trophy", requirement: 30, category: "consistency" },
  
  { id: "early-bird", title: "Early Bird", description: "Complete a habit before 8 AM", icon: "Sunrise", requirement: 1, category: "completion" },
  { id: "night-owl", title: "Night Owl", description: "Complete a habit after 10 PM", icon: "Moon", requirement: 1, category: "completion" },
  { id: "weekend-warrior", title: "Weekend Warrior", description: "Complete all habits on a weekend day", icon: "Calendar", requirement: 1, category: "consistency" },
  
  { id: "comeback-kid", title: "Comeback Kid", description: "Start a new streak after breaking one", icon: "RotateCcw", requirement: 1, category: "streak" },
  { id: "diverse-habits", title: "Well Rounded", description: "Have habits with all frequency types", icon: "Grid", requirement: 1, category: "habit" },
  { id: "custom-frequency", title: "Flexibility Master", description: "Create a habit with custom days", icon: "Settings", requirement: 1, category: "habit" },
  
  { id: "50-streak-any", title: "Streaker", description: "Reach a 50-day streak on any habit", icon: "Flame", requirement: 50, category: "streak" },
  { id: "3-perfect-days", title: "Consistency Pro", description: "Achieve 3 perfect days", icon: "CheckCircle", requirement: 3, category: "consistency" },
  { id: "all-daily-week", title: "Daily Grind", description: "Complete all daily habits for a week", icon: "Repeat", requirement: 7, category: "consistency" },
  { id: "milestone-hunter", title: "Milestone Hunter", description: "Unlock 10 achievements", icon: "Target", requirement: 10, category: "completion" },
];
