
import React, { useState, useEffect } from 'react';
import { paypalService } from '../../../services/paypalService';
import { authService } from '../../../services/authService';
import { PaymentProviderConfig } from '../../../types';

interface PayPalFormProps {
    isConnected: boolean;
    onStatusChange: (providerId: string, connected: boolean) => void;
}

export const PayPalForm: React.FC<PayPalFormProps> = ({ isConnected, onStatusChange }) => {
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPreferred, setIsPreferred] = useState(localStorage.getItem('flux_preferred_provider') === 'paypal');

    useEffect(() => {
        const checkPreferred = () => setIsPreferred(localStorage.getItem('flux_preferred_provider') === 'paypal');
        window.addEventListener('storage', checkPreferred);
        return () => window.removeEventListener('storage', checkPreferred);
    }, []);

    const handleConnect = async () => {
        if (!clientId || !clientSecret) return;
        setIsLoading(true);
        try {
            await paypalService.authenticate(clientId, clientSecret);
            const config: PaymentProviderConfig = { providerId: 'paypal', clientId, clientSecret, isConnected: true };
            await authService.updatePaymentConfig(config);
            onStatusChange('paypal', true);
        } catch (e) { 
            alert("Erro na conexão com PayPal"); 
        } finally { setIsLoading(false); }
    };

    const handleSetPreferred = () => {
        localStorage.setItem('flux_preferred_provider', 'paypal');
        setIsPreferred(true);
        window.dispatchEvent(new Event('storage'));
    };

    const handleDisconnect = async () => {
        if (!window.confirm("Deseja desconectar o PayPal?")) return;
        setIsLoading(true);
        try {
            await authService.updatePaymentConfig({ providerId: 'paypal', isConnected: false });
            if (localStorage.getItem('flux_preferred_provider') === 'paypal') {
                localStorage.removeItem('flux_preferred_provider');
            }
            onStatusChange('paypal', false);
        } catch (e) {
            alert("Erro ao desconectar");
        } finally { setIsLoading(false); }
    };

    if (isConnected) {
        return (
            <div className="animate-fade-in" style={{textAlign:'center', padding:'10px'}}>
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="feedback-msg success !mt-0">
                        <i className="fa-solid fa-circle-check"></i> PayPal Conectado
                    </div>
                    <button 
                        onClick={handleSetPreferred}
                        className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all ${isPreferred ? 'text-[#00c2ff] border-[#00c2ff]/50 bg-[#00c2ff]/10' : 'text-gray-400 hover:text-[#00c2ff]'}`}
                        title="Ver no Painel"
                    >
                        <i className="fa-solid fa-eye"></i>
                    </button>
                </div>
                <button className="disconnect-btn" onClick={handleDisconnect} disabled={isLoading}>
                    {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Desconectar'}
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="input-group">
                <label>Client ID</label>
                <input type="text" value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="PayPal Client ID" />
            </div>
            <div className="input-group">
                <label>Secret Key</label>
                <input type="password" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} placeholder="PayPal Secret Key" />
            </div>
            <button className="save-btn" onClick={handleConnect} disabled={isLoading}>
                {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Conectar PayPal'}
            </button>
        </div>
    );
};
