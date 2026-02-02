
import React from 'react';

export interface LanguageOption {
    id: string;
    label: string;
    flag: string;
    nativeName: string;
}

interface LanguageSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentLanguage: string;
    onSelect: (langId: string) => void;
}

export const LANGUAGES: LanguageOption[] = [
    { id: 'pt', label: 'Português', flag: '🇧🇷', nativeName: 'Brasil' },
    { id: 'en', label: 'English', flag: '🇺🇸', nativeName: 'United States' },
    { id: 'es', label: 'Español', flag: '🇪🇸', nativeName: 'España' }
];

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ 
    isOpen, 
    onClose, 
    currentLanguage, 
    onSelect 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div 
                className="w-full max-w-sm bg-[#1a1e26] border border-white/10 rounded-[32px] p-6 shadow-2xl animate-pop-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-[#00c2ff]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#00c2ff]/20">
                        <i className="fa-solid fa-language text-[#00c2ff] text-xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Selecionar Idioma</h3>
                    <p className="text-[11px] text-gray-500 mt-1 uppercase font-black tracking-widest">Escolha sua preferência</p>
                </div>

                <div className="space-y-2">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.id}
                            onClick={() => {
                                onSelect(lang.id);
                                onClose();
                            }}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all active:scale-[0.98] ${
                                currentLanguage === lang.id 
                                ? 'bg-[#00c2ff]/10 border-2 border-[#00c2ff] text-white' 
                                : 'bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-2xl grayscale-0">{lang.flag}</span>
                                <div className="text-left">
                                    <span className="font-bold text-sm block leading-none mb-1">{lang.label}</span>
                                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">{lang.nativeName}</span>
                                </div>
                            </div>
                            {currentLanguage === lang.id && (
                                <i className="fa-solid fa-circle-check text-[#00c2ff]"></i>
                            )}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={onClose}
                    className="w-full mt-6 py-4 text-gray-600 font-black uppercase text-[10px] tracking-[3px] hover:text-white transition-colors"
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};
