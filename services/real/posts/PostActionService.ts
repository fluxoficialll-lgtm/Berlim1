
import { Post } from '../../../types';
import { API_BASE } from '../../../apiConfig';
import { db } from '../../../database';
import { PostUtils } from './PostUtils';

const API_URL = `${API_BASE}/api/posts`;

export const PostActionService = {
    async uploadMedia(file: File, folder: string = 'feed'): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        return data.files[0].url;
    },

    async addPost(post: Post): Promise<void> {
        try {
            const res = await fetch(`${API_URL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(post)
            });
            if (res.ok) {
                const data = await res.json();
                if (data.post) post = data.post;
            }
        } catch (e) {}
        db.posts.add(PostUtils.sanitizePost(post));
    },

    async deletePost(id: string): Promise<void> {
        db.posts.delete(id);
        try { 
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' }); 
        } catch(e) {}
    }
};
