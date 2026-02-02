
import React, { useMemo } from 'react';
import { MemberMetrics } from '../../logic/MemberMetrics';
import { GroupRole } from '../../../../types';

interface Member {
    id: string;
    role: string;
    roleId?: string;
}

interface StatisticsSectionProps {
    members: Member[];
    roles: GroupRole[];
    memberLimit?: number | '';
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({ members, roles, memberLimit }) => {
    // Camada de Inteligência Dinâmica
    const metrics = useMemo(() => MemberMetrics.process(members, roles), [members, roles]);
    
    const hasGlobalLimit = typeof memberLimit === 'number' && memberLimit > 0;
    const totalMembers = members.length;
    const occupancyPercentage = hasGlobalLimit ? (totalMembers / (memberLimit as number)) * 100 : 0;

    return (
        <div className="space-y-8">
            {/* Card de Capacidade Total */}
            <div className="bg-white/5 border border-[#00c2ff]/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00c2ff] to-transparent opacity-50"></div>
                <span className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[2px] block mb-2">Capacidade Absoluta</span>
                <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black text-white">{totalMembers.toLocaleString()}</span>
                    <span className="text-gray-500 font-bold flex items-center">
                        / {hasGlobalLimit ? (
                            memberLimit?.toLocaleString()
                        ) : (
                            <i className="fa-solid fa-infinity text-sm ml-1.5 text-[#00c2ff]/60"></i>
                        )}
                    </span>
                </div>

                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-2">
                    <div 
                        className="h-full rounded-full transition-all duration-1000 bg-[#00c2ff]"
                        style={{ 
                            width: `${hasGlobalLimit ? Math.min(100, occupancyPercentage) : 100}%`, 
                            boxShadow: '0 0 15px rgba(0, 194, 255, 0.4)' 
                        }}
                    ></div>
                </div>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider text-right">
                    {hasGlobalLimit ? `${Math.min(100, occupancyPercentage).toFixed(1)}% preenchido` : 'Capacidade Adaptativa'}
                </p>
            </div>

            {/* Listagem de Hierarquia Customizada */}
            <div className="space-y-2">
                <h3 className="text-[9px] font-black text-gray-600 uppercase tracking-[3px] ml-2 mb-4">Distribuição de Cargos</h3>

                {/* Dono (Sempre fixo no topo) */}
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#FFD7001a] flex items-center justify-center text-[#FFD700] border border-[#FFD70033]">
                            <i className="fa-solid fa-crown"></i>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Dono</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Proprietário</p>
                        </div>
                    </div>
                    <span className="text-lg font-black text-[#FFD700]">{metrics.counts.owner}</span>
                </div>

                {/* Cargos Criados Dinamicamente */}
                {metrics.counts.customRoles.map(role => (
                    <div key={role.id} className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center justify-between animate-fade-in">
                        <div className="flex items-center gap-4">
                            <div 
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black"
                                style={{ backgroundColor: `${role.color}1a`, color: role.color, border: `1px solid ${role.color}33` }}
                            >
                                <i className="fa-solid fa-user-shield"></i>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">{role.name}</h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Cargo Customizado</p>
                            </div>
                        </div>
                        <span className="text-lg font-black text-white" style={{ color: role.count > 0 ? role.color : undefined }}>
                            {role.count}
                        </span>
                    </div>
                ))}

                {/* Membros Comuns (Sem cargo atribuído) */}
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                            <i className="fa-solid fa-users"></i>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Membros</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Sem cargo atribuído</p>
                        </div>
                    </div>
                    <span className="text-lg font-black text-gray-500">{metrics.counts.unassigned}</span>
                </div>
            </div>
            
            <div className="pt-4 border-t border-white/5 opacity-50 flex justify-between items-center px-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Força da Comunidade</span>
                <span className="text-xs font-black text-[#00c2ff]">{metrics.totalPower.toLocaleString()} pts</span>
            </div>
        </div>
    );
};
