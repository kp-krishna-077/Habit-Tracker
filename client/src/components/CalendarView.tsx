import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek, isSameMonth } from "date-fns";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarViewProps {
  habitId: string;
  completedDates: string[];
}

export default function CalendarView({ habitId, completedDates }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [direction, setDirection] = useState(0);
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const isCompleted = (date: Date) => {
    return completedDates.some(d => isSameDay(new Date(d), date));
  };
  
  const isInCurrentMonth = (date: Date) => {
    return isSameMonth(date, currentMonth);
  };
  
  const goToPrevMonth = () => {
    setDirection(-1);
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const goToNextMonth = () => {
    setDirection(1);
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const completionRate = days.filter(d => isInCurrentMonth(d) && isCompleted(d)).length / 
                         days.filter(d => isInCurrentMonth(d)).length * 100;
  
  return (
    <Card className="p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={goToPrevMonth}
          data-testid="button-prev-month"
          className="hover-elevate active-elevate-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <div className="text-center">
          <AnimatePresence mode="wait">
            <motion.h3
              key={format(currentMonth, "MMMM yyyy")}
              initial={{ opacity: 0, y: direction * 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction * -20 }}
              transition={{ duration: 0.2 }}
              className="font-semibold"
              data-testid="text-current-month"
            >
              {format(currentMonth, "MMMM yyyy")}
            </motion.h3>
          </AnimatePresence>
          {completionRate > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(completionRate)}% completed this month
            </p>
          )}
        </div>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={goToNextMonth}
          data-testid="button-next-month"
          className="hover-elevate active-elevate-2"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={format(currentMonth, "MMMM yyyy")}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.3 }}
            className="col-span-7 grid grid-cols-7 gap-2"
          >
            {days.map((day, i) => {
              const completed = isCompleted(day);
              const inMonth = isInCurrentMonth(day);
              const today = isToday(day);
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.01 }}
                  className="aspect-square relative"
                >
                  <div
                    className={`w-full h-full flex items-center justify-center rounded-full text-sm relative transition-all duration-200 ${
                      !inMonth ? 'text-muted-foreground/30' : ''
                    } ${today ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''} ${
                      completed && inMonth ? 'shadow-md' : ''
                    }`}
                    data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
                  >
                    {completed && inMonth && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </motion.div>
                    )}
                    {!completed && inMonth && (
                      <div className="absolute inset-0 border-2 border-border rounded-full" />
                    )}
                    <span className={`relative z-10 font-medium ${
                      completed && inMonth ? 'text-primary-foreground' : ''
                    }`}>
                      {format(day, 'd')}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}
