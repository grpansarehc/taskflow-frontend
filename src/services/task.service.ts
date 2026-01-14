import { API_CONFIG } from '../config/api.config';
import type { CreateTaskRequest } from '../types/kanban.types';

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}

class TaskService {
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
   * Create a new task
   */
  async createTask(request: CreateTaskRequest): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Failed to create task',
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
   * Get task by ID
   */
  async getTaskById(taskId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Failed to fetch task details',
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
   * Get subtasks by parent task ID
   */
  async getSubtasks(taskId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        // If 404, maybe just return empty list? or throw? 
        // Assuming empty list if no subtasks or just standard error handling
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Failed to fetch subtasks',
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

export const taskService = new TaskService();
export default taskService;
