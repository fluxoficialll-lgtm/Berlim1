
import { Post, User } from '../../../types';
import { db } from '../../../database';
import { ScoredItem, EngineContext } from '../types';

export class FeedEngine {
    private static WEIGHTS = {
        FOLLOW_BONUS: 5000,
        RECENCY_BASE: 2000,
        ENGAGEMENT_MULTIPLIER: 150,
        DECAY_FACTOR: 1.8
    };

    public static rank(posts: Post[], context: EngineContext): Post[] {
        const now = Date.now();
        const relationships = db.relationships.getAll();
        const myFollowing = context.user ? 
            relationships.filter(r => r.followerId === context.user?.id && r.status === 'accepted').map(r => r.followingId) : 
            [];

        const scored = posts.map(post => {
            let score = 1000;

            // 1. Relacionamento (Social Graph)
            if (myFollowing.includes(post.authorId)) {
                score += this.WEIGHTS.FOLLOW_BONUS;
            }

            // 2. Recência (Time Decay)
            const ageHours = Math.max(0, (now - post.timestamp) / (1000 * 60 * 60));
            score += this.WEIGHTS.RECENCY_BASE / Math.pow(ageHours + 1, this.WEIGHTS.DECAY_FACTOR);

            // 3. Engajamento Social
            const interactions = (post.likes * 2) + (post.comments * 5);
            score += interactions * this.WEIGHTS.ENGAGEMENT_MULTIPLIER;

            return { item: post, score };
        });

        return scored.sort((a, b) => b.score - a.score).map(s => s.item);
    }
}
