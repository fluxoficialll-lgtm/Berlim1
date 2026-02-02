
import React from 'react';
import { CapacityValidator } from '../../../features/groups/logic/CapacityValidator';
import { Group } from '../../../types';

interface GroupCapacityBadgeProps {
    group: Group;
}

export const GroupCapacityBadge: React.FC<GroupCapacityBadgeProps> = ({ group }) => {
    const status = CapacityValidator.getLottationStatus(group);
    const count = group.memberIds?.length || 0;
    const limit = group.settings?.memberLimit;

    if (!limit) return null;

    if (status === 'full') {
        return (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                <i className="fa-solid fa-circle-exclamation"></i> ESGOTADO ({count}/{limit})
            </div>
        );
    }

    if (status === 'near_full') {
        return (
            <div className="bg-orange-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                <i className="fa-solid fa-fire"></i> ÚLTIMAS VAGAS ({count}/{limit})
            </div>
        );
    }

    return (
        <div className="bg-white/10 text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
            {count}/{limit} vagas preenchidas
        </div>
    );
};
