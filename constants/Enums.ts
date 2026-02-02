
/**
 * Dicionário de Estados e Tipos Globais da Plataforma Flux
 * Elimina o uso de "strings mágicas" que causam bugs silenciosos.
 */

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended',
  PENDING_PAYMENT = 'pending'
}

export enum GroupType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  VIP = 'vip'
}

export enum PostType {
  TEXT = 'text',
  PHOTO = 'photo',
  VIDEO = 'video',
  POLL = 'poll'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

export enum UserRole {
  OWNER = 'Dono',
  ADMIN = 'Admin',
  MEMBER = 'Membro'
}
