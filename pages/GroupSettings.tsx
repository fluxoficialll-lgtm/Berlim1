
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroupSettings } from '../features/groups/hooks/useGroupSettings';
import { SettingItem } from '../components/settings/SettingItem';

export const GroupSettings: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { 
        group, loading, isOwner, isAdmin, handleLeaveDelete, form
    } = useGroupSettings();

    // Redirecionamento de Segurança: Impede acesso direto via URL para quem não é Admin/Dono
    useEffect(() => {
        if (!loading && group && !isAdmin) {
            console.warn("🔐 [Acesso Negado] Usuário tentou acessar configurações sem permissão.");
            navigate(`/group-chat/${id}`, { replace: true });
        }
    }, [loading, group, isAdmin, navigate, id]);

    if (loading || !group || !id) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
            </div>
        );
    }

    const handleBack = () => {
        navigate(-1);
    };

    const NewBadge = () => (
        <span className="bg-[#00c2ff] text-black text-[9px] font-black px-2 py-0.5 rounded-full ml-3 shadow-[0_0_10px_rgba(0,194,255,0.3)]">
            NEW
        </span>
    );

    const ActiveBadge = () => (
        <div className="flex items-center gap-1.5 bg-[#00ff821a] border border-[#00ff8233] px-2 py-0.5 rounded-lg ml-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff82] shadow-[0_0_5px_#00ff82]"></div>
            <span className="text-[#00ff82] text-[8px] font-black uppercase">Ativo</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
            <style>{`
                header { 
                    display: flex; 
                    align-items: center; 
                    padding: 0 16px; 
                    background: #0c0f14; 
                    position: fixed; 
                    width: 100%; 
                    top: 0; 
                    z-index: 40; 
                    border-bottom: 1px solid rgba(255,255,255,0.1); 
                    height: 65px; 
                }
                header .back-btn { background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; padding: 0 15px; }
                
                main { 
                    padding-top: 85px; 
                    padding-bottom: 100px; 
                    width: 100%; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding-left: 20px; 
                    padding-right: 20px; 
                    overflow-y: auto; 
                    flex-grow: 1; 
                }

                .settings-group { margin-bottom: 25px; }
                .settings-group h2 { 
                    font-size: 13px; 
                    color: #00c2ff; 
                    padding: 10px 0; 
                    margin-bottom: 12px; 
                    text-transform: uppercase; 
                    font-weight: 800; 
                    letter-spacing: 1.5px; 
                }
                
                .setting-item { 
                  display: flex; 
                  align-items: center; 
                  justify-content: space-between; 
                  padding: 16px; 
                  background-color: rgba(255, 255, 255, 0.03); 
                  border: 1px solid rgba(255,255,255,0.05);
                  transition: all 0.2s ease; 
                  color: #fff; 
                  cursor: pointer; 
                  border-radius: 14px; 
                  margin-bottom: 8px; 
                }
                .setting-item:hover { 
                    background-color: rgba(255, 255, 255, 0.06); 
                    border-color: rgba(0, 194, 255, 0.2);
                    transform: translateY(-1px);
                }
                
                .setting-info { display: flex; align-items: center; }
                .setting-info i { font-size: 18px; width: 30px; text-align: center; margin-right: 12px; color: #00c2ff; }
                .setting-item p { font-size: 15px; font-weight: 500; }
                
                .logout-container { margin-top: 20px; }
                .danger-btn { 
                  width: 100%; 
                  padding: 16px; 
                  background: rgba(255, 77, 77, 0.05); 
                  border: 1px solid rgba(255, 77, 77, 0.1); 
                  color: #ff4d4d; 
                  border-radius: 16px; 
                  font-weight: 700; 
                  font-size: 14px; 
                  cursor: pointer; 
                  transition: 0.3s; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  gap: 10px; 
                  margin-bottom: 12px;
                }
                .danger-btn:hover { 
                    background: rgba(255, 77, 77, 0.15); 
                    border-color: rgba(255, 77, 77, 0.3);
                    color: #ff3333;
                }
            `}</style>

            <header>
                <button onClick={handleBack} className="back-btn">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="font-bold text-lg text-white">Gestão da Comunidade</h1>
            </header>

            <main className="no-scrollbar">
                {/* 1. Estrutura e Identidade */}
                <div className="settings-group">
                    <h2>Estrutura e Identidade</h2>
                    <SettingItem 
                        icon="fa-circle-info" 
                        label="Informações Principais" 
                        onClick={() => navigate(`/group-settings/${id}/info`)} 
                    />
                    <SettingItem 
                        icon="fa-chart-simple" 
                        label="Estatísticas de Capacidade" 
                        onClick={() => navigate(`/group-settings/${id}/stats`)} 
                    />
                    <SettingItem 
                        icon="fa-cubes-stacked" 
                        label="Modo Hub (Conteúdo e Chat)" 
                        onClick={() => navigate(`/group-settings/${id}/sales-platform`)} 
                        rightElement={
                            <div className="flex items-center">
                                {form.isSalesPlatformEnabled && <ActiveBadge />}
                                <i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i>
                            </div>
                        }
                    />
                </div>

                {/* 2. Segurança e Moderação */}
                <div className="settings-group">
                    <h2>Segurança e Moderação</h2>
                    <SettingItem 
                        icon="fa-id-card-clip" 
                        label="Gestão de Cargos" 
                        onClick={() => navigate(`/group-settings/${id}/roles`)} 
                        rightElement={<div className="flex items-center"><NewBadge /><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
                    />
                    <SettingItem 
                        icon="fa-key" 
                        label="Acesso e Convites" 
                        onClick={() => navigate(`/group-settings/${id}/access`)} 
                    />
                    <SettingItem 
                        icon="fa-sliders" 
                        label="Regras de Chat" 
                        onClick={() => navigate(`/group-settings/${id}/moderation`)} 
                    />
                    <SettingItem 
                        icon="fa-users" 
                        label="Lista de Membros" 
                        onClick={() => navigate(`/group-settings/${id}/members`)} 
                    />
                </div>

                {/* 3. Monetização e Escala */}
                <div className="settings-group">
                    <h2>Monetização e Escala</h2>
                    <SettingItem 
                        icon="fa-cash-register" 
                        label="Configurações de Checkout" 
                        onClick={() => navigate(`/group-settings/${id}/checkout-config`)} 
                        rightElement={<div className="flex items-center"><NewBadge /><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
                    />
                    <SettingItem 
                        icon="fa-chart-pie" 
                        label="Faturamento Detalhado" 
                        onClick={() => navigate(`/group-revenue/${id}`)} 
                    />
                    <SettingItem 
                        icon="fa-calendar-check" 
                        label="Mensagens Agendadas" 
                        onClick={() => navigate(`/group-settings/${id}/schedule`)} 
                    />
                    {group.isVip && isOwner && (
                        <SettingItem 
                            icon="fa-crown" 
                            label="Funil de Vendas VIP" 
                            onClick={() => navigate(`/group-settings/${id}/vip`)} 
                            rightElement={<div className="flex items-center"><i className="fa-solid fa-star text-[#FFD700] text-sm"></i><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
                        />
                    )}
                </div>

                <div className="logout-container">
                    <h2 className="text-[11px] font-black text-red-500/50 uppercase tracking-[2px] mb-4 pl-1">Zona Crítica</h2>
                    
                    <button onClick={() => handleLeaveDelete('leave')} className="danger-btn">
                        <i className="fa-solid fa-right-from-bracket"></i> Sair do Grupo
                    </button>
                    
                    {isOwner && (
                        <button onClick={() => handleLeaveDelete('delete')} className="danger-btn" style={{ background: 'rgba(255, 77, 77, 0.1)', borderColor: 'rgba(255, 77, 77, 0.3)' }}>
                            <i className="fa-solid fa-trash-can"></i> Excluir Permanentemente
                        </button>
                    )}
                </div>

                <div className="text-center mt-8 opacity-20 text-[9px] uppercase font-black tracking-[3px]">
                    Flux Community Engine • {id}
                </div>
            </main>
        </div>
    );
};
