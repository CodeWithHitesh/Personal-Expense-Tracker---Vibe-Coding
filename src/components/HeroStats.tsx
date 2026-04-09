import { motion } from "motion/react";
import { Shield, Heart, Zap, User } from "lucide-react";
import { cn } from "../lib/utils";

interface HeroStatsProps {
  maxHp: number;
  currentHp: number;
  level: number;
  currency: string;
  isHit?: boolean;
}

export function HeroStats({ maxHp, currentHp, level, currency, isHit }: HeroStatsProps) {
  const isOverVitality = currentHp > maxHp;
  const hpPercentage = isOverVitality ? 100 : Math.max(0, (currentHp / maxHp) * 100);
  const overVitalityPercentage = isOverVitality ? Math.min(100, ((currentHp - maxHp) / maxHp) * 100) : 0;
  
  let hpColor = "bg-rpg-health";
  if (isOverVitality) hpColor = "bg-cyan-400";
  else if (hpPercentage < 25) hpColor = "bg-rpg-damage";
  else if (hpPercentage < 50) hpColor = "bg-yellow-500";

  return (
    <div className={cn(
      "bg-rpg-panel pixel-border p-6 flex flex-col md:flex-row gap-8 relative overflow-hidden transition-all duration-500",
      isOverVitality && "shadow-[0_0_20px_rgba(34,211,238,0.2)] border-cyan-500/50",
      hpPercentage < 25 && "shadow-[0_0_20px_rgba(239,68,68,0.2)] border-rpg-damage/50",
      isHit && "bg-rpg-damage/20"
    )}>
      {/* Hero Avatar Section */}
      <div className="flex flex-col items-center gap-2 relative z-10">
        <div className="relative">
          <motion.div 
            animate={isHit ? {
              x: [0, -5, 5, -5, 5, 0],
              filter: ["brightness(1)", "brightness(2)", "brightness(1)"]
            } : { 
              scale: [1, 1.05, 1],
              y: [0, -2, 0]
            }}
            transition={isHit ? { duration: 0.2 } : { 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className={cn(
              "w-24 h-24 bg-slate-800 pixel-border flex items-center justify-center relative",
              isOverVitality ? "pixel-border-gold" : "border-slate-700",
              isHit && "border-rpg-damage"
            )}
          >
            <User size={48} className={cn(
              "transition-colors duration-500",
              isHit ? "text-rpg-damage" : isOverVitality ? "text-cyan-400" : hpPercentage < 25 ? "text-rpg-damage" : "text-white"
            )} />
            
            {/* Status Auras */}
            {isOverVitality && (
              <motion.div 
                animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full"
              />
            )}
          </motion.div>
          
          {/* Level Badge */}
          <div className="absolute -bottom-2 -right-2 bg-rpg-gold text-slate-900 font-pixel text-[8px] px-2 py-1 pixel-border">
            LVL {level}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 relative z-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-pixel text-xl text-rpg-gold mb-1 tracking-tighter">HERO STATUS</h2>
            <p className="font-mono text-sm text-slate-400">
              {currentHp <= 0 ? "UNDEAD (In Debt)" : isOverVitality ? "DIVINE ASCENDANT" : "FINANCIAL ADVENTURER"}
            </p>
          </div>
          <div className="text-right">
            <div className="font-pixel text-2xl">
              <span className={cn(
                hpPercentage < 25 ? "text-rpg-damage animate-pulse" : isOverVitality ? "text-cyan-400" : "text-white"
              )}>
                {currency}{currentHp.toFixed(2)}
              </span>
              <span className="text-slate-500 text-sm ml-2">/ {currency}{maxHp.toFixed(2)}</span>
            </div>
            <p className="font-mono text-xs text-slate-400 mt-1 uppercase tracking-tighter">Current Vitality</p>
          </div>
        </div>

        <div className="relative">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className={cn(
              "flex items-center gap-1",
              isOverVitality ? "text-cyan-400" : "text-rpg-health"
            )}>
              {isOverVitality ? <Shield size={12} /> : <Heart size={12} />} {isOverVitality ? "OVER-VITALITY" : "HP"}
            </span>
            <span className={isOverVitality ? "text-cyan-400" : ""}>
              {isOverVitality ? `+${overVitalityPercentage.toFixed(1)}%` : `${hpPercentage.toFixed(1)}%`}
            </span>
          </div>
          <div className="h-6 bg-slate-800 rounded-sm overflow-hidden border-2 border-slate-700 relative">
            <motion.div 
              className={cn("h-full absolute left-0 top-0", isOverVitality ? "bg-rpg-health" : hpColor)}
              initial={{ width: 0 }}
              animate={{ width: `${hpPercentage}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
            />
            {isOverVitality && (
              <motion.div 
                className="h-full absolute left-0 top-0 bg-cyan-400 opacity-60"
                initial={{ width: 0 }}
                animate={{ width: `${overVitalityPercentage}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
              />
            )}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/20 pointer-events-none" />
            {hpPercentage < 25 && (
              <div className="absolute inset-0 bg-rpg-damage/20 animate-pulse pointer-events-none" />
            )}
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
        <Shield size={160} className={isOverVitality ? "text-cyan-400" : "text-white"} />
      </div>
    </div>
  );
}
