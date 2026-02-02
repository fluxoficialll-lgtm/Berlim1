
import React from 'react';

interface InfoSectionProps {
    isOwner: boolean;
    groupName: string;
    setGroupName: (val: string) => void;
    description: string;
    setDescription: (val: string) => void;
    coverImage?: string;
    setCoverImage: (val: string) => void;
    groupType: string;
}

export const InfoSection: React.FC<InfoSectionProps> = ({ 
    isOwner, groupName, setGroupName, description, setDescription, coverImage, setCoverImage, groupType 
}) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) {
            const r = new FileReader();
            r.onload = (ev) => setCoverImage(ev.target?.result as string);
            r.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {isOwner ? (
                <>
                    <div className="flex flex-col items-center gap-3 mb-2">
                        <div 
                            className="w-24 h-24 rounded-2xl bg-black/40 border border-white/10 overflow-hidden relative group cursor-pointer"
                            onClick={() => document.getElementById('coverInputGroup')?.click()}
                        >
                            <img src={coverImage || 'https://via.placeholder.com/300x100?text=Capa'} className="w-full h-full object-cover" alt="Capa" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <i className="fa-solid fa-camera text-white"></i>
                            </div>
                        </div>
                        <span className="text-[10px] px-2 py-1 rounded bg-[#00c2ff1a] text-[#00c2ff] font-black tracking-widest uppercase">{groupType}</span>
                        <input type="file" id="coverInputGroup" hidden accept="image/*" onChange={handleFileChange} />
                    </div>
                    <div className="input-group">
                        <label>Nome do Grupo</label>
                        <input type="text" className="input-field" value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Digite o nome..." />
                    </div>
                    <div className="input-group mb-0">
                        <label>Descrição</label>
                        <textarea className="input-field" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="O que é esse grupo?"></textarea>
                    </div>
                </>
            ) : (
                <p className="text-gray-400 text-sm italic text-center py-4">Informações protegidas pelo proprietário.</p>
            )}
        </div>
    );
};
