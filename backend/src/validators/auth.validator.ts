import { z } from 'zod';

/**
 * Valida formato de email
 */
const emailSchema = z
  .string()
  .email('Email inválido')
  .toLowerCase()
  .trim()
  .max(255, 'Email muito longo');

/**
 * Valida senha forte
 * - Mínimo 8 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 letra minúscula
 * - Pelo menos 1 número
 */
const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .max(128, 'A senha deve ter no máximo 128 caracteres')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra MAIÚSCULA')
  .regex(/\d/, 'A senha deve conter pelo menos um número');

/**
 * Valida nome
 */
const nameSchema = z
  .string()
  .min(2, 'Nome deve ter no mínimo 2 caracteres')
  .max(100, 'Nome deve ter no máximo 100 caracteres')
  .trim()
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos');

/**
 * Valida telefone brasileiro
 * Formatos aceitos: (11) 98765-4321, 11987654321, +5511987654321
 */
const phoneSchema = z
  .string()
  .regex(
    /^(\+55\s?)?(\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}$/,
    'Telefone inválido. Use formato: (11) 98765-4321'
  )
  .transform((phone) => {
    // Remove caracteres não numéricos exceto +
    return phone.replace(/[^\d+]/g, '');
  })
  .optional();

/**
 * Valida CPF brasileiro
 * Aplica algoritmo de validação de dígitos verificadores
 */
function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');

  // CPF deve ter 11 dígitos
  if (cpf.length !== 11) return false;

  // Rejeita CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
}

const cpfSchema = z
  .string()
  .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido. Use formato: 123.456.789-10')
  .transform((cpf) => cpf.replace(/[^\d]/g, '')) // Remove pontos e traços
  .refine((cpf) => validateCPF(cpf), 'CPF inválido')
  .optional();

/**
 * Schema de validação para registro de usuário
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  phone: phoneSchema,
  cpf: cpfSchema,
});

/**
 * Schema de validação para login
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
});

/**
 * Schema de validação para refresh token
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

/**
 * Schema de validação para atualização de perfil
 */
export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema,
  cpf: cpfSchema,
});

/**
 * Schema de validação para mudança de senha
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: passwordSchema,
});

/**
 * Schema de validação para reset de senha (request)
 */
export const requestPasswordResetSchema = z.object({
  email: emailSchema,
});

/**
 * Schema de validação para reset de senha (confirm)
 */
export const confirmPasswordResetSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  newPassword: passwordSchema,
});

/**
 * Tipos inferidos dos schemas (para TypeScript)
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;
export type ConfirmPasswordResetInput = z.infer<typeof confirmPasswordResetSchema>;
