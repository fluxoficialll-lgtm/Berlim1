
import { BaseManager } from './BaseManager';
import { Group } from '../../types';
import { sqlite } from '../engine';

export class GroupManager extends BaseManager {
    private table = 'groups';

    public getAll(): Group[] {
        return this.queryAll<Group>(this.table);
    }

    public saveAll(data: Group[]): void {
        data.forEach(g => this.add(g));
    }

    public add(group: Group): void {
        this.upsert(this.table, group.id, group);
    }

    public update(group: Group): void {
        this.add(group);
    }

    // Fix: Replaced sqlite.run with local storage filtering since JSONEngine doesn't support run()
    public delete(id: string): void {
        const items = this.queryAll<any>(this.table).filter(i => String(i.id) !== String(id));
        sqlite.saveTableData(this.table, items);
    }

    public findById(id: string): Group | undefined {
        return this.queryOne<Group>(this.table, id);
    }
}