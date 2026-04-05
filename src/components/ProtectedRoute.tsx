"use client";

import { useAppContext } from "@/context/AppContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Navigation from "./Navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthRoute = pathname === "/login" || pathname === "/cadastro";

  useEffect(() => {
    if (!loading) {
      if (!user && !isAuthRoute) {
        router.push("/login");
      } else if (user && isAuthRoute) {
        router.push("/");
      }
    }
  }, [user, loading, pathname, router, isAuthRoute]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se for rota de login/cadastro, mostra sem Navigation
  if (isAuthRoute) {
    return <main className="flex-1 w-full h-screen overflow-y-auto">{children}</main>;
  }

  // Se estiver carregado e o usuário não existe (embora useEffect vá redirecionar)
  if (!user) return null;

  return (
    <>
      <Navigation />
      <main className="flex-1 h-screen overflow-y-auto w-full pt-16 md:pt-0 pb-20 md:pb-0">
        {children}
      </main>
    </>
  );
}
