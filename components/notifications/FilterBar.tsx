
import React from 'react';

interface FilterBarProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ activeFilter, onFilterChange }) => {
    const filters = [
        { id: 'all', label: 'Todos' },
        { id: 'like', label: 'Curtidas' },
        { id: 'comment', label: 'Comentários' },
        { id: 'follow', label: 'Seguidores' },
        { id: 'mention', label: 'Menções' },
        { id: 'sale', label: 'Venda Realizada' },
        { id: 'pending', label: 'Pendentes' }
    ];

    return (
        <div id="filterButtons">
            <style>{`
                #filterButtons { 
                    display: flex; 
                    flex-wrap: nowrap; 
                    gap: 8px; 
                    position: fixed; 
                    top: 80px; 
                    left: 0; 
                    width: 100%; 
                    padding: 10px 16px; 
                    background: #0c0f14; 
                    z-index: 10; 
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3); 
                    overflow-x: auto; 
                    -webkit-overflow-scrolling: touch; 
                    scrollbar-width: none; 
                    border-bottom: 1px solid rgba(255,255,255,0.1); 
                }
                #filterButtons::-webkit-scrollbar { display: none; }
                .filter-btn { 
                    background: rgba(0,194,255,0.1); 
                    border: 1px solid #00c2ff; 
                    border-radius: 20px; 
                    color: #00c2ff; 
                    padding: 8px 16px; 
                    cursor: pointer; 
                    font-size: 14px; 
                    font-weight: 600; 
                    transition: 0.3s; 
                    white-space: nowrap; 
                }
                .filter-btn.active { background: #00c2ff; color: #000; transform: translateY(-1px); }
                .filter-btn:hover:not(.active) { background: rgba(0,194,255,0.2); }
            `}</style>
            {filters.map(f => (
                <button 
                    key={f.id}
                    className={`filter-btn ${activeFilter === f.id ? 'active' : ''}`} 
                    onClick={() => onFilterChange(f.id)}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
};
