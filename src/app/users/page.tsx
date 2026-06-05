
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Phone, Building, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function UserManagementPage() {
  const { users, currentUser } = useAppStore();

  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-black text-rose-500 uppercase">Quyền truy cập bị từ chối</h2>
      </div>
    );
  }

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin': return 'Quản trị viên';
      case 'csvc_manager': return 'Quản lý CSVC';
      case 'unit_leader': return 'Lãnh đạo đơn vị';
      case 'technician': return 'Kỹ thuật viên';
      case 'requester': return 'Nhân viên';
      default: return role;
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
          <Users className="h-7 w-7 text-primary" />
          Danh sách người dùng
        </h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Quản lý tài khoản đã đăng ký trên hệ thống</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {users.map((user) => (
          <Card key={user.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow overflow-hidden hover:bg-slate-50 transition-all">
            <CardContent className="p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="h-14 w-14 rounded-[1.5rem] bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-xl font-black text-primary">{user.name.charAt(0)}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-lg text-slate-800">{user.name}</h3>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[9px] font-black uppercase">
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6 border-slate-50">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Phone className="h-3 w-3" /> Số điện thoại
                  </p>
                  <p className="text-[11px] font-bold text-slate-700">{user.phoneNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Building className="h-3 w-3" /> Đơn vị / Khoa
                  </p>
                  <p className="text-[11px] font-bold text-slate-700">{user.unit || 'N/A'}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Shield className="h-3 w-3" /> Mật khẩu đăng ký
                  </p>
                  <p className="text-[11px] font-bold text-slate-300 tracking-[0.3em]">••••••••</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[3rem] card-shadow">
          <Users className="h-16 w-16 text-slate-100 mx-auto mb-6" />
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Chưa có người dùng nào đăng ký</p>
        </div>
      )}
    </div>
  );
}
