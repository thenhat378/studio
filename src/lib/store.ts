
"use client"

import { useState, useEffect } from 'react';
import type { User, UserRole, RepairRequest, Equipment } from './types';

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Nguyễn Văn A', role: 'requester', unit: 'Phòng Hành chính' },
  { id: 'u2', name: 'Trần Thị B', role: 'unit_leader', unit: 'Phòng Hành chính' },
  { id: 'u3', name: 'Lê Văn C', role: 'csvc_manager' },
  { id: 'u4', name: 'Phạm Văn D', role: 'technician' },
];

const MOCK_EQUIPMENT: Equipment[] = [
  { id: 'e1', name: 'Bàn ghế', category: 'Furniture' },
  { id: 'e2', name: 'Máy chiếu', category: 'IT' },
  { id: 'e3', name: 'Cáp HDMI', category: 'IT' },
  { id: 'e4', name: 'VGA', category: 'IT' },
  { id: 'e5', name: 'Bàn cầu', category: 'Plumbing' },
  { id: 'e6', name: 'Lavabo', category: 'Plumbing' },
];

const INITIAL_REQUESTS: RepairRequest[] = [
  {
    id: 'req-1',
    title: 'Hỏng vòi nước Lavabo',
    description: 'Vòi nước tại nhà vệ sinh tầng 2 bị rò rỉ mạnh không khóa được.',
    equipmentId: 'e6',
    equipmentName: 'Lavabo',
    category: 'Plumbing',
    status: 'pending_approval',
    requesterId: 'u1',
    requesterName: 'Nguyễn Văn A',
    unit: 'Phòng Hành chính',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req-2',
    title: 'Máy chiếu không lên hình',
    description: 'Bật máy chiếu nhưng không nhận tín hiệu từ máy tính.',
    equipmentId: 'e2',
    equipmentName: 'Máy chiếu',
    category: 'IT',
    status: 'assigned',
    requesterId: 'u1',
    requesterName: 'Nguyễn Văn A',
    unit: 'Phòng Hành chính',
    technicianId: 'u4',
    technicianName: 'Phạm Văn D',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export function useAppStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<RepairRequest[]>(INITIAL_REQUESTS);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('fixflow_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsInitialized(true);
  }, []);

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
      id: `req-${Date.now()}`,
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
