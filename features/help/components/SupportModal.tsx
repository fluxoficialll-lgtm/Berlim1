
import React, { useState, useRef } from 'react';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
    const [supportMessage, setSupportMessage] = useState('');
    const [supportMedia, setSupportMedia] = useState<{ file: File, preview: string, type: 'image' | 'video' } | null>(null);
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const type = file.type.startsWith('video/') ? 'video' : 'image';
            setSupportMedia({ file, preview: url, type });
        }
    };

    const removeMedia = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSupportMedia(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSendSupport = () => {
        if (!supportMessage.trim() && !supportMedia) {
            alert("Por favor, descreva seu problema ou anexe um arquivo.");
            return;
        }
        setIsSending(true);
        
        // Simulação de envio
        setTimeout(() => {
            alert("Solicitação enviada! Ticket #" + Math.floor(Math.random() * 9000 + 1000));
            setSupportMessage('');
            setSupportMedia(null);
            onClose();
            setIsSending(false);
        }, 800);
    };

    return (
        <div className="modal-overlay" onClick={() => !isSending && onClose()}>
            <div className="support-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title"><i className="fa-solid fa-comments text-[#00c2ff]"></i> Falar com Suporte</div>
                    <button className="close-modal" onClick={() => !isSending && onClose()}><i className="fa-solid fa-xmark"></i></button>
                </div>
                
                <div className="modal-body">
                    <div className="input-label">Mensagem</div>
                    <textarea 
                        className="support-textarea" 
                        placeholder="Descreva seu problema, dúvida ou sugestão..."
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        disabled={isSending}
                    ></textarea>

                    <div className="upload-box" onClick={() => !supportMedia && !isSending && fileInputRef.current?.click()}>
                        {supportMedia ? (
                            <div className="media-preview-container">
                                {supportMedia.type === 'video' ? (
                                    <video src={supportMedia.preview} controls className="media-preview" />
                                ) : (
                                    <img src={supportMedia.preview} alt="Print" className="media-preview" />
                                )}
                                <button className="remove-media" onClick={removeMedia} disabled={isSending}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        ) : (
                            <div className="upload-placeholder">
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                                <span>Adicionar Print, Foto ou Vídeo</span>
                                <span style={{fontSize:'11px', color:'#555'}}>(Opcional)</span>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            hidden 
                            accept="image/*,video/*" 
                            onChange={handleFileChange} 
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="send-btn" onClick={handleSendSupport} disabled={isSending}>
                        {isSending ? (
                            <><i className="fa-solid fa-circle-notch fa-spin"></i> Enviando...</>
                        ) : (
                            <><i className="fa-solid fa-paper-plane"></i> Enviar Mensagem</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
