
import { BaseManager } from './BaseManager';
import { NotificationItem } from '../../types';
import { sqlite } from '../engine';

export class NotificationManager extends BaseManager {
    private table = 'notifications';

    public getAll(): NotificationItem[] {
        return this.queryAll<NotificationItem>(this.table);
    }

    public add(item: NotificationItem): void {
        this.upsert(this.table, item.id, item, { timestamp: item.timestamp });
    }

    // Fix: Replaced sqlite.run with local storage filtering since JSONEngine doesn't support run()
    public delete(id: number): void {
        const items = this.queryAll<any>(this.table).filter(i => String(i.id) !== String(id));
        sqlite.saveTableData(this.table, items);
    }
}