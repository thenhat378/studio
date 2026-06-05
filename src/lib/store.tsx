
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, RepairRequest, Equipment, UserRole } from './types';
import { useFirebase } from '@/firebase';
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
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

interface AppContextType {
  currentUser: User | null;
  login: (phone: string, pass: string) => Promise<void>;
  register: (data: { phone: string, pass: string, name: string, unit: string, role: UserRole }) => Promise<void>;
  logout: () => void;
  requests: RepairRequest[];
  addRequest: (req: Omit<RepairRequest, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateRequestStatus: (id: string, status: RepairRequest['status'], extra?: Partial<RepairRequest>) => Promise<void>;
  equipment: Equipment[];
  users: User[];
  isInitialized: boolean;
  loading: boolean;
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
  const { db, auth } = useFirebase();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Chuyển đổi số điện thoại thành email giả để dùng Firebase Auth Email/Pass (ổn định nhất)
  const phoneToEmail = (phone: string) => `${phone.replace(/\D/g, '')}@due-repair.vn`;

  useEffect(() => {
    if (!auth || !db) return;

    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (userDoc.exists()) {
          setCurrentUser({ id: fbUser.uid, ...userDoc.data() } as User);
        }
      } else {
        setCurrentUser(null);
      }
      setIsInitialized(true);
      setLoading(false);
    });

    return () => unsubAuth();
  }, [auth, db]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RepairRequest)));
    });
    return () => unsub();
  }, [db]);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
    });
    return () => unsub();
  }, [db]);

  const login = async (phone: string, pass: string) => {
    if (!auth) return;
    await signInWithEmailAndPassword(auth, phoneToEmail(phone), pass);
  };

  const register = async (data: { phone: string, pass: string, name: string, unit: string, role: UserRole }) => {
    if (!auth || !db) return;
    const { user: fbUser } = await createUserWithEmailAndPassword(auth, phoneToEmail(data.phone), data.pass);
    
    const userData: User = {
      id: fbUser.uid,
      name: data.name,
      role: data.role,
      unit: data.unit,
      phoneNumber: data.phone
    };

    await setDoc(doc(db, 'users', fbUser.uid), userData);
    setCurrentUser(userData);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setCurrentUser(null);
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
    await updateDoc(doc(db, 'requests', id), { status, ...extra });
  };

  return (
    <AppContext.Provider value={{
      currentUser, 
      login,
      register,
      logout,
      requests, 
      addRequest, 
      updateRequestStatus,
      equipment: MOCK_EQUIPMENT, 
      users, 
      isInitialized,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
