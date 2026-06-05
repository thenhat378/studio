
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, RepairRequest, Equipment, UserRole } from './types';
import { useFirebase } from '@/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
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
  loginAsTestAccount: (role: UserRole, customUser?: User) => void;
  register: (email: string, pass: string, name: string, unit: string) => Promise<void>;
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

  useEffect(() => {
    // Ưu tiên LocalStorage để giữ phiên làm việc khi Firebase Auth bị lỗi dịch vụ
    const storedUser = localStorage.getItem('app_user_session');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    if (!auth || !db) {
      setIsInitialized(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setCurrentUser(userData);
            localStorage.setItem('app_user_session', JSON.stringify(userData));
          }
        } catch (e) {
          console.error("Firestore user load error:", e);
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
    }, (error) => console.error("Firestore requests snapshot error:", error));
    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    if (!db) return;
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(data);
    }, (error) => console.error("Firestore users snapshot error:", error));
    return () => unsubscribe();
  }, [db]);

  const login = async (email: string, pass: string) => {
    if (!auth) throw new Error("Auth service unavailable");
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const loginAsTestAccount = (role: UserRole, customUser?: User) => {
    const testUsers: Record<UserRole, User> = {
      'requester': { id: 'test-req', name: 'Nhân viên (Test)', role: 'requester', unit: 'Phòng Hành chính', email: 'req@test.com' },
      'unit_leader': { id: 'test-leader', name: 'Lãnh đạo (Test)', role: 'unit_leader', unit: 'Phòng Hành chính', email: 'leader@test.com' },
      'csvc_manager': { id: 'test-manager', name: 'Quản lý (Test)', role: 'csvc_manager', unit: 'Phòng CSVC', email: 'manager@test.com' },
      'technician': { id: 'test-tech', name: 'Kỹ thuật (Test)', role: 'technician', unit: 'Tổ Kỹ thuật', email: 'tech@test.com' },
    };
    const user = customUser || testUsers[role];
    setCurrentUser(user);
    localStorage.setItem('app_user_session', JSON.stringify(user));
  };

  const register = async (email: string, pass: string, name: string, unit: string) => {
    const userId = 'user-' + Math.random().toString(36).substr(2, 9);
    const newUser: User = { id: userId, name, role: 'requester', unit, email };
    
    // Thử tạo bằng Auth nếu được, nếu không thì lưu thẳng vào Firestore
    if (auth && db) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        const finalUser = { ...newUser, id: res.user.uid };
        await setDoc(doc(db, 'users', res.user.uid), finalUser);
        setCurrentUser(finalUser);
        localStorage.setItem('app_user_session', JSON.stringify(finalUser));
        return;
      } catch (e) {
        console.warn("Auth Registration failed, falling back to direct Firestore:", e);
      }
    }

    // Fallback: Lưu trực tiếp vào Firestore (nếu Rules cho phép) hoặc ít nhất là LocalStorage
    if (db) {
      await setDoc(doc(db, 'users', userId), newUser);
    }
    setCurrentUser(newUser);
    localStorage.setItem('app_user_session', JSON.stringify(newUser));
  };

  const logout = async () => {
    if (auth) {
      try { await signOut(auth); } catch(e) {}
    }
    setCurrentUser(null);
    localStorage.removeItem('app_user_session');
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
      loginAsTestAccount,
      register,
      logout,
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
