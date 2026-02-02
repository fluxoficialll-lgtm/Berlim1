
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../../../services/groupService';
import { ScheduledMessage, Channel } from '../../../types';
import { useModal } from '../../../components/ModalSystem';
import { ScheduleSection } from '../../../features/groups/components/settings/ScheduleSection';

export const GroupSchedule: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { showConfirm } = useModal();
    const [schedules, setSchedules] = useState<ScheduledMessage[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    
    const [isAdding, setIsAdding] = useState(false);
    const [newText, setNewText] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [targetChannel, setTargetChannel] = useState('general');

    useEffect(() => {
        if (id) {
            const group = groupService.getGroupById(id);
            if (group) {
                setSchedules(group.scheduledMessages || []);
                setChannels(group.channels || []);
            }
        }
    }, [id]);

    const handleAdd = () => {
        if (!newText || !newDate || !newTime) return;
        const ts = new Date(`${newDate}T${newTime}`).getTime();
        const newMessage: ScheduledMessage = {
            id: Date.now().toString(),
            channelId: targetChannel,
            text: newText,
            scheduledTime: ts,
            isSent: false
        };
        const updated = [newMessage, ...schedules];
        setSchedules(updated);
        groupService.updateGroup({ id: id!, scheduledMessages: updated } as any);
        setIsAdding(false);
        setNewText('');
    };

    const handleDelete = async (sid: string) => {
        if (await showConfirm('Cancelar Agendamento?')) {
            const updated = schedules.filter(s => s.id !== sid);
            setSchedules(updated);
            groupService.updateGroup({ id: id!, scheduledMessages: updated } as any);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col overflow-hidden">
            <header className="flex items-center p-4 bg-[#0c0f14] border-b border-white/10 h-[65px] sticky top-0 z-50">
                <button onClick={() => navigate(`/group-settings/${id}`)} className="mr-4 text-white text-xl">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="font-bold">Agendamentos</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-5 max-w-[600px] mx-auto w-full pb-10 no-scrollbar">
                <ScheduleSection 
                    schedules={schedules}
                    channels={channels}
                    onAddClick={() => setIsAdding(true)}
                    onDelete={handleDelete}
                />
            </main>

            {isAdding && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-[#1a1e26] p-8 rounded-3xl w-full max-w-sm border border-white/10 shadow-2xl animate-pop-in">
                        <h3 className="text-lg font-black mb-6 uppercase tracking-wider text-center">Programar Post</h3>
                        <div className="space-y-4">
                            <div className="input-group mb-0">
                                <label>Conteúdo da Mensagem</label>
                                <textarea className="input-field" value={newText} onChange={e => setNewText(e.target.value)} placeholder="O que deseja postar?" rows={3}></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="input-group mb-0">
                                    <label>Data</label>
                                    <input type="date" className="input-field" value={newDate} onChange={e => setNewDate(e.target.value)} style={{colorScheme:'dark'}} />
                                </div>
                                <div className="input-group mb-0">
                                    <label>Hora</label>
                                    <input type="time" className="input-field" value={newTime} onChange={e => setNewTime(e.target.value)} style={{colorScheme:'dark'}} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Destino</label>
                                <select className="input-field uppercase text-[10px] font-black" value={targetChannel} onChange={e => setTargetChannel(e.target.value)}>
                                    <option value="general"># GERAL</option>
                                    {channels.map(c => <option key={c.id} value={c.id}># {c.name.toUpperCase()}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button className="flex-1 py-4 bg-white/5 text-gray-400 font-bold rounded-2xl uppercase text-xs" onClick={() => setIsAdding(false)}>Cancelar</button>
                            <button className="flex-1 py-4 bg-[#00c2ff] text-black font-black rounded-2xl uppercase text-xs shadow-lg shadow-[#00c2ff]/20" onClick={handleAdd}>Programar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
