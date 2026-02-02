
import { Group } from '../../../types';
import { db } from '@/database';
import { authService } from '../../authService';
import { API_BASE } from '../../../apiConfig';
import { ValidationRules } from '../../../constants/ValidationRules';
import { StructurePolicy } from '../../policy/StructurePolicy';

const API_URL = `${API_BASE}/api/groups`;

export const GroupCore = {
    async fetchGroups(): Promise<Group[]> {
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                const data = await response.json();
                const groups = data.data || [];
                db.groups.saveAll(groups);
                return groups;
            }
        } catch (e) {
            console.error("Fetch groups failed", e);
        }
        return db.groups.getAll();
    },

    getGroupsSync(): Group[] {
        return db.groups.getAll().sort((a, b) => {
            const timeA = new Date(a.updated_at || a.created_at || 0).getTime();
            const timeB = new Date(b.updated_at || b.created_at || 0).getTime();
            return timeB - timeA;
        });
    },

    getGroupsPaginated(offset: number, limit: number) {
        const currentId = authService.getCurrentUserId();
        const all = db.groups.getAll();
        const myGroups = all.filter(g => 
            g.memberIds?.includes(currentId || '') || g.creatorId === currentId
        ).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        return { 
            groups: myGroups.slice(offset, offset + limit), 
            hasMore: offset + limit < myGroups.length 
        };
    },

    getGroupById: (id: string) => db.groups.findById(id),

    async fetchGroupById(id: string) {
        try {
            const res = await fetch(`${API_URL}/${id}`);
            if (res.ok) {
                const data = await res.json();
                if (data.group) {
                    db.groups.update(data.group);
                    return data.group;
                }
            }
        } catch (e) {
            console.error("Fetch specific group failed", e);
        }
        return db.groups.findById(id);
    },

    async createGroup(group: Group) {
        const userId = authService.getCurrentUserId();
        if (userId) group.creatorId = userId;
        
        // Validação de Preço Unificada
        if (group.isVip) {
            const price = parseFloat(group.price || '0');
            if (isNaN(price) || price < ValidationRules.MIN_VIP_PRICE) {
                throw new Error(`O preço mínimo para grupos VIP é R$ ${ValidationRules.MIN_VIP_PRICE.toFixed(2)}.`);
            }
        }

        // Aplicação de política estrutural
        const normalizedGroup = StructurePolicy.applyExclusivity(group);
        normalizedGroup.updated_at = new Date().toISOString();
        normalizedGroup.timestamp = Date.now();
        normalizedGroup.memberCount = group.memberIds?.length || 1; 

        db.groups.add(normalizedGroup);

        try {
            await fetch(`${API_URL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(normalizedGroup)
            });
        } catch (e) {
            console.error("Server group creation failed", e);
        }
    },

    async updateGroup(group: Group) {
        const existingGroup = db.groups.findById(group.id);
        
        if (group.isVip || (existingGroup && existingGroup.isVip)) {
            const price = parseFloat(group.price || existingGroup?.price || '0');
            if (isNaN(price) || price < ValidationRules.MIN_VIP_PRICE) {
                throw new Error(`O preço mínimo para grupos VIP é R$ ${ValidationRules.MIN_VIP_PRICE.toFixed(2)}.`);
            }
        }

        // Aplicação de política estrutural na atualização
        let mergedGroup = { ...existingGroup, ...group };
        mergedGroup = StructurePolicy.applyExclusivity(mergedGroup);
        mergedGroup.updated_at = new Date().toISOString();

        if (mergedGroup.memberIds) {
            mergedGroup.memberCount = mergedGroup.memberIds.length;
        }

        db.groups.update(mergedGroup);

        try {
            await fetch(`${API_URL}/${group.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mergedGroup)
            });
        } catch (e) {
            console.error("Server group update failed", e);
        }
    },

    async deleteGroup(id: string) {
        db.groups.delete(id);
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        } catch (e) {
            console.error("Server group delete failed", e);
        }
    }
};
