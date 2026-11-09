import {
  ref,
  set,
  update,
  onValue,
  onDisconnect,
  serverTimestamp,
} from 'firebase/database';
import {db} from './firebase';

export function startPresence(uid: string): () => void {
  const userStatusRef = ref(db, `users/${uid}`);
  const connectedRef = ref(db, '.info/connected');

  const unsubscribe = onValue(connectedRef, snapshot => {
    if (snapshot.val() === false) {
      return;
    }

    onDisconnect(userStatusRef)
      .update({online: false, lastSeen: serverTimestamp()})
      .then(() => {
        update(userStatusRef, {online: true, lastSeen: serverTimestamp()});
      })
      .catch(() => {});
  });

  return unsubscribe;
}

export async function setOffline(uid: string): Promise<void> {
  try {
    await update(ref(db, `users/${uid}`), {
      online: false,
      lastSeen: serverTimestamp(),
    });
  } catch {}
}

export async function setOnline(uid: string): Promise<void> {
  try {
    await set(ref(db, `users/${uid}/online`), true);
  } catch {}
}
