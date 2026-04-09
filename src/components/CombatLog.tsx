import { motion, AnimatePresence } from "motion/react";
import { Edit2 } from "lucide-react";
import { Transaction } from "../types";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { soundManager } from "../lib/sounds";

interface CombatLogProps {
  transactions: Transaction[];
  currency: string;
  onEdit: (t: Transaction) => void;
}

export function CombatLog({ transactions, currency, onEdit }: CombatLogProps) {
  return (
    <div className="bg-rpg-panel pixel-border p-4 flex flex-col h-full max-h-[400px]">
      <h3 className="font-pixel text-sm text-rpg-mana mb-4">COMBAT LOG</h3>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-2">
        <AnimatePresence initial={false}>
          {transactions.length === 0 ? (
            <div className="text-center text-slate-500 font-mono text-sm py-8">
              No encounters yet...
            </div>
          ) : (
            transactions.map((t) => {
              const isExpense = t.type === 'expense';
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-slate-900/50 border border-slate-700 p-3 flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-pixel text-[10px]",
                        isExpense ? "text-rpg-damage" : "text-rpg-health"
                      )}>
                        {isExpense ? "HIT!" : "HEAL!"}
                      </span>
                      <span className="font-mono text-sm text-white">{t.description}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs text-slate-500">{t.category}</span>
                      <span className="text-slate-600 text-[10px]">•</span>
                      <span className="font-mono text-xs text-slate-500">
                        {format(new Date(t.date), "MMM d, HH:mm")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "font-mono font-bold",
                      isExpense ? "text-rpg-damage" : "text-rpg-health"
                    )}>
                      {isExpense ? "-" : "+"}{currency}{t.amount.toFixed(2)}
                    </div>
                    <button 
                      onMouseEnter={() => soundManager.play('HOVER')}
                      onClick={() => { soundManager.play('CLICK'); onEdit(t); }} 
                      className="text-slate-500 hover:text-rpg-gold transition-colors"
                      title="Edit Encounter"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
