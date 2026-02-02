import React from 'react';
import { Link } from 'react-router-dom';

interface RecoveryEmailCardProps {
    email: string;
    setEmail: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    btnText: string;
    btnColorClass: string;
}

export const RecoveryEmailCard: React.FC<RecoveryEmailCardProps> = ({
    email, setEmail, onSubmit, loading, btnText, btnColorClass
}) => {
    return (
        <div className="w-full max-w-[400px] bg-white/5 backdrop-blur-2xl rounded-[32px] p-10 border border-white/10 shadow-2xl flex flex-col items-center animate-fade-in mx-auto">
            {/* Flux Logo Icon */}
            <div className="mb-8 w-[70px] h-[70px] bg-white/5 rounded-2xl flex items-center justify-center relative border border-white/10 shadow-[0_0_30px_rgba(0,194,255,0.2)]">
                <div className="absolute w-[45px] h-[25px] rounded-[50%] border-[3.5px] border-[#00c2ff] rotate-[25deg]"></div>
                <div className="absolute w-[45px] h-[25px] rounded-[50%] border-[3.5px] border-[#00c2ff] -rotate-[25deg]"></div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2 text-white">Recuperar Senha</h1>
            <p className="text-gray-400 text-sm text-center mb-8 leading-relaxed">
                Insira seu e-mail para receber o código de validação.
            </p>

            <form onSubmit={onSubmit} className="w-full space-y-5">
                <div className="relative">
                    <i className="fa-solid fa-at absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
                    <input 
                        type="email" 
                        placeholder="E-mail cadastrado" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3.5 pl-11 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-[#00c2ff] transition-all placeholder-gray-600"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={!email || loading}
                    className={`w-full py-4 bg-[#00c2ff] text-black font-black rounded-xl hover:bg-[#00aaff] transition-all shadow-lg shadow-[#00c2ff]/20 disabled:opacity-50 active:scale-[0.98] uppercase tracking-widest text-sm`}
                >
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : btnText}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 w-full text-center">
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-xs font-bold flex items-center justify-center gap-2">
                    <i className="fa-solid fa-arrow-left text-[10px]"></i> VOLTAR AO LOGIN
                </Link>
            </div>
        </div>
    );
};