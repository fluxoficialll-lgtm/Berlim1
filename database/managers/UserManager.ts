
import { BaseManager } from './BaseManager';
import { User } from '../../types';

export class UserManager extends BaseManager {
    private table = 'users';

    public getAll(): Record<string, User> {
        return this.queryAll<User>(this.table).reduce((acc, u) => { 
            acc[u.id] = u; 
            return acc; 
        }, {} as Record<string, User>);
    }

    public get(id: string): User | undefined {
        return this.queryOne<User>(this.table, id);
    }

    public set(user: User): void {
        this.upsert(this.table, user.id, user);
    }
}
