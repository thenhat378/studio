'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

/**
 * Khởi tạo Firebase một cách an toàn để tránh lỗi khởi tạo nhiều lần trong Next.js
 */
export function initializeFirebase() {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    
    db = getFirestore(app);
    auth = getAuth(app);

    return { app, db, auth };
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error;
  }
}

export { FirebaseProvider, useFirebase } from './provider';
