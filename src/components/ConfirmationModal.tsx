import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "../lib/utils";
import { soundManager } from "../lib/sounds";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "CONFIRM",
  cancelText = "CANCEL",
  variant = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={cn(
            "w-full max-w-sm bg-rpg-panel p-6 relative pixel-border",
            variant === 'danger' ? "pixel-border-damage" : "pixel-border-gold"
          )}
          style={{
            boxShadow: variant === 'danger'
              ? "-4px 0 0 0 #ef4444, 4px 0 0 0 #ef4444, 0 -4px 0 0 #ef4444, 0 4px 0 0 #ef4444"
              : "-4px 0 0 0 #eab308, 4px 0 0 0 #eab308, 0 -4px 0 0 #eab308, 0 4px 0 0 #eab308"
          }}
        >
          <button 
            onMouseEnter={() => soundManager.play('HOVER')}
            onClick={() => { soundManager.play('CLICK'); onClose(); }}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className={variant === 'danger' ? "text-rpg-damage" : "text-rpg-gold"} size={24} />
            <h2 className={cn("font-pixel text-sm", variant === 'danger' ? "text-rpg-damage" : "text-rpg-gold")}>
              {title}
            </h2>
          </div>

          <p className="font-mono text-xs text-slate-300 mb-8 leading-relaxed">
            {message}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onMouseEnter={() => soundManager.play('HOVER')}
              onClick={() => { soundManager.play('CLICK'); onClose(); }}
              className="py-2 font-pixel text-[10px] bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onMouseEnter={() => soundManager.play('HOVER')}
              onClick={() => { soundManager.play('CLICK'); onConfirm(); }}
              className={cn(
                "py-2 font-pixel text-[10px] text-white transition-transform hover:scale-105 active:scale-95",
                variant === 'danger' ? "bg-rpg-damage" : "bg-rpg-gold"
              )}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
