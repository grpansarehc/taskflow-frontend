// Kanban Board Type Definitions matching backend DTOs

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskType = 'EPIC' | 'USER_STORY' | 'SUBTASK' | 'BUG';

export interface TaskCard {
  taskId: string;
  title: string;
  description?: string;
  statusId: string;
  position: number;
  priority?: Priority;
  taskType?: TaskType;
  assigneeId?: string;
  projectId?: string;
  dueDate?: string;
  startDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KanbanColumn {
  statusId: string;
  name: string;
  tasks: TaskCard[];
}

export interface KanbanBoard {
  projectId: string;
  columns: KanbanColumn[];
}

export interface MoveTaskRequest {
  statusId: string;
  position: number;
}

export interface WorkflowStatus {
  id: string;
  name: string;
  description?: string;
  position: number;
  projectId: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  taskType: TaskType;
  parentTaskId?: string;
  projectId: string;
  statusId: string;
  assigneeId?: string;
  priority: Priority;
  dueDate?: string;
  startDate?: string;
}
