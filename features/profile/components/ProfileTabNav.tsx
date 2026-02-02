
import React from 'react';

interface ProfileTabNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    hasProducts: boolean;
}

export const ProfileTabNav: React.FC<ProfileTabNavProps> = ({ activeTab, setActiveTab, hasProducts }) => {
    return (
        <nav className="tab-nav">
            <style>{`
                .tab-nav { 
                    display: flex; 
                    border-bottom: 1px solid rgba(255,255,255,0.1); 
                    margin-bottom: 15px; 
                    background: #0c0f14; 
                    position: -webkit-sticky;
                    position: sticky;
                    top: 80px;
                    z-index: 40;
                    box-shadow: 0 10px 20px -10px rgba(0,0,0,0.5);
                }
                .tab-nav button { 
                    flex: 1; 
                    padding: 14px 0; 
                    background: none; 
                    border: none; 
                    color: #888; 
                    font-weight: 600; 
                    cursor: pointer; 
                    border-bottom: 2px solid transparent; 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    gap: 6px; 
                    transition: all 0.2s ease;
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .tab-nav button i { 
                    font-size: 18px; 
                    opacity: 0.4; 
                    transition: 0.2s;
                }
                .tab-nav button.active { 
                    color: #fff; 
                    border-bottom: 2px solid #00c2ff; 
                    background: rgba(0, 194, 255, 0.03);
                }
                .tab-nav button.active i { 
                    opacity: 1; 
                    color: #00c2ff; 
                    transform: translateY(-2px);
                }
                .tab-nav button:active {
                    transform: scale(0.95);
                }
            `}</style>
            
            <button 
                className={activeTab === 'posts' ? 'active' : ''} 
                onClick={() => setActiveTab('posts')}
            >
                <i className="fa-solid fa-list-ul"></i>
                <span>Posts</span>
            </button>
            
            {hasProducts && (
                <button 
                    className={activeTab === 'products' ? 'active' : ''} 
                    onClick={() => setActiveTab('products')}
                >
                    <i className="fa-solid fa-store"></i>
                    <span>Produtos</span>
                </button>
            )}
            
            <button 
                className={activeTab === 'fotos' ? 'active' : ''} 
                onClick={() => setActiveTab('fotos')}
            >
                <i className="fa-solid fa-camera"></i>
                <span>Fotos</span>
            </button>
            
            <button 
                className={activeTab === 'reels' ? 'active' : ''} 
                onClick={() => setActiveTab('reels')}
            >
                <i className="fa-solid fa-video"></i>
                <span>Reels</span>
            </button>
        </nav>
    );
};
