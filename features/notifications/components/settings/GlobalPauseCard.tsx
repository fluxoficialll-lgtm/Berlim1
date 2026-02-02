import React from 'react';

interface GlobalPauseCardProps {
    enabled: boolean;
    onToggle: () => void;
}

export const GlobalPauseCard: React.FC<GlobalPauseCardProps> = ({ enabled, onToggle }) => {
    return (
        <div className="section-card">
            <div className="section-header" onClick={onToggle}>
                <h3>
                    <div className="icon-bg">
                        <i className="fa-solid fa-bell-slash"></i>
                    </div>
                    Notificações
                </h3>
                <label className="switch" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={enabled} onChange={onToggle} />
                    <span className="slider-switch"></span>
                </label>
            </div>
            <div className="px-6 pb-5 -mt-2">
                <p className="text-xs text-gray-500 font-medium">Pausar Tudo</p>
                <p className="text-[11px] text-gray-600 mt-0.5">Desativar temporariamente todos os alertas push no dispositivo.</p>
            </div>
        </div>
    );
};