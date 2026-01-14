import { API_CONFIG } from '../config/api.config';

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
}

class AuthService {
  /**
   * Reset password using token from email
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to reset password' }));
        throw {
          message: errorData.message || 'Failed to reset password',
          status: response.status,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        message: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError;
    }
  }

  /**
   * Request password reset link via email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to send reset link' }));
        throw {
          message: errorData.message || 'Failed to send reset link',
          status: response.status,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        message: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError;
    }
  }

  /**
   * Validate reset token (optional - if backend provides this endpoint)
   */


  /**
   * Change password (requires current password)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // TODO: Implement when backend endpoint is ready
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header when implementing auth
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      throw new Error('Failed to change password');
    }
  }

  /**
   * Logout user - invalidates refresh token on server
   */
  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (token) {
        // Call backend signout endpoint to invalidate refresh token
        await fetch(`${API_BASE_URL}/auth/signout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // Even if API call fails, we still want to clear local storage
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local storage regardless of API success
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('refreshToken');
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string, rememberMe = false): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw {
          message: errorData.message || 'Login failed',
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      
      // Store authentication data in localStorage if rememberMe, otherwise sessionStorage
      if (rememberMe) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userEmail', data.email);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
      } else {
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('userId', data.id);
        sessionStorage.setItem('userEmail', data.email);
        if (data.refreshToken) {
          sessionStorage.setItem('refreshToken', data.refreshToken);
        }
      }
      return data;
      return data;
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        message: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError;
    }
  }

  /**
   * Register new user
   */
  async register(
    data: { name: string; email: string; password: string; department?: string; designation?: string },
    rememberMe = true
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        throw {
          message: errorData.message || 'Registration failed',
          status: response.status,
        } as ApiError;
      }

      const resData = await response.json();

      // If backend returns authentication data, store it (rememberMe decides storage)
      if (resData?.token) {
        if (rememberMe) {
          localStorage.setItem('authToken', resData.token);
          if (resData.id) localStorage.setItem('userId', resData.id);
          if (resData.email) localStorage.setItem('userEmail', resData.email);
          if (resData.refreshToken) localStorage.setItem('refreshToken', resData.refreshToken);
        } else {
          sessionStorage.setItem('authToken', resData.token);
          if (resData.id) sessionStorage.setItem('userId', resData.id);
          if (resData.email) sessionStorage.setItem('userEmail', resData.email);
          if (resData.refreshToken) sessionStorage.setItem('refreshToken', resData.refreshToken);
        }
      }
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        message: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError;
    }
  }
}

export const authService = new AuthService();
export default authService;
