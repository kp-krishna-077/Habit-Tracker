import { Button } from "@/components/ui/button";
import { Plus, Trophy, Calendar } from "lucide-react";

interface EmptyStateProps {
  type: "habits" | "achievements" | "calendar";
  onAction?: () => void;
}

export default function EmptyState({ type, onAction }: EmptyStateProps) {
  const content = {
    habits: {
      icon: Plus,
      title: "No habits yet",
      description: "Start building better habits today",
      actionLabel: "Add Your First Habit",
    },
    achievements: {
      icon: Trophy,
      title: "No achievements unlocked",
      description: "Complete habits to unlock achievements",
      actionLabel: null,
    },
    calendar: {
      icon: Calendar,
      title: "No completions yet",
      description: "Mark habits as done to see them here",
      actionLabel: null,
    },
  };
  
  const { icon: Icon, title, description, actionLabel } = content[type];
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} data-testid="button-empty-action">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
