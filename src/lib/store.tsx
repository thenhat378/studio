
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
  const { db } = useFirebase();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Khôi phục phiên đăng nhập từ LocalStorage
    const savedUser = localStorage.getItem('due_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('due_user');
      }
    }
    setIsInitialized(true);
    setLoading(false);
  }, []);

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
    if (!db) return;
    
    // Tìm user trong Firestore theo số điện thoại
    const q = query(collection(db, 'users'), where('phoneNumber', '==', phone), limit(1));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      const userData = { id: snap.docs[0].id, ...snap.docs[0].data() } as User;
      // Trong phiên bản đơn giản này, chúng ta chấp nhận đăng nhập nếu tìm thấy số điện thoại
      // Bạn có thể thêm kiểm tra mật khẩu ở đây nếu muốn (userData.password === pass)
      setCurrentUser(userData);
      localStorage.setItem('due_user', JSON.stringify(userData));
    } else {
      throw new Error("Số điện thoại chưa được đăng ký.");
    }
  };

  const register = async (data: { phone: string, pass: string, name: string, unit: string, role: UserRole }) => {
    if (!db) return;
    
    // Kiểm tra số điện thoại đã tồn tại chưa
    const q = query(collection(db, 'users'), where('phoneNumber', '==', data.phone), limit(1));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      throw new Error("Số điện thoại này đã được sử dụng.");
    }

    const userId = `user_${Date.now()}_${data.phone.slice(-4)}`;
    const userData: User = {
      id: userId,
      name: data.name,
      role: data.role,
      unit: data.unit,
      phoneNumber: data.phone,
      // Lưu mật khẩu trực tiếp trong Firestore cho bản demo đơn giản
      password: data.pass 
    };

    // Lưu thẳng vào Firestore
    await setDoc(doc(db, 'users', userId), userData);
    
    // Đăng nhập ngay lập tức
    setCurrentUser(userData);
    localStorage.setItem('due_user', JSON.stringify(userData));
  };

  const logout = async () => {
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
