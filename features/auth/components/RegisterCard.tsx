import React from 'react';
import { Link } from 'react-router-dom';

interface RegisterCardProps {
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    confirmPassword: string;
    setConfirmPassword: (v: string) => void;
    termsAccepted: boolean;
    setTermsAccepted: (v: boolean) => void;
    errors: { email?: string; password?: string; confirm?: string; form?: string };
    loading: boolean;
    isValid: boolean;
    referredBy: string | null;
    onSubmit: (e: React.FormEvent) => void;
}

export const RegisterCard: React.FC<RegisterCardProps> = ({
    email, setEmail, password, setPassword, confirmPassword, setConfirmPassword,
    termsAccepted, setTermsAccepted, errors, loading, isValid, referredBy, onSubmit
}) => {
    return (
        <div className="w-full max-w-[400px] bg-white/5 backdrop-blur-2xl rounded-[32px] p-10 border border-white/10 shadow-2xl flex flex-col items-center animate-fade-in">
            {/* Flux Logo Icon */}
            <div className="mb-8 w-[70px] h-[70px] bg-white/5 rounded-2xl flex items-center justify-center relative border border-white/10 shadow-[0_0_30px_rgba(0,194,255,0.2)]">
                <div className="absolute w-[45px] h-[25px] rounded-[50%] border-[3.5px] border-[#00c2ff] rotate-[25deg]"></div>
                <div className="absolute w-[45px] h-[25px] rounded-[50%] border-[3.5px] border-[#00c2ff] -rotate-[25deg]"></div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2 text-white">Criar Conta Flux</h1>
            <p className="text-gray-400 text-sm text-center mb-8 leading-relaxed">
                Junte-se à nossa plataforma de conexão.
            </p>

            {referredBy && (
                <div className="mb-6 w-full text-[10px] font-black uppercase tracking-widest bg-[#FFD7001a] border border-[#FFD70033] p-3 rounded-xl text-[#FFD700] flex items-center justify-center gap-2">
                    <i className="fa-solid fa-handshake"></i> Indicação Ativa
                </div>
            )}

            <form onSubmit={onSubmit} className="w-full space-y-4">
                <div className="relative">
                    <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
                    <input 
                        type="email" 
                        placeholder="E-mail"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3.5 pl-11 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-[#00c2ff] transition-all placeholder-gray-600"
                    />
                    {errors.email && <span className="text-[10px] text-red-400 font-bold mt-1 block ml-1 uppercase">{errors.email}</span>}
                </div>

                <div className="relative">
                    <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
                    <input 
                        type="password" 
                        placeholder="Senha"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3.5 pl-11 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-[#00c2ff] transition-all placeholder-gray-600"
                    />
                    {errors.password && <span className="text-[10px] text-red-400 font-bold mt-1 block ml-1 uppercase">{errors.password}</span>}
                </div>

                <div className="relative">
                    <i className="fa-solid fa-shield-check absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
                    <input 
                        type="password" 
                        placeholder="Confirmar Senha"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3.5 pl-11 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-[#00c2ff] transition-all placeholder-gray-600"
                    />
                    {errors.confirm && <span className="text-[10px] text-red-400 font-bold mt-1 block ml-1 uppercase">{errors.confirm}</span>}
                </div>

                <div className="flex items-center px-1 mb-2">
                    <input 
                        type="checkbox" 
                        id="acceptTerms"
                        required
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-4 h-4 rounded border-white/10 bg-black/20 text-[#00c2ff] focus:ring-[#00c2ff] cursor-pointer"
                    />
                    <label htmlFor="acceptTerms" className="ml-3 text-xs text-gray-400 cursor-pointer">
                        Aceito os <a href="#" className="text-[#00c2ff] hover:underline font-bold">Termos de Uso</a>
                    </label>
                </div>

                {errors.form && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[11px] text-center font-bold">
                        {errors.form}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={!isValid || loading}
                    className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-xl hover:bg-[#00aaff] transition-all shadow-lg shadow-[#00c2ff]/20 disabled:opacity-50 active:scale-[0.98] uppercase tracking-widest text-sm"
                >
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Criar Conta'}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 w-full text-center">
                <p className="text-gray-500 text-xs">
                    Já possui uma conta? <Link to="/" className="text-[#00c2ff] hover:underline font-bold ml-1">ENTRAR</Link>
                </p>
            </div>
        </div>
    );
};