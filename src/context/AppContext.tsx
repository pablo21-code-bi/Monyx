"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User as SupabaseUser } from "@supabase/supabase-js";

export type User = {
  cpf: string;
  name: string;
  email: string;
  partner_cpf: string | null;
  auth_id: string;
};

export type Transaction = {
  id: number;
  user_cpf: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  created_at?: string;
};

export type Goal = {
  id: number;
  user_cpf: string;
  title: string;
  target_amount: number;
  current_amount: number;
  is_shared: boolean;
  created_at?: string;
};

export type PartnerRequestType = {
  id: number;
  from_cpf: string;
  to_cpf: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  sender_name?: string; 
};

type AppContextType = {
  user: User | null;
  partner: User | null;
  transactions: Transaction[];
  partnerTransactions: Transaction[];
  activeTransactions: Transaction[];
  goals: Goal[];
  activeGoals: Goal[];
  loading: boolean;

  
  isCoupleView: boolean;
  setIsCoupleView: (v: boolean) => void;
  
  pendingRequests: PartnerRequestType[];
  sendPartnerRequest: (partnerCpf: string) => Promise<boolean>;
  acceptPartnerRequest: (reqId: number) => Promise<void>;
  rejectPartnerRequest: (reqId: number) => Promise<void>;
  disconnectPartner: () => Promise<void>;

  logout: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, "id" | "user_cpf" | "created_at">) => Promise<void>;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, "id" | "user_cpf" | "created_at">) => Promise<void>;
  updateGoal: (id: number, amountToAdd: number) => Promise<void>;
  fetchUserSession: () => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [partnerTransactions, setPartnerTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Novos estados do sistema Casal
  const [isCoupleView, setIsCoupleView] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<PartnerRequestType[]>([]);
  
  const router = useRouter();

  // A união baseada no estado de visão (Fácil de consumir nas telas)
  const activeTransactions = isCoupleView && partner 
    ? [...transactions, ...partnerTransactions] 
    : transactions;

  const activeGoals = isCoupleView && partner
    ? goals
    : goals.filter(g => g.user_cpf === user?.cpf);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setPartner(null);
        setTransactions([]);
        setPartnerTransactions([]);
        setGoals([]);
        setPendingRequests([]);
        setLoading(false);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (auth_id: string) => {
    try {
      const { data: userData, error } = await supabase.from("users").select("*").eq("auth_id", auth_id).single();
      
      if (error) {
        console.error("Error fetching user data:", error);
      } else if (userData) {
        setUser(userData);
        if (userData.partner_cpf) {
          await verifyPartner(userData.partner_cpf);
        } else {
          // Se não tem partner linkado ativamente, busca pedidos pendentes para ELE
          await fetchPendingRequests(userData.cpf);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await loadUserProfile(session.user.id);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchGoals();
    }
  }, [user]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const verifyPartner = async (partnerCpf: string) => {
    try {
      const { data: partnerData } = await supabase.from("users").select("*").eq("cpf", partnerCpf).single();
      if (partnerData) {
        setPartner(partnerData);
        // Desligamos de Requests pois o Casal já tá formado
        setPendingRequests([]); 
        const { data: pTx } = await supabase.from("transactions").select("*").eq("user_cpf", partnerCpf).order("created_at", { ascending: false });
        if (pTx) setPartnerTransactions(pTx);
      }
    } catch (err) {
      console.error("Error fetching partner:", err);
    }
  };

  const fetchPendingRequests = async (myCpf: string) => {
    try {
      // Puxar pedidos com 'pending' e to_cpf == min
      const { data } = await supabase.from("partner_requests").select("*").eq("to_cpf", myCpf).eq("status", "pending");
      if (data && data.length > 0) {
        // Enriquecer com o NOME do rementende para exibir na tela
        const enriched = await Promise.all(data.map(async (req) => {
          const { data: sender } = await supabase.from("users").select("name").eq("cpf", req.from_cpf).single();
          return { ...req, sender_name: sender?.name || "Usuário" };
        }));
        setPendingRequests(enriched);
      } else {
        setPendingRequests([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Enviar Pedido (Lógica nova do Perfil)
  const sendPartnerRequest = async (partnerCpf: string) => {
    if (!user || user.cpf === partnerCpf) return false;
    try {
      // Valida se o usuário destino existe
      const { data: destUser } = await supabase.from("users").select("*").eq("cpf", partnerCpf).single();
      if (!destUser) return false;

      // Deleta requests anteriores pendentes
      await supabase.from("partner_requests").delete().eq("from_cpf", user.cpf).eq("to_cpf", partnerCpf);

      // Insere o convite
      await supabase.from("partner_requests").insert([{ from_cpf: user.cpf, to_cpf: partnerCpf, status: "pending" }]);
      return true;
    } catch (err) {
      console.error("Error sending link request:", err);
      return false;
    }
  };

  // 2. Aceitar Pedido
  const acceptPartnerRequest = async (reqId: number) => {
    if (!user) return;
    try {
      const req = pendingRequests.find(r => r.id === reqId);
      if (!req) return;

      // Marca convite como accepted
      await supabase.from("partner_requests").update({ status: "accepted" }).eq("id", reqId);
      
      // Atualiza amarrando o cpf no to_cpf (Eu)
      await supabase.from("users").update({ partner_cpf: req.from_cpf }).eq("cpf", user.cpf);
      // Atualiza amarrando o cpf no from_cpf (Quem enviou)
      await supabase.from("users").update({ partner_cpf: user.cpf }).eq("cpf", req.from_cpf);

      // Limpa os requests e carrega
      setPendingRequests(pendingRequests.filter(r => r.id !== reqId));
      setUser({ ...user, partner_cpf: req.from_cpf });
      await verifyPartner(req.from_cpf);

    } catch(e) {
      console.error("Error accepting request:", e);
    }
  };

  // 3. Recusar Pedido
  const rejectPartnerRequest = async (reqId: number) => {
     try {
       await supabase.from("partner_requests").update({ status: "rejected" }).eq("id", reqId);
       setPendingRequests(pendingRequests.filter(r => r.id !== reqId));
     } catch(e) {}
  };

  // 4. Desconectar Casal (Rescisão)
  const disconnectPartner = async () => {
    if (!user || !partner) return;
    try {
       await supabase.from("users").update({ partner_cpf: null }).eq("cpf", user.cpf);
       await supabase.from("users").update({ partner_cpf: null }).eq("cpf", partner.cpf);
       // Limpa invites pra não rebugar
       await supabase.from("partner_requests").delete().or(`from_cpf.eq.${user.cpf},from_cpf.eq.${partner.cpf}`);
       
       setUser({ ...user, partner_cpf: null });
       setPartner(null);
       setPartnerTransactions([]);
       setIsCoupleView(false); // Reseta a view
    } catch(e) {}
  };

  const fetchTransactions = async () => {
    if (!user) return;
    try {
      const { data } = await supabase.from("transactions").select("*").eq("user_cpf", user.cpf).order("created_at", { ascending: false });
      if (data) setTransactions(data);
    } catch (err) {
      console.error("Error fetching tx:", err);
    }
  };

  const addTransaction = async (tx: Omit<Transaction, "id" | "user_cpf" | "created_at">) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from("transactions").insert([{ ...tx, user_cpf: user.cpf }]).select().single();
      if (error) throw error;
      setTransactions([data, ...transactions]);
    } catch (err) {
      console.error("Error adding tx:", err);
    }
  };

  const fetchGoals = async () => {
    if (!user) return;
    try {
      // Buscamos apenas os próprios + Parceiro Compartilhado se partner existir.
      let query = supabase.from("goals").select("*").or(`user_cpf.eq.${user.cpf}${user.partner_cpf ? `,and(user_cpf.eq.${user.partner_cpf},is_shared.eq.true)` : ''}`);
      const { data } = await query.order("created_at", { ascending: false });
      if (data) setGoals(data);
    } catch (err) {
      console.error("Error fetching goals:", err);
    }
  };

  const addGoal = async (goal: Omit<Goal, "id" | "user_cpf" | "created_at">) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from("goals").insert([{ ...goal, user_cpf: user.cpf }]).select().single();
      if (error) throw error;
      setGoals([data, ...goals]);
    } catch (err) {
      console.error("Error adding goal:", err);
    }
  };

  const updateGoal = async (id: number, amountToAdd: number) => {
    try {
      const goalToUpdate = goals.find(g => g.id === id);
      if (!goalToUpdate) return;
      const newAmount = goalToUpdate.current_amount + amountToAdd;
      const { error } = await supabase.from("goals").update({ current_amount: newAmount }).eq("id", id);
      if (error) throw error;
      setGoals(goals.map(g => g.id === id ? { ...g, current_amount: newAmount } : g));
    } catch (err) {
      console.error("Error updating goal:", err);
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, partner, transactions, partnerTransactions, activeTransactions, goals, activeGoals, loading, 
      isCoupleView, setIsCoupleView, pendingRequests, sendPartnerRequest, acceptPartnerRequest, rejectPartnerRequest, disconnectPartner,
      logout, fetchTransactions, addTransaction, fetchGoals, addGoal, updateGoal, fetchUserSession 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
