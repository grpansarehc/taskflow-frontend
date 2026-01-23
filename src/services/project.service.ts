import { API_CONFIG } from '../config/api.config';
import type { ProjectRequest, ProjectResponse } from '../types/project.types';

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
  name?: string;
  email?: string;
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
    // Check both localStorage and sessionStorage for auth data
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    console.log("token",token);
    
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'X-User-Id': userId || '',
    };
  }

  /**
   * Get all projects
   */
  async getAllProjects(): Promise<ProjectResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw {
          message: 'Failed to fetch projects',
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
   * Create new project
   */
  async createProject(projectData: ProjectRequest): Promise<ProjectResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Failed to create project' }));
        throw {
          message: errorData.message || 'Failed to create project',
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
