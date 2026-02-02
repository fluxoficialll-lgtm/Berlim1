import React from 'react';

interface CodeVerificationCardProps {
    email: string;
    code: string[];
    setCode: (code: string[]) => void;
    onInput: (index: number, value: string) => void;
    onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
    onPaste: (e: React.ClipboardEvent) => void;
    onSubmit: (e: React.FormEvent) => void;
    onResend: () => void;
    timer: number;
    canResend: boolean;
    loading: boolean;
    error: string;
    title?: string;
    subtitle?: string;
    inputsRef: React.MutableRefObject<(HTMLInputElement | null)[]>;
}

export const CodeVerificationCard: React.FC<CodeVerificationCardProps> = ({
    email, code, onInput, onKeyDown, onPaste, onSubmit, onResend, 
    timer, canResend, loading, error, title, subtitle, inputsRef
}) => {
    const isFilled = code.every(c => c !== '');

    return (
        <div className="w-full max-w-[400px] bg-white/5 backdrop-blur-2xl rounded-[32px] p-10 border border-white/10 shadow-2xl flex flex-col items-center animate-fade-in mx-auto">
            {/* Flux Logo Icon */}
            <div className="mb-8 w-[70px] h-[70px] bg-white/5 rounded-2xl flex items-center justify-center relative border border-white/10 shadow-[0_0_30px_rgba(0,194,255,0.2)]">
                <div className="absolute w-[45px] h-[25px] rounded-[50%] border-[3.5px] border-[#00c2ff] rotate-[25deg]"></div>
                <div className="absolute w-[45px] h-[25px] rounded-[50%] border-[3.5px] border-[#00c2ff] -rotate-[25deg]"></div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2 text-white">{title || 'Verificação'}</h1>
            <p className="text-gray-400 text-sm text-center mb-8 leading-relaxed px-2">
                {subtitle || `Enviamos o código para o seu e-mail.`}
            </p>

            <form onSubmit={onSubmit} className="w-full flex flex-col items-center">
                <div className="flex justify-center gap-2 mb-8">
                    {code.map((digit, index) => (
                        <input 
                            key={index}
                            ref={el => { inputsRef.current[index] = el }}
                            type="text" 
                            maxLength={1}
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => onInput(index, e.target.value)}
                            onKeyDown={(e) => onKeyDown(index, e)}
                            onPaste={onPaste}
                            className="w-11 h-14 text-center text-xl font-black bg-black/30 border border-white/10 rounded-xl text-[#00c2ff] outline-none focus:border-[#00c2ff] focus:bg-black/50 transition-all shadow-inner"
                            required
                        />
                    ))}
                </div>

                {error && (
                    <div className="w-full mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[11px] text-center font-bold uppercase tracking-tight">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={!isFilled || loading}
                    className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-xl hover:bg-[#00aaff] transition-all shadow-lg shadow-[#00c2ff]/20 disabled:opacity-50 active:scale-[0.98] uppercase tracking-widest text-sm"
                >
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'VERIFICAR'}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 w-full text-center">
                <button 
                    type="button"
                    onClick={onResend}
                    disabled={!canResend}
                    className="text-xs font-bold text-gray-500 hover:text-[#00c2ff] transition-colors disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-tighter"
                >
                    {canResend ? 'Reenviar novo código' : `Aguarde ${timer}s para reenviar`}
                </button>
            </div>
        </div>
    );
};