"use client";

import { useState } from "react";
import { X, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense");

  if (!isOpen) return null;

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
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Valor (R$)</label>
            <input 
              type="text" 
              placeholder="0,00"
              className="w-full text-3xl font-bold bg-transparent border-b-2 border-surface-border focus:border-primary outline-none py-2 transition-colors placeholder:text-text-muted/30"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Descrição</label>
            <input 
              type="text" 
              placeholder="Ex: Conta de Luz"
              className="w-full bg-background rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-surface-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Categoria</label>
              <select className="w-full bg-background rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-surface-border appearance-none">
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
                className="w-full bg-background rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-surface-border"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg mt-8 shadow-lg shadow-primary/30 transition-all"
          >
            Adicionar {type === "income" ? "Receita" : "Despesa"}
          </button>
        </form>
      </div>
    </div>
  );
}
