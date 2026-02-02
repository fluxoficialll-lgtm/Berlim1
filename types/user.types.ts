
import { UserDNA } from './dna.types';
import { PaymentProviderConfig, NotificationSettings, SecuritySettings, MarketingConfig } from './financial.types';

export interface User {
  id: string;
  email: string;
  password?: string; 
  isVerified: boolean;
  isProfileCompleted: boolean;
  profile?: UserProfile;
  googleId?: string;
  paymentConfig?: PaymentProviderConfig; 
  paymentConfigs?: Record<string, PaymentProviderConfig>;
  notificationSettings?: NotificationSettings; 
  securitySettings?: SecuritySettings; 
  marketingConfig?: MarketingConfig;
  language?: string;
  lastSeen?: number; 
  sessions?: UserSession[];
  changeHistory?: ChangeHistory;
  referredById?: string;
  
  // Integrity Fields
  trustScore?: number; // 0-1000
  strikes?: number; // 0-3
  isShadowBanned?: boolean;
  
  isDailyLimitExceeded?: boolean;
  isBanned?: boolean;
  banReason?: string;
  dna?: UserDNA;
}

export interface UserProfile {
  name: string; 
  nickname?: string; 
  bio?: string;
  website?: string;
  photoUrl?: string;
  isPrivate: boolean;
  cpf?: string;
  phone?: string;
  marketingConfig?: MarketingConfig;
}

export interface UserSession {
    id: string;
    device: string;
    location: string;
    timestamp: number;
    isActive: boolean;
}

export interface ChangeHistory {
    usernameChanges: number[];
    nicknameChanges: number[];
}

export enum AuthError {
  USER_NOT_FOUND = "Gmail não existe",
  WRONG_PASSWORD = "Senha incorreta",
  EMAIL_NOT_VERIFIED = "Verifique seu email",
  INVALID_FORMAT = "Formato inválido",
  ALREADY_EXISTS = "Email já cadastrado",
  PASSWORD_TOO_SHORT = "Senha muito curta",
  PASSWORDS_DONT_MATCH = "Senhas não coincidem",
  TERMS_REQUIRED = "Aceite os termos",
  CODE_INVALID = "Código incorreto",
  CODE_EXPIRED = "Código expirado",
  TOO_MANY_ATTEMPTS = "Muitas tentativas. Bloqueado por 24h.",
  NAME_TAKEN = "Nome indisponível",
  NAME_REQUIRED = "Nome obrigatório",
  GENERIC = "Ocorreu um erro",
  ACCOUNT_BANNED = "🚫 CONTA BANIDA: Violação dos Termos"
}
