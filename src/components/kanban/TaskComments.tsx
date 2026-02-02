import React, { useState, useEffect } from 'react';
import {
    Send,
    ThumbsUp,
    MessageSquare,
    Smile,
    CornerDownRight
} from 'lucide-react';
import { commentService } from '../../services/comment.service';
import type { Comment } from '../../services/comment.service';
import { taskService } from '../../services/task.service';
import { useToast } from '../common/ToastProvider';

// User info cache to avoid redundant API calls
const userCache: Record<string, { name: string; avatar: string }> = {};

interface TaskCommentsProps {
    taskId: string;
}

const CommentCard: React.FC<{
    comment: Comment;
    isReply?: boolean;
    onReply: (parentId: string, content: string) => void;
    onReact: (commentId: string) => void;
}> = ({ comment, isReply = false, onReply, onReact }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');

    // Get current user avatar for reply input
    const currentUserAvatar = localStorage.getItem('userAvatar') || `https://ui-avatars.com/api/?name=You&background=random`;

    const handleSendReply = () => {
        if (!replyText.trim()) return;
        onReply(comment.id, replyText);
        setReplyText('');
        setIsReplying(false);
    };

    return (
        <div className={`flex gap-3 group ${isReply ? 'mt-4' : 'mb-6'}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
                <img
                    src={comment.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.name || 'User')}&background=random`}
                    alt={comment.user?.name || 'User'}
                    className={`${isReply ? 'w-6 h-6' : 'w-8 h-8'} rounded-full object-cover border border-gray-100 shadow-sm`}
                />
            </div>

            {/* Content Body */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">{comment.user?.name || 'Unknown User'}</span>
                    <span className="text-xs text-gray-400">
                        {comment.timestamp ? new Date(comment.timestamp).toLocaleString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        }) : ''}
                    </span>
                </div>

                <div className="text-sm text-gray-800 leading-relaxed mb-2 whitespace-pre-wrap">
                    {comment.content}
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onReact(comment.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors group/reaction"
                    >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Like</span>
                    </button>

                    <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply</span>
                    </button>

                    {/* Existing Reactions */}
                    {comment.reactions && comment.reactions.length > 0 && (
                        <div className="flex gap-1 ml-2">
                            {comment.reactions.map((reaction, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => onReact(comment.id)}
                                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] border cursor-pointer transition-colors ${reaction.userHasReacted
                                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    <span>{reaction.emoji}</span>
                                    <span className="font-semibold">{reaction.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reply Input Box (Inline) */}
                {isReplying && (
                    <div className="mt-3 flex gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                        <img
                            src={currentUserAvatar}
                            alt="You"
                            className="w-6 h-6 rounded-full border border-gray-100"
                        />
                        <div className="flex-1">
                            <div className="relative">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="w-full min-h-[60px] p-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                    autoFocus
                                />
                                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                                    <button
                                        onClick={() => setIsReplying(false)}
                                        className="text-xs font-medium text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSendReply}
                                        disabled={!replyText.trim()}
                                        className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                    >
                                        <CornerDownRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-100">
                        {comment.replies.map(reply => (
                            <CommentCard
                                key={reply.id}
                                comment={reply}
                                isReply={true}
                                onReply={onReply}
                                onReact={onReact}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId }) => {
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentUserName, setCurrentUserName] = useState<string>('You');
    const { addToast } = useToast();

    // Get current user info from storage
    const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId') || '';
    const currentUserAvatar = localStorage.getItem('userAvatar') || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName)}&background=random`;

    // Fetch current user details to get their actual name
    useEffect(() => {
        const fetchCurrentUserInfo = async () => {
            if (!currentUserId) return;
            try {
                const user = await taskService.getUserById(currentUserId);
                if (user) {
                    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
                    const name = fullName || user.username || user.name || user.email || 'You';
                    setCurrentUserName(name);

                    // Add to cache
                    userCache[currentUserId] = {
                        name,
                        avatar: currentUserAvatar
                    };
                }
            } catch (error) {
                console.error("Failed to fetch current user info", error);
            }
        };
        fetchCurrentUserInfo();
    }, [currentUserId]);

    const resolveUser = async (userId: string, existingUser?: any) => {
        if (!userId) return { name: 'Unknown User', avatar: '' };

        // Check cache first
        if (userCache[userId]) return userCache[userId];

        // If existing user already has a valid name, use it and cache it
        if (existingUser && existingUser.name && existingUser.name !== 'Unknown User') {
            const data = {
                name: existingUser.name,
                avatar: existingUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(existingUser.name)}&background=random`
            };
            userCache[userId] = data;
            return data;
        }

        // Otherwise fetch from API
        try {
            const user = await taskService.getUserById(userId);
            if (user) {
                const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
                const name = fullName || user.username || user.name || user.email || 'Unknown User';
                const avatar = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
                const data = { name, avatar };
                userCache[userId] = data;
                return data;
            }
        } catch (error) {
            console.error(`Failed to fetch user info for ${userId}`, error);
        }

        return { name: 'Unknown User', avatar: '' };
    };

    const fetchComments = React.useCallback(async () => {
        if (!taskId) return;
        setLoading(true);
        try {
            const data = await commentService.getTaskComments(taskId);

            // Enrich comments with user info if missing
            const enrichedComments = await Promise.all(data.map(async (comment: Comment) => {
                const resolvedUser = await resolveUser(comment.userId, comment.user);

                // If comment has replies, resolve those too
                let resolvedReplies = comment.replies;
                if (comment.replies && comment.replies.length > 0) {
                    resolvedReplies = await Promise.all(comment.replies.map(async (reply: Comment) => {
                        const resolvedReplyUser = await resolveUser(reply.userId, reply.user);
                        return { ...reply, user: { ...reply.user, ...resolvedReplyUser } };
                    }));
                }

                return {
                    ...comment,
                    user: { ...comment.user, ...resolvedUser },
                    replies: resolvedReplies
                };
            }));

            setComments(enrichedComments);
        } catch (error) {
            console.error(error);
            addToast({ message: "Failed to load comments", type: "error" });
        } finally {
            setLoading(false);
        }
    }, [taskId, addToast]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleAddComment = async () => {
        if (!commentText.trim() || !currentUserId) return;

        try {
            await commentService.addComment({
                taskId,
                userId: currentUserId,
                content: commentText
            });

            // Backend should return the created comment. 
            // If backend returns just ID or partial, we might need to conform it or re-fetch.
            // Optimistically adding for now assuming backend returns full object or compatible structure
            // If backend doesn't return the populated user object, we might need to patch it locally for display

            // Re-fetch to be safe and get consistent state, or append if confident in response structure
            // setComments([newComment, ...comments]);
            fetchComments();
            setCommentText('');
        } catch (error) {
            console.error(error);
            addToast({ message: "Failed to add comment", type: "error" });
        }
    };

    const handleReply = async (parentId: string, content: string) => {
        if (!currentUserId) return;
        try {
            await commentService.replyToComment(parentId, {
                taskId,
                userId: currentUserId,
                content
            });
            fetchComments(); // Refresh to show nested reply
        } catch (error) {
            console.error(error);
            addToast({ message: "Failed to reply", type: "error" });
        }
    };

    const handleReact = async (commentId: string) => {
        if (!currentUserId) return;
        try {
            // Optimistic update could go here for better UX
            await commentService.toggleReaction(commentId, {
                userId: currentUserId,
                reactionType: 'LIKE'
            });
            fetchComments(); // Refresh to update counts
        } catch (error) {
            console.error(error);
            // No toast for reaction failure usually, just log
        }
    };

    if (loading && comments.length === 0) {
        return <div className="p-4 text-center text-gray-500 text-sm">Loading comments...</div>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    Comments
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {comments.reduce((acc, curr) => acc + 1 + (curr.replies?.length || 0), 0)}
                    </span>
                </h3>
            </div>

            {/* Add Comment Input */}
            <div className="flex gap-4 mb-8">
                <div className="flex-shrink-0">
                    <img
                        src={currentUserAvatar}
                        alt="Current User"
                        className="w-8 h-8 rounded-full border border-gray-200"
                    />
                </div>
                <div className="flex-1">
                    <div className="relative group">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full min-h-[80px] p-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none shadow-sm hover:border-gray-300"
                        />
                        <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-100 transition-opacity">
                            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                                <Smile className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleAddComment}
                                disabled={!commentText.trim()}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <span>Send</span>
                                <Send className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-2">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                ) : (
                    comments.map(comment => (
                        <CommentCard
                            key={comment.id}
                            comment={comment}
                            onReply={handleReply}
                            onReact={handleReact}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskComments;
