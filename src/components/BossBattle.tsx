import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ghost, Flame, Skull, Zap, AlertTriangle } from "lucide-react";
import { Transaction, GameState } from "../types";
import { cn } from "../lib/utils";

interface BossBattleProps {
  transactions: Transaction[];
  gameState: GameState;
  currency: string;
}

export function BossBattle({ transactions, gameState, currency }: BossBattleProps) {
  const [isHit, setIsHit] = useState(false);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseRatio = Math.min(1, totalExpenses / gameState.maxHp);
  
  // Trigger hit animation when transactions change
  useEffect(() => {
    if (transactions.length > 0 && transactions[0].type === 'expense') {
      setIsHit(true);
      setTimeout(() => setIsHit(false), 300);
    }
  }, [transactions]);

  // Determine boss type based on highest category
  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "Debt";

  const getBossIcon = () => {
    if (expenseRatio > 0.8) return <Skull size={80} className={cn("text-rpg-damage", isHit ? "animate-ping" : "animate-bounce")} />;
    if (topCategory === 'Food') return <Flame size={80} className={cn("text-orange-500", isHit ? "animate-ping" : "animate-pulse")} />;
    if (topCategory === 'Bills') return <Zap size={80} className={cn("text-yellow-400", isHit ? "animate-ping" : "animate-pulse")} />;
    return <Ghost size={80} className={cn("text-slate-400", isHit ? "animate-ping" : "animate-pulse")} />;
  };

  const getBossName = () => {
    if (expenseRatio > 0.9) return "THE BANKRUPTCY OVERLORD";
    if (expenseRatio > 0.7) return `THE ${topCategory.toUpperCase()} BEHEMOTH`;
    if (expenseRatio > 0.4) return `THE ${topCategory.toUpperCase()} WRAITH`;
    return `THE ${topCategory.toUpperCase()} SLIME`;
  };

  return (
    <div className={cn(
      "bg-rpg-panel pixel-border-damage p-6 relative overflow-hidden min-h-[200px] flex flex-col items-center justify-center transition-colors duration-300",
      isHit ? "bg-rpg-damage/20" : "bg-rpg-panel"
    )}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ef4444 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={16} className="text-rpg-damage animate-pulse" />
          <h3 className="font-pixel text-xs text-rpg-damage tracking-tighter">ACTIVE BOSS ENCOUNTER</h3>
        </div>

        <motion.div
          animate={isHit ? {
            x: [0, -10, 10, -10, 10, 0],
            rotate: [0, -5, 5, -5, 5, 0]
          } : { 
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
            filter: expenseRatio > 0.7 ? ["hue-rotate(0deg)", "hue-rotate(45deg)", "hue-rotate(0deg)"] : "none"
          }}
          transition={isHit ? { duration: 0.3 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {getBossIcon()}
          
          {/* Shadow */}
          <div className="w-16 h-2 bg-black/40 rounded-full blur-sm mt-4 mx-auto" />
        </motion.div>

        <div className="text-center">
          <h4 className="font-pixel text-lg text-white mb-1">{getBossName()}</h4>
          <div className="w-64 h-4 bg-slate-900 border-2 border-slate-700 p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(1 - expenseRatio) * 100}%` }}
              className={cn(
                "h-full transition-all duration-1000",
                expenseRatio > 0.8 ? "bg-rpg-damage" : expenseRatio > 0.5 ? "bg-yellow-500" : "bg-rpg-health"
              )}
            />
          </div>
          <div className="flex justify-between mt-1 font-mono text-[10px] text-slate-500">
            <span>BOSS HP</span>
            <span>{currency}{Math.max(0, gameState.maxHp - totalExpenses).toFixed(0)} / {currency}{gameState.maxHp.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* Floating Damage Numbers Effect */}
      <AnimatePresence>
        {isHit && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -150, scale: 2 }}
            exit={{ opacity: 0 }}
            className="absolute font-pixel text-rpg-damage text-2xl pointer-events-none z-20"
          >
            CRITICAL HIT!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
