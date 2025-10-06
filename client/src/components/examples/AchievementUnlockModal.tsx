import { useState } from 'react';
import AchievementUnlockModal from '../AchievementUnlockModal';
import { Button } from '@/components/ui/button';
import type { Achievement } from '@shared/schema';

export default function AchievementUnlockModalExample() {
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  
  return (
    <div className="p-4">
      <Button onClick={() => setAchievement({
        id: "first-habit",
        title: "Getting Started",
        description: "Add your first habit",
        icon: "Sparkles",
        requirement: 1,
        category: "habit",
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      })}>
        Show Achievement
      </Button>
      <AchievementUnlockModal 
        achievement={achievement} 
        onClose={() => setAchievement(null)} 
      />
    </div>
  );
}
