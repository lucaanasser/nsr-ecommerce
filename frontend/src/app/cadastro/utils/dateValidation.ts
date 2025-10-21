/**
 * Utilitários para conversão e validação de datas no cadastro
 */

/**
 * Converte data de formato ISO (yyyy-MM-dd) para formato brasileiro (dd/MM/yyyy)
 */
export const formatDateToBR = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

/**
 * Converte data de formato brasileiro (dd/MM/yyyy) para formato ISO (yyyy-MM-dd)
 */
export const formatDateToISO = (brDate: string): string => {
  if (!brDate) return '';
  const cleaned = brDate.replace(/\D/g, '');
  if (cleaned.length !== 8) return '';
  
  const day = cleaned.substring(0, 2);
  const month = cleaned.substring(2, 4);
  const year = cleaned.substring(4, 8);
  
  return `${year}-${month}-${day}`;
};

/**
 * Formata data enquanto o usuário digita (aplica máscara dd/MM/yyyy)
 */
export const formatBirthDateWhileTyping = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  
  let formatted = cleaned;
  if (cleaned.length >= 2) {
    formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
  }
  if (cleaned.length >= 4) {
    formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4) + '/' + cleaned.substring(4, 8);
  }
  
  return formatted;
};

/**
 * Valida se a data de nascimento está dentro dos limites aceitáveis
 */
export const validateAge = (isoDate: string): { valid: boolean; message?: string } => {
  if (!isoDate) {
    return { valid: false, message: 'Data de nascimento é obrigatória' };
  }

  const birthDate = new Date(isoDate);
  const today = new Date();
  
  if (isNaN(birthDate.getTime())) {
    return { valid: false, message: 'Data inválida' };
  }
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < 13) {
    return { valid: false, message: 'Você deve ter pelo menos 13 anos' };
  }
  
  if (age > 120) {
    return { valid: false, message: 'Data de nascimento inválida' };
  }
  
  return { valid: true };
};
