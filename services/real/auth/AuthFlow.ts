
import { User, AuthError } from '../../../types';
import { emailService } from '../../emailService';
import { cryptoService } from '../../cryptoService';
import { API_BASE } from '../../../apiConfig';
import { db } from '@/database';
import { AccountSyncService } from '../../sync/AccountSyncService';
import { hydrationManager } from '../../sync/HydrationManager';
import { USE_MOCKS, MOCK_USERS } from '../../../mocks';

const API_URL = `${API_BASE}/api/auth`;

export const AuthFlow = {
    async performLoginSync(user: User) {
        // Persistência mínima local
        db.users.set(user);
        localStorage.setItem('cached_user_profile', JSON.stringify(user));
        localStorage.setItem('user_id', user.id); 
        db.auth.setCurrentUserId(user.id);
        
        // Sinaliza ao gerenciador que a autenticação básica está pronta
        hydrationManager.markReady('AUTH');
        
        // DELEGAÇÃO DE RESPONSABILIDADE: 
        // O motor de sincronização assume o controle total daqui em diante.
        if (!USE_MOCKS) {
            // Executado em background para não travar a animação de login
            AccountSyncService.performFullSync().catch(console.error);
        }
    },

    async login(email: string, password: string): Promise<{ user: User; nextStep: string }> {
        if (USE_MOCKS) {
            const user = MOCK_USERS['creator'];
            localStorage.setItem('auth_token', 'mock_token_' + Date.now());
            await this.performLoginSync(user);
            return { user, nextStep: '/feed' };
        }

        const safeEmail = String(email || '').toLowerCase().trim();
        const hashed = await cryptoService.hashPassword(password);
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: safeEmail, password: hashed })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Falha no login.");

        localStorage.setItem('auth_token', data.token);
        await this.performLoginSync(data.user);
        return { user: data.user, nextStep: data.user.isBanned ? '/banned' : (!data.user.isProfileCompleted ? '/complete-profile' : '/feed') };
    },

    async loginWithGoogle(googleToken?: string, referredBy?: string): Promise<{ user: User; nextStep: string }> {
        if (USE_MOCKS) {
            const user = MOCK_USERS['user'];
            localStorage.setItem('auth_token', 'mock_token_g_' + Date.now());
            await this.performLoginSync(user);
            return { user, nextStep: '/feed' };
        }

        const response = await fetch(`${API_URL}/google`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ googleToken, referredBy: referredBy || null }) 
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Falha no Google Auth.");
        
        localStorage.setItem('auth_token', data.token);
        await this.performLoginSync(data.user);
        return { user: data.user, nextStep: data.user.isBanned ? '/banned' : (data.isNew ? '/complete-profile' : '/feed') };
    },

    async register(email: string, password: string, referredById?: string) {
        if (!email) throw new Error("E-mail é obrigatório.");
        const safeEmail = String(email).toLowerCase().trim();
        const hashed = await cryptoService.hashPassword(password);
        localStorage.setItem('temp_register_email', safeEmail);
        localStorage.setItem('temp_register_pw', hashed);
        if (referredById) localStorage.setItem('temp_referred_by_id', referredById);
        await this.sendVerificationCode(safeEmail);
    },

    async verifyCode(email: string, code: string, isResetFlow: boolean = false) {
        if (USE_MOCKS) return true;
        if (!email) throw new Error("E-mail não identificado para verificação.");
        
        const safeEmail = String(email).toLowerCase().trim();
        const session = JSON.parse(localStorage.getItem(`verify_${safeEmail}`) || '{}');
        if (!session.code || Date.now() > session.expiresAt) throw new Error(AuthError.CODE_EXPIRED);
        if (session.code !== code) throw new Error(AuthError.CODE_INVALID);
        
        if (!isResetFlow) {
            const response = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: safeEmail, 
                    password: localStorage.getItem('temp_register_pw'), 
                    isVerified: true, 
                    referredById: localStorage.getItem('temp_referred_by_id') || undefined,
                    profile: { name: safeEmail.split('@')[0].replace(/[^a-z0-9]/g, ''), nickname: 'Novo Usuário', isPrivate: false }
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            await this.performLoginSync(data.user);
            localStorage.setItem('auth_token', 'session_' + Date.now());
        }
        return true;
    },

    async sendVerificationCode(email: string, type: 'register' | 'reset' = 'register') {
        if (!email) return;
        const safeEmail = String(email).toLowerCase().trim();
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem(`verify_${safeEmail}`, JSON.stringify({ code, expiresAt: Date.now() + 900000 }));
        if (!USE_MOCKS) await emailService.sendVerificationCode(safeEmail, code, type);
        else alert(`[DEMO] Código: ${code}`);
    },

    async resetPassword(email: string, password: string) {
        if (!email) throw new Error("E-mail é obrigatório.");
        const safeEmail = String(email).toLowerCase().trim();
        const hashed = await cryptoService.hashPassword(password);
        const res = await fetch(`${API_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: safeEmail, password: hashed })
        });
        return res.json();
    }
};
