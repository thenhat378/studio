
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Wrench,
  PlusCircle,
  HardDrive,
  Phone,
  Lock,
  User,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Overview() {
  const { 
    currentUser, 
    login, 
    register, 
    loginAsTestAccount,
    requests, 
    isInitialized 
  } = useAppStore();
  
  const { toast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    name: '',
    unit: ''
  });

  if (!isInitialized) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegister) {
        if (!formData.name || !formData.unit) throw new Error("Vui lòng điền đủ thông tin.");
        await register(formData.phone, formData.password, formData.name, formData.unit);
        toast({ title: "Đăng ký thành công", description: "Chào mừng bạn gia nhập hệ thống!" });
      } else {
        await login(formData.phone, formData.password);
        toast({ title: "Đăng nhập thành công" });
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Lỗi xác thực", 
        description: error.message || "Thông tin không chính xác." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#F4F7FE]">
        <div className="w-full max-w-[420px] space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-3">
             <div className="inline-flex p-5 bg-white rounded-[2.5rem] shadow-2xl mb-2">
                <Wrench className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-2xl font-black text-primary uppercase tracking-tighter">Requisition DUE</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hệ thống quản lý sửa chữa chuyên nghiệp</p>
          </div>

          <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden">
            <CardHeader className="text-center pt-8 pb-2">
              <CardTitle className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {isRegister ? 'Tạo tài khoản mới' : 'Đăng nhập hệ thống'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 px-8 pb-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="09xx..." 
                      className="h-14 rounded-2xl bg-slate-50 border-none font-bold pl-12"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {isRegister && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Họ và tên</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                          placeholder="Nhập tên của bạn..." 
                          className="h-14 rounded-2xl bg-slate-50 border-none font-bold pl-12"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Đơn vị</Label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                          placeholder="Khoa / Phòng / Trung tâm" 
                          className="h-14 rounded-2xl bg-slate-50 border-none font-bold pl-12"
                          value={formData.unit}
                          onChange={(e) => setFormData({...formData, unit: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      type="password"
                      placeholder="••••••••" 
                      className="h-14 rounded-2xl bg-slate-50 border-none font-bold pl-12"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 font-black rounded-2xl bg-primary shadow-xl uppercase text-xs tracking-widest mt-4" disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : isRegister ? "Đăng ký ngay" : "Vào hệ thống"}
                </Button>

                <Button 
                  type="button" 
                  variant="link" 
                  className="w-full text-xs text-slate-400 font-bold" 
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký ngay"}
                </Button>
              </form>

              <div className="relative py-4 flex items-center gap-3">
                <div className="h-px bg-slate-100 flex-1"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase">Truy cập nhanh</span>
                <div className="h-px bg-slate-100 flex-1"></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-11 rounded-xl text-[9px] font-black uppercase border-slate-100 hover:bg-slate-50" onClick={() => loginAsTestAccount('requester')}>Nhân viên</Button>
                <Button variant="outline" className="h-11 rounded-xl text-[9px] font-black uppercase border-slate-100 hover:bg-slate-50" onClick={() => loginAsTestAccount('unit_leader')}>Lãnh đạo</Button>
                <Button variant="outline" className="h-11 rounded-xl text-[9px] font-black uppercase border-slate-100 hover:bg-slate-50" onClick={() => loginAsTestAccount('csvc_manager')}>Quản lý</Button>
                <Button variant="outline" className="h-11 rounded-xl text-[9px] font-black uppercase border-slate-100 hover:bg-slate-50" onClick={() => loginAsTestAccount('technician')}>Kỹ thuật</Button>
              </div>
            </CardContent>
          </Card>
          <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest pb-10">© 2026 Hệ thống quản lý sửa chữa DUE</p>
        </div>
      </div>
    );
  }

  const roleFilteredRequests = requests.filter(r => {
    if (currentUser.role === 'requester') return r.requesterId === currentUser.id;
    if (currentUser.role === 'unit_leader') return r.unit === currentUser.unit;
    if (currentUser.role === 'technician') return r.technicianId === currentUser.id;
    return true;
  });

  const stats = [
    { label: 'Tổng phiếu', value: roleFilteredRequests.length, icon: ClipboardList, color: 'text-primary', bg: 'bg-blue-50' },
    { label: 'Đang làm', value: roleFilteredRequests.filter(r => ['assigned', 'in_progress', 'completed', 'verified'].includes(r.status)).length, icon: Clock, color: 'text-accent', bg: 'bg-orange-50' },
    { label: 'Chờ duyệt', value: roleFilteredRequests.filter(r => r.status === 'pending_approval').length, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Đã xong', value: roleFilteredRequests.filter(r => r.status === 'closed').length, icon: CheckCircle2, color: 'text-secondary', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200">
         <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">DUE Dashboard</p>
              <h1 className="text-2xl font-black">Chào, {currentUser.name.split(' ').pop()}!</h1>
              <p className="text-xs font-bold opacity-80 mt-1">{currentUser.unit}</p>
            </div>
            <Badge className="bg-white/20 border-none font-black text-[10px] uppercase tracking-tighter px-4 py-1.5">{currentUser.role.replace('_', ' ')}</Badge>
         </div>
      </div>

      {currentUser.role === 'requester' && (
        <Link href="/requests/new">
          <Card className="border-none bg-white rounded-[2.5rem] shadow-xl hover:scale-[1.02] transition-all card-shadow">
            <CardContent className="p-7 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-3xl bg-orange-50 flex items-center justify-center text-accent">
                  <PlusCircle className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">Tạo phiếu mới</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phát hiện hỏng hóc thiết bị?</p>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-200" />
            </CardContent>
          </Card>
        </Link>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm rounded-[2rem] bg-white">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className={cn("p-3 rounded-2xl mb-3", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between px-3">
           <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Hoạt động mới nhất</h3>
           <Link href="/requests" className="text-[10px] font-black text-primary uppercase border-b-2 border-primary/20 pb-0.5">Xem tất cả</Link>
        </div>
        
        <div className="space-y-4">
          {roleFilteredRequests.slice(0, 5).map((req) => (
            <Link key={req.id} href={`/requests/${req.id}`}>
              <Card className="border-none shadow-sm rounded-[2rem] bg-white hover:bg-slate-50 transition-colors">
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <HardDrive className="h-6 w-6 text-primary/30" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm text-slate-800 truncate mb-0.5">{req.title}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{req.equipmentName} • {req.unit}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-200" />
                </CardContent>
              </Card>
            </Link>
          ))}
          {roleFilteredRequests.length === 0 && (
            <div className="text-center py-16 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Chưa có dữ liệu phiếu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
