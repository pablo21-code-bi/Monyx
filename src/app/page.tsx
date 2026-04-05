"use client";

import { Wallet, ArrowUpCircle, ArrowDownCircle, Plus, Users, BellRing, Check, X } from "lucide-react";
import { useState } from "react";
import TransactionModal from "@/components/TransactionModal";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";

export default function Home() {
  const { 
    user, partner, activeTransactions, isCoupleView, setIsCoupleView, 
    pendingRequests, acceptPartnerRequest, rejectPartnerRequest 
  } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calcula resumo usando O ARRAY DINÂMICO
  const income = activeTransactions.filter(tx => tx.type === "income").reduce((acc, curr) => acc + curr.amount, 0);
  const expense = activeTransactions.filter(tx => tx.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expense;

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Ordena
  const sortedTransactions = [...activeTransactions].sort((a, b) => {
    return new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime();
  }).slice(0, 5);

  if (!user) {
    return (
      <div className="p-6 md:p-10 max-w-6xl mx-auto flex flex-col items-center justify-center h-[80vh] text-center space-y-6">
        <img src="/monyx-logo.png" alt="Monyx Logo" className="w-24 h-24 object-contain shadow-2xl shadow-primary/20 rounded-3xl animate-bounce-subtle" />
        <h1 className="text-4xl font-bold tracking-tight">Bem vindo ao Monyx</h1>
        <p className="text-text-muted text-lg">Acesse seu perfil para criar ou conectar sua conta e gerenciar suas finanças.</p>
        <Link href="/perfil" className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/30">
          Ir para o Perfil
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Notificação de Convite Pendente */}
        {pendingRequests.map(req => (
          <div key={req.id} className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top">
             <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500">
                <div className="bg-amber-500/20 p-2 rounded-full hidden sm:block">
                  <BellRing size={20} />
                </div>
                <div>
                   <p className="font-bold text-sm md:text-base">Novo Pedido de União de Contas!</p>
                   <p className="text-xs md:text-sm opacity-90"><strong className="text-amber-700 dark:text-amber-400">{req.sender_name}</strong> ({req.from_cpf}) deseja compartilhar as finanças com você.</p>
                </div>
             </div>
             <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => rejectPartnerRequest(req.id)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-background border border-surface-border hover:bg-red-500/10 hover:text-red-500 rounded-xl text-sm font-semibold transition-colors"
                >
                  <X size={16} /> Recusar
                </button>
                <button 
                  onClick={() => acceptPartnerRequest(req.id)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-amber-500/20"
                >
                  <Check size={16} /> Aceitar
                </button>
             </div>
          </div>
        ))}

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-text-muted text-sm md:text-base mb-1">
              Bem-vindo de volta,
            </p>
            <h1 className="text-3xl font-bold tracking-tight flex flex-wrap items-center gap-2">
              {user.name}
              {partner && (
                <span className="text-xs bg-pink-500/10 text-pink-500 px-2 py-1 rounded-lg flex items-center gap-1 font-medium">
                  <span className="hidden md:inline">+ {partner.name}</span>
                  <Users size={14} />
                </span>
              )}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Toggle de Visualização (SÓ APARECE SE TIVER PARCEIRO) */}
             {partner && (
               <div className="bg-surface border border-surface-border p-1 rounded-xl flex shadow-sm">
                  <button 
                     onClick={() => setIsCoupleView(false)}
                     className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${!isCoupleView ? "bg-background shadow text-primary" : "text-text-muted hover:text-foreground"}`}
                  >
                    Individual
                  </button>
                  <button 
                     onClick={() => setIsCoupleView(true)}
                     className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1 ${isCoupleView ? "bg-pink-500 text-white shadow-md shadow-pink-500/20" : "text-text-muted hover:text-foreground"}`}
                  >
                    Casal <Users size={14} />
                  </button>
               </div>
             )}

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary-hover text-white p-3 md:px-5 md:py-2.5 rounded-full md:rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center gap-2 shrink-0"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span className="hidden md:inline font-semibold">Nova Movimentação</span>
            </button>
          </div>
        </header>

        {/* Cards de Resumo */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-surface border border-surface-border p-5 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-muted font-medium">{partner && isCoupleView ? "Saldo Conjunto" : "Meu Saldo Real"}</span>
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Wallet size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
          </div>

          <div className="bg-surface border border-surface-border p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-muted font-medium">Receitas {partner && isCoupleView ? "(Casal)" : "(Minhas)"}</span>
              <div className="bg-income/10 p-2 rounded-lg text-[#10B981]">
                <ArrowUpCircle size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#10B981]">{formatCurrency(income)}</p>
          </div>

          <div className="bg-surface border border-surface-border p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-muted font-medium">Despesas {partner && isCoupleView ? "(Casal)" : "(Minhas)"}</span>
              <div className="bg-expense/10 p-2 rounded-lg text-[#EF4444]">
                <ArrowDownCircle size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#EF4444]">{formatCurrency(expense)}</p>
          </div>
        </section>

        {/* Seção de Transações Recentes */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-bold">Movimentações Recentes</h2>
            <Link href="/registros" className="text-primary text-sm font-semibold hover:underline">Ver todas</Link>
          </div>
          
          <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-sm">
            {sortedTransactions.length === 0 ? (
              <div className="p-8 text-center text-text-muted">Nenhuma movimentação encontrada na visão atual.</div>
            ) : (
              sortedTransactions.map((tx, idx) => (
                <div 
                  key={tx.id || idx} 
                  className={`flex items-center justify-between p-4 ${
                    idx !== sortedTransactions.length - 1 ? "border-b border-surface-border/60" : ""
                  } hover:bg-background/50 transition-colors`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${tx.type === 'income' ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'}`}>
                      {tx.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                    </div>
                    <div>
                      <p className="font-semibold">{tx.title}</p>
                      <p className="text-xs text-text-muted mt-1 flex items-center gap-2">
                        {new Date(tx.created_at || tx.date).toLocaleDateString('pt-BR')} • {tx.category} 
                        {tx.is_shared && (
                          <span className="flex items-center gap-1 bg-pink-500/10 text-pink-500 px-1.5 py-0.5 rounded-md font-medium">
                            <Users size={12} /> Casal
                          </span>
                        )}
                        {partner && tx.user_cpf === partner.cpf && (
                           <span className="bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded-md font-medium">Parceiro</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold ${tx.type === 'income' ? 'text-income' : ''}`}>
                    {tx.type === 'income' ? "+ " : "- "}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
