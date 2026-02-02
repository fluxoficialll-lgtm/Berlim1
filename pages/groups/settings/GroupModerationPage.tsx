
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroupSettings } from '../../../features/groups/hooks/useGroupSettings';
import { ModerationSection } from '../../../features/groups/components/settings/ModerationSection';

export const GroupModerationPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { group, loading, isAdmin, handleSave, form } = useGroupSettings();

    if (loading || !group) return null;

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col overflow-hidden">
            <header className="flex items-center p-4 bg-[#0c0f14] border-b border-white/10 h-[65px] sticky top-0 z-50">
                <button onClick={() => navigate(`/group-settings/${id}`)} className="mr-4 text-white text-xl">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="font-bold">Regras e Moderação</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-5 max-w-[600px] mx-auto w-full">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <ModerationSection 
                        isAdmin={isAdmin}
                        onlyAdminsPost={form.onlyAdminsPost}
                        setOnlyAdminsPost={form.setOnlyAdminsPost}
                        msgSlowMode={form.msgSlowMode}
                        setMsgSlowMode={form.setMsgSlowMode}
                        msgSlowModeInterval={form.msgSlowModeInterval}
                        setMsgSlowModeInterval={form.setMsgSlowModeInterval}
                        memberLimit={form.memberLimit}
                        setMemberLimit={form.setMemberLimit}
                        forbiddenWords={form.forbiddenWords}
                        setForbiddenWords={form.setForbiddenWords}
                    />
                </div>
                <button className="btn-save-fixed" onClick={handleSave}>Salvar Regras</button>
            </main>
        </div>
    );
};
