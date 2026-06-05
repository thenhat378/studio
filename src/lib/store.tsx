
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, RepairRequest, Equipment, UserRole } from './types';
import { useFirebase } from '@/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult
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
  sendOtp: (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  verifyOtp: (confirmationResult: ConfirmationResult, otp: string, userData?: { name: string, unit: string }) => Promise<void>;
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
      } else {
        if (!localStorage.getItem('is_test_mode')) {
           setCurrentUser(null);
           localStorage.removeItem('app_user_session');
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
    localStorage.removeItem('is_test_mode');
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
    localStorage.setItem('is_test_mode', 'true');
    localStorage.setItem('app_user_session', JSON.stringify(user));
  };

  const register = async (email: string, pass: string, name: string, unit: string) => {
    if (!auth || !db) throw new Error("Firebase not initialized");
    localStorage.removeItem('is_test_mode');
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser: User = { id: res.user.uid, name, role: 'requester', unit, email };
    await setDoc(doc(db, 'users', res.user.uid), newUser);
    setCurrentUser(newUser);
    localStorage.setItem('app_user_session', JSON.stringify(newUser));
  };

  const sendOtp = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
    if (!auth) throw new Error("Auth service unavailable");
    // Đảm bảo recaptcha được render trước khi gửi
    await recaptchaVerifier.render();
    return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  };

  const verifyOtp = async (confirmationResult: ConfirmationResult, otp: string, userData?: { name: string, unit: string }) => {
    if (!db) throw new Error("Firestore not initialized");
    const result = await confirmationResult.confirm(otp);
    const user = result.user;
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const existingUser = userDoc.data() as User;
      setCurrentUser(existingUser);
      localStorage.setItem('app_user_session', JSON.stringify(existingUser));
    } else if (userData) {
      const newUser: User = { 
        id: user.uid, 
        name: userData.name, 
        unit: userData.unit, 
        role: 'requester', 
        phoneNumber: user.phoneNumber || '' 
      };
      await setDoc(doc(db, 'users', user.uid), newUser);
      setCurrentUser(newUser);
      localStorage.setItem('app_user_session', JSON.stringify(newUser));
    } else {
      throw new Error("Thông tin người dùng không tìm thấy.");
    }
    localStorage.removeItem('is_test_mode');
  };

  const logout = async () => {
    if (auth) {
      try { await signOut(auth); } catch(e) {}
    }
    setCurrentUser(null);
    localStorage.removeItem('is_test_mode');
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
      sendOtp,
      verifyOtp,
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
