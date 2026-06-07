
export type UserRole = 'requester' | 'unit_leader' | 'csvc_manager' | 'technician' | 'admin';

export type RequestStatus = 
  | 'pending_approval' 
  | 'approved' 
  | 'assigned' 
  | 'in_progress' 
  | 'completed' 
  | 'verified' 
  | 'closed'
  | 'rejected';

export type RepairType = 'repair_only' | 'backup_replacement' | 'pending_purchase' | 'new_replacement';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  unit?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
}

export interface RepairRequest {
  id: string;
  location: string; // Vị trí hư hỏng (Tiêu đề ngắn) - Nay là định danh chính
  description: string;
  equipmentId: string;
  equipmentName: string;
  category: string;
  status: RequestStatus;
  requesterId: string;
  requesterName: string;
  unit: string;
  technicianId?: string;
  technicianName?: string;
  createdAt: string;
  assignedAt?: string;
  completedAt?: string;
  images?: string[]; // Array of base64 strings (Requester)
  technicianImages?: string[]; // Array of base64 strings (Technician)
  aiSuggestions?: {
    causes: string[];
    recommendedEquipment: string[];
  };
  repairType?: RepairType;
  technicianReport?: string;
  rejectionReason?: string;
  unitFeedback?: string;
  rating?: number;
  requesterConfirmed?: boolean;
  requesterFeedback?: string;
  csvcManagerApproved?: boolean;
}
