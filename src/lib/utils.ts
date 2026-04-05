export function formatCPF(value: string) {
  // Remove tudo que não é dígito
  const v = value.replace(/\D/g, "");
  
  if (v.length <= 11) {
    return v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  
  // Limita a 11 números com máscara
  return v
    .substring(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function unmaskCPF(value: string) {
  return value.replace(/\D/g, "");
}
