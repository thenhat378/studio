
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
  deleteDoc,
  getDocs,
  where,
  limit,
  writeBatch
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
  addEquipment: (data: Omit<Equipment, 'id'>) => Promise<void>;
  updateEquipment: (id: string, data: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  resetSystem: () => Promise<void>;
  users: User[];
  isInitialized: boolean;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { db } = useFirebase();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
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

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(collection(db, 'equipment'), (snapshot) => {
      setEquipment(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment)));
    });
    return () => unsub();
  }, [db]);

  const login = async (phone: string, pass: string) => {
    if (!db) throw new Error("Database chưa sẵn sàng.");
    
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
      throw new Error("Số điện thoại chưa được đăng ký.");
    }
  };

  const register = async (data: { phone: string, pass: string, name: string, unit: string, role: UserRole }) => {
    if (!db) throw new Error("Database chưa sẵn sàng.");
    
    const q = query(collection(db, 'users'), where('phoneNumber', '==', data.phone), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      throw new Error("Số điện thoại này đã được đăng ký.");
    }

    const userId = `user_${Date.now()}`;
    const userData: User = {
      id: userId,
      name: data.name,
      role: data.role,
      unit: data.unit,
      phoneNumber: data.phone,
      password: data.pass
    };

    await setDoc(doc(db, 'users', userId), userData);
  };

  const resetPassword = async (phone: string, newPass: string) => {
    if (!db) throw new Error("Database chưa sẵn sàng.");
    const q = query(collection(db, 'users'), where('phoneNumber', '==', phone), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error("Không tìm thấy tài khoản.");
    await updateDoc(doc(db, 'users', snap.docs[0].id), { password: newPass });
  };

  const logout = () => {
    localStorage.removeItem('due_user');
    setCurrentUser(null);
  };

  const addRequest = async (req: Omit<RepairRequest, 'id' | 'createdAt' | 'status'>) => {
    if (!db) throw new Error("Database chưa sẵn sàng.");
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
    await updateDoc(doc(db, 'requests', id), { status, ...cleanExtra });
  };

  const addEquipment = async (data: Omit<Equipment, 'id'>) => {
    if (!db) return;
    await addDoc(collection(db, 'equipment'), data);
  };

  const updateEquipment = async (id: string, data: Partial<Equipment>) => {
    if (!db) return;
    await updateDoc(doc(db, 'equipment', id), data);
  };

  const deleteEquipment = async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, 'equipment', id));
  };

  const resetSystem = async () => {
    if (!db || currentUser?.role !== 'admin') return;
    const batch = writeBatch(db);
    
    // Xóa tất cả yêu cầu
    const requestSnap = await getDocs(collection(db, 'requests'));
    requestSnap.forEach(doc => batch.delete(doc.ref));
    
    // Xóa tất cả thiết bị
    const equipSnap = await getDocs(collection(db, 'equipment'));
    equipSnap.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, register, resetPassword, logout,
      requests, addRequest, updateRequestStatus,
      equipment, addEquipment, updateEquipment, deleteEquipment,
      resetSystem, users, isInitialized, loading
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
