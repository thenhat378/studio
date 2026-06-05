
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { initializeFirebase } from './index';

interface FirebaseContextType {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  user: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  db: null,
  auth: null,
  user: null,
  loading: true,
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Omit<FirebaseContextType, 'user' | 'loading'>>({
    app: null,
    db: null,
    auth: null,
  });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { app, db, auth } = initializeFirebase();
    setServices({ app, db, auth });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ ...services, user, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);
