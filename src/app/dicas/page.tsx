"use client";

import { Lightbulb, TrendingUp, ShieldAlert, Target } from "lucide-react";

export default function Dicas() {
  const tips = [
    {
      id: 1,
      icon: <Lightbulb size={24} />,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      title: "Construa sua Reserva de Emergência",
      description: "Tente poupar espaço para 3 a 6 meses das suas despesas fixas. Isso garantirá tranquilidade para imprevistos e redução do estresse diário."
    },
    {
      id: 2,
      icon: <TrendingUp size={24} />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      title: "A Regra 50/30/20",
      description: "Uma métrica clássica: dedique 50% de sua renda para necessidades básicas, 30% em desejos e estilo de vida, e poupe ativamente 20% sempre no início do mês."
    },
    {
      id: 3,
      icon: <ShieldAlert size={24} />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      title: "Evite financiamentos longos e faturas",
      description: "Juros compostos são seus melhores amigos investindo, mas os piores nas dívidas. Tente quitar o cartão sempre no valor integral antes da fatura fechar."
    },
    {
      id: 4,
      icon: <Target size={24} />,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      title: "Planeje suas compras maiores",
      description: "Quer trocar de celular ou planejar uma viagem? Espere no mínimo 72 horas após o desejo inicial. Se a vontade permanecer sustentável para o orçamento, vá em frente."
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dicas para Você</h1>
          <p className="text-text-muted text-sm mt-1">Conhecimento que vale ouro e poupa dinheiro</p>
        </div>
      </header>

      {/* Hero Tip */}
      <section className="bg-gradient-to-r from-primary to-indigo-600 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[200px]">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-64 h-64 transform -rotate-12 translate-x-12 -translate-y-12">
            <path fill="white" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.5C90.8,-33.9,96.8,-18.8,97.5,-3.6C98.2,11.6,93.6,26.9,84.6,39.6C75.6,52.3,62.2,62.4,47.8,70.9C33.4,79.4,18.1,86.3,1.8,83.4C-14.5,80.5,-29,67.8,-42.9,58.8C-56.8,49.8,-70.1,44.5,-79.8,34.4C-89.5,24.3,-95.6,9.4,-94.1,-4.7C-92.6,-18.8,-83.5,-32.1,-72.6,-42.6C-61.7,-53.1,-49,-60.8,-36.3,-68.8C-23.6,-76.8,-10.8,-85.1,2.5,-89.1C15.8,-93.1,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30 text-indigo-50">Dica da Semana</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">Conheça seus gastos fantasmas</h2>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Muitas vezes, assinaturas esquecidas e pequenos lanches não contabilizados (os gastos invisíveis) comem silenciosamente 20% do orçamento. Revise seus extratos do último trimestre e cancele o inútil.
          </p>
        </div>
      </section>

      {/* Grid of Tips */}
      <h3 className="text-xl font-bold pt-4 mb-4">Essenciais Monyx</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip) => (
          <div key={tip.id} className="bg-surface border border-surface-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <div className={`w-14 h-14 rounded-2xl ${tip.bg} ${tip.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform`}>
              {tip.icon}
            </div>
            <h4 className="text-lg font-bold mb-2">{tip.title}</h4>
            <p className="text-text-muted leading-relaxed">
              {tip.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
