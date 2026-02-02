
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationItem } from '../../../types';
import { postService } from '../../../services/postService';

interface ExpiringVipNotificationCardProps {
    notif: NotificationItem;
    onIgnore: (id: number) => void;
    onPay: (groupId: string) => void;
}

export const ExpiringVipNotificationCard: React.FC<ExpiringVipNotificationCardProps> = ({ notif, onIgnore, onPay }) => {
    const navigate = useNavigate();

    const handlePayClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (notif.groupId) {
            onPay(notif.groupId);
        }
    };

    const handleContainerClick = () => {
        if (notif.groupId) {
            navigate(`/vip-group-sales/${notif.groupId}`);
        }
    };

    return (
        <div 
            className="notification-item-vip" 
            onClick={handleContainerClick}
        >
            <style>{`
                .notification-item-vip { 
                    display: flex; 
                    align-items: center; 
                    padding: 12px 10px; 
                    margin-bottom: 8px; 
                    border-bottom: 1px solid rgba(255,255,255,0.1); 
                    transition: background 0.2s; 
                    cursor: pointer; 
                    border-radius: 8px;
                    background: rgba(255, 215, 0, 0.05);
                    border-left: 5px solid #FFD700;
                }
                .notification-item-vip:hover { background: rgba(255, 215, 0, 0.08); }
                
                .notification-avatar-vip { 
                    width: 48px; 
                    height: 48px; 
                    border-radius: 50%; 
                    object-fit: cover; 
                    margin-right: 12px; 
                    border: 2px solid #FFD700; 
                    flex-shrink: 0;
                }

                .notification-content-vip { 
                    flex-grow: 1; 
                    display: flex; 
                    flex-direction: column; 
                    min-width: 0; 
                }
                
                .notification-text-vip { 
                    font-size: 14px; 
                    line-height: 1.4; 
                    color: #eee; 
                }

                .notification-meta-vip {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 4px;
                }

                .notification-time-vip { 
                    font-size: 11px; 
                    color: #FFD700; 
                    font-weight: 700;
                    text-transform: uppercase;
                }
                
                .notification-relative-vip {
                    font-size: 11px;
                    color: #555;
                    font-weight: 600;
                }

                .notification-action-vip { 
                    margin-left: 10px; 
                    display: flex; 
                    gap: 6px; 
                    align-items: center; 
                }

                .action-button-vip { 
                    background: #00c2ff; 
                    color: #000; 
                    border: none; 
                    padding: 8px 14px; 
                    border-radius: 20px; 
                    cursor: pointer; 
                    font-weight: 800; 
                    transition: 0.3s; 
                    font-size: 11px; 
                    text-transform: uppercase;
                }
                
                .action-button-vip.primary { 
                    background: #00ff82; 
                }
                
                .action-button-vip.secondary { 
                    background: rgba(255,255,255,0.1); 
                    color: #fff; 
                }
                
                .action-button-vip:active {
                    transform: scale(0.95);
                }
            `}</style>

            <img src={notif.avatar} className="notification-avatar-vip" alt="VIP" />
            
            <div className="notification-content-vip">
                <p className="notification-text-vip">
                    Sua assinatura no grupo <b className="font-bold text-white">"{notif.text}"</b> expira em breve.
                </p>
                <div className="notification-meta-vip">
                    <span className="notification-time-vip">{notif.time}</span>
                    <span className="text-gray-700 text-[10px]">•</span>
                    <span className="notification-relative-vip">{postService.formatRelativeTime(notif.timestamp)}</span>
                </div>
            </div>

            <div className="notification-action-vip">
                <button className="action-button-vip primary" onClick={handlePayClick}>
                    Pagar
                </button>
                <button className="action-button-vip secondary" onClick={(e) => { e.stopPropagation(); onIgnore(notif.id); }}>
                    Ignorar
                </button>
            </div>
        </div>
    );
};
