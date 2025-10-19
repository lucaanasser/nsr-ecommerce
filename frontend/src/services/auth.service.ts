import api, { ApiResponse } from './api';

// Tipos de autenticação
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  privacyPolicy?: boolean;
  terms?: boolean;
  marketing?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string;
  cpf?: string;
  birthDate?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Serviço de autenticação
export const authService = {
  // Registrar novo usuário
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    
    // Salvar tokens no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data.data;
  },

  // Login
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    
    // Salvar tokens no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data.data;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } finally {
      // Limpar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  },

  // Logout de todas as sessões
  async logoutAll(): Promise<void> {
    try {
      await api.post('/auth/logout-all');
    } finally {
      // Limpar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  },

  // Obter perfil do usuário
  async getProfile(): Promise<AuthUser> {
    const response = await api.get<ApiResponse<{ user: AuthUser }>>('/auth/me');
    return response.data.data.user;
  },

  // Atualizar perfil
  async updateProfile(data: UpdateProfileData): Promise<AuthUser> {
    const response = await api.put<ApiResponse<{ user: AuthUser }>>('/auth/me', data);
    
    // Atualizar usuário no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data.data.user;
  },

  // Mudar senha
  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.put('/auth/change-password', data);
  },

  // Deletar conta permanentemente
  async deleteAccount(password: string): Promise<void> {
    await api.delete('/auth/account', {
      data: { password }
    });
    
    // Limpar dados locais
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Verificar se usuário está autenticado
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  },

  // Obter usuário do localStorage
  getCurrentUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },
};
