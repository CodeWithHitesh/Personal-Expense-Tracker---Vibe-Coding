import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface FloatingValue {
  id: string;
  value: string;
  type: 'damage' | 'heal' | 'xp';
  x: number;
  y: number;
}

export function FloatingText() {
  const [values, setValues] = useState<FloatingValue[]>([]);

  // Listen for custom events to trigger floating text
  useEffect(() => {
    const handleTrigger = (e: any) => {
      const { value, type } = e.detail;
      const id = crypto.randomUUID();
      // Randomize position slightly around center
      const x = window.innerWidth / 2 + (Math.random() * 200 - 100);
      const y = window.innerHeight / 2 + (Math.random() * 100 - 50);
      
      setValues(prev => [...prev, { id, value, type, x, y }]);
      setTimeout(() => {
        setValues(prev => prev.filter(v => v.id !== id));
      }, 2000);
    };

    window.addEventListener('trigger-floating-text', handleTrigger);
    return () => window.removeEventListener('trigger-floating-text', handleTrigger);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
      <AnimatePresence>
        {values.map(v => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: v.y, x: v.x, scale: 0.5 }}
            animate={{ opacity: 1, y: v.y - 150, scale: 1.5 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`font-pixel text-2xl drop-shadow-[0_2px_0_rgba(0,0,0,1)] ${
              v.type === 'damage' ? 'text-rpg-damage' : 
              v.type === 'heal' ? 'text-rpg-health' : 'text-rpg-gold'
            }`}
          >
            {v.value}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export const triggerFloatingText = (value: string, type: 'damage' | 'heal' | 'xp') => {
  window.dispatchEvent(new CustomEvent('trigger-floating-text', { detail: { value, type } }));
};
