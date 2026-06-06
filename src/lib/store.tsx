
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

const cleanObject = (obj: any) => {
  if (obj === null || typeof obj !== 'object') return obj;
  const newObj = Array.isArray(obj) ? [...obj] : { ...obj };
  Object.keys(newObj).forEach(key => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    } else if (typeof newObj[key] === 'object') {
      newObj[key] = cleanObject(newObj[key]);
    }
  });
  return newObj;
};

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
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
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
      if (userData.password === pass) { 
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
    if (!snap.empty) throw new Error("Số điện thoại này đã được đăng ký.");

    const userId = `user_${Date.now()}`;
    const userData: User = {
      id: userId,
      name: data.name.trim(),
      role: data.role,
      unit: data.unit.trim().toLowerCase(),
      phoneNumber: data.phone,
      password: data.pass
    };
    await setDoc(doc(db, 'users', userId), cleanObject(userData));
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
    const rawData = {
      ...req,
      unit: req.unit.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      status: 'pending_approval' as const
    };
    await addDoc(collection(db, 'requests'), cleanObject(rawData));
  };

  const updateRequestStatus = async (id: string, status: RepairRequest['status'], extra?: Partial<RepairRequest>) => {
    if (!db) return;
    const now = new Date().toISOString();
    const updateData: any = { status };
    
    if (status === 'assigned') {
      updateData.assignedAt = now;
    }
    if (status === 'completed') {
      updateData.completedAt = now;
    }
    
    if (extra) Object.assign(updateData, extra);
    await updateDoc(doc(db, 'requests', id), cleanObject(updateData));
  };

  const addEquipment = async (data: Omit<Equipment, 'id'>) => {
    if (!db) return;
    await addDoc(collection(db, 'equipment'), cleanObject(data));
  };

  const updateEquipment = async (id: string, data: Partial<Equipment>) => {
    if (!db) return;
    await updateDoc(doc(db, 'equipment', id), cleanObject(data));
  };

  const deleteEquipment = async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, 'equipment', id));
  };

  const resetSystem = async () => {
    if (!db || !currentUser) throw new Error("Hệ thống chưa sẵn sàng.");

    try {
      const requestSnap = await getDocs(collection(db, 'requests'));
      const userSnap = await getDocs(collection(db, 'users'));

      const refsToDelete = [
        ...requestSnap.docs.map(d => d.ref),
        ...userSnap.docs.filter(d => d.id !== currentUser.id).map(d => d.ref)
      ];

      // Cơ chế xóa theo Batch để tránh giới hạn 500 bản ghi của Firestore
      for (let i = 0; i < refsToDelete.length; i += 400) {
        const batch = writeBatch(db);
        const chunk = refsToDelete.slice(i, i + 400);
        chunk.forEach(ref => batch.delete(ref));
        await batch.commit();
      }
    } catch (e: any) {
      console.error("Reset System Error:", e);
      throw new Error("Lỗi khi dọn dẹp hệ thống: " + e.message);
    }
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
