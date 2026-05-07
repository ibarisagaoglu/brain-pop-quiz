import { Platform } from 'react-native';

// Replace with your Firebase project config from console.firebase.google.com
export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  databaseURL: 'https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com'
};

let auth = null;
let db = null;
let rtdb = null;
let storage = null;

if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line global-require
    const { getApps, initializeApp } = require('@react-native-firebase/app');
    // eslint-disable-next-line global-require
    const { getAuth } = require('@react-native-firebase/auth');
    // eslint-disable-next-line global-require
    const { getFirestore } = require('@react-native-firebase/firestore');
    // eslint-disable-next-line global-require
    const { getDatabase } = require('@react-native-firebase/database');
    // eslint-disable-next-line global-require
    const { getStorage } = require('@react-native-firebase/storage');

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    rtdb = getDatabase(app);
    storage = getStorage(app);
  } catch (error) {
    console.log('Firebase native modules unavailable in this environment');
  }
}

export { auth, db, rtdb, storage };
