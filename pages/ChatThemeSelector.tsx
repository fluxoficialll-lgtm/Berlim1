
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Definição da estrutura de um tema
interface ChatTheme {
  id: string;
  name: string;
  colors: {
    background: string;
    text: string;
    myMessageBg: string;
    otherMessageBg: string;
    headerBg: string;
    headerText: string;
    bubbleBorder: string;
  };
}

// Coleção de temas pré-definidos com alto contraste
const themes: ChatTheme[] = [
  {
    id: 'default',
    name: 'Padrão Flux',
    colors: {
      background: '#0c0f14',
      text: '#E0E0E0',
      myMessageBg: '#005c99',
      otherMessageBg: '#2a2d31',
      headerBg: '#1a1d21',
      headerText: '#FFFFFF',
      bubbleBorder: 'transparent',
    }
  },
  {
    id: 'nocturne',
    name: 'Noturno OLED',
    colors: {
      background: '#000000',
      text: '#F5F5F5',
      myMessageBg: '#2E0854', // Roxo profundo
      otherMessageBg: '#1C1C1E',
      headerBg: '#101010',
      headerText: '#FFFFFF',
      bubbleBorder: '#3A3A3C',
    }
  },
  {
    id: 'aurora',
    name: 'Aurora Boreal',
    colors: {
      background: '#010A14',
      text: '#EAEAEA',
      myMessageBg: 'linear-gradient(to right, #00467F, #A5CC82)',
      otherMessageBg: '#1B2838',
      headerBg: '#0E1621',
      headerText: '#FFFFFF',
      bubbleBorder: 'transparent',
    }
  },
  {
    id: 'solaris',
    name: 'Solaris Claro',
    colors: {
      background: '#F7F9FC',
      text: '#1C1E21',
      myMessageBg: '#0084FF',
      otherMessageBg: '#E4E6EB',
      headerBg: '#FFFFFF',
      headerText: '#000000',
      bubbleBorder: '#DCDFE6',
    }
  },
  {
    id: 'crimson',
    name: 'Escarlate',
    colors: {
      background: '#120000',
      text: '#F5E6E6',
      myMessageBg: '#8B0000',
      otherMessageBg: '#2C1414',
      headerBg: '#1A0A0A',
      headerText: '#FFC0CB',
      bubbleBorder: '#4D2A2A',
    }
  }
];

// Hook para gerenciar o tema
const useChatTheme = () => {
    const [theme, setTheme] = useState(themes[0]);

    useEffect(() => {
        const savedThemeId = localStorage.getItem('chatTheme') || 'default';
        const savedTheme = themes.find(t => t.id === savedThemeId) || themes[0];
        setTheme(savedTheme);
    }, []);

    useEffect(() => {
        // Aplica o tema na raiz do documento usando variáveis CSS
        const root = document.documentElement;
        root.style.setProperty('--chat-bg', theme.colors.background);
        root.style.setProperty('--chat-text', theme.colors.text);
        root.style.setProperty('--chat-my-message-bg', theme.colors.myMessageBg);
        root.style.setProperty('--chat-other-message-bg', theme.colors.otherMessageBg);
        root.style.setProperty('--chat-header-bg', theme.colors.headerBg);
        root.style.setProperty('--chat-header-text', theme.colors.headerText);
        
        localStorage.setItem('chatTheme', theme.id);
    }, [theme]);

    return { theme, setTheme, themes };
};


export const ChatThemeSelector: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme, themes } = useChatTheme();

  const handleBack = () => {
    navigate(-1);
  };

  const ThemePreviewCard: React.FC<{ t: ChatTheme }> = ({ t }) => (
    <div 
        onClick={() => setTheme(t)}
        style={{ background: t.colors.background, border: `2px solid ${t.id === theme.id ? '#00c2ff' : t.colors.bubbleBorder}` }}
        className="cursor-pointer rounded-2xl p-4 transition-all duration-300 transform hover:scale-105"
    >
        <div style={{ background: t.colors.headerBg }} className="h-8 rounded-t-lg mb-3"></div>
        <div className="space-y-2">
            <div style={{ background: t.colors.otherMessageBg }} className="h-5 w-3/4 rounded-lg"></div>
            <div style={{ background: t.colors.myMessageBg }} className="h-5 w-1/2 rounded-lg ml-auto"></div>
            <div style={{ background: t.colors.otherMessageBg }} className="h-5 w-2/3 rounded-lg"></div>
        </div>
        <h3 style={{ color: t.colors.text }} className="text-center font-bold text-sm mt-4">{t.name}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white font-['Inter'] flex flex-col">
      <header className="flex items-center p-4 bg-[#1a1d21] border-b border-gray-800">
        <button onClick={handleBack} className="mr-4">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h1 className="font-bold text-lg">Temas do Chat</h1>
      </header>

      <main className="flex-grow p-5 overflow-y-auto">
        <p className="text-gray-400 text-center mb-8 text-sm">Selecione um tema para personalizar sua experiência em todas as conversas.</p>
        <div className="grid grid-cols-2 gap-5">
            {themes.map(t => <ThemePreviewCard key={t.id} t={t} />)}
        </div>
      </main>
    </div>
  );
};
