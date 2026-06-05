
"use client"

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Phone, Building, Shield, RefreshCcw, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function UserManagementPage() {
  const { users, currentUser, resetSystem } = useAppStore();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-black text-rose-500 uppercase">Quyền truy cập bị từ chối</h2>
      </div>
    );
  }

  const handleReset = async () => {
    if (confirm("XÁC NHẬN LÀM SẠCH: Bạn có chắc chắn muốn xóa toàn bộ Phiếu yêu cầu và các tài khoản người dùng khác? \n\n- Danh mục Thiết bị sẽ được GIỮ LẠI.\n- Tài khoản Admin của bạn sẽ được GIỮ LẠI.")) {
      setIsResetting(true);
      try {
        await resetSystem();
        toast({ 
          title: "Đã làm sạch dữ liệu", 
          description: "Phiếu yêu cầu và các tài khoản người dùng khác đã được xóa thành công." 
        });
      } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Lỗi", description: "Không thể làm sạch dữ liệu. Vui lòng thử lại." });
      } finally {
        setIsResetting(false);
      }
    }
  };

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
            <Users className="h-7 w-7 text-primary" />
            Danh sách người dùng
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Quản lý tài khoản đã đăng ký trên hệ thống</p>
        </div>
        <Button 
          variant="destructive" 
          onClick={handleReset} 
          disabled={isResetting}
          className="rounded-2xl h-14 font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-rose-100"
        >
          {isResetting ? <Loader2 className="animate-spin h-5 w-5" /> : <RefreshCcw className="h-5 w-5" />}
          Dọn dẹp Phiếu & Người dùng
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {users.map((user) => (
          <Card key={user.id} className={cn(
            "border-none shadow-sm rounded-[2.5rem] bg-white card-shadow overflow-hidden hover:bg-slate-50 transition-all",
            user.id === currentUser.id && "border-2 border-primary/20 bg-blue-50/20"
          )}>
            <CardContent className="p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="h-14 w-14 rounded-[1.5rem] bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-xl font-black text-primary">{user.name.charAt(0)}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg text-slate-800">{user.name}</h3>
                      {user.id === currentUser.id && <Badge className="bg-primary text-[8px] uppercase">Bạn</Badge>}
                    </div>
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
