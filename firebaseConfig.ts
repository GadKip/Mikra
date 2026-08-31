import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "mikra-181ba.firebaseapp.com",
  projectId: "mikra-181ba",
  storageBucket: "mikra-181ba.firebasestorage.app",
  messagingSenderId: "345908910979",
  appId: "1:345908910979:web:d2ba4f3c6c1d378429b4b6",
  measurementId: "G-5V52WJGGMD"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// Initialize Auth with React Native persistence so auth state survives app restarts
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

/**
 * Initialize anonymous authentication on app load.
 * If user is already authenticated, does nothing.
 * If not authenticated, signs in anonymously with a new UID.
 */
export const initializeAuth = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Unsubscribe after first check
      
      if (user) {
        // User is already authenticated (anonymous or otherwise)
        console.log('User already authenticated. UID:', user.uid);
        resolve(user);
      } else {
        // No user authenticated, sign in anonymously
        try {
          const result = await signInAnonymously(auth);
          console.log('Anonymous user signed in. UID:', result.user.uid);
          resolve(result.user);
        } catch (error) {
          console.error('Error signing in anonymously:', error);
          reject(error);
        }
      }
    });
  });
};

export { auth, db };