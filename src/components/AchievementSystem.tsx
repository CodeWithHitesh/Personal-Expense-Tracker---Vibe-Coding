import { motion, AnimatePresence } from "motion/react";
import { Trophy, Star, Award } from "lucide-react";
import { useEffect, useState, ReactNode } from "react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

interface AchievementSystemProps {
  transactionsCount: number;
  level: number;
  isOverBudget: boolean;
}

export function AchievementSystem({ transactionsCount, level, isOverBudget }: AchievementSystemProps) {
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('rpg-achievements');
    return saved ? JSON.parse(saved) : [];
  });

  const unlock = (achievement: Achievement) => {
    if (unlockedIds.includes(achievement.id)) return;
    
    setUnlockedIds(prev => {
      const next = [...prev, achievement.id];
      localStorage.setItem('rpg-achievements', JSON.stringify(next));
      return next;
    });
    
    setActiveAchievement(achievement);
    setTimeout(() => setActiveAchievement(null), 5000);
  };

  useEffect(() => {
    if (transactionsCount === 1) {
      unlock({
        id: 'first_step',
        title: 'FIRST STEP',
        description: 'You entered the dungeon of finance.',
        icon: <Star className="text-yellow-400" />
      });
    }
    if (level >= 2) {
      unlock({
        id: 'level_2',
        title: 'NOVICE SAVER',
        description: 'Reached Level 2! Your power grows.',
        icon: <Trophy className="text-rpg-gold" />
      });
    }
    if (isOverBudget) {
      unlock({
        id: 'ascendant',
        title: 'DIVINE ASCENDANT',
        description: 'Your balance exceeds your budget. Godlike!',
        icon: <Award className="text-cyan-400" />
      });
    }
  }, [transactionsCount, level, isOverBudget]);

  return (
    <AnimatePresence>
      {activeAchievement && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed bottom-8 right-8 z-[200] bg-rpg-panel pixel-border-gold p-4 flex items-center gap-4 min-w-[300px]"
        >
          <div className="p-3 bg-slate-900 rounded-full">
            {activeAchievement.icon}
          </div>
          <div>
            <h4 className="font-pixel text-[10px] text-rpg-gold mb-1">ACHIEVEMENT UNLOCKED!</h4>
            <div className="font-pixel text-xs text-white mb-1">{activeAchievement.title}</div>
            <p className="font-mono text-[10px] text-slate-400">{activeAchievement.description}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
