"use client";

import { useState, useRef } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useAppContext, Transaction } from "@/context/AppContext";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ParsedTransaction = Omit<Transaction, "id" | "user_cpf" | "created_at">;

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { importTransactions } = useAppContext();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedTransaction[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{ added: number, skipped: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setIsParsing(true);
    setError(null);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        let data: ParsedTransaction[] = [];

        if (selectedFile.name.toLowerCase().endsWith(".ofx")) {
          data = parseOFX(text);
        } else if (selectedFile.name.toLowerCase().endsWith(".csv")) {
          data = parseCSV(text);
        } else {
          throw new Error("Formato de arquivo não suportado. Use .OFX ou .CSV");
        }

        if (data.length === 0) {
          throw new Error("Nenhuma transação encontrada no arquivo.");
        }

        setParsedData(data);
      } catch (err: any) {
        setError(err.message || "Erro ao ler o arquivo");
      } finally {
        setIsParsing(false);
      }
    };

    reader.readAsText(selectedFile, "ISO-8859-1"); // Muitos bancos usam codificação antiga
  };

  const parseOFX = (text: string): ParsedTransaction[] => {
    const transactions: ParsedTransaction[] = [];
    const stmtTrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
    let match;

    while ((match = stmtTrnRegex.exec(text)) !== null) {
      const content = match[1];
      
      const trnType = /<TRNTYPE>(.*)/i.exec(content)?.[1]?.trim();
      const amountStr = /<TRNAMT>([-]?\d+[,.]\d+|[-]?\d+)/i.exec(content)?.[1]?.trim().replace(",", ".");
      const dateStr = /<DTPOSTED>(\d{8})/i.exec(content)?.[1];
      const memo = (/<MEMO>(.*)/i.exec(content)?.[1] || /<NAME>(.*)/i.exec(content)?.[1])?.trim();

      if (amountStr && dateStr && memo) {
        const amount = parseFloat(amountStr);
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const date = `${year}-${month}-${day}`;

        transactions.push({
          title: cleanDescription(memo),
          amount: Math.abs(amount),
          type: amount > 0 ? "income" : "expense",
          category: "Outras Despesas",
          date,
          is_shared: false
        });
      }
    }

    return transactions;
  };

  const parseCSV = (text: string): ParsedTransaction[] => {
    const lines = text.split("\n");
    const transactions: ParsedTransaction[] = [];

    // Ignora cabeçalho rudimentar
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Suporta vírgula ou ponto e vírgula
      const parts = line.includes(";") ? line.split(";") : line.split(",");
      if (parts.length < 3) continue;

      // Tentativa de identificar data, descrição e valor
      // Formato esperado básico: Data, Descrição, Valor
      let [datePart, descPart, amountPart] = parts;

      // Limpeza simples de data (DD/MM/YYYY para YYYY-MM-DD)
      const dateMatch = /(\d{2})\/(\d{2})\/(\d{4})/.exec(datePart);
      if (!dateMatch) continue;
      const date = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;

      // Valor
      const amount = parseFloat(amountPart.replace(/"/g, "").replace(",", "."));
      if (isNaN(amount)) continue;

      transactions.push({
        title: cleanDescription(descPart.replace(/"/g, "")),
        amount: Math.abs(amount),
        type: amount > 0 ? "income" : "expense",
        category: "Outras Despesas",
        date,
        is_shared: false
      });
    }

    return transactions;
  };

  const cleanDescription = (desc: string) => {
    return desc
      .replace(/COMPRA NO CARTAO - /gi, "")
      .replace(/PAGAMENTO - /gi, "")
      .replace(/PIX - ENVIADO - /gi, "PIX: ")
      .replace(/PIX - RECEBIDO - /gi, "PIX: ")
      .trim();
  };

  const handleConfirmImport = async () => {
    const result = await importTransactions(parsedData);
    setImportResult(result);
    setParsedData([]);
    setFile(null);
  };

  const totalExpense = parsedData.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = parsedData.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full md:w-[540px] bg-surface rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Importar Extrato</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-border/50 rounded-full transition-colors text-text-muted">
            <X size={24} />
          </button>
        </header>

        {!file && !importResult && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-surface-border rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="p-4 bg-background rounded-2xl group-hover:scale-110 transition-transform">
              <Upload className="text-primary" size={32} />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">Clique para selecionar</p>
              <p className="text-sm text-text-muted">Arraste seu arquivo .OFX ou .CSV do banco aqui</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".ofx,.csv" 
              className="hidden" 
            />
          </div>
        )}

        {isParsing && (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-text-muted">Lendo dados do extrato...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500 mb-6">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {parsedData.length > 0 && !isParsing && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-background rounded-2xl p-4 mb-6 grid grid-cols-2 gap-4 border border-surface-border">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Transações</span>
                <span className="text-xl font-bold">{parsedData.length}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Resumo Financeiro</span>
                <div className="text-xs font-semibold">
                  <span className="text-income">+{totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  <span className="mx-1 text-text-muted">/</span>
                  <span className="text-expense">-{totalExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
              <div className="space-y-2">
                {parsedData.slice(0, 50).map((t, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-xl border border-surface-border/30">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold truncate">{t.title}</span>
                      <span className="text-[10px] text-text-muted uppercase font-bold">{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <span className={`text-sm font-bold ${t.type === 'income' ? 'text-income' : 'text-foreground'}`}>
                      {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                ))}
                {parsedData.length > 50 && (
                  <p className="text-center text-xs text-text-muted py-2">... e mais {parsedData.length - 50} transações</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setFile(null); setParsedData([]); }}
                className="flex-1 py-4 rounded-2xl font-bold text-text-muted hover:bg-background transition-all"
              >
                Trocar Arquivo
              </button>
              <button 
                onClick={handleConfirmImport}
                className="flex-[2] bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
              >
                Confirmar Importação
              </button>
            </div>
          </div>
        )}

        {importResult && (
          <div className="text-center py-10 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-income/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-income" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Importação Concluída!</h3>
            <p className="text-text-muted mb-6">
              {importResult.added > 0 
                ? `${importResult.added} novas movimentações adicionadas com sucesso.` 
                : "Nenhuma movimentação nova encontrada."}
              {importResult.skipped > 0 && (
                <span className="block text-xs mt-1">({importResult.skipped} duplicadas foram ignoradas)</span>
              )}
            </p>
            <button 
              onClick={onClose}
              className="w-full bg-background hover:bg-surface-border/30 py-4 rounded-2xl font-bold transition-all border border-surface-border"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
