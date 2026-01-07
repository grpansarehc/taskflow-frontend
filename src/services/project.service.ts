import { API_CONFIG } from '../config/api.config';

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface AddMemberByEmailRequest {
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
}

export interface ProjectMemberResponse {
  id: string;
  userId: string;
  projectId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  status: 'ACTIVE' | 'INVITED' | 'REMOVED';
  joinedAt: string;
}

export interface ApiError {
  message: string;
  status: number;
}

class ProjectService {
  /**
   * Get authorization header with token
   */
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'X-User-Id': userId || '',
    };
  }

  /**
   * Add member to project by email
   */
  async addMemberByEmail(
    projectId: string,
    data: AddMemberByEmailRequest
  ): Promise<ProjectMemberResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/members/by-email`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Failed to add member' }));
        throw {
          message: errorData.message || 'Failed to add member',
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
   * Get all members of a project
   */
  async getProjectMembers(projectId: string): Promise<ProjectMemberResponse[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/members`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw {
          message: 'Failed to fetch project members',
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
   * Remove member from project
   */
  async removeMember(projectId: string, userId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/members/${userId}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw {
          message: 'Failed to remove member',
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

  /**
   * Update member role
   */
  async updateMemberRole(
    projectId: string,
    userId: string,
    role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  ): Promise<ProjectMemberResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/members/${userId}/role?role=${role}`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw {
          message: 'Failed to update member role',
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
}

export const projectService = new ProjectService();
export default projectService;
