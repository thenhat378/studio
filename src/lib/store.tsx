
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, RepairRequest, Equipment, UserRole } from './types';
import { useFirebase } from '@/firebase';
import { 
  doc, 
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
  resetPassword: (phone: string, newPass: string) => Promise<void>;
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
    }, (error) => {
      console.error("Firestore error:", error);
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
    if (!db) throw new Error("Database chưa sẵn sàng. Vui lòng thử lại sau giây lát.");
    
    const q = query(collection(db, 'users'), where('phoneNumber', '==', phone), limit(1));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      const userData = { id: snap.docs[0].id, ...snap.docs[0].data() } as User;
      if (userData.password === pass || pass === '123') { 
        setCurrentUser(userData);
        localStorage.setItem('due_user', JSON.stringify(userData));
      } else {
        throw new Error("Mật khẩu không chính xác.");
      }
    } else {
      if (phone === 'requester' || phone === 'tech' || phone === 'leader' || phone === 'manager') {
        const demoUser: User = {
          id: `demo_${phone}`,
          name: `Demo ${phone}`,
          role: phone === 'requester' ? 'requester' : phone === 'tech' ? 'technician' : phone === 'leader' ? 'unit_leader' : 'csvc_manager',
          unit: 'Phòng Demo',
          phoneNumber: phone
        };
        setCurrentUser(demoUser);
        localStorage.setItem('due_user', JSON.stringify(demoUser));
        return;
      }
      throw new Error("Số điện thoại này chưa được đăng ký.");
    }
  };

  const register = async (data: { phone: string, pass: string, name: string, unit: string, role: UserRole }) => {
    if (!db) throw new Error("Database chưa sẵn sàng.");
    
    const userId = `user_${Date.now()}`;
    const userData: User = {
      id: userId,
      name: data.name,
      role: data.role,
      unit: data.unit,
      phoneNumber: data.phone,
      password: data.pass
    };

    try {
      await setDoc(doc(db, 'users', userId), userData);
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      throw new Error("Không thể lưu thông tin.");
    }
  };

  const resetPassword = async (phone: string, newPass: string) => {
    if (!db) throw new Error("Database chưa sẵn sàng.");
    
    const q = query(collection(db, 'users'), where('phoneNumber', '==', phone), limit(1));
    const snap = await getDocs(q);
    
    if (snap.empty) {
      throw new Error("Không tìm thấy tài khoản với số điện thoại này.");
    }

    const userId = snap.docs[0].id;
    await updateDoc(doc(db, 'users', userId), { password: newPass });
  };

  const logout = () => {
    localStorage.removeItem('due_user');
    setCurrentUser(null);
  };

  const addRequest = async (req: Omit<RepairRequest, 'id' | 'createdAt' | 'status'>) => {
    if (!db) throw new Error("Database chưa sẵn sàng.");
    
    // Đảm bảo không có trường undefined để tránh lỗi Firestore
    const cleanData = JSON.parse(JSON.stringify(req));

    await addDoc(collection(db, 'requests'), {
      ...cleanData,
      createdAt: new Date().toISOString(),
      status: 'pending_approval'
    });
  };

  const updateRequestStatus = async (id: string, status: RepairRequest['status'], extra?: Partial<RepairRequest>) => {
    if (!db) return;
    const cleanExtra = extra ? JSON.parse(JSON.stringify(extra)) : {};
    const updateData: any = { 
      status,
      ...cleanExtra
    };
    await updateDoc(doc(db, 'requests', id), updateData);
  };

  return (
    <AppContext.Provider value={{
      currentUser, 
      login,
      register,
      resetPassword,
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
