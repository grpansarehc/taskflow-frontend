// Project Type Definitions matching backend DTOs

export interface ProjectRequest {
  name: string;
  projectKey: string;
  description?: string;
  type: string;
  ownerId: string;
}

export interface ProjectResponse {
  id: string;
  name: string;
  projectKey: string;
  description?: string;
  type: string;
  ownerId: string;
  createdAt: string;
}

export interface CreateProjectFormData {
  name: string;
  key: string;
  description: string;
  type: string;
}
