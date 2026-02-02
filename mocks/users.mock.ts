
import { User } from '../types';

export const MOCK_USERS: Record<string, User> = {
  'admin': {
    id: 'u-admin-001',
    email: 'admin@flux.com',
    isVerified: true,
    isProfileCompleted: true,
    profile: {
      name: 'flux_admin',
      nickname: 'Flux Official',
      bio: 'Conta de administração do sistema Flux.',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      isPrivate: false,
      website: 'https://flux.com'
    },
    lastSeen: Date.now()
  },
  'creator': {
    id: 'u-creator-002',
    email: 'creator@test.com',
    isVerified: true,
    isProfileCompleted: true,
    profile: {
      name: 'pixel_master',
      nickname: 'Eduardo MKT',
      bio: 'Especialista em tráfego pago e funis de venda. Me siga para dicas diárias!',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eduardo',
      isPrivate: false,
      phone: '11999999999'
    },
    paymentConfig: {
      providerId: 'syncpay',
      isConnected: true
    },
    lastSeen: Date.now() - 5000
  },
  'user': {
    id: 'u-user-003',
    email: 'user@test.com',
    isVerified: true,
    isProfileCompleted: true,
    profile: {
      name: 'ana_clara',
      nickname: 'Ana Clara',
      bio: 'Apenas explorando os melhores grupos VIP do Flux. ✨',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      isPrivate: true
    },
    lastSeen: Date.now() - 3600000
  },
  'star': {
    id: 'u-star-004',
    email: 'star@test.com',
    isVerified: true,
    isProfileCompleted: true,
    profile: {
      name: 'julia_vendas',
      nickname: 'Julia Sales',
      bio: 'Top 1 Afiliada Flux. Mentoria de vendas no link abaixo.',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julia',
      isPrivate: false,
      website: 'https://juliasales.com'
    },
    lastSeen: Date.now() - 120000
  },
  'dev': {
    id: 'u-dev-005',
    email: 'dev@test.com',
    isVerified: true,
    isProfileCompleted: true,
    profile: {
      name: 'marcos_tech',
      nickname: 'Marcos Tech',
      bio: 'Desenvolvedor Fullstack e entusiasta de Web3.',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos',
      isPrivate: false
    },
    lastSeen: Date.now() - 800000
  },
  'm001': {
    id: 'u-mock-006',
    email: 'roberto@test.com',
    isVerified: true,
    isProfileCompleted: true,
    profile: {
      name: 'roberto_s',
      nickname: 'Roberto Silva',
      bio: 'Engenheiro de Software nas horas vagas.',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
      isPrivate: false
    },
    lastSeen: Date.now() - 4500000
  },
  'm002': {
    id: 'u-mock-007',
    email: 'mariana@test.com',
    isVerified: true,
    isProfileCompleted: true,
    profile: {
      name: 'mari_costa',
      nickname: 'Mariana Costa',
      bio: 'Viajante e criadora de conteúdo.',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana',
      isPrivate: false
    },
    lastSeen: Date.now() - 15000
  },
  'm003': {
    id: 'u-mock-008',
    email: 'felipe@test.com',
    isVerified: true,
    isProfileCompleted: true,
    profile: {
      name: 'felipe_dev',
      nickname: 'Felipe Rocha',
      bio: 'Build, ship, iterate.',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felipe',
      isPrivate: false
    },
    lastSeen: Date.now() - 9000000
  },
  'm004': {
    id: 'u-mock-009',
    email: 'camila@test.com',
    isVerified: true,
    isProfileCompleted: true,
    profile: {
      name: 'caca_mkt',
      nickname: 'Camila Oliveira',
      bio: 'Growth Hacker em startups.',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Camila',
      isPrivate: false
    },
    lastSeen: Date.now() - 300
  },
  'm010': {
    id: 'u-mock-010',
    email: 'vitor@test.com',
    isVerified: true,
    isProfileCompleted: true,
    profile: {
      name: 'vitor_ads',
      nickname: 'Vitor Hugo',
      bio: 'Gestor de Tráfego.',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vitor',
      isPrivate: false
    }
  },
  'm011': {
    id: 'u-mock-011',
    email: 'carla@test.com',
    isVerified: true,
    isProfileCompleted: true,
    profile: {
      name: 'carla_copy',
      nickname: 'Carla Souza',
      bio: 'Copywriter de alta conversão.',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carla',
      isPrivate: false
    }
  },
  'm012': {
    id: 'u-mock-012',
    email: 'bruno@test.com',
    isVerified: true,
    isProfileCompleted: true,
    profile: {
      name: 'bruno_scale',
      nickname: 'Bruno Mendes',
      bio: 'Estrategista de Escala.',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bruno',
      isPrivate: false
    }
  }
};
