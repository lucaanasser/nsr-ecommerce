import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base API URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Criar instância do axios
export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Buscar token do localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Se o erro for 401 (não autorizado) e ainda não tentamos refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentar renovar o token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;

          // Salvar novo token
          localStorage.setItem('accessToken', accessToken);

          // Atualizar header da requisição original
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          // Retentar requisição original
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Se falhar o refresh, limpar tokens e redirecionar para login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Tipos para respostas
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  error?: string;
  details?: Array<{ field: string; message: string }> | Record<string, unknown>;
  statusCode: number;
}

/**
 * Extrai mensagem de erro da resposta da API
 * Suporta diferentes formatos de erro do backend
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    
    // Se tem mensagem específica, usa ela
    if (apiError?.message) {
      return apiError.message;
    }
    
    // Se tem detalhes de validação (array)
    if (apiError?.details && Array.isArray(apiError.details)) {
      const firstError = apiError.details[0];
      if (firstError?.message) {
        return firstError.message;
      }
    }
    
    // Mensagens de erro de rede
    if (error.code === 'ERR_NETWORK') {
      return 'Erro de conexão. Verifique sua internet.';
    }
    
    if (error.code === 'ECONNABORTED') {
      return 'Tempo de conexão esgotado. Tente novamente.';
    }
    
    // Mensagem genérica do axios
    return error.message || 'Erro ao conectar com o servidor';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Erro desconhecido';
};

/**
 * Formata detalhes de erro de validação em uma string legível
 */
export const formatValidationErrors = (details?: Array<{ field: string; message: string }>): string => {
  if (!details || !Array.isArray(details) || details.length === 0) {
    return '';
  }
  
  if (details.length === 1) {
    return details[0].message;
  }
  
  return details.map(d => `• ${d.message}`).join('\n');
};

export default api;
