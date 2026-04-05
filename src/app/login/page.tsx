"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Email ou senha inválidos. Tente novamente.");
      setLoading(false);
    } else {
      // router.push("/") will be handled by the onAuthStateChange in AppContext automatically
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-surface border border-surface-border p-8 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-3xl font-bold">M</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Entrar no Monyx</h1>
        <p className="text-text-muted text-center mb-8">Gerencie suas finanças com inteligência.</p>

        {errorMsg && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm font-medium mb-6 text-center border border-red-500/20">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2 mt-4"
          >
            {loading ? "Entrando..." : (
              <>
                Entrar <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-8">
          Ainda não tem uma conta?{" "}
          <Link href="/cadastro" className="text-primary font-bold hover:underline">
            Crie agora
          </Link>
        </p>
      </div>
    </div>
  );
}
