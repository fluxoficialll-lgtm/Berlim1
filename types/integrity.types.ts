
export enum ViolationType {
    SPAM = 'SPAM',
    TOXICITY = 'TOXICITY',
    HARASSMENT = 'HARASSMENT',
    INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
    BAN_EVASION = 'BAN_EVASION',
    FRAUD = 'FRAUD'
}

export enum StrikeLevel {
    WARNING = 1,
    RESTRICTION = 2,
    TERMINATION = 3
}

export interface IntegrityLog {
    id: string;
    userId: string;
    type: ViolationType;
    severity: number; // 0-100
    evidence: string; // Conteúdo que gerou a violação
    timestamp: number;
    metadata: {
        deviceId: string;
        location?: string;
        context?: string; // Últimas mensagens para análise
    };
}

export interface UserIntegrityProfile {
    score: number; // 0-1000
    strikes: number;
    isShadowBanned: boolean;
    lastViolation?: number;
    history: IntegrityLog[];
}
