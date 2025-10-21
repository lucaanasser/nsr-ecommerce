/**
 * Utilitários de formatação para dados do perfil
 */

/**
 * Formata CPF no padrão XXX.XXX.XXX-XX
 */
export function formatCPF(cpf: string = ""): string {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Formata telefone no padrão brasileiro
 * (99) 99999-9999 para celular
 * (99) 9999-9999 para fixo
 */
export function formatPhone(phone: string = ""): string {
  const cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  
  return phone;
}

/**
 * Formata data de nascimento para padrão brasileiro DD/MM/YYYY
 */
export function formatBirthDate(birthDate?: string): string {
  if (!birthDate) return '';
  
  try {
    const date = new Date(birthDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
}

/**
 * Converte data DD/MM/YYYY para formato ISO (YYYY-MM-DD)
 */
export function convertBirthDateToISO(dateStr: string): string | null {
  if (!dateStr || dateStr.length !== 10) return null;
  
  const [day, month, year] = dateStr.split('/');
  if (!day || !month || !year) return null;
  
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Formata data enquanto o usuário digita (DD/MM/YYYY)
 */
export function formatDateWhileTyping(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  let formatted = cleaned;
  
  if (cleaned.length >= 2) {
    formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
  }
  if (cleaned.length >= 4) {
    formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
  }
  
  return formatted;
}

/**
 * Remove caracteres não numéricos de uma string
 */
export function cleanNumericString(value: string): string {
  return value.replace(/\D/g, '');
}
