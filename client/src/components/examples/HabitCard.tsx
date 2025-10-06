import HabitCard from '../HabitCard';

export default function HabitCardExample() {
  return (
    <div className="p-4 space-y-4">
      <HabitCard
        habit={{
          id: "1",
          title: "Morning Meditation",
          description: "10 minutes of mindfulness meditation",
          frequencyType: "daily",
          currentStreak: 7,
          bestStreak: 14,
          createdAt: new Date().toISOString(),
        }}
        isCompletedToday={true}
        onToggleComplete={() => console.log('Toggle complete')}
        onEdit={() => console.log('Edit')}
        onDelete={() => console.log('Delete')}
      />
      <HabitCard
        habit={{
          id: "2",
          title: "Exercise",
          description: "30 minutes cardio or strength training",
          frequencyType: "custom",
          customDays: [1, 3, 5],
          currentStreak: 0,
          bestStreak: 5,
          createdAt: new Date().toISOString(),
        }}
        isCompletedToday={false}
        onToggleComplete={() => console.log('Toggle complete')}
        onEdit={() => console.log('Edit')}
        onDelete={() => console.log('Delete')}
      />
    </div>
  );
}
