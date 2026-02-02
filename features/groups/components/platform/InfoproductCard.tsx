
import React from 'react';
import { Infoproduct } from '../../../../types';

interface InfoproductCardProps {
    item: Infoproduct;
    globalAllowDownload: boolean;
    onPreview: (item: Infoproduct) => void;
}

export const InfoproductCard: React.FC<InfoproductCardProps> = ({ item, globalAllowDownload, onPreview }) => {
    const getIcon = (item: Infoproduct) => {
        if (item.type === 'video') return 'fa-video';
        if (item.type === 'image') return 'fa-image';
        if (item.fileType === 'pdf') return 'fa-file-pdf';
        if (item.fileType === 'zip') return 'fa-file-zipper';
        if (item.fileType === 'doc') return 'fa-file-word';
        return 'fa-file-lines';
    };

    const canDownload = globalAllowDownload && item.allowDownload;

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canDownload) return;
        
        if (item.url && item.url !== '#') {
            window.open(item.url, '_blank');
        } else {
            alert("Este é um arquivo de demonstração.");
        }
    };

    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 group active:scale-[0.98] transition-all hover:bg-white/[0.08] hover:border-white/10">
            <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-[#00c2ff] text-lg overflow-hidden flex-shrink-0">
                {item.type === 'image' ? (
                    <img src={item.url} className="w-full h-full object-cover" alt={item.title} />
                ) : (
                    <i className={`fa-solid ${getIcon(item)} opacity-60`}></i>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-gray-200 truncate">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">
                        {item.fileType?.toUpperCase() || item.type.toUpperCase()}
                    </span>
                    <span className="text-[9px] font-bold text-[#00c2ff] uppercase tracking-widest opacity-60">
                        {item.size || 'Tamanho N/A'}
                    </span>
                </div>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => onPreview(item)}
                    className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#00c2ff] hover:bg-[#00c2ff1a] transition-colors"
                >
                    <i className={`fa-solid ${item.type === 'video' ? 'fa-play-circle text-lg' : 'fa-eye'}`}></i>
                </button>
                {canDownload && (
                    <button 
                        onClick={handleDownload}
                        className="w-9 h-9 rounded-full bg-[#00ff82]/5 flex items-center justify-center text-[#00ff82] hover:bg-[#00ff82]/10 transition-colors"
                        title="Baixar"
                    >
                        <i className="fa-solid fa-cloud-arrow-down"></i>
                    </button>
                )}
            </div>
        </div>
    );
};
