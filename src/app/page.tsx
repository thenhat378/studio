
"use client"

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Wrench,
  PlusCircle,
  HardDrive,
  User,
  ShieldCheck,
  Briefcase,
  Phone,
  Lock,
  Loader2,
  Building
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Overview() {
  const { 
    currentUser, 
    login,
    register,
    requests, 
    isInitialized,
    loading 
  } = useAppStore();
  
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Login states
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register states
  const [regData, setRegData] = useState({
    name: '',
    phone: '',
    pass: '',
    unit: '',
    role: 'requester' as UserRole
  });

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FE]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone || !loginPass) return;
    setIsSubmitting(true);
    try {
      await login(loginPhone, loginPass);
      toast({ title: "Đăng nhập thành công", description: "Chào mừng bạn trở lại hệ thống." });
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Lỗi đăng nhập", 
        description: "Số điện thoại hoặc mật khẩu không chính xác." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.name || !regData.phone || !regData.pass || !regData.unit) return;
    setIsSubmitting(true);
    try {
      await register(regData);
      toast({ title: "Đăng ký thành công", description: "Tài khoản của bạn đã sẵn sàng." });
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Lỗi đăng ký", 
        description: error.message || "Không thể tạo tài khoản lúc này." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Giao diện khi chưa đăng nhập
  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#F4F7FE]">
        <div className="w-full max-w-[450px] space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-3">
             <div className="inline-flex p-5 bg-white rounded-[2.5rem] shadow-2xl mb-2">
                <Wrench className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">Requisition DUE</h1>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Hệ thống quản lý sửa chữa chuyên nghiệp</p>
          </div>

          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-50 p-1">
                <TabsTrigger value="login" className="rounded-[2rem] font-black text-xs uppercase tracking-widest">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register" className="rounded-[2rem] font-black text-xs uppercase tracking-widest">Đăng ký</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="p-8">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <Input 
                        placeholder="Nhập số điện thoại..." 
                        className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold"
                        value={loginPhone}
                        onChange={e => setLoginPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <Input 
                        type="password"
                        placeholder="••••••••" 
                        className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold"
                        value={loginPass}
                        onChange={e => setLoginPass(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button className="w-full h-14 rounded-2xl bg-primary font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Vào hệ thống"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="p-8">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 col-span-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Họ và tên</Label>
                      <Input 
                        placeholder="Nguyễn Văn A" 
                        className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm"
                        value={regData.name}
                        onChange={e => setRegData(prev => ({...prev, name: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Số điện thoại</Label>
                      <Input 
                        placeholder="0905..." 
                        className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm"
                        value={regData.phone}
                        onChange={e => setRegData(prev => ({...prev, phone: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mật khẩu</Label>
                      <Input 
                        type="password"
                        placeholder="••••" 
                        className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm"
                        value={regData.pass}
                        onChange={e => setRegData(prev => ({...prev, pass: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Đơn vị / Khoa</Label>
                      <Input 
                        placeholder="Ví dụ: Khoa Quản trị" 
                        className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm"
                        value={regData.unit}
                        onChange={e => setRegData(prev => ({...prev, unit: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Vai trò</Label>
                      <Select value={regData.role} onValueChange={(val: any) => setRegData(prev => ({...prev, role: val}))}>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="requester">Nhân viên / Giảng viên</SelectItem>
                          <SelectItem value="unit_leader">Lãnh đạo đơn vị</SelectItem>
                          <SelectItem value="csvc_manager">Quản lý CSVC</SelectItem>
                          <SelectItem value="technician">Kỹ thuật viên</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full h-14 rounded-2xl bg-secondary font-black uppercase tracking-widest text-xs mt-4 shadow-xl shadow-emerald-100" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Đăng ký tài khoản"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          
          <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest">
            Hệ thống quản lý nội bộ trường ĐH Kinh tế - ĐHĐN
          </p>
        </div>
      </div>
    );
  }

  // Dashboard cho người dùng đã đăng nhập
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
