import {
  ref,
  push,
  set,
  update,
  onValue,
  query,
  orderByChild,
  limitToLast,
  serverTimestamp,
  increment,
} from 'firebase/database';
import {db} from './firebase';
import type {ChatSummary, Message, MessageType} from '../types';

export function getChatId(uidA: string, uidB: string): string {
  return [uidA, uidB].sort().join('_');
}

const MESSAGE_PAGE_SIZE = 200;

export function subscribeMessages(
  chatId: string,
  callback: (messages: Message[]) => void,
): () => void {
  const messagesQuery = query(
    ref(db, `messages/${chatId}`),
    orderByChild('createdAt'),
    limitToLast(MESSAGE_PAGE_SIZE),
  );

  return onValue(messagesQuery, snapshot => {
    const value = snapshot.val() ?? {};
    const messages: Message[] = Object.keys(value)
      .map(id => ({
        id,
        senderId: value[id]?.senderId ?? '',
        type: (value[id]?.type === 'location'
          ? 'location'
          : 'text') as MessageType,
        text: value[id]?.text ?? '',
        latitude: value[id]?.latitude,
        longitude: value[id]?.longitude,
        createdAt:
          typeof value[id]?.createdAt === 'number' ? value[id].createdAt : 0,
      }))
      .sort((a, b) => a.createdAt - b.createdAt);

    callback(messages);
  });
}

interface SendMessageInput {
  chatId: string;
  senderId: string;
  receiverId: string;
  type: 'text' | 'location';
  text: string;
  latitude?: number;
  longitude?: number;
}

export async function sendMessage(input: SendMessageInput): Promise<void> {
  const {chatId, senderId, receiverId, type, text, latitude, longitude} = input;

  const trimmed = text.trim();
  if (type === 'text' && trimmed.length === 0) {
    return;
  }

  const messageRef = push(ref(db, `messages/${chatId}`));
  const messageId = messageRef.key;
  if (!messageId) {
    throw new Error('Không tạo được id tin nhắn.');
  }

  const message: Record<string, unknown> = {
    senderId,
    type,
    text: trimmed,
    createdAt: serverTimestamp(),
  };
  if (type === 'location') {
    message.latitude = latitude;
    message.longitude = longitude;
  }

  const preview =
    type === 'location' ? '📍 Đã gửi một vị trí' : trimmed;

  await update(ref(db), {
    [`messages/${chatId}/${messageId}`]: message,
    [`chats/${chatId}/members/${senderId}`]: true,
    [`chats/${chatId}/members/${receiverId}`]: true,
    [`chats/${chatId}/lastMessage`]: preview,
    [`chats/${chatId}/lastMessageAt`]: serverTimestamp(),
    [`chats/${chatId}/lastSenderId`]: senderId,
    [`chats/${chatId}/unread/${receiverId}`]: increment(1),
  });
}

export function subscribeChats(
  uid: string,
  callback: (chats: ChatSummary[]) => void,
): () => void {
  return onValue(ref(db, 'chats'), snapshot => {
    const value = snapshot.val() ?? {};
    const chats: ChatSummary[] = Object.keys(value)
      .filter(chatId => value[chatId]?.members?.[uid] === true)
      .map(chatId => ({
        chatId,
        members: value[chatId]?.members ?? {},
        lastMessage: value[chatId]?.lastMessage ?? '',
        lastMessageAt:
          typeof value[chatId]?.lastMessageAt === 'number'
            ? value[chatId].lastMessageAt
            : 0,
        lastSenderId: value[chatId]?.lastSenderId ?? '',
        unread: value[chatId]?.unread ?? {},
      }))
      .sort((a, b) => b.lastMessageAt - a.lastMessageAt);

    callback(chats);
  });
}

export async function markChatAsRead(
  chatId: string,
  uid: string,
): Promise<void> {
  try {
    await set(ref(db, `chats/${chatId}/unread/${uid}`), 0);
  } catch {}
}

export function getPartnerUid(
  members: Record<string, boolean>,
  currentUid: string,
): string | null {
  const other = Object.keys(members).find(uid => uid !== currentUid);
  return other ?? null;
}
