
import { BaseManager } from './BaseManager';
import { Post } from '../../types';
import { sqlite } from '../engine';

export class PostManager extends BaseManager {
    private table = 'posts';

    public getAll(): Post[] {
        return this.queryAll<Post>(this.table).sort((a, b) => b.timestamp - a.timestamp);
    }

    public getCursorPaginated(limit: number, cursor?: number): Post[] {
        let items = this.getAll();
        // Filtra apenas posts que não são Ads para o feed orgânico inicial
        const organic = items.filter(p => !p.isAd);
        if (cursor) {
            return organic.filter(i => i.timestamp < cursor).slice(0, limit);
        }
        return organic.slice(0, limit);
    }

    public saveAll(data: Post[]): void {
        data.forEach(p => this.add(p));
    }

    public add(post: Post): void {
        this.upsert(this.table, post.id, post, { timestamp: post.timestamp });
    }

    public update(post: Post): void {
        this.add(post);
    }

    public delete(id: string): void {
        const items = this.queryAll<any>(this.table).filter(i => String(i.id) !== String(id));
        sqlite.saveTableData(this.table, items);
    }

    public findById(id: string): Post | undefined {
        return this.queryOne<Post>(this.table, id);
    }
}
