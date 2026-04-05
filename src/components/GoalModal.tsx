import { useState } from "react";
import { X, Target } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoalModal({ isOpen, onClose }: GoalModalProps) {
  const { addGoal, partner } = useAppContext();
  
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await addGoal({
      title,
      target_amount: parseFloat(targetAmount),
      current_amount: 0,
      is_shared: isShared
    });
    
    setLoading(false);
    setTitle("");
    setTargetAmount("");
    setIsShared(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="flex justify-between items-center p-6 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Target size={24} />
            </div>
            <h2 className="text-xl font-bold">Nova Meta</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-foreground transition-colors p-1"
          >
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Título da Caixinha</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Viagem para Praia, Reserva de Emergência"
              className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Objetivo (R$)</label>
            <input
              type="number"
              required
              step="0.01"
              min="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="5000.00"
              className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
            />
          </div>

          {partner && (
            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-pink-500/30 bg-pink-500/5 p-4 py-3">
              <input 
                type="checkbox" 
                id="isShared"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-600 outline-none"
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="isShared" className="text-sm font-medium text-pink-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Meta em Conjunto (Modo Casal)
                </label>
                <p className="text-[13px] text-pink-600/70">
                  Vocês dois poderão contribuir e acompanhar o progresso dessa caixinha juntos.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-3 md:py-4 rounded-xl font-semibold transition-colors mt-2"
          >
            {loading ? "Criando..." : "Criar Caixinha"}
          </button>
        </form>
      </div>
    </div>
  );
}
