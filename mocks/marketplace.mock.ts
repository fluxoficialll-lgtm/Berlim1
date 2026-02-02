
import { MarketplaceItem } from '../types';

export const MOCK_PRODUCTS: MarketplaceItem[] = [
  {
    id: 'prod-001',
    title: 'iPhone 15 Pro Max 256GB - Titânio',
    price: 7890.00,
    category: 'Eletrônicos',
    location: 'São Paulo, SP',
    description: 'Aparelho novo, lacrado com nota fiscal e garantia Apple de 1 ano.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600',
    sellerId: 'u-creator-002', // Eduardo MKT
    sellerName: 'Eduardo MKT',
    timestamp: Date.now() - 3600000,
    soldCount: 14
  },
  {
    id: 'prod-002',
    title: 'Mentoria: Do Zero ao Milhão no Tráfego',
    price: 497.00,
    category: 'Infoprodutos',
    location: 'Brasil / Online',
    description: 'Aprenda as estratégias que usei para escalar mais de 100 operações de e-commerce.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600',
    sellerId: 'u-creator-002', // Eduardo MKT
    sellerName: 'Eduardo MKT',
    timestamp: Date.now() - 86400000,
    soldCount: 156
  },
  {
    id: 'prod-003',
    title: 'Setup Home Office High-End',
    price: 12500.00,
    category: 'Eletrônicos',
    location: 'Curitiba, PR',
    description: 'Cadeira Herman Miller + Monitor Ultrawide 34 + MacBook M2 Pro.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600',
    sellerId: 'u-creator-002', // Eduardo MKT
    sellerName: 'Eduardo MKT',
    timestamp: Date.now() - 172800000,
    soldCount: 1
  },
  {
    id: 'prod-004',
    title: 'E-book: 100 Copys que Vendem',
    price: 29.90,
    category: 'Infoprodutos',
    location: 'Online',
    description: 'Biblioteca de modelos de copy prontos para usar em anúncios de alta conversão.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600',
    sellerId: 'u-creator-002', // Eduardo MKT
    sellerName: 'Eduardo MKT',
    timestamp: Date.now() - 500000,
    soldCount: 890
  }
];
