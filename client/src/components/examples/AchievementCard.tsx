import AchievementCard from '../AchievementCard';

export default function AchievementCardExample() {
  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <AchievementCard
        achievement={{
          id: "1",
          title: "First Step",
          description: "Complete your first habit",
          icon: "Check",
          requirement: 1,
          category: "completion",
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        }}
      />
      <AchievementCard
        achievement={{
          id: "2",
          title: "Week Warrior",
          description: "Maintain a 7-day streak",
          icon: "Flame",
          requirement: 7,
          category: "streak",
          unlocked: false,
        }}
      />
    </div>
  );
}
