
import { AdCampaign } from '../types';

export const MOCK_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'camp-pending-001',
    ownerId: 'u-creator-002', 
    ownerEmail: 'creator@test.com',
    name: 'Campanha em Aprovação',
    scheduleType: 'continuous',
    budget: 50.00,
    trafficObjective: 'visits',
    pricingModel: 'budget',
    creative: {
      text: 'Este anúncio está aguardando o pagamento para entrar em veiculação global.',
      mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000',
      mediaType: 'image'
    },
    campaignObjective: 'traffic',
    destinationType: 'url',
    targetUrl: 'https://flux.com',
    optimizationGoal: 'clicks',
    placements: ['feed', 'marketplace'],
    ctaButton: 'saiba mais',
    status: 'pending', // STATUS PENDENTE PARA TRIGGER DE PAGAMENTO
    timestamp: Date.now(),
    stats: {
        views: 0,
        clicks: 0,
        conversions: 0
    }
  },
  {
    id: 'camp-001',
    ownerId: 'u-creator-002', 
    ownerEmail: 'creator@test.com',
    name: 'Lançamento Mentoria Flux',
    scheduleType: 'continuous',
    budget: 1500.00,
    trafficObjective: 'conversions',
    pricingModel: 'budget',
    creative: {
      text: 'Quer faturar como os grandes? Entre para o nosso grupo VIP agora!',
      mediaUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop',
      mediaType: 'image'
    },
    campaignObjective: 'sales',
    destinationType: 'group',
    targetGroupId: 'g-vip-001',
    optimizationGoal: 'group_joins',
    placements: ['feed', 'reels'],
    ctaButton: 'assinar',
    status: 'active',
    timestamp: Date.now() - 86400000,
    stats: {
        views: 12500,
        clicks: 840,
        conversions: 45
    }
  },
  {
    id: 'camp-002',
    ownerId: 'u-creator-002',
    ownerEmail: 'creator@test.com',
    name: 'Retargeting iPhone 15',
    scheduleType: 'date',
    startDate: Date.now(),
    endDate: Date.now() + 604800000,
    budget: 500.00,
    trafficObjective: 'visits',
    pricingModel: 'budget',
    creative: {
      text: 'Você viu mas não comprou. O iPhone 15 Pro com desconto acaba hoje!',
      mediaUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
      mediaType: 'image'
    },
    campaignObjective: 'traffic',
    destinationType: 'url',
    targetUrl: 'https://flux.com/marketplace/product/prod-001',
    optimizationGoal: 'clicks',
    placements: ['feed', 'marketplace'],
    ctaButton: 'comprar',
    status: 'active',
    timestamp: Date.now(),
    stats: {
        views: 3200,
        clicks: 410,
        conversions: 12
    }
  },
  {
    id: 'camp-003',
    ownerId: 'u-creator-002',
    ownerEmail: 'creator@test.com',
    name: 'Algoritmo de Vendas (CPA)',
    scheduleType: 'continuous',
    budget: 0,
    trafficObjective: 'engagement',
    pricingModel: 'commission',
    creative: {
      text: 'Participe do maior grupo de networking do Brasil.',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-lighting-dancing-3182-large.mp4',
      mediaType: 'video'
    },
    campaignObjective: 'engagement',
    destinationType: 'group',
    targetGroupId: 'g-vip-001',
    optimizationGoal: 'views',
    placements: ['reels'],
    ctaButton: 'entrar',
    status: 'active',
    timestamp: Date.now() - 3600000,
    stats: {
        views: 89000,
        clicks: 12400,
        conversions: 0
    }
  }
];
