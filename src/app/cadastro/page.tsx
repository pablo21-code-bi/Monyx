"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { formatCPF, unmaskCPF } from "@/lib/utils";
import { UserPlus } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function Cadastro() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const { fetchUserSession } = useAppContext();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const cleanCpf = unmaskCPF(cpf);
    if (cleanCpf.length !== 11) {
      setErrorMsg("O CPF deve conter exatamente 11 números.");
      setLoading(false);
      return;
    }

    // 1. Cadastrar no auth do Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      if (authError?.message.includes("already registered")) {
        setErrorMsg("Este e-mail já está em uso.");
      } else if (authError?.message.includes("Password should be")) {
         setErrorMsg("A senha deve ter pelo menos 6 caracteres.");
      } else {
        console.error("AUTH ERROR:", authError);
        setErrorMsg("Auth Error: " + (authError?.message || "User object missing"));
      }
      setLoading(false);
      return;
    }

    // 2. Tentar inserir na nosssa tabela public.users
    const auth_id = authData.user.id;
    
    const { error: dbError } = await supabase.from("users").insert([
      { cpf: cleanCpf, name, email, auth_id }
    ]);

    if (dbError) {
      // Falhou em criar na tabela, possivelmente CPF duplicado (cpf is PRIMARY KEY)
      if (dbError.code === "23505") { // Código unique violation
        setErrorMsg("Este CPF já está cadastrado no sistema.");
      } else {
        console.error("DB ERROR: ", dbError);
        setErrorMsg("Erro banco: " + dbError.message);
      }
      // Por segurança faríamos supabase.auth.signOut(), mas estamos apenas criando
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // Tratar race condition: carregar o contexto explicitamente agora que o insert terminou
    await fetchUserSession();

    // Feito!
    router.push("/");
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background py-10">
      <div className="w-full max-w-md bg-surface border border-surface-border p-8 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-3xl font-bold">M</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Criar nova conta</h1>
        <p className="text-text-muted text-center mb-8">Preencha seus dados para começar.</p>

        {errorMsg && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm font-medium mb-6 text-center border border-red-500/20">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCadastro} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João da Silva"
              className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">CPF</label>
            <input
              type="text"
              required
              value={cpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2 mt-6"
          >
            {loading ? "Criando..." : (
              <>
                Cadastrar <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-8">
          Já possui conta?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
