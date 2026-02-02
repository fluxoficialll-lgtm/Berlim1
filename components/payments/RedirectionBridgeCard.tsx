
import React from 'react';

export type RedirectionProvider = 'paypal' | 'stripe' | 'stripe_link' | 'wallet' | 'generic';

interface RedirectionBridgeCardProps {
    provider: RedirectionProvider;
    price: string;
    onConfirm: () => void;
    onBack: () => void;
    isLoading?: boolean;
}

const PROVIDER_DATA = {
    paypal: {
        name: 'PayPal',
        icon: 'fa-brands fa-paypal',
        color: '#003087',
        accent: '#00cfff',
        msg: 'Você será levado ao ambiente oficial do PayPal para concluir sua transação com segurança.'
    },
    stripe: {
        name: 'Stripe',
        icon: 'fa-brands fa-stripe',
        color: '#635bff',
        accent: '#80e9ff',
        msg: 'Conclua seu pagamento via Checkout Seguro Stripe. Seus dados estão protegidos por criptografia de ponta a ponta.'
    },
    stripe_link: {
        name: 'Stripe Link',
        icon: 'fa-solid fa-link',
        color: '#00d66f',
        accent: '#ffffff',
        msg: 'Finalize sua compra em 1-clique. O sistema enviará um código SMS para confirmar sua identidade na Stripe.'
    },
    wallet: {
        name: 'Apple / Google Pay',
        icon: 'fa-solid fa-wallet',
        color: '#ffffff',
        accent: '#000000',
        msg: 'Ativando carteira digital. Você usará a biometria ou senha do seu dispositivo para autorizar o pagamento.'
    },
    generic: {
        name: 'Gateway Seguro',
        icon: 'fa-solid fa-shield-halved',
        color: '#00c2ff',
        accent: '#00ff82',
        msg: 'Estamos preparando sua conexão segura com o provedor de pagamentos.'
    }
};

export const RedirectionBridgeCard: React.FC<RedirectionBridgeCardProps> = ({ 
    provider, price, onConfirm, onBack, isLoading 
}) => {
    const data = PROVIDER_DATA[provider] || PROVIDER_DATA.generic;
    const isWallet = provider === 'wallet';

    return (
        <div className="redirection-bridge animate-fade-in flex flex-col items-center">
            <style>{`
                .bridge-container {
                    width: 100%;
                    padding: 20px 10px;
                }
                .provider-shield {
                    width: 70px;
                    height: 70px;
                    background: ${isWallet ? 'rgba(255,255,255,0.1)' : data.color + '1a'};
                    border: 2px solid ${isWallet ? 'rgba(255,255,255,0.2)' : data.color + '44'};
                    border-radius: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    color: ${isWallet ? '#fff' : data.color};
                    margin: 0 auto 20px;
                    box-shadow: 0 10px 25px ${isWallet ? 'rgba(0,0,0,0.2)' : data.color + '22'};
                    position: relative;
                }
                .secure-badge {
                    position: absolute;
                    bottom: -8px;
                    background: #00ff82;
                    color: #000;
                    font-size: 8px;
                    font-weight: 900;
                    padding: 2px 8px;
                    border-radius: 20px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 4px 10px rgba(0,255,130,0.3);
                }
                .price-tag-bridge {
                    font-size: 28px;
                    font-weight: 900;
                    color: #fff;
                    margin-bottom: 8px;
                }
                .redirect-msg {
                    font-size: 13px;
                    color: #888;
                    line-height: 1.6;
                    padding: 0 20px;
                    margin-bottom: 30px;
                }
                .confirm-redirect-btn {
                    width: 100%;
                    padding: 18px;
                    background: ${isWallet ? '#fff' : data.color};
                    color: ${isWallet ? '#000' : '#fff'};
                    border: none;
                    border-radius: 16px;
                    font-weight: 800;
                    font-size: 15px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: 0.3s;
                    box-shadow: 0 10px 30px ${isWallet ? 'rgba(255,255,255,0.1)' : data.color + '44'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }
                .confirm-redirect-btn:hover {
                    filter: brightness(1.1);
                    transform: translateY(-2px);
                }
                .confirm-redirect-btn:active {
                    transform: scale(0.98);
                }
                .back-link {
                    margin-top: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    color: #444;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    cursor: pointer;
                    background: none;
                    border: none;
                    transition: 0.2s;
                }
                .back-link:hover { color: #fff; }
            `}</style>

            <div className="bridge-container">
                <div className="provider-shield">
                    <i className={data.icon}></i>
                    <div className="secure-badge">
                        <i className="fa-solid fa-lock mr-1"></i> Protegido
                    </div>
                </div>

                <div className="price-tag-bridge">{price}</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">Total a pagar via {data.name}</div>

                <p className="redirect-msg">{data.msg}</p>

                <button 
                    className="confirm-redirect-btn" 
                    onClick={onConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                    ) : (
                        <>
                            <span>{isWallet ? 'Pagar agora' : 'Confirmar e Ir'}</span>
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </>
                    )}
                </button>

                <button className="back-link" onClick={onBack}>
                    <i className="fa-solid fa-arrow-left mr-2"></i> Alterar Método
                </button>
            </div>
        </div>
    );
};
