import { motion } from "motion/react";
import { Swords, FlaskConical, Shield, Sparkles } from "lucide-react";
import { soundManager } from "../lib/sounds";

interface ActionPanelProps {
  onAddExpense: () => void;
  onAddIncome: () => void;
}

export function ActionPanel({ onAddExpense, onAddIncome }: ActionPanelProps) {
  return (
    <div className="bg-rpg-panel pixel-border p-6 flex flex-col justify-center gap-6">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} className="text-rpg-gold animate-pulse" />
        <h3 className="font-pixel text-[10px] text-rpg-gold tracking-tighter uppercase">Command Center</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onMouseEnter={() => soundManager.play('HOVER')}
          onClick={onAddExpense}
          className="group relative flex items-center justify-between p-4 bg-slate-900 border-2 border-rpg-damage/30 hover:border-rpg-damage transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-rpg-damage/5 group-hover:bg-rpg-damage/10 transition-colors" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-2 bg-rpg-damage/20 rounded-sm">
              <Swords className="text-rpg-damage group-hover:rotate-12 transition-transform" size={24} />
            </div>
            <div className="text-left">
              <div className="font-pixel text-xs text-white">TAKE DAMAGE</div>
              <div className="font-mono text-[10px] text-slate-500 uppercase">Record Expense</div>
            </div>
          </div>
          <div className="font-pixel text-[10px] text-rpg-damage opacity-0 group-hover:opacity-100 transition-opacity">
            -HP
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onMouseEnter={() => soundManager.play('HOVER')}
          onClick={onAddIncome}
          className="group relative flex items-center justify-between p-4 bg-slate-900 border-2 border-rpg-health/30 hover:border-rpg-health transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-rpg-health/5 group-hover:bg-rpg-health/10 transition-colors" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-2 bg-rpg-health/20 rounded-sm">
              <FlaskConical className="text-rpg-health group-hover:scale-110 transition-transform" size={24} />
            </div>
            <div className="text-left">
              <div className="font-pixel text-xs text-white">USE POTION</div>
              <div className="font-mono text-[10px] text-slate-500 uppercase">Record Income</div>
            </div>
          </div>
          <div className="font-pixel text-[10px] text-rpg-health opacity-0 group-hover:opacity-100 transition-opacity">
            +HP
          </div>
        </motion.button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-2 opacity-30 grayscale">
        <Shield size={16} className="text-slate-400" />
        <div className="h-[1px] flex-1 bg-slate-700" />
        <span className="font-pixel text-[8px] text-slate-500 uppercase">Inventory Empty</span>
      </div>
    </div>
  );
}
