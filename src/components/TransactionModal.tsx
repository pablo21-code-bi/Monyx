"use client";

import { useState } from "react";
import { X, ArrowUpCircle, ArrowDownCircle, Users, User } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const { addTransaction, partner } = useAppContext();
  
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Alimentação");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isShared, setIsShared] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    await addTransaction({
      title: description || (type === "income" ? "Receita" : "Despesa"),
      amount: numericAmount,
      type,
      category,
      date,
      is_shared: isShared
    });

    // Reset form
    setAmount("");
    setDescription("");
    setIsShared(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full md:w-[480px] bg-surface md:rounded-3xl rounded-t-3xl p-6 md:p-8 shadow-2xl animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-4 duration-300">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Nova Movimentação</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-border/50 rounded-full transition-colors text-text-muted"
          >
            <X size={24} />
          </button>
        </header>

        {/* Type Selector */}
        <div className="flex bg-background p-1 rounded-xl mb-6">
          <button 
            onClick={() => setType("expense")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
              type === "expense" 
                ? "bg-surface shadow-md text-expense" 
                : "text-text-muted hover:text-foreground"
            }`}
          >
            <ArrowDownCircle size={18} />
            Despesa
          </button>
          <button 
            onClick={() => setType("income")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
              type === "income" 
                ? "bg-surface shadow-md text-income" 
                : "text-text-muted hover:text-foreground"
            }`}
          >
            <ArrowUpCircle size={18} />
            Receita
          </button>
        </div>

        {/* Content Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Valor (R$)</label>
            <input 
              type="text" 
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-3xl font-bold bg-transparent border-b-2 border-surface-border focus:border-primary outline-none py-2 transition-colors placeholder:text-text-muted/30"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Descrição</label>
            <input 
              type="text" 
              placeholder="Ex: Conta de Luz"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-surface-border"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Categoria</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-background rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-surface-border appearance-none"
              >
                {type === "expense" ? (
                  <>
                    <option>Alimentação</option>
                    <option>Supermercado</option>
                    <option>Moradia</option>
                    <option>Contas Fixas (Luz, Água)</option>
                    <option>Transporte</option>
                    <option>Saúde</option>
                    <option>Educação</option>
                    <option>Lazer e Restaurantes</option>
                    <option>Vestuário</option>
                    <option>Assinaturas</option>
                    <option>Cuidados Pessoais</option>
                    <option>Manutenção</option>
                    <option>Outras Despesas</option>
                  </>
                ) : (
                  <>
                    <option>Salário</option>
                    <option>Pix / Transferência</option>
                    <option>Investimentos</option>
                    <option>Vendas</option>
                    <option>Bônus extra</option>
                    <option>Cashback</option>
                    <option>Rendimentos</option>
                    <option>Outras Receitas</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Data</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-surface-border"
              />
            </div>
          </div>

          {/* Compartilhamento de Casal (SÓ APARECE SE TIVER PARCEIRO) */}
          {partner && (
            <div className="pt-2">
              <label className="block text-sm font-medium text-text-muted mb-2">Quem deve ver isso?</label>
              <div className="grid grid-cols-2 gap-3">
                 <button
                    type="button"
                    onClick={() => setIsShared(false)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-medium ${!isShared ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-surface-border text-text-muted'}`}
                 >
                    <User size={18} />
                    Individual
                 </button>
                 <button
                    type="button"
                    onClick={() => setIsShared(true)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-medium ${isShared ? 'bg-pink-500/10 border-pink-500 text-pink-600' : 'bg-background border-surface-border text-text-muted'}`}
                 >
                    <Users size={18} />
                    Casal
                 </button>
              </div>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg mt-4 shadow-lg shadow-primary/30 transition-all"
          >
            Adicionar {type === "income" ? "Receita" : "Despesa"}
          </button>
        </form>
      </div>
    </div>
  );
}
