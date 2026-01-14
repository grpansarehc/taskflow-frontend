import { API_CONFIG } from '../config/api.config';
import type { KanbanBoard, MoveTaskRequest } from '../types/kanban.types';

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface ApiError {
  message: string;
  status: number;
}

class KanbanService {
  /**
   * Get authorization header with token
   */
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'X-User-Id': userId || '',
    };
  }

  /**
   * Get Kanban board for a project
   */
  async getKanbanBoard(projectId: string): Promise<KanbanBoard> {
    try {
      const response = await fetch(`${API_BASE_URL}/kanban/projects/${projectId}/board`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw {
          message: 'Failed to fetch Kanban board',
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
   * Move task to a new status/position
   */
  async moveTask(taskId: string, request: MoveTaskRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/kanban/tasks/${taskId}/move`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Failed to move task' }));
        throw {
          message: errorData.message || 'Failed to move task',
          status: response.status,
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
}

export const kanbanService = new KanbanService();
export default kanbanService;
