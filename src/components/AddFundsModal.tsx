"use client";

import { useState } from "react";
import { X, PiggyBank } from "lucide-react";

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: number | null;
  goalName: string;
  onAddFunds: (id: number, amount: number) => void;
}

export default function AddFundsModal({ isOpen, onClose, goalId, goalName, onAddFunds }: AddFundsModalProps) {
  const [amountInput, setAmountInput] = useState("");

  if (!isOpen || goalId === null) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountInput.replace(",", "."));
    if (!isNaN(amount) && amount > 0) {
      onAddFunds(goalId, amount);
      setAmountInput("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full md:w-[400px] bg-surface md:rounded-3xl rounded-t-3xl p-6 md:p-8 shadow-2xl animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-4 duration-300">
        <header className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
             <div className="bg-primary/10 p-3 rounded-xl text-primary">
                <PiggyBank size={24} />
             </div>
             <div>
               <h2 className="text-xl font-bold">Depositar</h2>
               <p className="text-sm text-text-muted truncate max-w-[200px]">{goalName}</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-border/50 rounded-full transition-colors text-text-muted"
          >
            <X size={20} />
          </button>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Qual valor você guardou?</label>
            <div className="relative">
               <span className="absolute left-0 top-3 text-2xl font-bold text-text-muted">R$</span>
               <input 
                 type="number"
                 step="0.01"
                 required
                 value={amountInput}
                 onChange={(e) => setAmountInput(e.target.value)}
                 placeholder="0.00"
                 className="w-full text-3xl font-bold bg-transparent border-b-2 border-surface-border focus:border-primary outline-none py-2 pl-12 transition-colors placeholder:text-text-muted/30"
                 autoFocus
               />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg mt-8 shadow-lg shadow-primary/30 transition-all"
          >
            Confirmar Depósito
          </button>
        </form>
      </div>
    </div>
  );
}
