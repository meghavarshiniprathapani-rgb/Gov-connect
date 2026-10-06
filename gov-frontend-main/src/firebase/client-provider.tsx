'use client';
import { ReactNode, useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    return {
      firebaseApp: app,
      auth: auth,
      firestore: firestore,
    };
  }, []);

  return <FirebaseProvider value={value}>{children}</FirebaseProvider>;
}
