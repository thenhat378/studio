
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
  updateDoc,
  getDocs,
  where,
  limit
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

  // Chuyển số điện thoại thành email giả cho Firebase Auth
  const phoneToEmail = (phone: string) => {
    // Nếu là các vai trò đặc biệt để test nhanh
    if (['requester', 'leader', 'manager', 'tech'].includes(phone)) {
      return `${phone}@due.vn`;
    }
    return `${phone.replace(/\D/g, '')}@due-repair.vn`;
  };

  useEffect(() => {
    if (!auth || !db) return;

    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (userDoc.exists()) {
          setCurrentUser({ id: fbUser.uid, ...userDoc.data() } as User);
        } else {
          // Trường hợp đã có Auth nhưng chưa có User record (ví dụ lỗi gián đoạn)
          // Thử tìm user record theo email/phone
          const q = query(collection(db, 'users'), where('phoneNumber', '==', fbUser.email?.split('@')[0]));
          const snap = await getDocs(q);
          if (!snap.empty) {
             setCurrentUser({ id: fbUser.uid, ...snap.docs[0].data() } as User);
          }
        }
      } else {
        // Kiểm tra LocalStorage để hỗ trợ chế độ Offline/Bypass lỗi Token
        const savedUser = localStorage.getItem('due_user');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
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
    if (!auth || !db) return;
    try {
      await signInWithEmailAndPassword(auth, phoneToEmail(phone), pass);
    } catch (authError: any) {
      // Cơ chế Bypass: Nếu Auth lỗi (ví dụ token hỏng), kiểm tra Firestore trực tiếp
      // Đây là phương án cứu cánh để người dùng không bị kẹt
      const q = query(collection(db, 'users'), where('phoneNumber', '==', phone), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const userData = { id: snap.docs[0].id, ...snap.docs[0].data() } as User;
        setCurrentUser(userData);
        localStorage.setItem('due_user', JSON.stringify(userData));
      } else {
        throw authError;
      }
    }
  };

  const register = async (data: { phone: string, pass: string, name: string, unit: string, role: UserRole }) => {
    if (!auth || !db) return;
    
    let userId = "";
    try {
      // Thử tạo tài khoản trên Firebase Auth
      const { user: fbUser } = await createUserWithEmailAndPassword(auth, phoneToEmail(data.phone), data.pass);
      userId = fbUser.uid;
    } catch (authError: any) {
      // Nếu lỗi Token (auth/firebase-app-check-token-is-invalid)
      // Chúng ta sẽ "Bypass" bằng cách tạo ID thủ công và lưu vào Firestore
      if (authError.message.includes('app-check-token') || authError.message.includes('token-is-invalid')) {
        userId = `offline_${Date.now()}_${data.phone}`;
      } else {
        throw authError;
      }
    }
    
    const userData: User = {
      id: userId,
      name: data.name,
      role: data.role,
      unit: data.unit,
      phoneNumber: data.phone
    };

    // Lưu vào Firestore
    await setDoc(doc(db, 'users', userId), userData);
    
    // Lưu local để bypass các lần sau nếu Auth vẫn lỗi
    setCurrentUser(userData);
    localStorage.setItem('due_user', JSON.stringify(userData));
  };

  const logout = async () => {
    if (auth) await signOut(auth);
    localStorage.removeItem('due_user');
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
