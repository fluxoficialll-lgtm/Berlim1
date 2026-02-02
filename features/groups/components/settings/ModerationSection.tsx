
import React, { useState } from 'react';

interface ModerationSectionProps {
    isAdmin: boolean;
    onlyAdminsPost: boolean;
    setOnlyAdminsPost: (val: boolean) => void;
    msgSlowMode: boolean;
    setMsgSlowMode: (val: boolean) => void;
    msgSlowModeInterval: string;
    setMsgSlowModeInterval: (val: string) => void;
    memberLimit: number | '';
    setMemberLimit: (val: number | '') => void;
    forbiddenWords: string[];
    setForbiddenWords: (val: string[]) => void;
}

export const ModerationSection: React.FC<ModerationSectionProps> = ({
    isAdmin, onlyAdminsPost, setOnlyAdminsPost, msgSlowMode, setMsgSlowMode,
    msgSlowModeInterval, setMsgSlowModeInterval, memberLimit, setMemberLimit,
    forbiddenWords, setForbiddenWords
}) => {
    const [newWord, setNewWord] = useState('');

    if (!isAdmin) return <div className="py-4 text-center text-gray-500 italic text-xs">Proteção administrativa ativa.</div>;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex flex-col">
                    <h4 className="font-bold text-sm text-white">Modo Unidirecional</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Apenas Admins Postam</p>
                </div>
                <label className="switch">
                    <input type="checkbox" checked={onlyAdminsPost} onChange={() => setOnlyAdminsPost(!onlyAdminsPost)} />
                    <span className="slider-switch"></span>
                </label>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="flex flex-col">
                    <h4 className="font-bold text-sm text-white">Frequência de Chat</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Modo Lento Ativo</p>
                </div>
                <label className="switch">
                    <input type="checkbox" checked={msgSlowMode} onChange={() => setMsgSlowMode(!msgSlowMode)} />
                    <span className="slider-switch"></span>
                </label>
            </div>
            
            {msgSlowMode && (
                <div className="input-group highlight-box bg-[#00c2ff]/5 border border-[#00c2ff]/20 p-4 rounded-xl">
                    <label>Segundos de espera</label>
                    <input type="number" className="input-field border-none bg-transparent font-black text-lg text-[#00c2ff]" value={msgSlowModeInterval} onChange={e => setMsgSlowModeInterval(e.target.value)} />
                </div>
            )}

            <div className="input-group">
                <label>Capacidade da Comunidade</label>
                <input type="number" className="input-field" placeholder="Membros ilimitados" value={memberLimit} onChange={e => setMemberLimit(e.target.value ? parseInt(e.target.value) : '')} />
            </div>

            <div className="input-group mb-0">
                <label>Lista Negra de Palavras</label>
                <div className="flex gap-2">
                    <input type="text" className="input-field" placeholder="Banir palavra..." value={newWord} onChange={e => setNewWord(e.target.value)} />
                    <button onClick={() => { if(newWord.trim()){ setForbiddenWords([...forbiddenWords, newWord.trim().toLowerCase()]); setNewWord(''); } }} className="bg-[#00c2ff] text-black w-12 rounded-xl font-black text-xl">+</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    {forbiddenWords.map(w => (
                        <span key={w} className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                            {w} <i className="fa-solid fa-xmark cursor-pointer opacity-50 hover:opacity-100" onClick={() => setForbiddenWords(forbiddenWords.filter(x => x !== w))}></i>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
