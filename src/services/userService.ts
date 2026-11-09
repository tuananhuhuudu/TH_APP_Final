import {ref, onValue, get} from 'firebase/database';
import {db} from './firebase';
import type {AppUser} from '../types';

function toAppUser(uid: string, raw: any): AppUser {
  return {
    uid,
    fullName: raw?.fullName ?? 'Người dùng',
    email: raw?.email ?? '',
    online: raw?.online === true,
    lastSeen: typeof raw?.lastSeen === 'number' ? raw.lastSeen : 0,
    createdAt: typeof raw?.createdAt === 'number' ? raw.createdAt : 0,
  };
}

export function subscribeUsers(
  currentUid: string,
  callback: (users: AppUser[]) => void,
): () => void {
  const usersRef = ref(db, 'users');

  return onValue(usersRef, snapshot => {
    const value = snapshot.val() ?? {};
    const users = Object.keys(value)
      .filter(uid => uid !== currentUid)
      .map(uid => toAppUser(uid, value[uid]))
      .sort((a, b) => {
        if (a.online !== b.online) {
          return a.online ? -1 : 1;
        }
        return a.fullName.localeCompare(b.fullName, 'vi');
      });

    callback(users);
  });
}

export function subscribeUser(
  uid: string,
  callback: (user: AppUser | null) => void,
): () => void {
  return onValue(ref(db, `users/${uid}`), snapshot => {
    const value = snapshot.val();
    callback(value ? toAppUser(uid, value) : null);
  });
}

export async function fetchUser(uid: string): Promise<AppUser | null> {
  const snapshot = await get(ref(db, `users/${uid}`));
  const value = snapshot.val();
  return value ? toAppUser(uid, value) : null;
}
