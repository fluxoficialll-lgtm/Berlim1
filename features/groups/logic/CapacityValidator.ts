
import { Group } from '../../../types';

export const CapacityValidator = {
    isFull(group: Group): boolean {
        if (!group.settings?.memberLimit) return false;
        const currentCount = group.memberIds?.length || 0;
        return currentCount >= group.settings.memberLimit;
    },

    getLottationStatus(group: Group): 'available' | 'near_full' | 'full' {
        if (!group.settings?.memberLimit) return 'available';
        const currentCount = group.memberIds?.length || 0;
        const limit = group.settings.memberLimit;
        
        if (currentCount >= limit) return 'full';
        if (currentCount >= limit * 0.9) return 'near_full';
        return 'available';
    }
};
