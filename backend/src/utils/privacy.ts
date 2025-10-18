/**
 * Utilitários para proteção de dados pessoais (LGPD)
 */

/**
 * Mascara CPF para exibição
 * Exemplo: 123.456.789-10 -> 123.456.***-**
 */
export function maskCPF(cpf: string | null | undefined): string | null {
  if (!cpf) return null;
  
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) {
    return cpf; // Retorna original se não for CPF válido
  }
  
  // Formata com máscara: XXX.XXX.***-**
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.***-**');
}

/**
 * Mascara email para exibição
 * Exemplo: usuario@email.com -> us***@email.com
 */
export function maskEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  
  const [username, domain] = email.split('@');
  
  if (!domain || !username) return email;
  
  // Mostra primeiros 2 caracteres do username
  const visibleChars = Math.min(2, username.length);
  const maskedUsername = username.substring(0, visibleChars) + '***';
  
  return `${maskedUsername}@${domain}`;
}

/**
 * Mascara telefone para exibição
 * Exemplo: (11) 98765-4321 -> (11) 98***-****
 */
export function maskPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 11) {
    // Celular: (XX) 9XXXX-XXXX -> (XX) 9X***-****
    return cleanPhone.replace(/(\d{2})(\d{2})(\d{3})(\d{4})/, '($1) $2***-****');
  } else if (cleanPhone.length === 10) {
    // Fixo: (XX) XXXX-XXXX -> (XX) XX***-****
    return cleanPhone.replace(/(\d{2})(\d{2})(\d{2})(\d{4})/, '($1) $2***-****');
  }
  
  return phone; // Retorna original se formato desconhecido
}

/**
 * Remove dados sensíveis de um objeto de usuário para exibição segura
 */
export function sanitizeUserData(user: any): any {
  if (!user) return null;
  
  const sanitized = { ...user };
  
  // Remove senha completamente
  delete sanitized.password;
  
  // Mascara dados pessoais
  if (sanitized.cpf) {
    sanitized.cpf = maskCPF(sanitized.cpf);
  }
  
  if (sanitized.phone) {
    sanitized.phone = maskPhone(sanitized.phone);
  }
  
  return sanitized;
}

/**
 * Valida se CPF está em formato válido (apenas formato, não verifica dígitos verificadores)
 */
export function isValidCPFFormat(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.length === 11;
}
