
export interface Post {
  id: string;
  type: 'photo' | 'poll' | 'text' | 'video';
  authorId: string;
  authorEmail?: string;
  username: string;
  text: string;
  image?: string;
  images?: string[];
  video?: string;
  avatar?: string;
  isPublic: boolean;
  isAdultContent?: boolean;
  time: string; 
  timestamp: number;
  views: number;
  viewedByIds?: string[]; 
  likes: number;
  likedByIds?: string[]; 
  comments: number;
  liked: boolean;
  pollOptions?: PollOption[];
  votedOptionIndex?: number | null;
  commentsList?: Comment[];
  title?: string;
  location?: string;
  relatedGroupId?: string;
  isAd?: boolean;
  adCampaignId?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface PollOption {
  text: string;
  votes: number;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  text: string;
  timestamp: number;
  likes?: number;
  likedByMe?: boolean;
  replies?: Comment[];
  replyToUsername?: string; 
}

export interface NotificationItem {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'sale' | 'pending' | 'expiring_vip';
  subtype?: 'friend' | 'group_join' | 'group_invite';
  senderId: string;
  username: string;
  time: string;
  timestamp: number;
  avatar: string;
  text?: string;
  postImage?: string;
  isFollowing?: boolean;
  recipientId: string;
  recipientEmail: string;
  read: boolean;
  groupId?: string;
}

export interface Relationship {
  followerId: string;
  followingId: string;
  followingUsername: string;
  status: 'pending' | 'accepted';
}

export interface ChatMessage {
    id: number;
    text: string;
    type: 'sent' | 'received';
    contentType: 'text' | 'audio' | 'image' | 'video' | 'file';
    mediaUrl?: string;
    fileName?: string;
    product?: {
        id: string;
        title: string;
        price: number;
        image?: string;
    };
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
    duration?: string;
    senderId?: string;
    senderName?: string;
    senderAvatar?: string;
    senderEmail?: string;
    // Comment: Novo campo para gerenciar quem excluiu esta mensagem específica (Deleção Lógica Granular)
    deletedBy?: string[];
}

export interface ChatData {
    id: string | number;
    contactName: string;
    contactId?: string;
    isBlocked: boolean;
    messages: ChatMessage[];
    deletedBy?: string[];
}
