
import { Comment } from '../../../types';
import { API_BASE } from '../../../apiConfig';
import { db } from '../../../database';
import { authService } from '../../authService';
import { PostMetricsService } from '../PostMetricsService';

const API_URL = `${API_BASE}/api/posts`;

export const PostCommentService = {
    /**
     * Adiciona um comentário de nível 0.
     */
    async addComment(postId: string, text: string, username: string, avatar?: string): Promise<Comment | undefined> {
        const userId = authService.getCurrentUserId();
        const cleanUsername = username.replace(/^@/, '');
        const newComment: Comment = { 
            id: Date.now().toString(), 
            userId: userId || 'user', 
            text, 
            username: cleanUsername, 
            avatar, 
            timestamp: Date.now(), 
            replies: [] 
        };

        const post = db.posts.findById(postId);
        if (post) {
            post.commentsList = [newComment, ...(post.commentsList || [])];
            PostMetricsService.notifyCommentChange(postId, 1);
            db.posts.update(post);
            
            try {
                fetch(`${API_URL}/${postId}/comment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment: newComment })
                }).catch(() => {});
            } catch (e) {}
            return newComment;
        }
    },

    /**
     * Adiciona uma resposta a um comentário existente (Thread).
     */
    addReply(postId: string, commentId: string, text: string, username: string, avatar?: string): Comment | undefined {
        const post = db.posts.findById(postId);
        const currentUserId = authService.getCurrentUserId();
        if (post && post.commentsList) {
            let rootComment: Comment | undefined;
            let repliedToUser: string | undefined;

            for (const c of post.commentsList) {
                if (c.id === commentId) {
                    rootComment = c;
                    repliedToUser = c.username;
                    break;
                }
                const nested = c.replies?.find(r => r.id === commentId);
                if (nested) {
                    rootComment = c;
                    repliedToUser = nested.username;
                    break;
                }
            }

            if (rootComment) {
                const newReply: Comment = { 
                    id: 'r-' + Date.now(), 
                    userId: currentUserId || 'user', 
                    text, 
                    username: username.replace(/^@/, ''), 
                    avatar, 
                    timestamp: Date.now(),
                    replies: [],
                    replyToUsername: repliedToUser?.replace(/^@/, '')
                };
                rootComment.replies = [...(rootComment.replies || []), newReply];
                PostMetricsService.notifyCommentChange(postId, 1);
                db.posts.update(post);
                
                try {
                    fetch(`${API_URL}/${postId}/reply`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ parentId: rootComment.id, reply: newReply })
                    }).catch(() => {});
                } catch (e) {}
                return newReply;
            }
        }
        return undefined;
    },

    async deleteComment(postId: string, commentId: string): Promise<boolean> {
        const post = db.posts.findById(postId);
        if (post) {
            const removeFromList = (list: Comment[]): Comment[] => {
                return list.filter(c => {
                    if (c.id === commentId) return false;
                    if (c.replies) c.replies = removeFromList(c.replies);
                    return true;
                });
            };
            post.commentsList = removeFromList(post.commentsList || []);
            PostMetricsService.notifyCommentChange(postId, -1);
            db.posts.update(post);
            return true;
        }
        return false;
    },

    toggleCommentLike(postId: string, commentId: string): boolean {
        const post = db.posts.findById(postId);
        if (post && post.commentsList) {
            const updateRecursive = (list: Comment[]) => {
                for (const c of list) {
                    if (c.id === commentId) {
                        c.likedByMe = !c.likedByMe;
                        c.likes = (c.likes || 0) + (c.likedByMe ? 1 : -1);
                        return true;
                    }
                    if (c.replies && updateRecursive(c.replies)) return true;
                }
                return false;
            };
            if (updateRecursive(post.commentsList)) {
                db.posts.update(post);
                return true;
            }
        }
        return false;
    }
};
