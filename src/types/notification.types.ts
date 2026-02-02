// Notification Type Definitions

export type NotificationType = 
  | 'TASK_ASSIGNED'
  | 'TASK_UPDATED'
  | 'TASK_COMMENT'
  | 'PROJECT_MEMBER_ADDED'
  | 'DUE_DATE_REMINDER'
  | 'MENTION';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAt: string;
}

export interface CreateNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface NotificationPreference {
  userId: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  taskAssignments: boolean;
  taskComments: boolean;
  projectUpdates: boolean;
  dueDateReminders: boolean;
  updatedAt?: string;
}

export interface NotificationPreferenceRequest {
  emailNotifications?: boolean;
  inAppNotifications?: boolean;
  taskAssignments?: boolean;
  taskComments?: boolean;
  projectUpdates?: boolean;
  dueDateReminders?: boolean;
}
