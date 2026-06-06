
"use client"

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone,
  Lock,
  Loader2,
  User,
  Building,
  CheckCircle2,
  ShieldCheck,
  Check,
  X,
  Info,
  Wrench,
  ChevronRight,
  UserCircle2,
  BarChart3,
  Star,
  Timer,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceStrict, format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function Overview() {
  const { 
    currentUser, 
    login,
    register,
    resetPassword,
    requests, 
    isInitialized
  } = useAppStore();
  
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [regData, setRegData] = useState({
    name: '',
    phone: '',
    pass: '',
    unit: '',
    role: 'requester' as UserRole
  });

  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotData, setForgotData] = useState({
    phone: '',
    newPass: '',
    confirmPass: ''
  });
  const [forgotPassValidation, setForgotPassValidation] = useState({
    length: false,
    special: false,
    match: false
  });

  const [passValidation, setPassValidation] = useState({
    length: regData.pass.length >= 8,
    special: /[!@#$%^&*(),.?":{}|<>]/.test(regData.pass)
  });
  const [showPassHint, setShowPassHint] = useState(false);

  useEffect(() => {
    setPassValidation({
      length: regData.pass.length >= 8,
      special: /[!@#$%^&*(),.?":{}|<>]/.test(regData.pass)
    });
  }, [regData.pass]);

  useEffect(() => {
    setForgotPassValidation({
      length: forgotData.newPass.length >= 8,
      special: /[!@#$%^&*(),.?":{}|<>]/.test(forgotData.newPass),
      match: forgotData.newPass !== '' && forgotData.newPass === forgotData.confirmPass
    });
  }, [forgotData.newPass, forgotData.confirmPass]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FE]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone) return;
    setIsSubmitting(true);
    try {
      await login(loginPhone, loginPass);
      toast({ title: "Chào mừng trở lại!", description: "Đăng nhập thành công." });
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Lỗi đăng nhập", 
        description: error.message || "Vui lòng kiểm tra lại thông tin." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.name || !regData.phone || !regData.unit) {
      toast({ variant: "destructive", title: "Thiếu thông tin", description: "Vui lòng điền đầy đủ thông tin." });
      return;
    }
    if (!passValidation.length || !passValidation.special) {
      toast({ variant: "destructive", title: "Mật khẩu yếu", description: "Mật khẩu phải từ 8 ký tự và có ký tự đặc biệt." });
      return;
    }
    setIsSubmitting(true);
    try {
      await register(regData);
      toast({ title: "Đăng ký thành công!", description: "Bạn có thể đăng nhập ngay bây giờ." });
      setLoginPhone(regData.phone);
      setLoginPass('');
      setActiveTab('login');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Lỗi", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPassValidation.match || !forgotPassValidation.length || !forgotPassValidation.special) return;
    setIsSubmitting(true);
    try {
      await resetPassword(forgotData.phone, forgotData.newPass);
      toast({ title: "Thành công", description: "Mật khẩu đã được đặt lại." });
      setIsForgotOpen(false);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Lỗi", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch(role) {
      case 'requester': return 'Nhân viên / Giảng viên';
      case 'unit_leader': return 'Quản lý đơn vị';
      case 'csvc_manager': return 'Quản lý CSVC';
      case 'technician': return 'Nhân viên kỹ thuật';
      case 'admin': return 'Quản trị viên';
      default: return role;
    }
  };

  if (!currentUser) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center p-6 bg-[#F4F7FE]">
        <div className="w-full max-w-[480px] space-y-8 text-center animate-slide-up">
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="h-20 w-20 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/20">
              <Wrench className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter mt-4">
              <span className="text-slate-800">Requisition Form</span>
              <span className="text-accent ml-1">D</span><span className="text-secondary">U</span><span className="text-primary">E</span>
            </h1>
          </div>
          
          <Card className="rounded-[3rem] overflow-hidden bg-white card-shadow text-left border-none">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-16 bg-slate-50 p-1">
                <TabsTrigger value="login" className="h-full rounded-2xl font-black text-[11px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register" className="h-full rounded-2xl font-black text-[11px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Đăng ký</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="p-8 md:p-10 space-y-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <Input placeholder="Số điện thoại" className="pl-14 h-16 rounded-2xl bg-slate-50 border-none font-bold" value={loginPhone} onChange={e => setLoginPhone(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <Input type="password" placeholder="••••••••" className="pl-14 h-16 rounded-2xl bg-slate-50 border-none font-bold" value={loginPass} onChange={e => setLoginPass(e.target.value)} required />
                    </div>
                    <button type="button" onClick={() => setIsForgotOpen(true)} className="text-[10px] font-black text-primary hover:underline uppercase float-right pr-4 tracking-tighter">Quên mật khẩu?</button>
                  </div>
                  <Button className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest mt-4 shadow-xl shadow-primary/20 active:scale-95 transition-all" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Vào hệ thống"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="p-8 md:p-10 space-y-5">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase ml-4">Họ và tên</Label>
                    <Input placeholder="Nguyễn Văn A" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" value={regData.name} onChange={e => setRegData(prev => ({...prev, name: e.target.value}))} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 uppercase ml-4">SĐT</Label>
                      <Input placeholder="Số điện thoại" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" value={regData.phone} onChange={e => setRegData(prev => ({...prev, phone: e.target.value}))} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 uppercase ml-4">Mật khẩu</Label>
                      <Input type="password" placeholder="••••" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" value={regData.pass} onChange={e => setRegData(prev => ({...prev, pass: e.target.value}))} required onFocus={() => setShowPassHint(true)} />
                    </div>
                  </div>
                  {showPassHint && (
                    <div className="p-4 bg-slate-50 rounded-2xl border text-[10px] space-y-1.5 font-bold uppercase tracking-tighter">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-3 w-3 rounded-full shrink-0", passValidation.length ? "bg-emerald-500" : "bg-slate-200")} />
                        <span className={passValidation.length ? "text-emerald-600" : "text-slate-400"}>Tối thiểu 8 ký tự</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn("h-3 w-3 rounded-full shrink-0", passValidation.special ? "bg-emerald-500" : "bg-slate-200")} />
                        <span className={passValidation.special ? "text-emerald-600" : "text-slate-400"}>Có ký tự đặc biệt (!@#...)</span>
                      </div>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase ml-4">Đơn vị / Khoa / Phòng</Label>
                    <Input placeholder="Ví dụ: Phòng CSVC, Khoa CNTT..." className="h-14 rounded-2xl bg-slate-50 border-none font-bold" value={regData.unit} onChange={e => setRegData(prev => ({...prev, unit: e.target.value}))} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase ml-4">Chức danh</Label>
                    <Select value={regData.role} onValueChange={(val: any) => setRegData(prev => ({...prev, role: val}))}>
                      <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-xl">
                        <SelectItem value="requester">Nhân viên / Giảng viên</SelectItem>
                        <SelectItem value="unit_leader">Quản lý đơn vị</SelectItem>
                        <SelectItem value="csvc_manager">Quản lý CSVC</SelectItem>
                        <SelectItem value="technician">Nhân viên kỹ thuật</SelectItem>
                        <SelectItem value="admin">Quản trị viên (Admin)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full h-16 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest mt-4 shadow-xl shadow-emerald-100" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Xác nhận đăng ký"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
          <DialogContent className="rounded-[3rem] p-8 md:p-10 border-none shadow-2xl">
            <DialogHeader><DialogTitle className="uppercase font-black text-primary tracking-tighter">Đặt lại mật khẩu</DialogTitle></DialogHeader>
            <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
              <Input placeholder="Số điện thoại" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" value={forgotData.phone} onChange={e => setForgotData(prev => ({...prev, phone: e.target.value}))} required />
              <Input type="password" placeholder="Mật khẩu mới" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" value={forgotData.newPass} onChange={e => setForgotData(prev => ({...prev, newPass: e.target.value}))} required />
              <Input type="password" placeholder="Xác nhận mật khẩu" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" value={forgotData.confirmPass} onChange={e => setForgotData(prev => ({...prev, confirmPass: e.target.value}))} required />
              <Button className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest mt-4" disabled={isSubmitting || !forgotPassValidation.match}>Đặt lại mật khẩu</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const roleFilteredRequests = requests.filter(r => {
    if (currentUser.role === 'requester') return r.requesterId === currentUser.id;
    if (currentUser.role === 'unit_leader') {
      const normalizedUserUnit = (currentUser.unit || '').trim().toLowerCase();
      const normalizedReqUnit = (r.unit || '').trim().toLowerCase();
      return normalizedUserUnit === normalizedReqUnit;
    }
    if (currentUser.role === 'technician') return r.technicianId === currentUser.id;
    return true;
  });

  const getDuration = (start?: string, end?: string) => {
    if (!start || !end) return "N/A";
    try {
      return formatDistanceStrict(new Date(start), new Date(end), { locale: vi });
    } catch (e) {
      return "N/A";
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), 'HH:mm - dd/MM/yyyy');
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div className="space-y-8 pb-safe">
      <div className="bg-primary rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden animate-slide-up">
         <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em]">Hệ thống DUE</p>
              <h1 className="text-3xl font-black leading-none">Chào, {currentUser.name.split(' ').pop()}!</h1>
              <div className="flex items-center gap-2 pt-2">
                 <Building className="h-4 w-4 opacity-60" />
                 <p className="text-sm font-bold opacity-80 uppercase">{currentUser.unit}</p>
              </div>
            </div>
            <Badge className="bg-white/20 border-none font-black text-[10px] uppercase tracking-tighter px-4 py-2 rounded-full">
              {getRoleLabel(currentUser.role)}
            </Badge>
         </div>
         <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-white/5 rounded-full blur-2xl" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tất cả phiếu', value: roleFilteredRequests.length, icon: UserCircle2, color: 'text-blue-500' },
          { label: 'Đang xử lý', value: roleFilteredRequests.filter(r => ['assigned', 'in_progress'].includes(r.status)).length, icon: Wrench, color: 'text-amber-500' },
          { label: 'Hoàn thành', value: roleFilteredRequests.filter(r => r.status === 'closed').length, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Cần duyệt', value: roleFilteredRequests.filter(r => r.status === 'pending_approval' || r.status === 'verified').length, icon: ShieldCheck, color: 'text-rose-500' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-[2.5rem] bg-white border-none card-shadow group hover:bg-slate-50 transition-all active:scale-95">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
              <div className={cn("p-3 rounded-2xl bg-slate-50", stat.color.replace('text', 'bg').replace('500', '50'))}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentUser.role === 'csvc_manager' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Hiệu suất kỹ thuật chi tiết
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {roleFilteredRequests.filter(r => r.technicianId && (r.status === 'closed' || r.status === 'verified' || r.status === 'completed')).slice(0, 4).map(req => (
              <Card key={req.id} className="rounded-[2.5rem] bg-white border-none card-shadow p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-black text-base text-slate-800 truncate">{req.technicianName}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Nhân viên thực hiện</p>
                  </div>
                  {req.status === 'closed' && (
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-3.5 w-3.5", s <= (req.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-100")} />)}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Nhận việc lúc</p>
                    <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-blue-500" /> {formatDate(req.assignedAt)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Báo xong lúc</p>
                    <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3" /> {formatDate(req.completedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">Xử lý trong: {getDuration(req.assignedAt, req.completedAt)}</span>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase border-none">{req.status === 'closed' ? 'Đã đóng' : 'Chờ nghiệm thu'}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Hoạt động gần đây</h3>
          <Link href="/requests" className="text-[10px] font-black text-primary uppercase hover:underline">Xem tất cả</Link>
        </div>
        <div className="grid gap-4">
          {roleFilteredRequests.slice(0, 5).map(req => (
            <Link key={req.id} href={`/requests/${req.id}`} className="active:scale-95 transition-all">
               <Card className="rounded-[2.5rem] bg-white border-none card-shadow hover:bg-slate-50 transition-all overflow-hidden border-l-8 border-l-slate-100 hover:border-l-primary/30">
                  <CardContent className="p-7 flex items-center justify-between">
                     <div className="space-y-2">
                        <p className="font-black text-base text-slate-800 tracking-tight leading-tight">{req.title}</p>
                        <div className="flex items-center gap-2">
                           <Badge variant="secondary" className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 border-none">
                             {req.equipmentName}
                           </Badge>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{req.status.replace('_', ' ')}</p>
                        </div>
                     </div>
                     <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
                        <ChevronRight className="h-5 w-5" />
                     </div>
                  </CardContent>
               </Card>
            </Link>
          ))}
          {roleFilteredRequests.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] card-shadow border-2 border-dashed border-slate-100">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Không có hoạt động nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
