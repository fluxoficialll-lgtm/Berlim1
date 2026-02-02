
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Group } from '../../../../types';

interface OwnerControlsProps {
    group: Group;
}

export const OwnerControls: React.FC<OwnerControlsProps> = ({ group }) => {
    const navigate = useNavigate();

    return (
        <div className="owner-controls">
            <button 
                className="ctrl-btn" 
                onClick={() => navigate(`/group-settings/${group.id}`)} 
                title="Configurações"
            >
                <i className="fa-solid fa-gear"></i>
            </button>
        </div>
    );
};
