
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { preferenceService } from '../services/real/preferenceService';

export const LANGUAGES = [
    { id: 'pt', label: 'Português', flag: '🇧🇷', nativeName: 'Brasil' },
    { id: 'en', label: 'English', flag: '🇺🇸', nativeName: 'United States' },
    { id: 'es', label: 'Español', flag: '🇪🇸', nativeName: 'España' }
];

export const LanguageSettings: React.FC = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const currentLangId = user?.language || localStorage.getItem('app_language') || 'pt';

    const handleLanguageSelect = async (langId: string) => {
        if (user?.email) {
            await preferenceService.updateLanguage(user.email, langId);
            // Em produção, aqui dispararíamos a atualização do i18next ou similar
            navigate(-1);
        }
    };

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/settings');
        }
    };

    return (
        <div className="h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
            <style>{`
                header {
                    display:flex; align-items:center; padding:16px;
                    background: #0c0f14; position:fixed; width:100%; top:0; z-index:10;
                    border-bottom:1px solid rgba(255,255,255,0.1); height: 65px;
                }
                header .back-btn {
                    background:none; border:none; color:#fff; font-size:24px; cursor:pointer; padding-right: 15px;
                }
                header h1 { font-size:20px; font-weight:600; }
                
                main { 
                    padding-top: 85px; padding-bottom: 40px; width: 100%; max-width: 600px; 
                    margin: 0 auto; padding-left: 20px; padding-right: 20px;
                    overflow-y: auto; flex-grow: 1; -webkit-overflow-scrolling: touch;
                }

                .lang-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 18px;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    margin-bottom: 12px;
                }

                .lang-card:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(0, 194, 255, 0.2);
                    transform: translateY(-1px);
                }

                .lang-card.active {
                    background: rgba(0, 194, 255, 0.1);
                    border-color: #00c2ff;
                }

                .lang-info {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .lang-flag {
                    font-size: 24px;
                }

                .lang-texts {
                    display: flex;
                    flex-direction: column;
                }

                .lang-label {
                    font-size: 16px;
                    font-weight: 700;
                    color: #fff;
                }

                .lang-native {
                    font-size: 11px;
                    color: #666;
                    text-transform: uppercase;
                    font-weight: 800;
                    letter-spacing: 1px;
                }

                .check-icon {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #00c2ff;
                    color: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    box-shadow: 0 0 15px rgba(0, 194, 255, 0.4);
                }
            `}</style>

            <header>
                <button onClick={handleBack} className="back-btn">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1>Selecionar Idioma</h1>
            </header>

            <main className="no-scrollbar">
                <div className="text-center mb-8 opacity-40">
                    <i className="fa-solid fa-language text-4xl mb-2"></i>
                    <p className="text-xs uppercase font-black tracking-[3px]">Preferências Globais</p>
                </div>

                <div className="lang-list">
                    {LANGUAGES.map((lang) => (
                        <div 
                            key={lang.id}
                            className={`lang-card ${currentLangId === lang.id ? 'active' : ''}`}
                            onClick={() => handleLanguageSelect(lang.id)}
                        >
                            <div className="lang-info">
                                <span className="lang-flag">{lang.flag}</span>
                                <div className="lang-texts">
                                    <span className="lang-label">{lang.label}</span>
                                    <span className="lang-native">{lang.nativeName}</span>
                                </div>
                            </div>
                            {currentLangId === lang.id && (
                                <div className="check-icon">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-10 p-6 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                        Alterar o idioma afetará apenas a interface do sistema. Posts e mensagens de outros usuários permanecem no idioma original em que foram escritos.
                    </p>
                </div>
            </main>
        </div>
    );
};
