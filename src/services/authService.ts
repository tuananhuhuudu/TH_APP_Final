import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {ref, set, serverTimestamp} from 'firebase/database';
import {auth, db} from './firebase';

export function mapAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Email không đúng định dạng.';
    case 'auth/email-already-in-use':
      return 'Email này đã được đăng ký.';
    case 'auth/weak-password':
      return 'Mật khẩu phải có ít nhất 6 ký tự.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email hoặc mật khẩu không đúng.';
    case 'auth/too-many-requests':
      return 'Bạn đã thử quá nhiều lần. Vui lòng đợi một lát rồi thử lại.';
    case 'auth/network-request-failed':
      return 'Không có kết nối mạng. Kiểm tra lại Internet.';
    default:
      return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
  }
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string,
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
  const {user} = credential;

  await updateProfile(user, {displayName: fullName.trim()});

  await set(ref(db, `users/${user.uid}`), {
    uid: user.uid,
    fullName: fullName.trim(),
    email: email.trim(),
    online: true,
    lastSeen: serverTimestamp(),
    createdAt: serverTimestamp(),
  });

  return user;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
  return credential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
