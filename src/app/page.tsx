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
  Clock,
  MapPin
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
            <div className="h-24 w-24 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary/30 active-scale">
              <Wrench className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter mt-4 leading-none uppercase">
              <span className="text-slate-800">Requisition Form</span>
              <div className="mt-2">
                <span className="text-accent">D</span><span className="text-secondary">U</span><span className="text-primary">E</span>
              </div>
            </h1>
          </div>
          
          <Card className="rounded-[3.5rem] overflow-hidden bg-white card-shadow text-left border-none">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-20 bg-slate-50 p-2">
                <TabsTrigger value="login" className="h-full rounded-3xl font-black text-[12px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register" className="h-full rounded-3xl font-black text-[12px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">Đăng ký</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="p-8 md:p-12 space-y-8">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                      <Input placeholder="Số điện thoại" className="pl-16 h-18 rounded-3xl bg-slate-50 border-none font-bold text-lg" value={loginPhone} onChange={e => setLoginPhone(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                      <Input type="password" placeholder="••••••••" className="pl-16 h-18 rounded-3xl bg-slate-50 border-none font-bold text-lg" value={loginPass} onChange={e => setLoginPass(e.target.value)} required />
                    </div>
                    <button type="button" onClick={() => setIsForgotOpen(true)} className="text-[11px] font-black text-primary hover:underline uppercase float-right pr-4 tracking-tighter">Quên mật khẩu?</button>
                  </div>
                  <Button className="w-full h-20 rounded-[2rem] bg-primary text-white font-black text-base uppercase tracking-widest mt-6 shadow-2xl shadow-primary/20 active-scale" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Vào hệ thống"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="p-8 md:p-12 space-y-6">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black text-slate-400 uppercase ml-4">Họ và tên</Label>
                    <Input placeholder="Nguyễn Văn A" className="h-16 rounded-3xl bg-slate-50 border-none font-bold" value={regData.name} onChange={e => setRegData(prev => ({...prev, name: e.target.value}))} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-black text-slate-400 uppercase ml-4">SĐT</Label>
                      <Input placeholder="Số điện thoại" className="h-16 rounded-3xl bg-slate-50 border-none font-bold" value={regData.phone} onChange={e => setRegData(prev => ({...prev, phone: e.target.value}))} required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-black text-slate-400 uppercase ml-4">Mật khẩu</Label>
                      <Input type="password" placeholder="••••" className="h-16 rounded-3xl bg-slate-50 border-none font-bold" value={regData.pass} onChange={e => setRegData(prev => ({...prev, pass: e.target.value}))} required onFocus={() => setShowPassHint(true)} />
                    </div>
                  </div>
                  {showPassHint && (
                    <div className="p-5 bg-slate-50 rounded-[2rem] border text-[11px] space-y-2 font-bold uppercase tracking-tighter">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-4 w-4 rounded-full shrink-0", passValidation.length ? "bg-secondary" : "bg-slate-200")} />
                        <span className={passValidation.length ? "text-secondary" : "text-slate-400"}>Tối thiểu 8 ký tự</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={cn("h-4 w-4 rounded-full shrink-0", passValidation.special ? "bg-secondary" : "bg-slate-200")} />
                        <span className={passValidation.special ? "text-secondary" : "text-slate-400"}>Có ký tự đặc biệt (!@#...)</span>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black text-slate-400 uppercase ml-4">Đơn vị công tác</Label>
                    <Input placeholder="Ví dụ: Phòng CSVC, Khoa CNTT..." className="h-16 rounded-3xl bg-slate-50 border-none font-bold" value={regData.unit} onChange={e => setRegData(prev => ({...prev, unit: e.target.value}))} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black text-slate-400 uppercase ml-4">Chức danh</Label>
                    <Select value={regData.role} onValueChange={(val: any) => setRegData(prev => ({...prev, role: val}))}>
                      <SelectTrigger className="h-16 rounded-3xl bg-slate-50 border-none font-bold shadow-none"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-[2rem] border-none shadow-2xl p-2">
                        <SelectItem value="requester" className="rounded-xl h-12 font-bold">Nhân viên / Giảng viên</SelectItem>
                        <SelectItem value="unit_leader" className="rounded-xl h-12 font-bold">Quản lý đơn vị</SelectItem>
                        <SelectItem value="csvc_manager" className="rounded-xl h-12 font-bold">Quản lý CSVC</SelectItem>
                        <SelectItem value="technician" className="rounded-xl h-12 font-bold">Nhân viên kỹ thuật</SelectItem>
                        <SelectItem value="admin" className="rounded-xl h-12 font-bold">Quản trị viên (Admin)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full h-20 rounded-[2rem] bg-secondary text-white font-black text-base uppercase tracking-widest mt-6 shadow-2xl shadow-secondary/10 active-scale" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Xác nhận đăng ký"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
          <DialogContent className="rounded-[3.5rem] p-10 border-none shadow-2xl max-w-lg">
            <DialogHeader><DialogTitle className="uppercase font-black text-primary text-xl tracking-tighter">Đặt lại mật khẩu</DialogTitle></DialogHeader>
            <form onSubmit={handleResetPassword} className="space-y-5 mt-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase text-slate-400 ml-4">Số điện thoại</Label>
                <Input placeholder="Số điện thoại" className="h-16 rounded-[1.8rem] bg-slate-50 border-none font-bold px-6" value={forgotData.phone} onChange={e => setForgotData(prev => ({...prev, phone: e.target.value}))} required />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase text-slate-400 ml-4">Mật khẩu mới</Label>
                <Input type="password" placeholder="Mật khẩu mới" className="h-16 rounded-[1.8rem] bg-slate-50 border-none font-bold px-6" value={forgotData.newPass} onChange={e => setForgotData(prev => ({...prev, newPass: e.target.value}))} required />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase text-slate-400 ml-4">Xác nhận mật khẩu</Label>
                <Input type="password" placeholder="Xác nhận mật khẩu" className="h-16 rounded-[1.8rem] bg-slate-50 border-none font-bold px-6" value={forgotData.confirmPass} onChange={e => setForgotData(prev => ({...prev, confirmPass: e.target.value}))} required />
              </div>
              <Button className="w-full h-20 rounded-[2rem] bg-primary text-white font-black text-base uppercase tracking-widest mt-6 active-scale" disabled={isSubmitting || !forgotPassValidation.match}>Xác nhận đặt lại</Button>
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
      <div className="bg-primary rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden animate-slide-up">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <p className="text-[11px] font-black uppercase opacity-60 tracking-[0.3em]">HỆ THỐNG QUẢN LÝ DUE</p>
              <h1 className="text-4xl font-black leading-none tracking-tight">Chào, {currentUser.name.split(' ').pop()}!</h1>
              <div className="flex items-center gap-3 pt-2">
                 <div className="p-2 bg-white/10 rounded-xl">
                   <Building className="h-4 w-4 opacity-80" />
                 </div>
                 <p className="text-sm font-bold opacity-90 uppercase tracking-tight">{currentUser.unit}</p>
              </div>
            </div>
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none font-black text-[11px] uppercase tracking-widest px-6 py-3 rounded-full backdrop-blur-md">
              {getRoleLabel(currentUser.role)}
            </Badge>
         </div>
         <div className="absolute -right-20 -bottom-20 h-64 w-64 bg-white/5 rounded-full blur-3xl" />
         <div className="absolute -left-20 -top-20 h-40 w-40 bg-accent/10 rounded-full blur-2xl" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Tất cả phiếu', value: roleFilteredRequests.length, icon: UserCircle2, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Đang xử lý', value: roleFilteredRequests.filter(r => ['assigned', 'in_progress'].includes(r.status)).length, icon: Wrench, color: 'text-accent', bg: 'bg-accent/5' },
          { label: 'Hoàn thành', value: roleFilteredRequests.filter(r => r.status === 'closed').length, icon: CheckCircle2, color: 'text-secondary', bg: 'bg-secondary/5' },
          { label: 'Cần duyệt', value: roleFilteredRequests.filter(r => r.status === 'pending_approval' || r.status === 'verified').length, icon: ShieldCheck, color: 'text-rose-500', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-[2.5rem] bg-white border-none card-shadow group hover:bg-slate-50 transition-all active-scale">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300", stat.bg)}>
                <stat.icon className={cn("h-7 w-7", stat.color)} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentUser.role === 'csvc_manager' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-6">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="p-2 bg-primary/5 rounded-lg"><BarChart3 className="h-4 w-4 text-primary" /></div>
              Báo cáo hiệu suất kỹ thuật
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2 px-4 md:px-0">
            {roleFilteredRequests.filter(r => r.technicianId && (['closed', 'verified', 'completed'].includes(r.status))).slice(0, 4).map(req => (
              <Card key={req.id} className="rounded-[3rem] bg-white border-none card-shadow p-10 space-y-6 border-t-8 border-t-primary/5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="font-black text-lg text-slate-800 truncate uppercase tracking-tight">[{req.location}] {req.technicianName}</p>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-300" /> {req.unit}
                    </div>
                  </div>
                  {req.status === 'closed' && req.rating && (
                    <div className="flex gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
                      {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-3.5 w-3.5", s <= req.rating! ? "fill-amber-400 text-amber-400" : "text-slate-200")} />)}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 rounded-[2rem] p-6 border border-slate-100">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nhận việc lúc</p>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-sm">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-bold text-slate-700">{formatDate(req.assignedAt)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Báo xong lúc</p>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
                      <span className="text-[11px] font-bold text-secondary">{formatDate(req.completedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/5 rounded-lg">
                      <Timer className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">Xử lý trong: {getDuration(req.assignedAt, req.completedAt)}</span>
                  </div>
                  <Badge className={cn(
                    "text-[9px] font-black uppercase border-none px-4 py-1.5 rounded-lg",
                    req.status === 'closed' ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                  )}>
                    {req.status === 'closed' ? 'Đã đóng' : 'Chờ nghiệm thu'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between px-6">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Hoạt động gần đây</h3>
          <Link href="/requests" className="text-[11px] font-black text-primary uppercase hover:underline tracking-widest bg-white px-4 py-2 rounded-full shadow-sm">Tất cả</Link>
        </div>
        <div className="grid gap-4 px-4 md:px-0">
          {roleFilteredRequests.slice(0, 6).map(req => (
            <Link key={req.id} href={`/requests/${req.id}`} className="active-scale">
               <Card className="rounded-[2.5rem] bg-white border-none card-shadow hover:bg-slate-50 transition-all overflow-hidden border-l-8 border-l-slate-100 hover:border-l-primary/30 group">
                  <CardContent className="p-8 flex items-center justify-between">
                     <div className="space-y-3 min-w-0">
                        <p className="font-black text-lg text-slate-800 tracking-tight leading-tight uppercase truncate">
                          <span className="text-primary/40 mr-2 font-black">#</span>[{req.location}] {req.equipmentName}
                        </p>
                        <div className="flex items-center gap-3">
                           <Badge variant="secondary" className="text-[9px] font-black uppercase px-3 py-1 bg-slate-100 text-slate-500 border-none rounded-lg">
                             {req.unit}
                           </Badge>
                           <div className="h-1 w-1 rounded-full bg-slate-200" />
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.status.replace('_', ' ')}</p>
                        </div>
                     </div>
                     <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-all ml-4 shrink-0">
                        <ChevronRight className="h-6 w-6" />
                     </div>
                  </CardContent>
               </Card>
            </Link>
          ))}
          {roleFilteredRequests.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[4rem] card-shadow border-2 border-dashed border-slate-100 mx-4 md:mx-0">
              <Info className="h-16 w-16 text-slate-100 mx-auto mb-6" />
              <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">KHÔNG CÓ HOẠT ĐỘNG NÀO</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
