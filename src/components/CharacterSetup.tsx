import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Shield, Coins, Sword, Wand2, Ghost } from "lucide-react";
import CurrencyInput from "react-currency-input-field";
import { soundManager } from "../lib/sounds";
import { cn } from "../lib/utils";

interface CharacterSetupProps {
  onComplete: (maxHp: number, currentHp: number, currency: string) => void;
}

const CURRENCIES = ["$", "€", "£", "¥", "₹"];

const CLASSES = [
  { id: 'warrior', name: 'WARRIOR', icon: <Sword size={20} />, description: 'Focus on high vitality and survival.' },
  { id: 'mage', name: 'MAGE', icon: <Wand2 size={20} />, description: 'Master of mana and strategic saving.' },
  { id: 'rogue', name: 'ROGUE', icon: <Ghost size={20} />, description: 'Agile spender, expert at finding loot.' },
];

export function CharacterSetup({ onComplete }: CharacterSetupProps) {
  const [maxHp, setMaxHp] = useState<string>("");
  const [currency, setCurrency] = useState<string>("₹");
  const [selectedClass, setSelectedClass] = useState(CLASSES[0].id);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const max = Number(maxHp) || 0;
    if (max > 0) {
      soundManager.play('LEVEL_UP');
      onComplete(max, max, currency);
    }
  };

  return (
    <div className="min-h-screen bg-rpg-bg flex items-center justify-center p-4 font-sans selection:bg-rpg-mana/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-rpg-panel pixel-border-gold p-8 relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
          <Shield size={150} />
        </div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-pixel text-2xl text-rpg-gold mb-2">CHARACTER CREATION</h1>
          <p className="font-mono text-slate-400 text-sm">Declare your starting vitality and choose your path.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-slate-400 mb-2">CURRENCY</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-900 border-2 border-slate-700 rounded-none py-3 px-4 text-white focus:outline-none focus:border-rpg-gold transition-colors text-lg appearance-none"
              >
                {CURRENCIES.map(c => (
                  <option key={c} value={c}>{c} - Symbol</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-2 flex items-center gap-2">
                <Shield size={14} className="text-rpg-health"/> MONTHLY BUDGET (HP)
              </label>
              <CurrencyInput
                id="maxHp"
                name="maxHp"
                placeholder={`${currency}0.00`}
                decimalsLimit={2}
                prefix={currency}
                value={maxHp}
                onValueChange={(value) => setMaxHp(value || "")}
                className="w-full bg-slate-900 border-2 border-slate-700 rounded-none py-3 px-4 text-white focus:outline-none focus:border-rpg-gold transition-colors text-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-3">CHOOSE YOUR CLASS</label>
            <div className="grid grid-cols-1 gap-3">
              {CLASSES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onMouseEnter={() => soundManager.play('HOVER')}
                  onClick={() => { setSelectedClass(c.id); soundManager.play('CLICK'); }}
                  className={cn(
                    "flex items-center gap-4 p-4 border-2 transition-all text-left group",
                    selectedClass === c.id 
                      ? "border-rpg-gold bg-rpg-gold/10" 
                      : "border-slate-700 bg-slate-900 hover:border-slate-500"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-none",
                    selectedClass === c.id ? "text-rpg-gold" : "text-slate-500 group-hover:text-slate-300"
                  )}>
                    {c.icon}
                  </div>
                  <div>
                    <div className={cn(
                      "font-pixel text-[10px] mb-1",
                      selectedClass === c.id ? "text-rpg-gold" : "text-slate-400"
                    )}>
                      {c.name}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      {c.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!maxHp}
            className="w-full py-4 font-pixel text-sm mt-4 bg-rpg-gold text-slate-900 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            ENTER DUNGEON
          </button>
        </form>
      </motion.div>
    </div>
  );
}
