export interface AppUser {
  uid: string;
  fullName: string;
  email: string;
  online: boolean;
  lastSeen: number;
  createdAt: number;
}

export type MessageType = 'text' | 'location';

export interface Message {
  id: string;
  senderId: string;
  type: MessageType;
  text: string;
  latitude?: number;
  longitude?: number;
  createdAt: number;
}

export interface ChatSummary {
  chatId: string;
  members: Record<string, boolean>;
  lastMessage: string;
  lastMessageAt: number;
  lastSenderId: string;
  unread: Record<string, number>;
}

export interface ConversationItem {
  chatId: string;
  partner: AppUser;
  lastMessage: string;
  lastMessageAt: number;
  unreadCount: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
}
