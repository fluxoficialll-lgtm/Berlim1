
import React from 'react';
import { Group } from '../../../types';

interface RankingPodiumItemProps {
    group: Group;
    position: 1 | 2 | 3;
    onClick: (group: Group) => void;
}

export const RankingPodiumItem: React.FC<RankingPodiumItemProps> = ({ group, position, onClick }) => {
    const getPlaceClass = () => {
        if (position === 1) return 'first-place';
        if (position === 2) return 'second-place';
        return 'third-place';
    };

    return (
        <div className={`podium-item ${getPlaceClass()}`} onClick={() => onClick(group)}>
            <div className="podium-cover-wrapper">
                <i className="fa-solid fa-crown crown-icon"></i>
                <div className="podium-cover">
                    {group.coverImage ? (
                        <img src={group.coverImage} alt={group.name} />
                    ) : (
                        <i className={`fa-solid ${group.isVip ? 'fa-crown' : 'fa-users'}`}></i>
                    )}
                </div>
                <div className="rank-badge">{position}</div>
            </div>
            <div className="podium-name">{group.name}</div>
            <div className="podium-count">{(group as any).memberCount || group.memberIds?.length || 0} membros</div>
        </div>
    );
};
