
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroupSettings } from '../../../features/groups/hooks/useGroupSettings';
import { useModal } from '../../../components/ModalSystem';
import { PlatformStatusCard } from '../../../features/groups/components/settings/sales-platform/PlatformStatusCard';
import { PlatformStructureEditor } from '../../../features/groups/components/settings/sales-platform/PlatformStructureEditor';
import { PlatformInfoBox } from '../../../features/groups/components/settings/sales-platform/PlatformInfoBox';
import { FolderOptionsModal } from '../../../features/groups/components/settings/sales-platform/FolderOptionsModal';
import { ChannelOptionsModal } from '../../../features/groups/components/settings/channels/ChannelOptionsModal';
import { SalesFolder, SalesSection, Channel } from '../../../types';

export const GroupSalesPlatformPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { group, loading, handleSave, form } = useGroupSettings();
    const { showPrompt } = useModal();

    const [optionsModal, setOptionsModal] = useState<{
        isOpen: boolean;
        target: SalesFolder | SalesSection | Channel | null;
        type: 'folder' | 'section' | 'channel';
    }>({ isOpen: false, target: null, type: 'folder' });

    if (loading || !group) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
            </div>
        );
    }

    const handleToggleStatus = async () => {
        form.setIsSalesPlatformEnabled(!form.isSalesPlatformEnabled);
    };

    const handleOpenOptions = (target: SalesFolder | SalesSection | Channel, type: 'folder' | 'section' | 'channel') => {
        setOptionsModal({ isOpen: true, target, type });
    };

    const handleUpdateChannelProperties = (updates: Partial<Channel>) => {
        if (optionsModal.type !== 'channel' || !optionsModal.target) return;
        
        const cid = optionsModal.target.id;
        const newSections = form.salesPlatformSections.map(sec => ({
            ...sec,
            channels: sec.channels?.map(c => c.id === cid ? { ...c, ...updates } : c)
        }));
        
        form.setSalesPlatformSections(newSections);
        setOptionsModal(prev => ({
            ...prev,
            target: { ...prev.target as Channel, ...updates }
        }));
    };

    const handleUpdateFolderProperties = (updates: Partial<SalesFolder>) => {
        if (optionsModal.type !== 'folder' || !optionsModal.target) return;
        
        const folderId = optionsModal.target.id;
        const newSections = form.salesPlatformSections.map(sec => ({
            ...sec,
            folders: sec.folders.map(f => f.id === folderId ? { ...f, ...updates } : f)
        }));
        
        form.setSalesPlatformSections(newSections);
        setOptionsModal(prev => ({
            ...prev,
            target: { ...prev.target as SalesFolder, ...updates }
        }));
    };

    const handleAddFolderInside = async () => {
        if (optionsModal.type !== 'section' || !optionsModal.target) return;
        const sectionId = optionsModal.target.id;

        const name = await showPrompt('Nome da Pasta', 'Ex: Material Complementar');
        if (!name) return;

        const newFolder: SalesFolder = {
            id: `fold_${Date.now()}`,
            name,
            itemsCount: 0,
            allowDownload: true,
            allowMemberUpload: false
        };

        const newSections = form.salesPlatformSections.map(sec => {
            if (sec.id === sectionId) {
                return { ...sec, folders: [...sec.folders, newFolder] };
            }
            return sec;
        });

        form.setSalesPlatformSections(newSections);
    };

    const handleAddChannelInside = async () => {
        if (optionsModal.type !== 'section' || !optionsModal.target) return;
        const sectionId = optionsModal.target.id;
        
        const name = await showPrompt('Nome do Canal de Chat', 'Ex: Suporte VIP');
        if (!name) return;

        const newChannel: Channel = {
            id: `ch_plt_${Date.now()}`,
            name,
            onlyAdminsPost: false,
            type: 'text'
        };
        
        const newSections = form.salesPlatformSections.map(sec => {
            if (sec.id === sectionId) {
                return { ...sec, channels: [...(sec.channels || []), newChannel] };
            }
            return sec;
        });

        form.setSalesPlatformSections(newSections);
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col overflow-hidden">
            <header className="flex items-center p-4 bg-[#0c0f14] border-b border-white/10 h-[65px] sticky top-0 z-50">
                <button onClick={() => navigate(`/group-settings/${id}`)} className="mr-4 text-white text-xl">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="font-bold">Configuração do Modo Hub</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-5 max-w-[600px] mx-auto w-full pb-32 no-scrollbar">
                <div className="flex flex-col gap-6">
                    <PlatformStatusCard 
                        enabled={form.isSalesPlatformEnabled} 
                        onToggle={handleToggleStatus} 
                    />

                    {form.isSalesPlatformEnabled && (
                        <PlatformStructureEditor 
                            sections={form.salesPlatformSections}
                            onSectionsChange={form.setSalesPlatformSections}
                            onOptions={handleOpenOptions}
                        />
                    )}

                    <div className="mt-2">
                        <PlatformInfoBox />
                    </div>
                </div>

                <button 
                    className="btn-save-fixed" 
                    onClick={handleSave}
                >
                    Salvar Estrutura do Hub
                </button>
            </main>

            {optionsModal.isOpen && optionsModal.type === 'channel' && (
                <ChannelOptionsModal 
                    isOpen={optionsModal.isOpen}
                    onClose={() => setOptionsModal({ ...optionsModal, isOpen: false })}
                    title={(optionsModal.target as Channel).name}
                    type="channel"
                    target={optionsModal.target as Channel}
                    onUpdateChannel={handleUpdateChannelProperties}
                />
            )}

            {optionsModal.isOpen && (optionsModal.type === 'folder' || optionsModal.type === 'section') && (
                <FolderOptionsModal 
                    isOpen={optionsModal.isOpen}
                    onClose={() => setOptionsModal({ ...optionsModal, isOpen: false })}
                    title={(optionsModal.target as any).name || (optionsModal.target as any).title}
                    type={optionsModal.type as any}
                    target={optionsModal.target as any}
                    onUpdateFolder={handleUpdateFolderProperties}
                    onAddFolderInside={handleAddFolderInside}
                    onAddChannelInside={handleAddChannelInside}
                />
            )}
            
            <div className="text-center opacity-10 text-[8px] uppercase font-black tracking-[3px] mb-8">
                Flux Hub Engine v4.3
            </div>
        </div>
    );
};
