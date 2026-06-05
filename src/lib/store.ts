
"use client"

import { useState, useEffect } from 'react';
import type { User, UserRole, RepairRequest, Equipment } from './types';

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Nhân viên A', role: 'requester', unit: 'Phòng Hành chính' },
  { id: 'u2', name: 'Lãnh đạo B', role: 'unit_leader', unit: 'Phòng Hành chính' },
  { id: 'u3', name: 'Quản lý CSVC C', role: 'csvc_manager' },
  { id: 'u4', name: 'Kỹ thuật viên D', role: 'technician' },
];

const MOCK_EQUIPMENT: Equipment[] = [
  { id: 'e1', name: 'Bàn ghế văn phòng', category: 'Furniture' },
  { id: 'e2', name: 'Máy chiếu Sony', category: 'IT' },
  { id: 'e3', name: 'Cáp HDMI 5m', category: 'IT' },
  { id: 'e4', name: 'Cáp VGA 3m', category: 'IT' },
  { id: 'e5', name: 'Bồn cầu Viglacera', category: 'Plumbing' },
  { id: 'e6', name: 'Lavabo Inax', category: 'Plumbing' },
];

const INITIAL_REQUESTS: RepairRequest[] = [
  {
    id: 'req-1',
    title: 'Hỏng vòi nước Lavabo',
    description: 'Vòi nước tại nhà vệ sinh tầng 2 bị rò rỉ mạnh không khóa được.',
    equipmentId: 'e6',
    equipmentName: 'Lavabo Inax',
    category: 'Plumbing',
    status: 'pending_approval',
    requesterId: 'u1',
    requesterName: 'Nhân viên A',
    unit: 'Phòng Hành chính',
    createdAt: new Date().toISOString(),
  }
];

export function useAppStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<RepairRequest[]>(INITIAL_REQUESTS);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('fixflow_user');
    const savedRequests = localStorage.getItem('fixflow_requests');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('fixflow_requests', JSON.stringify(requests));
    }
  }, [requests, isInitialized]);

  const login = (role: UserRole) => {
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    setCurrentUser(user);
    localStorage.setItem('fixflow_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fixflow_user');
  };

  const addRequest = (req: Omit<RepairRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: RepairRequest = {
      ...req,
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'pending_approval',
    };
    setRequests(prev => [newReq, ...prev]);
    return newReq;
  };

  const updateRequestStatus = (id: string, status: RepairRequest['status'], extra?: Partial<RepairRequest>) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, ...extra } : r));
  };

  return {
    currentUser,
    login,
    logout,
    requests,
    addRequest,
    updateRequestStatus,
    equipment: MOCK_EQUIPMENT,
    users: MOCK_USERS,
    isInitialized
  };
}
