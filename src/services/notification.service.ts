import { API_CONFIG } from '../config/api.config';
import type { Notification, NotificationPreference, NotificationPreferenceRequest } from '../types/notification.types';

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}

class NotificationService {
  /**
   * Get authorization header with token
   */
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'X-User-Id': userId || '',
      'X-User-Email': userEmail || ''
    };
  }

  /**
   * Get all notifications for current user
   */
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Failed to fetch notifications',
          status: response.status,
          errors: errorData.errors
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
   * Get unread notifications
   */
  async getUnreadNotifications(): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/unread`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Failed to fetch unread notifications',
          status: response.status,
          errors: errorData.errors
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
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/count`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Failed to fetch unread count',
          status: response.status,
          errors: errorData.errors
        } as ApiError;
      }

      const data = await response.json();
      return data.unreadCount || 0;
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      return 0; // Return 0 on error
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Failed to mark notification as read',
          status: response.status,
          errors: errorData.errors
        } as ApiError;
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

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Failed to mark all as read',
          status: response.status,
          errors: errorData.errors
        } as ApiError;
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

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Failed to delete notification',
          status: response.status,
          errors: errorData.errors
        } as ApiError;
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

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<NotificationPreference> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/preferences`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Failed to fetch preferences',
          status: response.status,
          errors: errorData.errors
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
   * Update notification preferences
   */
  async updatePreferences(preferences: NotificationPreferenceRequest): Promise<NotificationPreference> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/preferences`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Failed to update preferences',
          status: response.status,
          errors: errorData.errors
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
}

export const notificationService = new NotificationService();
export default notificationService;
