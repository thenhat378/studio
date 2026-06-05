
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

interface AppContextType {
  currentUser: User | null;
  loginAsRole: (role: UserRole, customName?: string, customUnit?: string) => void;
  logout: () => void;
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
  const { db } = useFirebase();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Tự động khôi phục phiên làm việc từ LocalStorage (không cần mật khẩu)
    const savedUser = localStorage.getItem('due_repair_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsInitialized(true);
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

  const loginAsRole = (role: UserRole, customName?: string, customUnit?: string) => {
    const defaultUsers: Record<UserRole, User> = {
      'requester': { id: 'req-1', name: customName || 'Nguyễn Văn A', role: 'requester', unit: customUnit || 'Khoa Quản trị' },
      'unit_leader': { id: 'leader-1', name: customName || 'Trần Thị B', role: 'unit_leader', unit: customUnit || 'Khoa Quản trị' },
      'csvc_manager': { id: 'manager-1', name: customName || 'Phạm Văn C', role: 'csvc_manager', unit: 'Phòng CSVC' },
      'technician': { id: 'tech-1', name: customName || 'Kỹ thuật viên 01', role: 'technician', unit: 'Tổ Kỹ thuật' },
    };
    
    const user = defaultUsers[role];
    setCurrentUser(user);
    localStorage.setItem('due_repair_user', JSON.stringify(user));
    
    // Lưu vào Firestore để quản lý danh sách người dùng
    if (db) {
      setDoc(doc(db, 'users', user.id), user, { merge: true });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('due_repair_user');
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
      loginAsRole, 
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

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
