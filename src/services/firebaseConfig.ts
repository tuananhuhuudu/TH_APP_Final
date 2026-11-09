export const firebaseConfig = {
  apiKey: 'AIzaSyDa-y9It9SbVSmq9R35yTopO4tjT77l6KQ',
  authDomain: 'th-app-chat.firebaseapp.com',
  databaseURL:
    'https://th-app-chat-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'th-app-chat',
  storageBucket: 'th-app-chat.firebasestorage.app',
  messagingSenderId: '989662587054',
  appId: '1:989662587054:web:f357170d8d1132905aa53f',
};

export const isFirebaseConfigured = !Object.values(firebaseConfig).some(value =>
  value.startsWith('DÁN_'),
);
