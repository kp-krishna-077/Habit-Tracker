import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CalendarView from "@/components/CalendarView";
import EmptyState from "@/components/EmptyState";
import { localStorageService } from "@/lib/storage";
import type { Habit, Completion } from "@shared/schema";

export default function CalendarPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string>("");

  useEffect(() => {
    const savedHabits = localStorageService.getHabits();
    const savedCompletions = localStorageService.getCompletions();
    setHabits(savedHabits);
    setCompletions(savedCompletions);
    if (savedHabits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(savedHabits[0].id);
    }
  }, []);

  const selectedHabit = habits.find(h => h.id === selectedHabitId);
  const completedDates = completions
    .filter(c => c.habitId === selectedHabitId && c.completed)
    .map(c => c.date);

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b z-40">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Calendar</h1>
          
          {habits.length > 0 && (
            <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
              <SelectTrigger data-testid="select-habit">
                <SelectValue placeholder="Select a habit" />
              </SelectTrigger>
              <SelectContent>
                {habits.map(habit => (
                  <SelectItem key={habit.id} value={habit.id}>
                    {habit.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {habits.length === 0 ? (
          <EmptyState type="calendar" />
        ) : selectedHabit ? (
          <CalendarView habitId={selectedHabitId} completedDates={completedDates} />
        ) : null}
      </div>
    </div>
  );
}
