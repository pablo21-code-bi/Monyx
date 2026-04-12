# 💎 Monyx - Organizador de Finanças Inteligente

![Monyx Logo](public/monyx-logo.png)

O **Monyx** é uma aplicação moderna de gestão financeira pessoal e compartilhada, projetada para oferecer clareza, controle e simplicidade no dia a dia financeiro. Com uma interface premium e recursos avançados, o Monyx ajuda você (e seu parceiro/parceira) a conquistar metas e entender para onde seu dinheiro está indo.

## 🚀 Funcionalidades Principais

- **📊 Dashboard Interativo:** Visão geral instantânea de saldo, receitas e despesas com indicadores visuais claros.
- **👩‍❤️‍👨 Modo Casal (Shared Finances):** Conecte-se com seu parceiro(a) para gerenciar despesas compartilhadas sem perder a privacidade de suas contas individuais.
- **📈 Gráficos Dinâmicos:** Visualize sua evolução financeira através de gráficos detalhados por categoria e evolução temporal.
- **🎯 Gestão de Metas:** Defina objetivos financeiros (ex: Viagem, Fundo de Emergência) e acompanhe o progresso em tempo real com barras de evolução.
- **📱 Responsividade Total:** Use no desktop ou no celular com uma experiência fluida e adaptada.
- **🔒 Segurança com Supabase:** Autenticação segura e armazenamento de dados robusto.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com o que há de mais moderno no ecossistema web:

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router & Turbopack)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend & Auth:** [Supabase](https://supabase.com/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Ícones:** [Lucide React](https://lucide.dev/)

## 🌐 Deploy Atual

O projeto está configurado para deploy contínuo no **GitHub Pages** e utiliza um domínio customizado:
🔗 [monyxfinance.com.br](https://monyxfinance.com.br)

## 🖥️ Como rodar localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/monyx.git
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` com suas chaves do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=seu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 📦 Script de Deploy

Para atualizar a versão de produção no GitHub Pages:
```bash
npm run deploy
```

---

*Desenvolvido com foco em UX e excelência técnica.*
