
import React, { useState, useEffect } from 'react';
import { stripeService } from '../../../services/stripeService';
import { authService } from '../../../services/authService';
import { PaymentProviderConfig } from '../../../types';

interface StripeFormProps {
    isConnected: boolean;
    onStatusChange: (providerId: string, connected: boolean) => void;
}

export const StripeForm: React.FC<StripeFormProps> = ({ isConnected, onStatusChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [secretKey, setSecretKey] = useState('');
    const [isPreferred, setIsPreferred] = useState(localStorage.getItem('flux_preferred_provider') === 'stripe');

    useEffect(() => {
        const checkPreferred = () => setIsPreferred(localStorage.getItem('flux_preferred_provider') === 'stripe');
        window.addEventListener('storage', checkPreferred);
        return () => window.removeEventListener('storage', checkPreferred);
    }, []);

    const handleConnect = async () => {
        if (!secretKey) return;
        setIsLoading(true);
        try {
            await stripeService.authenticate(secretKey);
            const config: PaymentProviderConfig = { providerId: 'stripe', clientSecret: secretKey, isConnected: true };
            await authService.updatePaymentConfig(config);
            onStatusChange('stripe', true);
        } catch (err: any) { 
            alert("Erro na conexão com Stripe"); 
        } finally { setIsLoading(false); }
    };

    const handleSetPreferred = () => {
        localStorage.setItem('flux_preferred_provider', 'stripe');
        setIsPreferred(true);
        window.dispatchEvent(new Event('storage'));
    };

    const handleDisconnect = async () => {
        if (!window.confirm("Deseja desconectar a Stripe?")) return;
        setIsLoading(true);
        try {
            await authService.updatePaymentConfig({ providerId: 'stripe', isConnected: false });
            if (localStorage.getItem('flux_preferred_provider') === 'stripe') {
                localStorage.removeItem('flux_preferred_provider');
            }
            onStatusChange('stripe', false);
        } catch (e) {
            alert("Erro ao desconectar");
        } finally { setIsLoading(false); }
    };

    if (isConnected) {
        return (
            <div className="animate-fade-in" style={{textAlign:'center', padding:'10px'}}>
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="feedback-msg success !mt-0">
                        <i className="fa-solid fa-circle-check"></i> Stripe Conectada
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
                <label>Secret Key (sk_...)</label>
                <input type="password" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} placeholder="Sua sk_live ou sk_test" />
            </div>
            <button className="save-btn" onClick={handleConnect} disabled={isLoading}>
                {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Conectar Stripe'}
            </button>
        </div>
    );
};
