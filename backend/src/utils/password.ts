/**
 * Utilitários para hash, comparação, validação de força e geração de senhas seguras.
 * Inclui funções para entropia, crack time e tokens aleatórios.
 */
import bcrypt from 'bcrypt';
import crypto from 'crypto';

/**
 * Número de salt rounds para bcrypt
 * OWASP recomenda 10+, usamos 12 para segurança extra
 */
const SALT_ROUNDS = 12;

/**
 * Lista de senhas óbvias e padrões comuns
 * Incluindo variações comuns com caracteres especiais e números
 */
const COMMON_PASSWORDS = [
  // Senhas numéricas simples
  '123456', '12345678', '123456789', '1234567890',
  '12345', '1234', '111111', '1234567', '123123',
  '000000', '00000000',
  
  // Palavras comuns
  'password', 'qwerty', 'dragon', 'baseball', 'iloveyou',
  'trustno1', 'sunshine', 'master', 'welcome', 'shadow',
  'ashley', 'football', 'jesus', 'michael', 'ninja',
  'mustang', 'password1', 'admin', 'letmein', 'monkey',
  
  // Padrões óbvios com caracteres especiais e números (conforme solicitado)
  'senha123', 'senha!123', 'senha@123', 'senha#123',
  'abcde!123', 'abcde@123', 'abcde#123', 'abcde$123',
  'abc123!', 'abc123@', 'abc123#', 'abc123$',
  'password!', 'password@', 'password#', 'password$',
  'password!123', 'password@123', 'password#123',
  'qwerty123', 'qwerty!123', 'qwerty@123',
  'admin123', 'admin!123', 'admin@123',
  'teste123', 'teste!123', 'teste@123',
  '12345678!', '12345678@', '12345678#',
  'aaaaa!123', 'aaaaa@123', 'bbbbb!123',
  'abcd1234', 'abcd!234', 'abcd@234',
  '1234abcd', '1234abcd!', '1234abcd@',
];

/**
 * Hash de senha usando bcrypt
 * @param password - Senha em plain text
 * @returns Senha hasheada
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara senha em plain text com hash
 * Usa timing-safe comparison do bcrypt
 * @param password - Senha em plain text
 * @param hash - Hash armazenado
 * @returns true se a senha corresponde ao hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Valida força da senha
 * Regras:
 * - Mínimo 8 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 letra minúscula
 * - Pelo menos 1 número
 * - Pelo menos 1 caractere especial
 * - Não pode ser senha óbvia/comum
 * 
 * @param password - Senha a validar
 * @returns Objeto com validação e mensagens de erro detalhadas
 */
export function validatePasswordStrength(
  password: string
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Mínimo 8 caracteres
  if (password.length < 8) {
    errors.push('A senha deve ter no mínimo 8 caracteres');
  }

  // Máximo 128 caracteres (DoS protection)
  if (password.length > 128) {
    errors.push('A senha deve ter no máximo 128 caracteres');
  }

  // Pelo menos uma letra minúscula
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula (a-z)');
  }

  // Pelo menos uma letra maiúscula
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula (A-Z)');
  }

  // Pelo menos um número
  if (!/\d/.test(password)) {
    errors.push('A senha deve conter pelo menos um número (0-9)');
  }

  // OBRIGATÓRIO: Pelo menos um caractere especial
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('A senha deve conter pelo menos um caractere especial (!@#$%&*...)');
  }

  // Verifica senhas óbvias/comuns (case insensitive)
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('Esta senha é muito óbvia e fácil de adivinhar. Por favor, escolha uma senha mais única');
  }

  // Verifica sequências óbvias
  if (
    /(.)\1{2,}/.test(password) || // caracteres repetidos (aaa, 111)
    /012|123|234|345|456|567|678|789/.test(password) || // sequências numéricas
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password) // sequências alfabéticas
  ) {
    errors.push('Evite sequências óbvias (abc, 123) ou caracteres repetidos (aaa, 111)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Gera um token seguro aleatório
 * Útil para reset de senha, confirmação de email, etc.
 * @param length - Tamanho do token em bytes (padrão: 32)
 * @returns Token hexadecimal
 */
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Gera uma senha aleatória forte
 * Útil para senhas temporárias de admin
 * @param length - Tamanho da senha (padrão: 16)
 * @returns Senha aleatória forte
 */
export function generateStrongPassword(length = 16): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const allChars = lowercase + uppercase + numbers + symbols;

  let password = '';

  // Garante pelo menos um de cada tipo
  password += lowercase[crypto.randomInt(0, lowercase.length)];
  password += uppercase[crypto.randomInt(0, uppercase.length)];
  password += numbers[crypto.randomInt(0, numbers.length)];
  password += symbols[crypto.randomInt(0, symbols.length)];

  // Preenche o resto aleatoriamente
  for (let i = password.length; i < length; i++) {
    password += allChars[crypto.randomInt(0, allChars.length)];
  }

  // Embaralha a senha
  return password
    .split('')
    .sort(() => crypto.randomInt(-1, 2))
    .join('');
}

/**
 * Calcula entropia da senha (bits)
 * Maior = mais forte
 * @param password - Senha a analisar
 * @returns Entropia em bits
 */
export function calculatePasswordEntropy(password: string): number {
  let charsetSize = 0;

  if (/[a-z]/.test(password)) charsetSize += 26; // lowercase
  if (/[A-Z]/.test(password)) charsetSize += 26; // uppercase
  if (/\d/.test(password)) charsetSize += 10; // digits
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32; // symbols (aproximado)

  // Entropia = log2(charsetSize^length)
  return Math.log2(Math.pow(charsetSize, password.length));
}

/**
 * Estima tempo para quebrar senha por brute force
 * Assume 1 bilhão de tentativas por segundo (GPU moderna)
 * @param password - Senha a analisar
 * @returns Descrição do tempo estimado
 */
export function estimateCrackTime(password: string): string {
  const entropy = calculatePasswordEntropy(password);
  const combinations = Math.pow(2, entropy);
  const guessesPerSecond = 1_000_000_000; // 1 bilhão
  const seconds = combinations / guessesPerSecond;

  if (seconds < 1) return 'Menos de 1 segundo';
  if (seconds < 60) return `${Math.round(seconds)} segundos`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutos`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} horas`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} dias`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} meses`;
  if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} anos`;
  
  return 'Mais de 100 anos';
}
