
import { sqlite } from '../engine';

/**
 * BaseManager refatorado para operar sobre o JSON Engine de forma síncrona.
 */
export class BaseManager {
    protected queryAll<T>(table: string): T[] {
        const data = sqlite.getTableData(table);
        return data.map(item => {
            // Se for string (legado do SQLite), tenta parsear, senão retorna o objeto
            if (typeof item.data === 'string') {
                try { return JSON.parse(item.data); } catch { return item.data; }
            }
            return item;
        });
    }

    protected queryOne<T>(table: string, id: string | number): T | undefined {
        const items = this.queryAll<any>(table);
        const found = items.find(i => String(i.id) === String(id));
        return found as T | undefined;
    }

    protected upsert(table: string, id: string | number, data: any, extra?: { timestamp?: number }) {
        const items = this.queryAll<any>(table);
        const index = items.findIndex(i => String(i.id) === String(id));
        
        const newItem = { 
            ...data, 
            id: String(id), 
            timestamp: extra?.timestamp || data.timestamp || Date.now() 
        };

        if (index > -1) {
            items[index] = newItem;
        } else {
            items.push(newItem);
        }

        sqlite.saveTableData(table, items);
    }
}
