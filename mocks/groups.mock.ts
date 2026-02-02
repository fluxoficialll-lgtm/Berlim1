
import { Group } from '../types';

export const MOCK_GROUPS: Group[] = [
  {
    id: 'g-vip-001',
    name: 'Networking Elite (VIP)',
    description: 'Acesso exclusivo aos maiores players do mercado digital. Networking, hacks de escala e chamadas semanais.',
    isVip: true,
    isPrivate: true,
    price: '97.00',
    currency: 'BRL',
    accessType: 'temporary',
    coverImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000&auto=format&fit=crop',
    creatorId: 'u-creator-002',
    creatorEmail: 'creator@test.com',
    memberIds: [
      'u-admin-001', 'u-user-003', 'u-creator-002', 
      'u-mock-006', 'u-mock-007', 'u-mock-008', 'u-mock-009',
      'u-mock-010', 'u-mock-011', 'u-mock-012', 'u-star-004', 'u-dev-005'
    ],
    adminIds: ['u-creator-002', 'u-admin-001', 'u-user-003'],
    pendingMemberIds: ['u-mock-010'],
    status: 'active',
    timestamp: Date.now() - 10000000,
    vipDoor: {
      text: 'O segredo da escala não está no produto, mas no networking. Entre para o time que fatura 6 dígitos por mês.',
      buttonText: 'ASSINAR ACESSO VIP',
      mediaItems: [
          { url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000&auto=format&fit=crop', type: 'image' }
      ]
    }
  },
  {
    id: 'g-vip-002',
    name: 'Sinais de Cripto Pro',
    description: 'Análises diárias de Bitcoin e Altcoins. Entradas e saídas em tempo real.',
    isVip: true,
    isPrivate: true,
    price: '149.90',
    currency: 'BRL',
    accessType: 'temporary',
    coverImage: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000&auto=format&fit=crop',
    creatorId: 'u-admin-001',
    creatorEmail: 'admin@flux.com',
    memberIds: ['u-admin-001', 'u-creator-002', 'u-mock-008'],
    adminIds: ['u-admin-001'],
    status: 'active',
    timestamp: Date.now() - 5000000,
    vipDoor: {
        text: 'Não perca o próximo bull market. Nossos analistas trabalham 24/7 para você.',
        buttonText: 'QUERO OS SINAIS',
        mediaItems: [{ url: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000&auto=format&fit=crop', type: 'image' }]
    }
  },
  {
    id: 'g-pub-001',
    name: 'Dicas de Design UI/UX',
    description: 'Grupo aberto para troca de experiências e feedbacks de layouts. Focado em mobile-first design.',
    isVip: false,
    isPrivate: false,
    coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop',
    creatorId: 'u-admin-001',
    creatorEmail: 'admin@flux.com',
    memberIds: ['u-user-003', 'u-creator-002', 'u-admin-001', 'u-mock-006', 'u-mock-007', 'u-mock-008', 'u-mock-009'],
    adminIds: ['u-admin-001'],
    lastMessage: 'Alguém tem o link do novo Figma?',
    time: '10:30',
    timestamp: Date.now() - 2000000
  },
  {
    id: 'g-pub-002',
    name: 'Desenvolvedores React Br',
    description: 'Comunidade de devs apaixonados por React, Next.js e TypeScript.',
    isVip: false,
    isPrivate: false,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
    creatorId: 'u-user-003',
    creatorEmail: 'user@test.com',
    memberIds: ['u-user-003', 'u-admin-001', 'u-mock-008'],
    adminIds: ['u-user-003'],
    lastMessage: 'Vite ou Webpack em 2024?',
    time: '08:45',
    timestamp: Date.now() - 1000000
  },
  {
    id: 'g-priv-001',
    name: 'Mastermind E-commerce Br',
    description: 'Grupo fechado apenas para donos de lojas com faturamento acima de 50k. Requer aprovação.',
    isVip: false,
    isPrivate: true,
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
    creatorId: 'u-creator-002',
    creatorEmail: 'creator@test.com',
    memberIds: ['u-creator-002', 'u-mock-009'],
    adminIds: ['u-creator-002'],
    pendingMemberIds: ['u-user-003', 'u-mock-006'],
    lastMessage: 'Solicitação de entrada pendente.',
    time: 'Ontem',
    timestamp: Date.now() - 86400000
  },
  {
    id: 'g-priv-002',
    name: 'Investidores Anjo Anônimos',
    description: 'Discussões privadas sobre aportes em startups early stage.',
    isVip: false,
    isPrivate: true,
    coverImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1000&auto=format&fit=crop',
    creatorId: 'u-admin-001',
    creatorEmail: 'admin@flux.com',
    memberIds: ['u-admin-001', 'u-mock-007'],
    adminIds: ['u-admin-001'],
    lastMessage: 'Grupo restrito.',
    time: '3 dias',
    timestamp: Date.now() - 259200000
  }
];
