import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {AppState, type AppStateStatus} from 'react-native';
import type {User} from 'firebase/auth';
import {subscribeAuth} from '../services/authService';
import {
  startPresence,
  setOffline,
  setOnline,
} from '../services/presenceService';

interface AuthContextValue {
  user: User | null;
  initializing: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  initializing: true,
});

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAuth(nextUser => {
      setUser(nextUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const uid = user.uid;
    const stopPresence = startPresence(uid);

    const handleAppState = (state: AppStateStatus) => {
      if (state === 'active') {
        setOnline(uid);
      } else if (state === 'background') {
        setOffline(uid);
      }
    };
    const appStateSub = AppState.addEventListener('change', handleAppState);

    return () => {
      stopPresence();
      appStateSub.remove();
    };
  }, [user]);

  const value = useMemo(
    () => ({user, initializing}),
    [user, initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export function useCurrentUser(): User {
  const {user} = useAuth();
  if (!user) {
    throw new Error('useCurrentUser chỉ dùng được bên trong luồng đã đăng nhập.');
  }
  return user;
}
