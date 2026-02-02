import { Group, User } from '../../../types';

/**
 * Engine de Permissões Flux
 * Centraliza a inteligência de segurança para evitar bypass de UI.
 */
export const GroupPermissions = {
  isAdmin: (group: Group, userId: string): boolean => {
    return group.creatorId === userId || group.adminIds?.includes(userId) || false;
  },

  canDeleteMessage: (group: Group, userId: string, messageAuthorId: string): boolean => {
    if (group.creatorId === userId) return true; // Dono apaga tudo
    if (messageAuthorId === userId) return true; // Autor apaga a própria
    
    // Moderadores com permissão específica
    const userRole = group.roles?.find(r => group.memberIds?.includes(userId)); // Simplificação para lógica de roles
    return userRole?.permissions.canDeleteMessages || false;
  },

  canPost: (group: Group, userId: string, channelId?: string): boolean => {
    const isAdm = GroupPermissions.isAdmin(group, userId);
    if (isAdm) return true;

    // Verifica modo somente leitura do grupo ou canal
    if (group.settings?.onlyAdminsPost) return false;
    
    const channel = group.channels?.find(c => c.id === channelId);
    if (channel?.onlyAdminsPost) return false;

    return true;
  },

  hasVipAccess: (group: Group, userId: string): boolean => {
    if (group.creatorId === userId) return true;
    if (!group.isVip) return true;
    // Aqui integraria com a tabela de assinaturas reais do banco
    return group.memberIds?.includes(userId) || false;
  }
};