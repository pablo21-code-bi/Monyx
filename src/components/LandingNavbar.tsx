"use client";

import Link from "next/link";

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-surface/80 backdrop-blur-md border-b border-surface-border z-50 flex items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tight">
        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
          <span className="text-2xl font-bold">M</span>
        </div>
        Monyx
      </div>
      
      <div className="flex items-center gap-4">
        <Link 
          href="/login" 
          className="text-sm font-semibold text-text-muted hover:text-primary transition-colors hidden sm:block"
        >
          Faça seu login
        </Link>
        <Link 
          href="/cadastro" 
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
        >
          Criar conta
        </Link>
      </div>
    </nav>
  );
}
