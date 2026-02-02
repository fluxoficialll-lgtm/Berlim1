
import { Post } from '../../types';
import { db } from '../../database';

export const reelsService = {
  fetchReels: async () => {},
  getReels: (): Post[] => db.posts.getAll().filter(p => p.type === 'video'),
  getReelsByAuthor: (authorId: string) => db.posts.getAll().filter(p => p.type === 'video' && p.authorId === authorId),
  searchReels: (query: string) => {
      const term = query.toLowerCase();
      return db.posts.getAll().filter(p => p.type === 'video' && p.text.toLowerCase().includes(term));
  },
  uploadVideo: async (file: File) => URL.createObjectURL(file),
  addReel: async (reel: Post) => db.posts.add(reel),
  toggleLike: async (id: string) => {
      const p = db.posts.findById(id);
      if (p) {
          p.liked = !p.liked;
          p.likes += p.liked ? 1 : -1;
          db.posts.update(p);
          return p;
      }
  },
  incrementView: (id: string) => {
      const p = db.posts.findById(id);
      if (p) { p.views++; db.posts.update(p); }
  },
  getReelById: (id: string) => db.posts.findById(id)
};
