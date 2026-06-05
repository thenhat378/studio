"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, RepairRequest, Equipment, UserRole } from './types';
import { useFirebase } from '@/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
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
  loginWithGoogle: () => Promise<void>;
  loginAsTestAccount: (role: UserRole) => void;
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
          } else {
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Người dùng mới',
              role: 'requester',
              unit: 'Đơn vị chưa xác định',
              email: firebaseUser.email || ''
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setCurrentUser(newUser);
          }
        } catch (e) {
          console.error("Firestore error loading user profile:", e);
        }
      } else {
        const storedUser = localStorage.getItem('test_user');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
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
    if (!auth) throw new Error("Firebase Auth chưa khởi tạo.");
    await signInWithEmailAndPassword(auth, email, pass);
    localStorage.removeItem('test_user');
  };

  const loginWithGoogle = async () => {
    if (!auth) throw new Error("Firebase Auth chưa khởi tạo.");
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    localStorage.removeItem('test_user');
  };

  const loginAsTestAccount = (role: UserRole) => {
    const testUsers: Record<UserRole, User> = {
      'requester': { id: 'test-req', name: 'Nhân viên (Test)', role: 'requester', unit: 'Phòng Hành chính', email: 'req@test.com' },
      'unit_leader': { id: 'test-leader', name: 'Lãnh đạo (Test)', role: 'unit_leader', unit: 'Phòng Hành chính', email: 'leader@test.com' },
      'csvc_manager': { id: 'test-manager', name: 'Quản lý CSVC (Test)', role: 'csvc_manager', unit: 'Phòng CSVC', email: 'manager@test.com' },
      'technician': { id: 'test-tech', name: 'Kỹ thuật viên (Test)', role: 'technician', unit: 'Tổ Kỹ thuật', email: 'tech@test.com' },
    };
    const user = testUsers[role];
    setCurrentUser(user);
    localStorage.setItem('test_user', JSON.stringify(user));
  };

  const register = async (email: string, pass: string, name: string, unit: string) => {
    if (!auth || !db) throw new Error("Firebase chưa khởi tạo.");
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser: User = {
      id: res.user.uid,
      name,
      role: 'requester',
      unit,
      email
    };
    await setDoc(doc(db, 'users', res.user.uid), newUser);
    setCurrentUser(newUser);
    localStorage.removeItem('test_user');
  };

  const logout = async () => {
    if (auth) await signOut(auth);
    setCurrentUser(null);
    localStorage.removeItem('test_user');
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
      loginWithGoogle,
      loginAsTestAccount,
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
