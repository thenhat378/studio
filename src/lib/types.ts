
export type UserRole = 'requester' | 'unit_leader' | 'csvc_manager' | 'technician';

export type RequestStatus = 
  | 'pending_approval' 
  | 'approved' 
  | 'assigned' 
  | 'in_progress' 
  | 'completed' 
  | 'verified' 
  | 'closed'
  | 'rejected';

export type RepairType = 'replacement' | 'backup_replacement' | 'repair_only';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  unit?: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
}

export interface RepairRequest {
  id: string;
  title: string;
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
  aiSuggestions?: {
    causes: string[];
    recommendedEquipment: string[];
  };
  repairType?: RepairType;
  technicianReport?: string;
  rejectionReason?: string;
  unitFeedback?: string;
  rating?: number; // 1 to 5 stars
  requesterConfirmed?: boolean;
  csvcManagerApproved?: boolean;
}
