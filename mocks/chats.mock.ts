
import { ChatData } from '../types';

/**
 * MOCK_CHATS define as conversas iniciais visíveis no modo demonstração.
 * IDs seguem o padrão participante1@email.com_participante2@email.com (ordenados)
 * Alinhado com 'creator@test.com' que é o login padrão do mock.
 */
export const MOCK_CHATS: ChatData[] = [
  {
    id: 'admin@flux.com_creator@test.com',
    contactName: 'Suporte Flux',
    isBlocked: false,
    messages: [
      {
        id: Date.now() - 10000000,
        text: 'Olá! Bem-vindo ao Flux. Como podemos ajudar?',
        type: 'received',
        contentType: 'text',
        timestamp: '14:20',
        status: 'read',
        senderEmail: 'admin@flux.com',
        senderName: 'Flux Official'
      }
    ]
  },
  {
    id: 'another@test.com_creator@test.com',
    contactName: 'Filipe Silva',
    isBlocked: false,
    messages: [
      {
        id: Date.now() - 5000000,
        text: 'E aí! Vi seu post sobre escala. Muito bom.',
        type: 'received',
        contentType: 'text',
        timestamp: '09:15',
        status: 'read',
        senderEmail: 'another@test.com',
        senderName: 'Filipe Silva'
      },
      {
        id: Date.now() - 600000,
        text: 'Temos call amanhã?',
        type: 'received',
        contentType: 'text',
        timestamp: '5m',
        status: 'delivered',
        senderEmail: 'another@test.com',
        senderName: 'Filipe Silva'
      }
    ]
  },
  {
    id: 'user@test.com_creator@test.com',
    contactName: 'Ana Clara',
    isBlocked: false,
    messages: [
      {
        id: Date.now() - 86400000,
        text: 'Pode me mandar o link do grupo VIP?',
        type: 'received',
        contentType: 'text',
        timestamp: 'Ontem',
        status: 'read',
        senderEmail: 'user@test.com',
        senderName: 'Ana Clara'
      }
    ]
  }
];
