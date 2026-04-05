"use client";

import { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, Search, Filter, Users, Pencil } from "lucide-react";
import { useAppContext, Transaction } from "@/context/AppContext";
import TransactionModal from "@/components/TransactionModal";

export default function Registros() {
  const { user, partner, activeTransactions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  
  const sortedTransactions = [...activeTransactions].sort((a, b) => {
    return new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime();
  });

  const filtered = sortedTransactions.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Registros</h1>
          <p className="text-text-muted text-sm mt-1">Histórico completo de transações {partner && "(Contas somadas)"}</p>
        </div>
      </header>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Buscar transações..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-surface border border-surface-border rounded-xl px-6 py-3 font-semibold text-text-muted hover:text-foreground transition-colors">
          <Filter size={20} />
          Filtros
        </button>
      </div>

      {/* Tabela/Lista de Transações */}
      <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-sm">
        {filtered.map((tx, idx) => (
          <div 
            key={tx.id} 
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 ${
              idx !== filtered.length - 1 ? "border-b border-surface-border/60" : ""
            } hover:bg-background/50 transition-colors gap-4 sm:gap-0`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${tx.type === 'income' ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'}`}>
                {tx.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
              </div>
              <div>
                <p className="font-semibold text-base">{tx.title}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted mt-1">
                  <span>{new Date(tx.created_at || tx.date).toLocaleDateString("pt-BR")}</span>
                  <span>•</span>
                  <span className="bg-surface-border/50 px-2 py-0.5 rounded-full">{tx.category}</span>
                  {tx.is_shared && (
                     <span className="bg-pink-500/10 text-pink-500 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Users size={12} /> Casal
                     </span>
                  )}
                  {partner && tx.user_cpf === partner.cpf && (
                     <span className="bg-indigo-500/10 text-indigo-500 font-medium px-2 py-0.5 rounded-full">Parceiro</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-left sm:text-right">
              <span className={`font-bold text-lg block ${tx.type === 'income' ? 'text-income' : ''}`}>
                {tx.type === 'income' ? "+ " : "- "}{formatCurrency(tx.amount)}
              </span>
              
              {/* Botão Editar: Visível se for o dono ou se for compartilhada */}
              {(tx.user_cpf === user?.cpf || tx.is_shared) && (
                <button 
                  onClick={() => {
                    setSelectedTx(tx);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                  title="Editar transação"
                >
                  <Pencil size={18} />
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-text-muted">
            <p className="text-lg font-medium mb-1">Nenhum registro encontrado</p>
            <p className="text-sm">Tente buscar por outro termo ou cadastre uma nova transação no painel Início.</p>
          </div>
        )}
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTx(null);
        }} 
        transactionToEdit={selectedTx}
      />
    </div>
  );
}
