import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HeroStats } from "./components/HeroStats";
import { ActionPanel } from "./components/ActionPanel";
import { CombatLog } from "./components/CombatLog";
import { StatsRadar } from "./components/StatsRadar";
import { Oracle } from "./components/Oracle";
import { BossBattle } from "./components/BossBattle";
import { TransactionModal } from "./components/TransactionModal";
import { CharacterSetup } from "./components/CharacterSetup";
import { AchievementSystem } from "./components/AchievementSystem";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { FloatingText, triggerFloatingText } from "./components/FloatingText";
import { Transaction, TransactionType, Category, GameState } from "./types";
import { soundManager } from "./lib/sounds";
import { RotateCcw } from "lucide-react";
import { cn } from "./lib/utils";

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('rpg-transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('rpg-gamestate');
    return saved ? JSON.parse(saved) : {
      isInitialized: false,
      maxHp: 0,
      currentHp: 0,
      level: 1,
      xp: 0,
      currency: '₹'
    };
  });

  const [isShaking, setIsShaking] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [heroHit, setHeroHit] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setIsFlashing(true);
    setHeroHit(true);
    setTimeout(() => {
      setIsShaking(false);
      setIsFlashing(false);
      setHeroHit(false);
    }, 500);
  };

  const currentCurrency = gameState.currency || '₹';

  const [modalOpen, setModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('expense');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    localStorage.setItem('rpg-transactions', JSON.stringify(transactions));
    localStorage.setItem('rpg-gamestate', JSON.stringify(gameState));
  }, [transactions, gameState]);

  // Handle Level Up Sound
  const [lastLevel, setLastLevel] = useState(gameState.level);
  useEffect(() => {
    if (gameState.level > lastLevel) {
      soundManager.play('LEVEL_UP');
      setLastLevel(gameState.level);
    }
  }, [gameState.level, lastLevel]);

  const handleInitialize = (maxHp: number, currentHp: number, currency: string) => {
    setGameState(prev => ({
      ...prev,
      isInitialized: true,
      maxHp,
      currentHp,
      currency
    }));
    soundManager.play('LEVEL_UP');
  };

  const handleUpdateCurrency = (newCurrency: string) => {
    setGameState(prev => ({ ...prev, currency: newCurrency }));
    soundManager.play('CLICK');
  };

  const handleReset = () => {
    setResetModalOpen(true);
    soundManager.play('CLICK');
  };

  const executeReset = () => {
    setTransactions([]);
    const newState = {
      isInitialized: false,
      maxHp: 0,
      currentHp: 0,
      level: 1,
      xp: 0,
      currency: '₹'
    };
    setGameState(newState);
    setLastLevel(1);
    localStorage.removeItem('rpg-transactions');
    localStorage.removeItem('rpg-gamestate');
    localStorage.removeItem('rpg-achievements');
    setResetModalOpen(false);
    soundManager.play('CLICK');
  };

  const handleSaveTransaction = (data: { id?: string, type: TransactionType, amount: number, category: Category, description: string }) => {
    if (data.type === 'expense') triggerShake();
    
    if (data.id) {
      // Edit existing transaction
      const oldT = transactions.find(t => t.id === data.id);
      if (!oldT) return;

      setTransactions(prev => prev.map(t => t.id === data.id ? { ...t, ...data } : t));

      setGameState(prev => {
        let newHp = prev.currentHp;
        
        // Reverse old effect
        if (oldT.type === 'expense') newHp += oldT.amount;
        else newHp -= oldT.amount;

        // Apply new effect
        if (data.type === 'expense') {
          newHp -= data.amount;
        } else {
          newHp += data.amount;
        }

        return { ...prev, currentHp: newHp };
      });

      if (data.type === 'expense') {
        soundManager.play('DAMAGE');
        triggerFloatingText(`-${currentCurrency}${data.amount}`, 'damage');
      } else {
        soundManager.play('HEAL');
        triggerFloatingText(`+${currentCurrency}${data.amount}`, 'heal');
      }
    } else {
      // Add new transaction
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        type: data.type,
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: new Date().toISOString()
      };

      setTransactions(prev => [newTransaction, ...prev]);

      setGameState(prev => {
        let newHp = prev.currentHp;
        let newXp = prev.xp;
        let newLevel = prev.level;

        if (data.type === 'expense') {
          newHp -= data.amount;
          newXp += 10;
        } else {
          newHp += data.amount;
          newXp += 25;
        }

        // Level up logic
        if (newXp >= newLevel * 100) {
          newLevel += 1;
          newXp = 0;
        }

        return {
          ...prev,
          currentHp: newHp,
          level: newLevel,
          xp: newXp
        };
      });

      if (data.type === 'expense') {
        soundManager.play('DAMAGE');
        triggerFloatingText(`-${currentCurrency}${data.amount}`, 'damage');
        triggerFloatingText(`+10 XP`, 'xp');
      } else {
        soundManager.play('HEAL');
        triggerFloatingText(`+${currentCurrency}${data.amount}`, 'heal');
        triggerFloatingText(`+25 XP`, 'xp');
      }

      // Check for level up sound
      const oldLevel = gameState.level;
      // Note: This check might be slightly stale due to async state, 
      // but for sound/UI it's usually acceptable or can be handled in a useEffect
    }
    setEditingTransaction(null);
  };

  const handleEditClick = (t: Transaction) => {
    setEditingTransaction(t);
    setModalType(t.type);
    setModalOpen(true);
  };

  if (!gameState.isInitialized) {
    return <CharacterSetup onComplete={handleInitialize} />;
  }

  return (
    <div className={cn(
      "min-h-screen bg-rpg-bg p-4 md:p-8 font-sans selection:bg-rpg-mana/30 overflow-x-hidden relative dungeon-grid",
      isShaking && "animate-shake"
    )}>
      {/* Damage Flash Overlay */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-rpg-damage z-[90] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* Ambient Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
        <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-rpg-gold rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-rpg-mana rounded-full animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        <header className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-rpg-gold/5 blur-3xl rounded-full" />
          
          <div className="flex justify-between items-start mb-4">
            <div className="w-24" /> {/* Spacer */}
            <h1 className="font-pixel text-4xl md:text-5xl text-white tracking-widest relative z-10" style={{ textShadow: '0 4px 0 #3b82f6, 0 8px 0 #1e3a8a' }}>
              EXPENSE<span className="text-rpg-gold">QUEST</span>
            </h1>
            <button 
              onMouseEnter={() => soundManager.play('HOVER')}
              onClick={handleReset}
              className="flex items-center gap-2 font-pixel text-[10px] text-slate-500 hover:text-rpg-damage transition-colors relative z-10"
              title="Reset Quest"
            >
              <RotateCcw size={14} />
              <span className="hidden md:inline">RESET QUEST</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 relative z-10">
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-rpg-gold" />
            <p className="font-mono text-rpg-gold text-xs uppercase tracking-[0.3em]">Dungeon Floor: {gameState.level}</p>
            <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-rpg-gold" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Hero & Boss */}
          <div className="lg:col-span-8 space-y-8">
            <HeroStats 
              maxHp={gameState.maxHp} 
              currentHp={gameState.currentHp} 
              level={gameState.level} 
              currency={currentCurrency}
              isHit={heroHit}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BossBattle transactions={transactions} gameState={gameState} currency={currentCurrency} />
              <ActionPanel 
                onAddExpense={() => { setModalType('expense'); setModalOpen(true); soundManager.play('CLICK'); }}
                onAddIncome={() => { setModalType('income'); setModalOpen(true); soundManager.play('CLICK'); }}
              />
            </div>

            <Oracle transactions={transactions} currency={currentCurrency} />
          </div>

          {/* Right Column: Log & Stats */}
          <div className="lg:col-span-4 space-y-8 flex flex-col">
            <div className="flex-1 min-h-[400px]">
              <StatsRadar transactions={transactions} currency={currentCurrency} />
            </div>
            <div className="flex-1 min-h-[400px]">
              <CombatLog transactions={transactions} currency={currentCurrency} onEdit={handleEditClick} />
            </div>
          </div>
        </div>

      </div>

      <TransactionModal 
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTransaction(null); }}
        onSave={handleSaveTransaction}
        type={modalType}
        currency={currentCurrency}
        onCurrencyChange={handleUpdateCurrency}
        initialData={editingTransaction}
      />

      <AchievementSystem 
        transactionsCount={transactions.length}
        level={gameState.level}
        isOverBudget={gameState.currentHp > gameState.maxHp}
      />

      <FloatingText />

      <ConfirmationModal 
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={executeReset}
        title="RESET QUEST?"
        message="Are you sure you want to reset your quest? All progress, transactions, and achievements will be lost forever."
        confirmText="RESET"
        cancelText="ABANDON"
      />
    </div>
  );
}
