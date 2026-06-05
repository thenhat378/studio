
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, RepairRequest, Equipment, UserRole } from './types';
import { useFirebase } from '@/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
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
  login: (phone: string, pass: string) => Promise<void>;
  register: (phone: string, pass: string, name: string, unit: string) => Promise<void>;
  loginAsTestAccount: (role: UserRole) => void;
  logout: () => Promise<void>;
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

  // Helper to convert phone to internal auth email
  const phoneToEmail = (phone: string) => `${phone.trim()}@due-repair.vn`;

  useEffect(() => {
    if (!auth || !db) {
      setIsInitialized(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
          }
        } catch (e) {
          console.error("User load error:", e);
        }
      } else {
        const testUser = localStorage.getItem('test_user_session');
        if (testUser) {
          setCurrentUser(JSON.parse(testUser));
        } else {
          setCurrentUser(null);
        }
      }
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, [auth, db]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RepairRequest)));
    });
  }, [db]);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
    });
  }, [db]);

  const login = async (phone: string, pass: string) => {
    if (!auth) throw new Error("Service unavailable");
    localStorage.removeItem('test_user_session');
    await signInWithEmailAndPassword(auth, phoneToEmail(phone), pass);
  };

  const register = async (phone: string, pass: string, name: string, unit: string) => {
    if (!auth || !db) throw new Error("Service unavailable");
    const result = await createUserWithEmailAndPassword(auth, phoneToEmail(phone), pass);
    const newUser: User = {
      id: result.user.uid,
      name,
      unit,
      role: 'requester',
      phoneNumber: phone
    };
    await setDoc(doc(db, 'users', result.user.uid), newUser);
    setCurrentUser(newUser);
  };

  const loginAsTestAccount = (role: UserRole) => {
    const testUsers: Record<UserRole, User> = {
      'requester': { id: 'test-req', name: 'Nhân viên (Test)', role: 'requester', unit: 'Phòng Hành chính' },
      'unit_leader': { id: 'test-leader', name: 'Lãnh đạo (Test)', role: 'unit_leader', unit: 'Phòng Hành chính' },
      'csvc_manager': { id: 'test-manager', name: 'Quản lý (Test)', role: 'csvc_manager', unit: 'Phòng CSVC' },
      'technician': { id: 'test-tech', name: 'Kỹ thuật (Test)', role: 'technician', unit: 'Tổ Kỹ thuật' },
    };
    const user = testUsers[role];
    setCurrentUser(user);
    localStorage.setItem('test_user_session', JSON.stringify(user));
  };

  const logout = async () => {
    if (auth) await signOut(auth);
    setCurrentUser(null);
    localStorage.removeItem('test_user_session');
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
      currentUser, login, register, loginAsTestAccount, logout,
      requests, addRequest, updateRequestStatus,
      equipment: MOCK_EQUIPMENT, users, isInitialized
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
