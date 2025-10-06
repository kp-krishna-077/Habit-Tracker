import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import type { FrequencyType } from "@shared/schema";

interface AddHabitDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, frequencyType: FrequencyType, customDays?: number[], reminderTime?: string, reminderDate?: string) => void;
  initialTitle?: string;
  initialDescription?: string;
  initialFrequencyType?: FrequencyType;
  initialCustomDays?: number[];
  initialReminderTime?: string;
  initialReminderDate?: string;
}

export default function AddHabitDialog({
  open,
  onClose,
  onSave,
  initialTitle = "",
  initialDescription = "",
  initialFrequencyType = "daily",
  initialCustomDays = [],
  initialReminderTime = "",
  initialReminderDate = "",
}: AddHabitDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(initialFrequencyType);
  const [customDays, setCustomDays] = useState<number[]>(initialCustomDays);
  const [reminderTime, setReminderTime] = useState(initialReminderTime);
  const [reminderDate, setReminderDate] = useState(initialReminderDate);
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const toggleDay = (day: number) => {
    setCustomDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };
  
  const handleSave = () => {
    if (title.trim()) {
      onSave(title, description, frequencyType, frequencyType === "custom" ? customDays : undefined, reminderTime, reminderDate);
      setTitle("");
      setDescription("");
      setFrequencyType("daily");
      setCustomDays([]);
      setReminderTime("");
      setReminderDate("");
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="dialog-add-habit">
        <DialogHeader>
          <DialogTitle>{initialTitle ? "Edit Habit" : "Add New Habit"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="habit-title">Habit Title</Label>
            <Input
              id="habit-title"
              placeholder="e.g. Morning Meditation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-habit-title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="habit-description">Description (Optional)</Label>
            <Textarea
              id="habit-description"
              placeholder="Add details about this habit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="input-habit-description"
              rows={3}
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Frequency</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={frequencyType === "daily" ? "default" : "outline"}
                onClick={() => setFrequencyType("daily")}
                data-testid="button-frequency-daily"
                className="flex-1"
              >
                Daily
              </Button>
              <Button
                type="button"
                variant={frequencyType === "weekly" ? "default" : "outline"}
                onClick={() => setFrequencyType("weekly")}
                data-testid="button-frequency-weekly"
                className="flex-1"
              >
                Weekly
              </Button>
              <Button
                type="button"
                variant={frequencyType === "custom" ? "default" : "outline"}
                onClick={() => setFrequencyType("custom")}
                data-testid="button-frequency-custom"
                className="flex-1"
              >
                Custom
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reminder-date">Reminder Date</Label>
              <Input
                id="reminder-date"
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Reminder Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
          </div>
          
          {frequencyType === "custom" && (
            <div className="space-y-2">
              <Label>Select Days</Label>
              <div className="flex gap-2 flex-wrap">
                {dayNames.map((day, i) => (
                  <Badge
                    key={i}
                    variant={customDays.includes(i) ? "default" : "outline"}
                    className="cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => toggleDay(i)}
                    data-testid={`badge-day-${i}`}
                  >
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()} data-testid="button-save">
            Save Habit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
