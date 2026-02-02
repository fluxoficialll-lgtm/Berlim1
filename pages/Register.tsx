
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { AuthError } from '../types';
import { RegisterCard } from '../features/auth/components/RegisterCard';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [errors, setErrors] = useState<{email?: string, password?: string, confirm?: string, form?: string}>({});
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [referredBy, setReferredBy] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) setReferredBy(ref);

    const newErrors: any = {};
    if (email && !authService.isValidEmail(email)) newErrors.email = AuthError.INVALID_FORMAT;
    if (password && password.length < 6) newErrors.password = AuthError.PASSWORD_TOO_SHORT;
    if (confirmPassword && password !== confirmPassword) newErrors.confirm = AuthError.PASSWORDS_DONT_MATCH;

    setErrors(newErrors);
    const allFilled = email && password && confirmPassword && termsAccepted;
    setIsValid(!!allFilled && Object.keys(newErrors).length === 0);
  }, [email, password, confirmPassword, termsAccepted, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    try {
      await authService.register(email, password, referredBy || undefined);
      navigate('/verify-email');
    } catch (err: any) {
      setErrors(prev => ({ ...prev, form: err.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-[#0c0f14] text-white font-['Inter'] flex items-center justify-center p-5">
        <header className="fixed top-0 left-0 w-full flex justify-start p-5 z-10">
            <button onClick={() => navigate('/')} className="bg-white/10 p-2 rounded-full border border-[#00c2ff] text-[#00c2ff]">
                <i className="fa-solid fa-arrow-left"></i>
            </button>
        </header>

        <RegisterCard 
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted}
            errors={errors} loading={loading} isValid={isValid} referredBy={referredBy}
            onSubmit={handleSubmit}
        />
    </div>
  );
};
