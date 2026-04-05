"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, PieChart, Lightbulb, UserCircle, Target } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Início", href: "/", icon: LayoutDashboard },
    { name: "Registros", href: "/registros", icon: Receipt },
    { name: "Metas", href: "/metas", icon: Target },
    { name: "Gráficos", href: "/graficos", icon: PieChart },
    { name: "Dicas", href: "/dicas", icon: Lightbulb },
  ];

  const mobileNavItems = [...navItems, { name: "Perfil", href: "/perfil", icon: UserCircle }];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-md border-b border-surface-border flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
            <span className="text-xl">M</span>
          </div>
          Monyx
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-surface-border flex items-center justify-around px-1 z-50 pb-safe shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.1)] dark:shadow-none overflow-x-auto">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full min-w-[60px] h-full space-y-1 ${
                isActive ? "text-primary" : "text-text-muted hover:text-foreground"
              } transition-colors`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:flex flex-col w-64 h-full bg-surface border-r border-surface-border z-50">
        <div className="h-16 flex items-center px-6 border-b border-surface-border">
          <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <span className="text-xl">M</span>
            </div>
            Monyx
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-muted hover:bg-surface-border/50 hover:text-foreground"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-border">
          <Link href="/perfil" className={`flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-all ${pathname === '/perfil' ? 'bg-primary/10 text-primary font-medium' : 'text-text-muted hover:bg-surface-border/50 hover:text-foreground'}`}>
            <UserCircle size={20} strokeWidth={pathname === '/perfil' ? 2.5 : 2} />
            <span className="text-sm font-medium">Perfil</span>
          </Link>
        </div>
      </div>
    </>
  );
}
