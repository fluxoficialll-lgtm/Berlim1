
import { randomUUID } from 'crypto';

/**
 * Módulo centralizado para geração de Identificadores Únicos Universais (UUIDs).
 * Utiliza prefixos para tornar os IDs auto-descritivos, facilitando a depuração e a manutenção.
 * 
 * Exemplo de ID de usuário: usr_b17a2a78-c51a-428a-96b6-583f7336b3e2
 */

// Enum para os prefixos, garantindo consistência e evitando erros de digitação.
const Prefixes = {
    USER: 'usr',
    POST: 'post',
    COMMENT: 'cmt',
    GROUP: 'grp',
    PAYMENT: 'pay',
    TRANSACTION: 'txn', // Para uma cobrança ou reembolso específico dentro de um pagamento
    FILE: 'file',
    SESSION: 'ses',
    REPORT: 'rpt',      // Para denúncias de conteúdo
};

/**
 * Função base que gera um UUID v4.
 * @returns {string} Um UUID padrão. Ex: 'b17a2a78-c51a-428a-96b6-583f7336b3e2'
 */
const generate = () => randomUUID();

/**
 * Gera um ID prefixado.
 * @param {string} prefix - O prefixo da entidade (ex: 'usr').
 * @returns {string} Um ID completo e prefixado.
 */
const generatePrefixedId = (prefix) => `${prefix}_${generate()}`;

export const idManager = {
    /** Gera um ID para um novo Usuário. */
    user: () => generatePrefixedId(Prefixes.USER),

    /** Gera um ID para um novo Post. */
    post: () => generatePrefixedId(Prefixes.POST),

    /** Gera um ID para um novo Comentário. */
    comment: () => generatePrefixedId(Prefixes.COMMENT),

    /** Gera um ID para um novo Grupo. */
    group: () => generatePrefixedId(Prefixes.GROUP),

    /** Gera um ID para uma intenção de Pagamento. */
    payment: () => generatePrefixedId(Prefixes.PAYMENT),

    /** Gera um ID para uma Transação financeira específica (cobrança, estorno). */
    transaction: () => generatePrefixedId(Prefixes.TRANSACTION),

    /** Gera um ID para um Arquivo (upload no R2). */
    file: () => generatePrefixedId(Prefixes.FILE),

    /** Gera um ID para uma Sessão de usuário. */
    session: () => generatePrefixedId(Prefixes.SESSION),

    /** Gera um ID para uma Denúncia (Report). */
    report: () => generatePrefixedId(Prefixes.REPORT),

    /** Gera um UUID puro, sem prefixo, para casos especiais. */
    generic: () => generate(),
};
