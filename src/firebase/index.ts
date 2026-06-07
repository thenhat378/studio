
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let messaging: Messaging | undefined;

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

    // Messaging chỉ chạy trên trình duyệt hỗ trợ (client-side)
    if (typeof window !== 'undefined') {
      isSupported().then(supported => {
        if (supported) {
          messaging = getMessaging(app);
        }
      });
    }

    return { app, db, auth, messaging };
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error;
  }
}

export { FirebaseProvider, useFirebase } from './provider';
