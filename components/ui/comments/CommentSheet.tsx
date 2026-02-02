
import React, { useRef, useEffect } from 'react';
import { Comment } from '../../../types';
import { CommentItem } from './CommentItem';

interface CommentSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    comments: Comment[];
    commentText: string;
    onCommentTextChange: (text: string) => void;
    onSend: () => void;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
    onUserClick: (username: string) => void;
    currentUserId?: string;
    replyingTo: { id: string, username: string } | null;
    onCancelReply: () => void;
    onReplyClick: (id: string, username: string) => void;
    placeholder?: string;
}

export const CommentSheet: React.FC<CommentSheetProps> = ({
    isOpen, onClose, title, comments, commentText, onCommentTextChange, onSend,
    onLike, onDelete, onUserClick, currentUserId, replyingTo, onCancelReply,
    onReplyClick, placeholder = "Adicione um comentário..."
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (replyingTo && inputRef.current) {
            inputRef.current.focus();
        }
    }, [replyingTo]);

    return (
        <>
            <style>{`
                .comments-overlay {
                    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px); z-index: 100; opacity: 0; pointer-events: none;
                    transition: opacity 0.3s ease;
                }
                .comments-overlay.open { opacity: 1; pointer-events: auto; }
                
                .comments-drawer {
                    position: fixed; bottom: 0; left: 0; width: 100%; height: 75vh;
                    background: #1a1e26; border-top-left-radius: 32px; border-top-right-radius: 32px;
                    z-index: 101; transform: translateY(100%); 
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex; flex-direction: column;
                    box-shadow: 0 -10px 40px rgba(0,0,0,0.5);
                    border-top: 1px solid rgba(255,255,255,0.1);
                }
                .comments-drawer.open { transform: translateY(0); }
                
                .drawer-header {
                    padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05);
                    display: flex; justify-content: space-between; align-items: center;
                }
                .drawer-content { flex: 1; overflow-y: auto; padding: 24px; }
                
                .drawer-input-area {
                    padding: 16px 24px 32px 24px; background: #252a33;
                    border-top: 1px solid rgba(255,255,255,0.05);
                }
                .reply-indicator {
                    display: flex; justify-content: space-between; align-items: center;
                    background: rgba(0, 194, 255, 0.1); padding: 8px 16px;
                    border-radius: 12px; margin-bottom: 12px; font-size: 12px;
                    border-left: 3px solid #00c2ff;
                }
                .input-container { display: flex; gap: 12px; align-items: center; }
                .input-container input {
                    flex: 1; background: #0c0f14; border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 14px; padding: 12px 18px; color: #fff; outline: none;
                    font-size: 15px; transition: border-color 0.2s;
                }
                .input-container input:focus { border-color: #00c2ff; }
                .send-btn-circle {
                    width: 46px; height: 46px; border-radius: 50%; background: #00c2ff;
                    color: #000; border: none; display: flex; items-center; justify-content: center;
                    cursor: pointer; transition: transform 0.2s, background 0.2s;
                }
                .send-btn-circle:active { transform: scale(0.9); }
                .send-btn-circle:disabled { background: #333; color: #777; cursor: not-allowed; }
            `}</style>

            <div className={`comments-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`comments-drawer ${isOpen ? 'open' : ''}`}>
                <header className="drawer-header">
                    <h3 className="text-base font-black text-white uppercase tracking-widest">{title}</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </header>

                <div className="drawer-content no-scrollbar">
                    {comments.length > 0 ? (
                        comments.map(c => (
                            <CommentItem 
                                key={c.id} 
                                comment={c} 
                                onReplyClick={onReplyClick} 
                                onLike={onLike} 
                                onDelete={onDelete}
                                onUserClick={onUserClick}
                                currentUserId={currentUserId}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-20">
                            <i className="fa-regular fa-comments text-5xl mb-4"></i>
                            <p className="font-bold uppercase tracking-widest text-sm">Nenhuma interação ainda</p>
                        </div>
                    )}
                </div>

                <div className="drawer-input-area">
                    {replyingTo && (
                        <div className="reply-indicator animate-fade-in">
                            <span className="text-gray-300">Respondendo a <strong className="text-[#00c2ff]">@{replyingTo.username}</strong></span>
                            <button onClick={onCancelReply} className="text-gray-500 hover:text-white">
                                <i className="fa-solid fa-circle-xmark"></i>
                            </button>
                        </div>
                    )}
                    <div className="input-container">
                        <input 
                            ref={inputRef}
                            type="text" 
                            placeholder={replyingTo ? `Responda @${replyingTo.username}...` : placeholder}
                            value={commentText} 
                            onChange={(e) => onCommentTextChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSend()}
                        />
                        <button 
                            className="send-btn-circle" 
                            onClick={onSend}
                            disabled={!commentText.trim()}
                        >
                            <i className="fa-solid fa-paper-plane text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
