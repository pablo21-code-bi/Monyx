"use client";

import { useState } from "react";
import { UserCircle, Heart, Lock, CheckCircle2, LogOut, Send, AlertTriangle } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function Perfil() {
  const { user, partner, sendPartnerRequest, disconnectPartner, logout } = useAppContext();
  
  const [partnerCpfInput, setPartnerCpfInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);

  const handleLinkPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerCpfInput) return;
    setLoading(true);
    setMessage({ text: "", type: "" });
    
    // Agora enviamos um convite!
    const success = await sendPartnerRequest(partnerCpfInput);
    if (success) {
      setMessage({ text: "Convite enviado com sucesso! O parceiro(a) precisa acessar a conta dele e aceitar na tela inicial.", type: "success" });
      setPartnerCpfInput("");
    } else {
      setMessage({ text: "CPF não encontrado ou já vinculado. Verifique os dados.", type: "error" });
    }
    setLoading(false);
  };
  
  const handleDisconnect = async () => {
     setLoading(true);
     await disconnectPartner();
     setLoading(false);
     setShowConfirmDisconnect(false);
  }

  if (!user) return null;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Perfil</h1>
          <p className="text-text-muted">Gerencie seus dados e conecte-se com seu parceiro(a).</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-xl transition-colors font-semibold"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dados do Usuário */}
        <section className="bg-surface border border-surface-border p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <UserCircle size={28} />
            </div>
            <h2 className="text-xl font-bold">Seus Dados</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-text-muted">Nome</p>
              <p className="text-lg font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">CPF</p>
              <p className="text-lg font-semibold">{user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Email</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#10B981] bg-[#10B981]/10 px-3 py-2 rounded-lg w-fit mt-4">
              <CheckCircle2 size={16} />
              <span>Conta verificada via Supabase</span>
            </div>
          </div>
        </section>

        {/* Modo Casal */}
        <section className="bg-gradient-to-br from-pink-500/5 to-rose-500/10 border border-pink-500/20 p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="bg-pink-500/20 p-3 rounded-full text-pink-500">
                <Heart size={28} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Modo Casal</h2>
            </div>

            {partner ? (
              <div className="space-y-4 relative z-10 flex-1 flex flex-col">
                <p className="text-text-muted mb-4">Você está conectado com:</p>
                <div className="bg-background/80 backdrop-blur border border-pink-500/30 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">{partner.name}</p>
                    <p className="text-sm text-text-muted">{partner.cpf}</p>
                  </div>
                  <Heart className="text-pink-500 animate-pulse" size={24} fill="currentColor" />
                </div>
                
                <div className="mt-auto pt-6">
                   {!showConfirmDisconnect ? (
                      <button 
                         onClick={() => setShowConfirmDisconnect(true)}
                         className="w-full border border-red-500/20 text-red-500 hover:bg-red-500/10 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                         <AlertTriangle size={18} /> Desfazer vínculo
                      </button>
                   ) : (
                      <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                         <p className="text-sm text-red-500 font-medium mb-3">Tem certeza? Vocês deixarão de ver a carteira conjunta.</p>
                         <div className="flex gap-2">
                            <button onClick={() => setShowConfirmDisconnect(false)} className="flex-1 bg-surface border border-surface-border text-foreground py-2 rounded-lg text-sm font-semibold hover:bg-surface/80 transition-colors">Cancelar</button>
                            <button onClick={handleDisconnect} disabled={loading} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-bold shadow-md shadow-red-500/20 hover:bg-red-600 transition-colors">{loading ? "Separando..." : "Confirmar"}</button>
                         </div>
                      </div>
                   )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleLinkPartner} className="space-y-4 relative z-10 flex flex-col flex-1">
                <p className="text-text-muted text-sm mb-2">
                  Envie um convite de segurança para o CPF do seu parceiro(a). Quando ele(a) aprovar, suas carteiras receberão uma visão conjunta!
                </p>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Digite apenas os números do CPF"
                    value={partnerCpfInput}
                    onChange={(e) => setPartnerCpfInput(e.target.value.replace(/\D/g, "").substring(0, 11))}
                    className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                {message.text && (
                  <p className={`text-sm ${message.type === "error" ? "text-red-500" : "text-[#10B981]"}`}>
                    {message.text}
                  </p>
                )}
                
                <div className="mt-auto pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? "Processando..." : <><Send size={18} /> Enviar Convite</>}
                  </button>
                </div>
              </form>
            )}
            
            <Lock className="absolute -bottom-4 -right-4 text-pink-500/5 rotate-12" size={120} />
          </div>
        </section>
      </div>
    </div>
  );
}
