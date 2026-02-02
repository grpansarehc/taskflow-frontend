import { API_CONFIG } from '../config/api.config';

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface CommentUser {
    id: string;
    name: string;
    avatar: string; // URL or Initials
}

export interface CommentReaction {
    id?: string;
    userId: string;
    emoji: string;
    count: number;
    userHasReacted: boolean;
}

export interface Comment {
    id: string;
    taskId: string;
    user: CommentUser; // Map from backend userId to full user object
    userId: string;    // Raw userId from backend
    content: string;
    timestamp: string; // ISO string 
    reactions: CommentReaction[];
    replies?: Comment[];
    parentId?: string;
}

export interface CreateCommentRequest {
    taskId: string;
    userId: string;
    content: string;
}

export interface ReplyCommentRequest {
    taskId: string;
    userId: string;
    content: string;
}

export interface ToggleReactionRequest {
    userId: string;
    reactionType: string; // "LIKE", etc.
}

class CommentService {
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
     * Fetch comments for a task
     */
    async getTaskComments(taskId: string): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/comments/task/${taskId}`, {
                method: 'GET',
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                return [];
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch comments", error);
            return [];
        }
    }

    /**
     * Add a new comment
     */
    async addComment(request: CreateCommentRequest): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/comments`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error('Failed to add comment');
        }

        return await response.json();
    }

    /**
     * Reply to a comment
     */
    async replyToComment(commentId: string, request: ReplyCommentRequest): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/comments/${commentId}/reply`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error('Failed to reply to comment');
        }

        return await response.json();
    }

    /**
     * Toggle reaction on a comment
     */
    async toggleReaction(commentId: string, request: ToggleReactionRequest): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/comments/${commentId}/reactions`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error('Failed to toggle reaction');
        }

        // Backend might return updated reaction count or the reaction object
        return await response.json().catch(() => ({}));
    }
}

export const commentService = new CommentService();
export default commentService;
