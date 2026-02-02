
export interface Group {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  isVip: boolean;
  isPrivate?: boolean;
  price?: string;
  category?: string;
  currency?: 'BRL' | 'USD' | 'EUR' | 'BTC' | 'GBP';
  accessType?: 'lifetime' | 'temporary' | 'one_time';
  expirationDate?: string;
  vipDoor?: {
    media?: string;
    mediaType?: 'image' | 'video' | null;
    mediaItems?: VipMediaItem[];
    text?: string;
    buttonText?: string;
  };
  lastMessage?: string;
  time?: string;
  creatorId: string;
  creatorEmail?: string;
  links?: GroupLink[];
  memberIds?: string[];
  pendingMemberIds?: string[];
  bannedUserIds?: string[];
  adminIds?: string[];
  settings?: GroupSettingsConfig;
  status?: 'active' | 'inactive';
  selectedProviderId?: string;
  checkoutConfig?: CheckoutConfig; // Nova configuração
  pixelId?: string;
  pixelToken?: string;
  updated_at?: string;
  created_at?: string;
  timestamp?: number;
  channels?: Channel[];
  channelSections?: ChannelSection[];
  scheduledMessages?: ScheduledMessage[];
  auditLogs?: AuditLog[];
  roles?: GroupRole[];
  isSalesPlatformEnabled?: boolean;
  salesPlatformSections?: SalesSection[];
  salesPlatformAllowDownload?: boolean;
  salesPlatformAllowMemberUpload?: boolean;
  salesFoldersCount?: number;
  memberCount?: number;
}

export interface CheckoutConfig {
    providerId: string;
    targetCountry: string;
    enabledMethods: string[];
}

export interface ChannelSection {
    id: string;
    title: string;
    channelIds: string[];
}

export interface GroupRole {
    id: string;
    name: string;
    color: string;
    priority: number;
    permissions: {
        isAdmin: boolean;
        canEditGroupInfo: boolean;
        canManageRoles: boolean;
        canViewAuditLogs: boolean;
        canViewRevenue: boolean;
        canSendMessages: boolean;
        canDeleteMessages: boolean;
        canPinMessages: boolean;
        canBypassSlowMode: boolean;
        canKickMembers: boolean;
        canBanMembers: boolean;
        canApproveMembers: boolean;
        canInviteMembers: boolean;
        canManageFolders: boolean;
        canManageFiles: boolean;
        canPostScheduled: boolean;
        canManageAds: boolean;
    };
}

export interface Channel {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    onlyAdminsPost: boolean;
    type: 'text' | 'media' | 'links';
    // Novas Configurações Avançadas
    slowMode?: number; // segundos
    charLimit?: number;
    mediaOnly?: boolean;
    blockLinks?: boolean;
    noAudio?: boolean;
    nsfw?: boolean;
    autoDeleteHours?: number;
    hideFromMembers?: boolean;
    disableReactions?: boolean;
    topic?: string;
    allowedRoleIds?: string[];
}

export interface GroupLink {
  id: string;
  name: string;
  code: string;
  joins: number;
  createdAt: number;
  maxUses?: number;
  expiresAt?: string;
}

export interface GroupSettingsConfig {
    memberLimit?: number;
    onlyAdminsPost?: boolean;
    msgSlowMode?: boolean;
    msgSlowModeInterval?: number;
    approveMembers?: boolean;
    joinSlowMode?: boolean;
    joinSlowModeInterval?: number;
    forbiddenWords?: string[];
}

export interface AuditLog {
    id: string;
    adminId: string;
    adminName: string;
    action: string;
    target: string;
    timestamp: number;
}

export interface ScheduledMessage {
    id: string;
    channelId: string;
    text: string;
    mediaUrl?: string;
    scheduledTime: number;
    isSent: boolean;
}

export interface VipMediaItem {
  url: string;
  type: 'image' | 'video';
}

export interface SalesSection {
    id: string;
    title: string;
    folders: SalesFolder[];
    channels?: Channel[];
}

export interface SalesFolder {
    id: string;
    name: string;
    itemsCount: number;
    items?: Infoproduct[];
    permissions?: Record<string, boolean>;
    allowDownload?: boolean;
    allowMemberUpload?: boolean;
}

export interface Infoproduct {
    id: string;
    title: string;
    type: 'image' | 'video' | 'file';
    fileType?: 'pdf' | 'zip' | 'doc' | 'other';
    url: string;
    thumbnail?: string;
    allowDownload: boolean;
    size?: string;
}
