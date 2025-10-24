/**
 * Utilitários para formatação e validação de CEP
 */

/**
 * Formata o CEP no padrão 12345-678
 */
export function formatCep(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara 12345-678
  if (numbers.length <= 5) {
    return numbers;
  }
  
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
}

/**
 * Remove a formatação do CEP, deixando apenas números
 */
export function cleanCep(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Valida se o CEP tem o formato correto (8 dígitos)
 */
export function isValidCep(value: string): boolean {
  const clean = cleanCep(value);
  return clean.length === 8;
}
