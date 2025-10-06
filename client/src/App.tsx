import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { storageService } from "./lib/storage";
import BottomNav from "@/components/BottomNav";
import HabitsPage from "@/pages/HabitsPage";
import CalendarPage from "@/pages/CalendarPage";
import AchievementsPage from "@/pages/AchievementsPage";
import SettingsPage from "@/pages/SettingsPage";
import TodoPage from "@/pages/TodoPage";

function App() {
  const [activeTab, setActiveTab] = useState("habits");

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await storageService.getTheme();
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

      const habits = await storageService.getHabits();
      habits.forEach(habit => {
        if (habit.reminderTime === currentTime && habit.reminderDate === currentDate) {
          fetch("/api/send-notification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: "Habit Reminder",
              body: `Don't forget to complete your habit: ${habit.title}`,
            }),
          });
        }
      });

      const todos = await storageService.getTodos();
      todos.forEach(todo => {
        if (todo.dueTime === currentTime && todo.dueDate === currentDate) {
          fetch("/api/send-notification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: "To-Do Reminder",
              body: `Your task is due: ${todo.title}`,
            }),
          });
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {activeTab === "habits" && <HabitsPage onTabChange={setActiveTab} />}
          {activeTab === "calendar" && <CalendarPage />}
          {activeTab === "achievements" && <AchievementsPage />}
          {activeTab === "settings" && <SettingsPage />}
          {activeTab === "todo" && <TodoPage />}
          
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
