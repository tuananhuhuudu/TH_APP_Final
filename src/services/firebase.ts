import {initializeApp, getApps, getApp, type FirebaseApp} from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  type Auth,
  type Persistence,
} from 'firebase/auth';
import {getDatabase, type Database} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebaseConfig} from './firebaseConfig';

const {getReactNativePersistence} = require('firebase/auth') as {
  getReactNativePersistence: (storage: unknown) => Persistence;
};

const app: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

let authInstance: Auth;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const db: Database = getDatabase(app);
export default app;
