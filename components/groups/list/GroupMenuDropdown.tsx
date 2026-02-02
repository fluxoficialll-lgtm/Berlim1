import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Group } from '../../../types';

interface GroupMenuDropdownProps {
    group: Group;
    isActive: boolean;
    onTracking: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

export const GroupMenuDropdown: React.FC<GroupMenuDropdownProps> = ({ 
    group, 
    isActive, 
    onTracking, 
    onDelete 
}) => {
    const navigate = useNavigate();
    
    if (!isActive) return null;

    return (
        <div className="group-dropdown-container absolute right-2 top-10 z-[100] animate-pop-in">
            <style>{`
                .group-dropdown-card {
                    min-width: 200px;
                    background: rgba(26, 30, 38, 0.95);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 18px;
                    padding: 6px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
                }
                
                .dropdown-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 14px;
                    background: transparent;
                    border: none;
                    border-radius: 12px;
                    color: #efefef;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: left;
                }

                .dropdown-btn:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateX(2px);
                }

                .dropdown-btn:active {
                    transform: scale(0.98);
                }

                .dropdown-btn i {
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: 0.2s;
                }

                .icon-settings { background: rgba(0, 194, 255, 0.1); color: #00c2ff; }
                .icon-preview { background: rgba(255, 215, 0, 0.1); color: #FFD700; }
                .icon-tracking { background: rgba(0, 255, 130, 0.1); color: #00ff82; }
                .icon-delete { background: rgba(255, 77, 77, 0.1); color: #ff4d4d; }

                .dropdown-btn.danger:hover {
                    background: rgba(255, 77, 77, 0.1);
                    color: #ff4d4d;
                }

                .btn-label {
                    flex: 1;
                }

                .shortcut-hint {
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.2);
                    font-weight: 800;
                }
            `}</style>

            <div className="group-dropdown-card" onClick={(e) => e.stopPropagation()}>
                <button className="dropdown-btn" onClick={(e) => { e.stopPropagation(); navigate(`/group-settings/${group.id}`); }}>
                    <i className="fa-solid fa-gear icon-settings"></i>
                    <span className="btn-label">Configurações</span>
                </button>

                {group.isVip && (
                    <button className="dropdown-btn" onClick={(e) => { e.stopPropagation(); navigate(`/vip-group-sales/${group.id}`); }}>
                        <i className="fa-solid fa-eye icon-preview"></i>
                        <span className="btn-label">Preview de Venda</span>
                    </button>
                )}

                <button className="dropdown-btn" onClick={onTracking}>
                    <i className="fa-solid fa-link icon-tracking"></i>
                    <span className="btn-label">Rastreamento</span>
                </button>

                <div className="h-px bg-white/5 my-1 mx-2"></div>

                <button className="dropdown-btn danger" onClick={onDelete}>
                    <i className="fa-solid fa-trash icon-delete"></i>
                    <span className="btn-label">Excluir Grupo</span>
                    <span className="shortcut-hint">PERMANENTE</span>
                </button>
            </div>
        </div>
    );
};