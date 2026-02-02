
import React from 'react';
import { NotificationItem } from '../../types';
import { postService } from '../../services/postService';

interface NotificationCardProps {
    notif: NotificationItem & { displayName?: string };
    onFollowToggle: (id: number, username: string) => void;
    onPendingAction: (action: 'accept' | 'reject', notification: any) => void;
    onNavigate: (path: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ 
    notif, 
    onFollowToggle, 
    onPendingAction, 
    onNavigate 
}) => {
    return (
        <div 
            className={`notification-item ${notif.type === 'sale' ? 'notification-sale' : ''} ${notif.type === 'pending' ? 'notification-pending' : ''}`} 
            onClick={() => notif.type !== 'pending' && onNavigate(`/user/${notif.username.replace('@','')}`)}
        >
            <style>{`
                .notification-item { display: flex; align-items: center; padding: 12px 0; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); transition: background 0.2s; cursor: pointer; border-radius: 8px; }
                .notification-item:hover { background: rgba(255,255,255,0.05); }
                .notification-sale { background: rgba(0, 255, 130, 0.05); border-left: 5px solid #00ff82; padding-left: 7px; }
                .notification-pending { border-left: 5px solid #ffaa00; padding-left: 7px; }
                .notification-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; margin-right: 12px; border: 2px solid #00c2ff; }
                .notification-content { flex-grow: 1; display: flex; flex-direction: column; min-width: 0; }
                .notification-text { font-size: 15px; line-height: 1.4; color: #eee; }
                .notification-time { font-size: 12px; color: #aaa; margin-top: 4px; }
                .notification-action { margin-left: 10px; display: flex; gap: 5px; align-items: center; }
                .notification-action img { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(255,255,255,0.2); }
                .action-button { background: #00c2ff; color: #000; border: none; padding: 8px 12px; border-radius: 20px; cursor: pointer; font-weight: 600; transition: 0.3s; font-size: 12px; }
                .action-button.following { background: #1a1a1a; color: #00c2ff; border: 1px solid #00c2ff; }
                .action-button.primary { background: #00ff82; }
                .action-button.secondary { background: rgba(255,255,255,0.1); color: #fff; }
            `}</style>

            <img src={notif.avatar} className="notification-avatar" alt="Avatar" />
            
            <div className="notification-content">
                <p className="notification-text">
                    {notif.type === 'like' && <><b className="font-bold">{notif.displayName}</b> curtiu sua publicação.</>}
                    {notif.type === 'comment' && <><b className="font-bold">{notif.displayName}</b> {notif.text}</>}
                    {notif.type === 'follow' && <><b className="font-bold">{notif.displayName}</b> começou a te seguir: {notif.text || ''}</>}
                    {notif.type === 'mention' && <><b className="font-bold">{notif.displayName}</b> te mencionou em uma publicação.</>}
                    {notif.type === 'sale' && <><b className="font-bold">{notif.displayName}</b>: {notif.text}</>}
                    {notif.type === 'pending' && <><b className="font-bold">{notif.displayName}</b> {notif.text}</>}
                </p>
                <span className="notification-time">{postService.formatRelativeTime(notif.timestamp)}</span>
            </div>

            <div className="notification-action">
                {notif.type === 'follow' && (
                    <button 
                        className={`action-button ${notif.isFollowing ? 'following' : ''}`} 
                        onClick={(e) => { e.stopPropagation(); onFollowToggle(notif.id, notif.username); }}
                    >
                        {notif.isFollowing ? 'Seguindo' : 'Seguir'}
                    </button>
                )}
                
                {notif.type === 'sale' && (
                    <i className="fa-solid fa-money-bill-wave" style={{color: '#00ff82', fontSize: '30px', marginRight: '10px'}}></i>
                )}
                
                {notif.type === 'pending' && (
                    <>
                        <button className="action-button primary" onClick={(e) => { e.stopPropagation(); onPendingAction('accept', notif); }}>
                            {notif.subtype === 'group_join' ? 'Aprovar' : 'Aceitar'}
                        </button>
                        <button className="action-button secondary" onClick={(e) => { e.stopPropagation(); onPendingAction('reject', notif); }}>
                            {notif.subtype === 'group_join' ? 'Negar' : 'Recusar'}
                        </button>
                    </>
                )}
                
                {(notif.type === 'like' || notif.type === 'comment') && notif.postImage && (
                    <img src={notif.postImage} alt="Post" />
                )}
            </div>
        </div>
    );
};
