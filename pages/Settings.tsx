
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useModal } from '../components/ModalSystem';
import { Footer } from '../components/layout/Footer';

// Novos Componentes Modulares
import { AccountGroup } from '../components/settings/AccountGroup';
import { PrivacyGroup } from '../components/settings/PrivacyGroup';
import { GeneralGroup } from '../components/settings/GeneralGroup';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { showConfirm, showAlert } = useModal();
  const [isPrivate, setIsPrivate] = useState(false);
  const [isAdultContent, setIsAdultContent] = useState(localStorage.getItem('settings_18_plus') === 'true');

  useEffect(() => {
      const user = authService.getCurrentUser();
      if (user?.profile) { setIsPrivate(user.profile.isPrivate); }
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (await showConfirm("Sair da conta", "Deseja realmente sair do aplicativo? Você precisará fazer login novamente.", "Sair", "Ficar")) {
      authService.logout();
      navigate('/', { replace: true });
    }
  };

  const handleTogglePrivacy = async () => {
    const newState = !isPrivate;
    setIsPrivate(newState);
    const user = authService.getCurrentUser();
    if(user && user.email && user.profile) { 
        authService.completeProfile(user.email, { ...user.profile, isPrivate: newState })
            .catch(e => console.error(e)); 
    }
    await showAlert("Status da Conta", `Sua conta agora é ${newState ? 'PRIVADA' : 'PÚBLICA'}.`);
  };

  const handleToggleAdultContent = () => {
    const newState = !isAdultContent;
    setIsAdultContent(newState);
    localStorage.setItem('settings_18_plus', String(newState));
  };

  return (
    <div className="h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
      <style>{`
        header { display:flex; align-items:center; padding:16px; background: #0c0f14; position:fixed; width:100%; top:0; z-index:10; border-bottom:1px solid rgba(255,255,255,0.1); height: 65px; }
        header .back-btn { background:none; border:none; color:#fff; font-size:24px; cursor:pointer; padding-right: 15px; }
        main { padding-top: 85px; padding-bottom: 100px; width: 100%; max-width: 600px; margin: 0 auto; padding-left: 20px; padding-right: 20px; overflow-y: auto; flex-grow: 1; -webkit-overflow-scrolling: touch; }
        
        .settings-group { margin-bottom: 20px; }
        .settings-group h2 { font-size: 13px; color: #00c2ff; padding: 10px 0; margin-bottom: 8px; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; }
        
        .setting-item { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 16px; 
          background-color: rgba(255, 255, 255, 0.03); 
          border: 1px solid rgba(255,255,255,0.05);
          transition: 0.2s; 
          color: #fff; 
          cursor: pointer; 
          border-radius: 14px; 
          margin-bottom: 8px; 
        }
        .setting-item:hover { background-color: rgba(255, 255, 255, 0.06); border-color: rgba(0, 194, 255, 0.2); }
        
        .setting-info { display: flex; align-items: center; }
        .setting-info i { font-size: 18px; width: 30px; text-align: center; margin-right: 12px; color: #00c2ff; }
        .setting-item p { font-size: 15px; font-weight: 500; }
        
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #333; transition: .4s; border-radius: 25px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #00c2ff; }
        input:checked + .slider:before { transform: translateX(20px); }
        
        .logout-container { margin-top: 30px; padding: 0 10px 40px 10px; }
        .logout-btn { 
          width: 100%; 
          padding: 16px; 
          background: rgba(255, 77, 77, 0.08); 
          border: 1px solid rgba(255, 77, 77, 0.2); 
          color: #ff4d4d; 
          border-radius: 16px; 
          font-weight: 700; 
          font-size: 15px; 
          cursor: pointer; 
          transition: 0.3s; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 10px; 
        }
        .logout-btn:hover { background: #ff4d4d; color: #fff; box-shadow: 0 4px 20px rgba(255, 77, 77, 0.2); }
      `}</style>

      <header>
        <button onClick={() => navigate('/profile')} className="back-btn"><i className="fas fa-arrow-left"></i></button>
        <h1 className="font-bold text-lg text-white">Configurações</h1>
      </header>

      <main className="no-scrollbar">
        <AccountGroup />

        <PrivacyGroup 
            isPrivate={isPrivate}
            onTogglePrivacy={handleTogglePrivacy}
            isAdultContent={isAdultContent}
            onToggleAdult={handleToggleAdultContent}
        />

        <GeneralGroup />

        <div className="logout-container">
            <button onClick={handleLogout} className="logout-btn">
                <i className="fas fa-sign-out-alt"></i> Sair da Conta
            </button>
            <div className="text-center mt-6 opacity-20 text-[10px] uppercase font-black tracking-widest">
                Flux Security Ecosystem • v1.2.3
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
