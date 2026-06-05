"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, RepairRequest, Equipment } from './types';
import { useFirebase } from '@/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  addDoc,
  updateDoc
} from 'firebase/firestore';

interface AppContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, unit: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  requests: RepairRequest[];
  addRequest: (req: Omit<RepairRequest, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateRequestStatus: (id: string, status: RepairRequest['status'], extra?: Partial<RepairRequest>) => Promise<void>;
  equipment: Equipment[];
  users: User[];
  isInitialized: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MOCK_EQUIPMENT: Equipment[] = [
  { id: 'e1', name: 'Bàn ghế văn phòng', category: 'Furniture' },
  { id: 'e2', name: 'Máy chiếu Sony', category: 'IT' },
  { id: 'e3', name: 'Cáp HDMI 5m', category: 'IT' },
  { id: 'e4', name: 'Cáp VGA 3m', category: 'IT' },
  { id: 'e5', name: 'Bồn cầu Viglacera', category: 'Plumbing' },
  { id: 'e6', name: 'Lavabo Inax', category: 'Plumbing' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const { auth, db } = useFirebase();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!auth || !db) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
          } else {
            // Document might not exist yet during registration, wait a bit or handle it
            console.log("User authenticated but document not found yet.");
          }
        } catch (e) {
          console.error("Error fetching user doc:", e);
        }
      } else {
        setCurrentUser(null);
      }
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, [auth, db]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RepairRequest));
      setRequests(data);
    });
    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    if (!db) return;
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(data);
    });
    return () => unsubscribe();
  }, [db]);

  const login = async (email: string, pass: string) => {
    if (!auth) throw new Error("Hệ thống xác thực chưa sẵn sàng.");
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (email: string, pass: string, name: string, unit: string) => {
    if (!auth || !db) throw new Error("Hệ thống Firebase chưa sẵn sàng.");
    
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      
      const newUser: User = {
        id: res.user.uid,
        name,
        role: 'requester',
        unit,
        email
      };
      
      // Attempt to save profile to Firestore
      await setDoc(doc(db, 'users', res.user.uid), newUser);
      setCurrentUser(newUser);
    } catch (error: any) {
      console.error("Registration sub-error:", error);
      throw error; // Re-throw to be handled by UI
    }
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    if (!auth) return;
    await sendPasswordResetEmail(auth, email);
  };

  const addRequest = async (req: Omit<RepairRequest, 'id' | 'createdAt' | 'status'>) => {
    if (!db) return;
    await addDoc(collection(db, 'requests'), {
      ...req,
      createdAt: new Date().toISOString(),
      status: 'pending_approval'
    });
  };

  const updateRequestStatus = async (id: string, status: RepairRequest['status'], extra?: Partial<RepairRequest>) => {
    if (!db) return;
    await updateDoc(doc(db, 'requests', id), {
      status,
      ...extra
    });
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      register,
      logout,
      resetPassword,
      requests,
      addRequest,
      updateRequestStatus,
      equipment: MOCK_EQUIPMENT,
      users,
      isInitialized
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
