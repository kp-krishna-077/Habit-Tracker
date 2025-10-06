import CalendarView from '../CalendarView';

export default function CalendarViewExample() {
  const completedDates = [
    new Date(2025, 9, 1).toISOString(),
    new Date(2025, 9, 2).toISOString(),
    new Date(2025, 9, 3).toISOString(),
    new Date(2025, 9, 5).toISOString(),
  ];
  
  return (
    <div className="p-4">
      <CalendarView
        habitId="1"
        completedDates={completedDates}
      />
    </div>
  );
}
