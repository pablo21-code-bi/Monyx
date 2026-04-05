"use client";

import { useState, useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  PieChart, Pie
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { useAppContext, Transaction } from "@/context/AppContext";

const COLORS = ["#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#10B981", "#14B8A6", "#F43F5E"];

export default function Graficos() {
  const { activeTransactions, partner, isCoupleView, setIsCoupleView } = useAppContext();
  const [period, setPeriod] = useState("Tudo");
  const periods = ["Tudo", "Semana", "Mês", "Ano"];

  const currentData = useMemo(() => {
    let filteredTx = activeTransactions;
    const now = new Date();
    
    if (period === "Semana") {
      const umaSemanaAtras = new Date(now.setDate(now.getDate() - 7));
      filteredTx = activeTransactions.filter((t: any) => new Date(t.created_at || t.date) >= umaSemanaAtras);
    } else if (period === "Mês") {
      const umMesAtras = new Date(now.setMonth(now.getMonth() - 1));
      filteredTx = activeTransactions.filter((t: any) => new Date(t.created_at || t.date) >= umMesAtras);
    } else if (period === "Ano") {
      const umAnoAtras = new Date(now.setFullYear(now.getFullYear() - 1));
      filteredTx = activeTransactions.filter((t: any) => new Date(t.created_at || t.date) >= umAnoAtras);
    }

    // Pie Chart (Categorias de Despesas)
    const expenseOnly = filteredTx.filter((t: any) => t.type === "expense");
    const categoryMap: Record<string, number> = {};
    expenseOnly.forEach((t: any) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
    });

    const pieData = Object.entries(categoryMap).map(([name, value], idx) => ({
      name,
      value,
      color: COLORS[idx % COLORS.length]
    })).sort((a, b) => b.value - a.value);

    // Bar Chart (Receitas x Despesas agrupados por período base)
    // Se for pouco, agrupamos por dia/mes genérico
    const barMap: Record<string, { name: string; income: number; expense: number }> = {};
    
    filteredTx.forEach((t: any) => {
      const dateObj = new Date(t.created_at || t.date);
      let key = "";
      if (period === "Tudo" || period === "Ano") {
        key = dateObj.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      } else {
        key = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      }

      if (!barMap[key]) {
        barMap[key] = { name: key, income: 0, expense: 0 };
      }

      if (t.type === "income") barMap[key].income += Number(t.amount);
      if (t.type === "expense") barMap[key].expense += Number(t.amount);
    });

    const barData = Object.values(barMap).sort((a,b) => {
      return a.name.localeCompare(b.name); // Simple string sort for DD/MM or MMM YY
    });

    return { pie: pieData, bar: barData };
  }, [activeTransactions, period]);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <PieChartIcon size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gráficos</h1>
            <p className="text-text-muted text-sm mt-1">Veja seus gastos reais em detalhes</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Toggle de Visualização */}
          {partner && (
            <div className="bg-surface border border-surface-border p-1 rounded-xl flex shadow-sm w-full sm:w-auto">
               <button 
                  onClick={() => setIsCoupleView(false)}
                  className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-all ${!isCoupleView ? "bg-background shadow text-primary" : "text-text-muted hover:text-foreground"}`}
               >
                 Individual
               </button>
               <button 
                  onClick={() => setIsCoupleView(true)}
                  className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${isCoupleView ? "bg-pink-500 text-white shadow-md shadow-pink-500/20" : "text-text-muted hover:text-foreground"}`}
               >
                 Casal
               </button>
            </div>
          )}

          {/* Filtro de Período */}
          <div className="bg-surface border border-surface-border rounded-xl p-1 flex w-full sm:w-auto">
            {periods.map(p => (
              <button 
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  period === p 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-text-muted hover:text-foreground hover:bg-surface-border/50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </header>

      {activeTransactions.length === 0 ? (
         <div className="p-12 text-center text-text-muted bg-surface rounded-2xl border border-surface-border">
           <PieChartIcon size={48} className="mx-auto mb-4 opacity-30" />
           <p className="text-lg font-medium">Nenhum dado financeiro</p>
           <p className="text-sm">Cadastre receitas e despesas no Início para visualizar seus gráficos aqui.</p>
         </div>
      ): (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras: Receitas vs Despesas */}
          <div className="bg-surface border border-surface-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6">Receitas x Despesas ({period})</h2>
            <div className="h-[300px] w-full">
              {currentData.bar.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentData.bar} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#F3F4F6'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                    />
                    <Bar dataKey="income" name="Receitas" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="expense" name="Despesas" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-text-muted">Sem dados no período</div>
              )}
            </div>
          </div>

          {/* Gráfico de Pizza: Gastos por Categoria */}
          <div className="bg-surface border border-surface-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6">Despesas por Categoria</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-[300px]">
              
              {currentData.pie.length > 0 ? (
                <>
                  <div className="w-full md:w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                          formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                        />
                        <Pie
                          data={currentData.pie}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {currentData.pie.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Custom Legend */}
                  <div className="w-full md:w-1/2 space-y-3 overflow-y-auto max-h-[250px] pr-2">
                    {currentData.pie.map((cat, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></div>
                          <span className="text-text-muted truncate max-w-[100px]">{cat.name}</span>
                        </div>
                        <span className="font-bold shrink-0">R$ {cat.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                   <p>Nenhuma despesa no período.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
