
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { CodeVerificationCard } from '../features/auth/components/CodeVerificationCard';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const email = authService.getCurrentUserEmail();

  useEffect(() => {
    if (!email) { navigate('/register'); return; }
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { setCanResend(true); clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (email) {
        await authService.verifyCode(email, code.join(''));
        navigate('/complete-profile');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;
    setCanResend(false); setTimer(30);
    try { await authService.sendVerificationCode(email); } catch (err: any) { setError(err.message); setCanResend(true); }
  };

  return (
    <div className="h-screen w-full bg-[#0c0f14] text-white font-['Inter'] flex items-center justify-center p-5">
      <header className="fixed top-0 left-0 w-full p-5 z-10">
        <button onClick={() => navigate('/register')} className="bg-white/10 p-2 rounded-full border border-[#00c2ff] text-[#00c2ff]">
            <i className="fa-solid fa-arrow-left"></i>
        </button>
      </header>

      <CodeVerificationCard 
        email={email || ''} code={code} setCode={setCode}
        onInput={(idx, val) => {
            const n = [...code]; n[idx] = val.slice(-1); setCode(n);
            if(val && idx < 5) inputsRef.current[idx+1]?.focus();
        }}
        onKeyDown={(idx, e) => { if(e.key === 'Backspace' && !code[idx] && idx > 0) inputsRef.current[idx-1]?.focus(); }}
        onPaste={(e) => {
            e.preventDefault();
            const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0,6);
            const n = [...code]; p.split('').forEach((c, i) => n[i] = c); setCode(n);
        }}
        onSubmit={handleVerify} onResend={handleResend}
        timer={timer} canResend={canResend} loading={loading} error={error}
        inputsRef={inputsRef} title="Verificação de E-mail"
        subtitle="Enviamos o código para o seu e-mail cadastrado."
      />
    </div>
  );
};
