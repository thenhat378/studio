
"use client"

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Phone, Building, Shield, RefreshCcw, Loader2, AlertTriangle } from 'lucide-react';
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
      <div className="text-center py-24 px-6 animate-slide-up">
        <div className="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6">
          <Shield className="h-10 w-10 text-rose-500" />
        </div>
        <h2 className="text-xl font-black text-rose-500 uppercase tracking-tighter">Quyền truy cập bị từ chối</h2>
        <p className="text-slate-500 font-medium mt-2">Khu vực này chỉ dành cho Quản trị viên hệ thống.</p>
      </div>
    );
  }

  const handleReset = async () => {
    const confirmation = window.confirm(
      "CẢNH BÁO QUAN TRỌNG: Bạn có chắc chắn muốn DỌN DẸP HỆ THỐNG? \n\n" +
      "- TOÀN BỘ Phiếu yêu cầu sẽ bị xóa vĩnh viễn.\n" +
      "- TOÀN BỘ tài khoản người dùng khác sẽ bị xóa.\n" +
      "- Danh mục Thiết bị sẽ được GIỮ LẠI.\n" +
      "- Tài khoản Admin hiện tại của bạn sẽ được GIỮ LẠI.\n\n" +
      "Hành động này không thể hoàn tác. Bạn có tiếp tục?"
    );

    if (confirmation) {
      setIsResetting(true);
      try {
        await resetSystem();
        toast({ 
          title: "Đã làm sạch hệ thống", 
          description: "Dữ liệu rác đã được xóa sạch. Hệ thống hiện ở trạng thái sẵn sàng bàn giao." 
        });
      } catch (error: any) {
        console.error(error);
        toast({ 
          variant: "destructive", 
          title: "Lỗi dọn dẹp", 
          description: error.message || "Không thể thực hiện dọn dẹp lúc này." 
        });
      } finally {
        setIsResetting(false);
      }
    }
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin': return 'Quản trị viên';
      case 'csvc_manager': return 'Quản lý CSVC';
      case 'unit_leader': return 'Quản lý đơn vị';
      case 'technician': return 'Kỹ thuật viên';
      case 'requester': return 'Nhân viên / Giảng viên';
      default: return role;
    }
  };

  return (
    <div className="space-y-8 pb-24 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[3rem] shadow-sm border-l-8 border-l-primary">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tighter">
            <Users className="h-8 w-8 text-primary" />
            Quản trị tài khoản
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Tổng cộng {users.length} tài khoản đã đăng ký</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="destructive" 
            onClick={handleReset} 
            disabled={isResetting}
            className="rounded-2xl h-16 px-8 font-black text-xs uppercase tracking-widest gap-3 shadow-2xl shadow-rose-100 active:scale-95 transition-all"
          >
            {isResetting ? <Loader2 className="animate-spin h-5 w-5" /> : <RefreshCcw className="h-5 w-5" />}
            Dọn dẹp hệ thống
          </Button>
        </div>
      </div>

      {isResetting && (
        <Card className="rounded-[2.5rem] border-2 border-dashed border-rose-200 bg-rose-50/50 p-8 flex items-center justify-center gap-4 animate-pulse">
           <AlertTriangle className="h-6 w-6 text-rose-500" />
           <p className="font-black text-rose-500 uppercase text-xs tracking-widest">Hệ thống đang được dọn dẹp, vui lòng đợi...</p>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {users.map((user) => (
          <Card key={user.id} className={cn(
            "border-none shadow-sm rounded-[3rem] bg-white card-shadow overflow-hidden hover:bg-slate-50 transition-all active:scale-[0.98]",
            user.id === currentUser?.id && "ring-4 ring-primary/10 bg-blue-50/10"
          )}>
            <CardContent className="p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-5">
                  <div className="h-16 w-16 rounded-[2rem] bg-slate-100 flex items-center justify-center shrink-0 border-2 border-white shadow-inner">
                    <span className="text-2xl font-black text-primary">{user.name.charAt(0)}</span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-xl text-slate-800 tracking-tight">{user.name}</h3>
                      {user.id === currentUser?.id && <Badge className="bg-primary text-[9px] font-black uppercase px-2 py-0.5">Bạn</Badge>}
                    </div>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-black uppercase px-3 py-1">
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6 border-t pt-8 border-slate-50">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> Số liên hệ
                  </p>
                  <p className="text-sm font-bold text-slate-700">{user.phoneNumber}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Building className="h-3.5 w-3.5" /> Đơn vị khoa
                  </p>
                  <p className="text-sm font-bold text-slate-700 truncate">{user.unit || 'Chưa rõ'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && !isResetting && (
        <div className="text-center py-32 bg-white rounded-[4rem] card-shadow border-2 border-dashed border-slate-100">
          <Users className="h-24 w-24 text-slate-50 mx-auto mb-6" />
          <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">HỆ THỐNG TRỐNG</p>
        </div>
      )}
    </div>
  );
}
