import {useEffect, useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {subscribeChats} from '../services/chatService';

export function useUnreadTotal(): number {
  const {user} = useAuth();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) {
      setTotal(0);
      return;
    }

    const uid = user.uid;
    const unsubscribe = subscribeChats(uid, chats => {
      const sum = chats.reduce(
        (accumulator, chat) => accumulator + (chat.unread?.[uid] ?? 0),
        0,
      );
      setTotal(sum);
    });

    return unsubscribe;
  }, [user]);

  return total;
}
