"use client";

import { Wallet, ArrowUpCircle, ArrowDownCircle, Plus, Users, BellRing, Check, X, Pencil } from "lucide-react";
import { useState } from "react";
import TransactionModal from "@/components/TransactionModal";
import { useAppContext, Transaction } from "@/context/AppContext";
import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";

export default function Home() {
  const { 
    user, partner, activeTransactions, isCoupleView, setIsCoupleView, 
    pendingRequests, acceptPartnerRequest, rejectPartnerRequest 
  } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

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
      <div className="min-h-screen bg-background selection:bg-primary/20">
        <LandingNavbar />
        
        {/* HERO SECTION */}
        <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[150px] animate-pulse delay-700"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-6 text-center space-y-8 flex flex-col items-center">
            <div className="w-24 h-24 bg-primary text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 animate-bounce-subtle mb-4">
               <span className="text-5xl font-black">M</span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-2 rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Nova era das finanças pessoais
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700">
              Gerencie suas finanças com <br/>
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">inteligência e estilo.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-muted leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
              O Monyx transforma a forma como você lida com dinheiro. De gastos individuais a orçamentos em casal, oferecemos as ferramentas certas para sua liberdade financeira.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
              <Link 
                href="/cadastro" 
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-hover transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 flex items-center justify-center gap-2"
              >
                Começar agora <Plus size={20} />
              </Link>
              <Link 
                href="/login" 
                className="w-full sm:w-auto px-8 py-4 bg-surface border border-surface-border rounded-2xl font-bold text-lg hover:bg-surface-border/30 transition-all flex items-center justify-center gap-2"
              >
                Acessar minha conta
              </Link>
            </div>
          </div>
        </header>

        {/* FEATURES SECTION */}
        <section className="py-24 bg-surface/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">O que o Monyx oferece?</h2>
              <p className="text-text-muted max-w-xl mx-auto">Tudo o que você precisa para organizar sua vida financeira em um só lugar.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Controle em Tempo Real", 
                  desc: "Registre receitas e despesas instantaneamente e veja seu saldo atualizado em segundos.",
                  icon: <Wallet className="text-primary" size={32} />
                },
                { 
                  title: "Modo Casal Inteligente", 
                  desc: "Conecte sua conta com seu parceiro(a) e gerenciem despesas compartilhadas sem complicações.",
                  icon: <Users className="text-pink-500" size={32} />
                },
                { 
                  title: "Metas Financeiras", 
                  desc: "Defina objetivos para o futuro e acompanhe seu progresso com indicadores visuais claros.",
                  icon: <Check className="text-green-500" size={32} />
                }
              ].map((f, i) => (
                <div key={i} className="p-8 bg-surface border border-surface-border rounded-3xl hover:border-primary/30 transition-all group">
                  <div className="mb-6 p-4 bg-background rounded-2xl w-fit group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-text-muted leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARISON SECTION */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-primary/5 rounded-[40px] p-8 md:p-16 border border-primary/10 overflow-hidden relative">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight">Diferente de tudo o que você já viu.</h2>
                  <p className="text-text-muted text-lg leading-relaxed">
                    Esqueça planilhas complexas ou apps que poluem sua tela com anúncios e funções inúteis. O Monyx foca no que importa.
                  </p>
                  
                  <ul className="space-y-4">
                    {[
                      "Interface limpa e focada no usuário",
                      "Modo Casal que realmente funciona",
                      "Privacidade total dos seus dados",
                      "Sincronização instantânea na nuvem"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 font-medium">
                        <div className="bg-primary/20 p-1 rounded-full text-primary">
                          <Check size={14} strokeWidth={3} />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-3xl border border-white/10 flex items-center justify-center p-8">
                     <div className="bg-surface p-6 rounded-2xl shadow-2xl space-y-4 w-full">
                        <div className="h-4 w-1/3 bg-primary/10 rounded"></div>
                        <div className="h-8 w-full bg-primary/20 rounded-lg"></div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="h-20 bg-green-500/10 rounded-xl"></div>
                           <div className="h-20 bg-red-500/10 rounded-xl"></div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECT BRIEFING SECTION */}
        <section className="py-24 bg-surface/50 border-y border-surface-border">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            <h2 className="text-3xl font-bold">A Missão do Monyx</h2>
            <p className="text-xl text-text-muted italic leading-relaxed">
              "Monyx nasceu da necessidade de simplificar a gestão financeira, fugindo de interfaces complexas e carregadas. Nosso foco é a clareza visual e a colaboração, permitindo que indivíduos e casais tomem decisões inteligentes com seus recursos. O projeto utiliza tecnologias modernas como Next.js e Supabase para garantir velocidade, segurança e uma experiência fluida em qualquer dispositivo."
            </p>
            <div className="pt-4 flex flex-col items-center">
               <p className="font-bold text-lg text-primary">Equipe Monyx</p>
               <p className="text-sm text-text-muted uppercase tracking-widest mt-1">Desenvolvido com Paixão</p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 border-t border-surface-border">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 text-primary font-bold text-xl grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                <span className="text-lg">M</span>
              </div>
              Monyx
            </div>
            
            <p className="text-sm text-text-muted font-medium order-3 md:order-2">
              © {new Date().getFullYear()} Monyx Finance. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center gap-6 text-sm font-semibold text-text-muted order-2 md:order-3">
               <Link href="/login" className="hover:text-primary">Entrar</Link>
               <Link href="/cadastro" className="hover:text-primary">Cadastrar</Link>
            </div>
          </div>
        </footer>
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
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${tx.type === 'income' ? 'text-income' : ''}`}>
                        {tx.type === 'income' ? "+ " : "- "}
                        {formatCurrency(tx.amount)}
                      </span>
                      
                      {/* Botão Editar */}
                      {(tx.user_cpf === user?.cpf || tx.is_shared) && (
                        <button 
                          onClick={() => {
                            setSelectedTx(tx);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                    </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTx(null);
        }} 
        transactionToEdit={selectedTx}
      />
    </>
  );
}
