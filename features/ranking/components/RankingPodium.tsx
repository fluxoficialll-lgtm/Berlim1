
import React from 'react';
import { Group } from '../../../types';
import { RankingPodiumItem } from './RankingPodiumItem';

interface RankingPodiumProps {
    groups: Group[];
    onGroupClick: (group: Group) => void;
}

export const RankingPodium: React.FC<RankingPodiumProps> = ({ groups, onGroupClick }) => {
    if (groups.length === 0) return null;

    return (
        <div className="top-three-container">
            {/* 2º Lugar */}
            {groups[1] && (
                <RankingPodiumItem 
                    group={groups[1]} 
                    position={2} 
                    onClick={onGroupClick} 
                />
            )}

            {/* 1º Lugar */}
            {groups[0] && (
                <RankingPodiumItem 
                    group={groups[0]} 
                    position={1} 
                    onClick={onGroupClick} 
                />
            )}

            {/* 3º Lugar */}
            {groups[2] && (
                <RankingPodiumItem 
                    group={groups[2]} 
                    position={3} 
                    onClick={onGroupClick} 
                />
            )}
        </div>
    );
};
