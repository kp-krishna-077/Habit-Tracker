import { Home, Calendar, Trophy, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "habits", label: "Habits", icon: Home },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t safe-area-inset-bottom z-50 shadow-2xl">
      <div className="flex items-center justify-around max-w-2xl mx-auto relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              data-testid={`button-nav-${tab.id}`}
              className={`flex-1 flex flex-col items-center gap-1 h-16 rounded-none relative transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
              </motion.div>
              
              <motion.span
                className="text-xs font-medium"
                animate={{
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {tab.label}
              </motion.span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
