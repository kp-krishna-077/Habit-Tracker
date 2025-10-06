import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AchievementCard from "@/components/AchievementCard";
import EmptyState from "@/components/EmptyState";
import { localStorageService } from "@/lib/storage";
import { INITIAL_ACHIEVEMENTS } from "@/lib/achievements";
import type { Achievement } from "@shared/schema";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    let savedAchievements = localStorageService.getAchievements();
    if (savedAchievements.length === 0) {
      savedAchievements = INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }));
      localStorageService.saveAchievements(savedAchievements);
    }
    setAchievements(savedAchievements);
  }, []);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b z-40">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold">Achievements</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unlockedAchievements.length} of {achievements.length} unlocked
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
            <TabsTrigger value="unlocked" data-testid="tab-unlocked">Unlocked</TabsTrigger>
            <TabsTrigger value="locked" data-testid="tab-locked">Locked</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {achievements.length === 0 ? (
              <EmptyState type="achievements" />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {achievements.map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="unlocked">
            {unlockedAchievements.length === 0 ? (
              <EmptyState type="achievements" />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {unlockedAchievements.map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="locked">
            <div className="grid grid-cols-2 gap-3">
              {lockedAchievements.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
