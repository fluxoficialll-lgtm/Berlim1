
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { RecoveryEmailCard } from '../features/auth/components/RecoveryEmailCard';
import { CodeVerificationCard } from '../features/auth/components/CodeVerificationCard';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [stage, setStage] = useState<'email' | 'code'>('email');
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [btnText, setBtnText] = useState('Enviar E-mail');
  const [btnColorClass, setBtnColorClass] = useState('bg-[#00c2ff]');
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any;
    if (timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        await authService.sendVerificationCode(email, 'reset');
        setStage('code');
        setTimer(30);
    } catch (err: any) {
        setBtnText(err.message || 'Erro');
        setBtnColorClass('bg-red-500');
        setTimeout(() => { setBtnText('Enviar E-mail'); setBtnColorClass('bg-[#00c2ff]'); }, 2000);
    } finally {
        setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await authService.verifyCode(email, code.join(''), true);
        localStorage.setItem('reset_email', email);
        navigate('/reset-password');
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleInput = (index: number, value: string) => {
      const newCode = [...code];
      newCode[index] = value.slice(-1);
      setCode(newCode);
      if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !code[index] && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      const newCode = [...code];
      paste.split('').forEach((char, i) => newCode[i] = char);
      setCode(newCode);
  };

  return (
    <div className="h-screen w-full bg-[#0c0f14] text-white font-['Inter'] flex items-center justify-center p-5">
        <header className="fixed top-0 left-0 w-full p-5 z-10">
            <button onClick={() => navigate('/')} className="bg-white/10 p-2 rounded-full border border-[#00c2ff] text-[#00c2ff]">
                <i className="fa-solid fa-arrow-left"></i>
            </button>
        </header>

        {stage === 'email' ? (
            <RecoveryEmailCard 
                email={email} setEmail={setEmail} loading={loading}
                btnText={btnText} btnColorClass={btnColorClass} onSubmit={handleEmailSubmit}
            />
        ) : (
            <CodeVerificationCard 
                email={email} code={code} setCode={setCode}
                onInput={handleInput} onKeyDown={handleKeyDown} onPaste={handlePaste}
                onSubmit={handleVerifyCode} onResend={handleEmailSubmit}
                timer={timer} canResend={timer === 0} loading={loading} error={error}
                inputsRef={inputsRef} title="Redefinir Senha"
            />
        )}
    </div>
  );
};
