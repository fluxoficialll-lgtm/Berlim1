
import { pixelOrchestrator } from '../PixelOrchestrator';
import { Group } from '../../../types';
import { authService } from '../../authService';

/**
 * VipSalesTracker: Orquestra o rastreio específico da página de vendas VIP.
 */
export const vipSalesTracker = {
  
  isOwner(group: Group): boolean {
    const user = authService.getCurrentUser();
    if (!user) return false;
    return group.creatorId === user.id || group.creatorEmail === user.email;
  },

  /**
   * Chamado ao carregar a porta do VIP. Dispara PageView e ViewContent.
   */
  trackLanding: (group: Group) => {
    if (vipSalesTracker.isOwner(group)) return;

    pixelOrchestrator.init({
      metaId: group.pixelId,
      pixelToken: group.pixelToken
    });

    // Dispara PageView passando o contexto do grupo para a trava de singleton
    pixelOrchestrator.track('PageView', {
      content_ids: [group.id],
      content_type: 'product_group'
    });

    // Dispara ViewContent com dados do produto
    pixelOrchestrator.track('ViewContent', {
      content_name: group.name,
      content_ids: [group.id],
      content_type: 'product_group',
      value: parseFloat(group.price || '0'),
      currency: group.currency || 'BRL'
    });
  },

  /**
   * Rastreia quando o usuário interage com a galeria de mídias do VIP.
   */
  trackGalleryInteraction: (group: Group) => {
    if (vipSalesTracker.isOwner(group)) return;
    
    pixelOrchestrator.track('GalleryInteraction', {
      content_name: group.name,
      content_ids: [group.id],
      content_type: 'product_group'
    });
  },

  trackLead: (group: Group, email: string) => {
    if (vipSalesTracker.isOwner(group)) return;

    pixelOrchestrator.track('Lead', {
      content_name: group.name,
      content_ids: [group.id],
      content_type: 'product_group'
    }, { email });
  },

  trackCheckoutIntent: (group: Group) => {
    if (vipSalesTracker.isOwner(group)) return;

    pixelOrchestrator.track('InitiateCheckout', {
      content_name: group.name,
      content_ids: [group.id],
      value: parseFloat(group.price || '0'),
      currency: group.currency || 'BRL'
    });
  },

  trackAddPaymentInfo: (group: Group, method: string, conversion?: any) => {
    if (vipSalesTracker.isOwner(group)) return;

    pixelOrchestrator.track('AddPaymentInfo', {
      content_name: group.name,
      content_ids: [group.id],
      content_type: 'product_group',
      value: conversion?.amount || parseFloat(group.price || '0'),
      currency: conversion?.currency || group.currency || 'BRL',
      payment_method: method
    });
  },

  trackTimeStay60s: (group: Group) => {
    if (vipSalesTracker.isOwner(group)) return;
    pixelOrchestrator.track('TimeStay60s', {
      content_name: group.name,
      content_ids: [group.id],
      content_type: 'product_group'
    });
  }
};
