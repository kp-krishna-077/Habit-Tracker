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
