import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Swords, FlaskConical } from "lucide-react";
import CurrencyInput from "react-currency-input-field";
import { TransactionType, Category, Transaction } from "../types";
import { cn } from "../lib/utils";
import { soundManager } from "../lib/sounds";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id?: string, type: TransactionType, amount: number, category: Category, description: string }) => void;
  type: TransactionType;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  initialData?: Transaction | null;
}

const EXPENSE_CATEGORIES: Category[] = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Other'];
const INCOME_CATEGORIES: Category[] = ['Salary', 'Gift', 'Other'];
const CURRENCIES = ["$", "€", "£", "¥", "₹"];

export function TransactionModal({ isOpen, onClose, onSave, type, currency, onCurrencyChange, initialData }: TransactionModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<Category>(type === 'expense' ? 'Food' : 'Salary');
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setAmount(initialData.amount.toString());
        setCategory(initialData.category);
        setDescription(initialData.description);
      } else {
        setAmount("");
        setCategory(type === 'expense' ? 'Food' : 'Salary');
        setDescription("");
      }
    }
  }, [isOpen, initialData, type]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount)) return;
    onSave({
      id: initialData?.id,
      type,
      amount: numAmount,
      category,
      description: description || (type === 'expense' ? 'Unknown Monster' : 'Unknown Loot')
    });
    soundManager.play('CLICK');
    onClose();
  };

  const isExpense = type === 'expense';
  const categories = isExpense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "w-full max-w-md bg-rpg-panel p-6 relative pixel-border",
              isExpense ? "pixel-border-damage" : "pixel-border-health"
            )}
            style={{
              boxShadow: isExpense 
                ? "-4px 0 0 0 #ef4444, 4px 0 0 0 #ef4444, 0 -4px 0 0 #ef4444, 0 4px 0 0 #ef4444"
                : "-4px 0 0 0 #22c55e, 4px 0 0 0 #22c55e, 0 -4px 0 0 #22c55e, 0 4px 0 0 #22c55e"
            }}
          >
            <button 
              onMouseEnter={() => soundManager.play('HOVER')}
              onClick={() => { soundManager.play('CLICK'); onClose(); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              {isExpense ? <Swords className="text-rpg-damage" /> : <FlaskConical className="text-rpg-health" />}
              <h2 className={cn("font-pixel text-lg", isExpense ? "text-rpg-damage" : "text-rpg-health")}>
                {isExpense ? "TAKE DAMAGE (EXPENSE)" : "USE POTION (INCOME)"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-mono">
              <div className="flex gap-2">
                <div className="w-1/4">
                  <label className="block text-xs text-slate-400 mb-1">CURRENCY</label>
                  <select
                    value={currency}
                    onMouseEnter={() => soundManager.play('HOVER')}
                    onChange={(e) => { onCurrencyChange(e.target.value); soundManager.play('CLICK'); }}
                    className="w-full bg-slate-900 border-2 border-slate-700 rounded-none py-2 px-3 text-white focus:outline-none focus:border-rpg-mana transition-colors appearance-none"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-1">AMOUNT</label>
                  <CurrencyInput
                    id="amount"
                    name="amount"
                    placeholder={`${currency}0.00`}
                    decimalsLimit={2}
                    prefix={currency}
                    value={amount}
                    onValueChange={(value) => setAmount(value || "")}
                    className="w-full bg-slate-900 border-2 border-slate-700 rounded-none py-2 px-3 text-white focus:outline-none focus:border-rpg-mana transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">CATEGORY</label>
                <select
                  value={category}
                  onMouseEnter={() => soundManager.play('HOVER')}
                  onChange={(e) => { setCategory(e.target.value as Category); soundManager.play('CLICK'); }}
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-none py-2 px-3 text-white focus:outline-none focus:border-rpg-mana transition-colors appearance-none"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">DESCRIPTION (OPTIONAL)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border-2 border-slate-700 rounded-none py-2 px-3 text-white focus:outline-none focus:border-rpg-mana transition-colors"
                  placeholder={isExpense ? "e.g. Dragon Fire (Coffee)" : "e.g. Found Gold (Bonus)"}
                />
              </div>

              <button
                type="submit"
                disabled={!amount}
                onMouseEnter={() => soundManager.play('HOVER')}
                className={cn(
                  "w-full py-3 font-pixel text-sm mt-6 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100",
                  isExpense ? "bg-rpg-damage text-white" : "bg-rpg-health text-white"
                )}
              >
                {initialData 
                  ? (isExpense ? "UPDATE DAMAGE" : "UPDATE HEAL") 
                  : (isExpense ? "CONFIRM DAMAGE" : "CONFIRM HEAL")}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
