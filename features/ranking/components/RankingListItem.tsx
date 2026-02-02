
import React from 'react';
import { Group } from '../../../types';

interface RankingListItemProps {
    group: Group;
    rank: number;
    onClick: (group: Group) => void;
    isMember: boolean;
}

export const RankingListItem: React.FC<RankingListItemProps> = ({ group, rank, onClick, isMember }) => {
    return (
        <div className="rank-item" onClick={() => onClick(group)}>
            <div className="rank-number">#{rank}</div>
            <div className="list-cover">
                {group.coverImage ? (
                    <img src={group.coverImage} alt="cover" />
                ) : (
                    <i className={`fa-solid ${group.isVip ? 'fa-crown' : 'fa-users'}`}></i>
                )}
            </div>
            <div className="list-info">
                <span className="list-name">{group.name}</span>
                <span className="list-desc">
                    {((group as any).memberCount || group.memberIds?.length || 0)} membros
                </span>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                {isMember ? (
                    <button className="action-btn open-btn" onClick={() => onClick(group)}>Acessar</button>
                ) : (
                    <button className="action-btn join-btn" onClick={() => onClick(group)}>Explorar</button>
                )}
            </div>
        </div>
    );
};
