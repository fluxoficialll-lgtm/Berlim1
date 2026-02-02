
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Channel, ChannelSection } from '../../../types';
import { useModal } from '../../../components/ModalSystem';
import { useGroupSettings } from '../../../features/groups/hooks/useGroupSettings';
import { ChannelsSection as ChannelsEditor } from '../../../features/groups/components/settings/ChannelsSection';
import { ChannelsHeader } from '../../../features/groups/components/settings/channels/ChannelsHeader';
import { ChannelsNotice } from '../../../features/groups/components/settings/channels/ChannelsNotice';
import { ChannelOptionsModal } from '../../../features/groups/components/settings/channels/ChannelOptionsModal';

export const GroupChannelsPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { showConfirm, showPrompt } = useModal();
    const { group, loading, form, handleSave } = useGroupSettings();

    const [optionsModal, setOptionsModal] = useState<{
        isOpen: boolean;
        target: Channel | ChannelSection | null;
        type: 'channel' | 'section';
    }>({ isOpen: false, target: null, type: 'channel' });

    if (loading || !group) {
        return (
            <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
                <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
            </div>
        );
    }

    const checkExclusivity = async (): Promise<boolean> => {
        if (form.isSalesPlatformEnabled) {
            const confirmed = await showConfirm(
                "Modo Plataforma Ativo",
                "Você está usando o Modo Plataforma de Vendas. Criar canais customizados irá DESATIVAR o catálogo de pastas. Deseja prosseguir?",
                "Sim, Usar Canais",
                "Cancelar"
            );
            if (confirmed) {
                form.setIsSalesPlatformEnabled(false);
                return true;
            }
            return false;
        }
        return true;
    };

    const handleAddChannel = async (toSectionId?: string) => {
        if (!(await checkExclusivity())) return;

        const name = await showPrompt('Nome do Canal', 'Ex: Suporte, Avisos, VIP Chat');
        if (!name) return;

        const newChannelId = `ch_${Date.now()}`;
        const newChannel: Channel = {
            id: newChannelId,
            name,
            onlyAdminsPost: false,
            type: 'text'
        };

        form.setChannels([...form.channels, newChannel]);

        if (toSectionId) {
            form.setChannelSections(form.channelSections.map(s => 
                s.id === toSectionId 
                ? { ...s, channelIds: [...s.channelIds, newChannelId] }
                : s
            ));
        }
    };

    const handleAddSection = async () => {
        if (!(await checkExclusivity())) return;

        const title = await showPrompt('Nome da Seção', 'Ex: ÁREA DE CONTEÚDO');
        if (!title) return;

        const newSection: ChannelSection = {
            id: `sec_${Date.now()}`,
            title,
            channelIds: []
        };

        form.setChannelSections([...form.channelSections, newSection]);
    };

    const handleOpenOptions = (target: Channel | ChannelSection, type: 'channel' | 'section') => {
        setOptionsModal({ isOpen: true, target, type });
    };

    const handleUpdateChannelProperties = (updates: Partial<Channel>) => {
        if (optionsModal.type !== 'channel' || !optionsModal.target) return;
        
        const cid = optionsModal.target.id;
        const updatedChannels = form.channels.map(c => c.id === cid ? { ...c, ...updates } : c);
        form.setChannels(updatedChannels);
        
        setOptionsModal(prev => ({
            ...prev,
            target: { ...prev.target as Channel, ...updates }
        }));
    };

    const handleDeleteChannel = async (cid: string) => {
        if (await showConfirm('Excluir canal?', 'Todas as mensagens deste canal serão perdidas.')) {
            form.setChannels(form.channels.filter(c => c.id !== cid));
            form.setChannelSections(form.channelSections.map(s => ({
                ...s,
                channelIds: s.channelIds.filter(id => id !== cid)
            })));
        }
    };

    const handleDeleteSection = async (sid: string) => {
        if (await showConfirm('Excluir seção?', 'Os canais dentro dela serão removidos da categoria, mas não serão excluídos.')) {
            form.setChannelSections(form.channelSections.filter(s => s.id !== sid));
        }
    };

    const handleUpdateSectionTitle = (sid: string, title: string) => {
        form.setChannelSections(form.channelSections.map(s => s.id === sid ? { ...s, title } : s));
    };

    const handleMoveSection = (index: number, direction: 'up' | 'down') => {
        const newSections = [...form.channelSections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newSections.length) return;
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        form.setChannelSections(newSections);
    };

    const handleBack = () => navigate(`/group-settings/${id}`);

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col overflow-hidden">
            <ChannelsHeader onBack={handleBack} title="Estrutura de Canais" />

            <main className="flex-1 overflow-y-auto p-5 max-w-[600px] mx-auto w-full pb-32 no-scrollbar">
                <ChannelsNotice />

                <ChannelsEditor 
                    channels={form.channels}
                    sections={form.channelSections}
                    onAddChannel={() => handleAddChannel()}
                    onAddSection={handleAddSection}
                    onOptions={handleOpenOptions}
                    onDeleteChannel={handleDeleteChannel}
                    onDeleteSection={handleDeleteSection}
                    onUpdateSectionTitle={handleUpdateSectionTitle}
                    onMoveSection={handleMoveSection}
                />

                <button className="btn-save-fixed" onClick={handleSave}>Salvar Estrutura</button>
            </main>

            {optionsModal.isOpen && (
                <ChannelOptionsModal 
                    isOpen={optionsModal.isOpen}
                    onClose={() => setOptionsModal({ ...optionsModal, isOpen: false })}
                    title={(optionsModal.target as any).name || (optionsModal.target as any).title}
                    type={optionsModal.type}
                    target={optionsModal.target}
                    onUpdateChannel={handleUpdateChannelProperties}
                    onAddChannelInside={optionsModal.type === 'section' ? () => handleAddChannel(optionsModal.target!.id) : undefined}
                />
            )}
        </div>
    );
};
