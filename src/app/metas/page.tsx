"use client";

import { useState } from "react";
import { Target, Plus, Heart, PiggyBank, Users } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import GoalModal from "@/components/GoalModal";
import AddFundsModal from "@/components/AddFundsModal";

export default function Metas() {
  const { activeGoals, updateGoal, partner, isCoupleView, setIsCoupleView } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Controle do modal de depósito
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<{id: number, title: string} | null>(null);

  const openDepositModal = (id: number, title: string) => {
    setSelectedGoal({ id, title });
    setIsAddFundsOpen(true);
  };

  const handleAddFunds = (id: number, amount: number) => {
    updateGoal(id, amount);
  };

  return (
    <>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Caixinhas</h1>
            <p className="text-text-muted text-sm md:text-base">Guarde dinheiro para seus objetivos</p>
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
              className="bg-primary hover:bg-primary-hover text-white p-3 md:px-5 md:py-2.5 rounded-full md:rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span className="hidden md:inline font-semibold">Nova Caixinha</span>
            </button>
          </div>
        </header>

        {activeGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-surface border border-surface-border rounded-2xl">
            <PiggyBank size={48} className="text-text-muted mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">Nenhuma caixinha na visão atual</h3>
            <p className="text-text-muted max-w-md mx-auto mb-6">
              Crie uma caixinha para organizar no que você quer gastar o seu dinheiro guardado. É a melhor forma de atingir suas metas.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-colors"
            >
              Criar minha primeira
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGoals.map((goal: any) => {
              const percentage = Math.min(
                100, 
                Math.round((goal.current_amount / goal.target_amount) * 100)
              );
              
              const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

              return (
                <div key={goal.id} className="bg-surface border border-surface-border p-5 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden relative group hover:border-primary/50 transition-colors">
                  
                  {goal.is_shared && (
                    <div className="absolute top-4 right-4 text-pink-500 bg-pink-500/10 p-1.5 rounded-full" title="Meta do Casal">
                      <Heart size={16} fill="currentColor" />
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl ${goal.is_shared ? 'bg-pink-500/10 text-pink-500' : 'bg-primary/10 text-primary'}`}>
                      <Target size={24} />
                    </div>
                    <div className="pr-6">
                      <h3 className="font-bold text-lg truncate">{goal.title}</h3>
                      <p className="text-xs text-text-muted">{goal.is_shared ? "Meta Conjunta" : "Meta Individual"}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold">{formatCurrency(goal.current_amount)}</span>
                        <span className="text-text-muted">de {formatCurrency(goal.target_amount)}</span>
                      </div>
                      
                      {/* Progress Bar Container */}
                      <div className="w-full bg-surface-border/50 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            goal.is_shared ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gradient-to-r from-primary to-indigo-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-right mt-1.5 font-medium text-text-muted">{percentage}% concluído</p>
                    </div>

                    <button 
                      onClick={() => openDepositModal(goal.id, goal.title)}
                      className={`w-full py-2.5 rounded-xl font-medium transition-colors ${
                        goal.is_shared 
                          ? 'bg-pink-500/10 text-pink-600 hover:bg-pink-500/20' 
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      Depositar Valores
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <GoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <AddFundsModal 
        isOpen={isAddFundsOpen} 
        onClose={() => setIsAddFundsOpen(false)}
        goalId={selectedGoal?.id || null}
        goalName={selectedGoal?.title || ""}
        onAddFunds={handleAddFunds}
      />
    </>
  );
}
