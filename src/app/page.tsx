
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
  ChevronRight
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
    length: false,
    special: false
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
        <div className="w-full max-w-[480px] space-y-8 text-center">
          <h1 className="text-4xl font-black tracking-tighter">
            <span className="text-slate-800 mr-2">Requisition Form</span>
            <span className="text-accent">D</span><span className="text-secondary">U</span><span className="text-primary">E</span>
          </h1>
          <Card className="rounded-[3.5rem] overflow-hidden bg-white/70 backdrop-blur-2xl card-shadow text-left border-white/50">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-20 bg-transparent border-b p-0">
                <TabsTrigger value="login" className="h-full rounded-none font-black text-xs uppercase tracking-widest data-[state=active]:border-b-4 data-[state=active]:border-primary">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register" className="h-full rounded-none font-black text-xs uppercase tracking-widest data-[state=active]:border-b-4 data-[state=active]:border-primary">Đăng ký mới</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="p-10 space-y-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <Input placeholder="Nhập số điện thoại" className="pl-14 h-16 rounded-[1.8rem]" value={loginPhone} onChange={e => setLoginPhone(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <Input type="password" placeholder="••••••••" className="pl-14 h-16 rounded-[1.8rem]" value={loginPass} onChange={e => setLoginPass(e.target.value)} required />
                    </div>
                    <button type="button" onClick={() => setIsForgotOpen(true)} className="text-[11px] font-black text-primary hover:underline uppercase float-right pr-4">Quên mật khẩu?</button>
                  </div>
                  <Button className="w-full h-16 rounded-[1.8rem] bg-primary text-white font-black uppercase tracking-widest mt-4" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Vào hệ thống"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="p-10 space-y-5">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase ml-4">Họ và tên</Label>
                    <Input placeholder="Nguyễn Văn A" className="h-14 rounded-2xl" value={regData.name} onChange={e => setRegData(prev => ({...prev, name: e.target.value}))} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 uppercase ml-4">SĐT</Label>
                      <Input placeholder="09xxx" className="h-14 rounded-2xl" value={regData.phone} onChange={e => setRegData(prev => ({...prev, phone: e.target.value}))} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 uppercase ml-4">Mật khẩu</Label>
                      <Input type="password" placeholder="••••" className="h-14 rounded-2xl" value={regData.pass} onChange={e => setRegData(prev => ({...prev, pass: e.target.value}))} required onFocus={() => setShowPassHint(true)} />
                    </div>
                  </div>
                  {showPassHint && (
                    <div className="p-4 bg-slate-50 rounded-2xl border text-[11px] space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-3 w-3 rounded-full", passValidation.length ? "bg-emerald-500" : "bg-slate-200")} />
                        <span>Tối thiểu 8 ký tự</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn("h-3 w-3 rounded-full", passValidation.special ? "bg-emerald-500" : "bg-slate-200")} />
                        <span>Có ký tự đặc biệt (!@#...)</span>
                      </div>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase ml-4">Đơn vị / Khoa / Phòng</Label>
                    <Input placeholder="Phòng CSVC, Khoa CNTT..." className="h-14 rounded-2xl" value={regData.unit} onChange={e => setRegData(prev => ({...prev, unit: e.target.value}))} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase ml-4">Chức danh</Label>
                    <Select value={regData.role} onValueChange={(val: any) => setRegData(prev => ({...prev, role: val}))}>
                      <SelectTrigger className="h-14 rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="requester">Nhân viên / Giảng viên</SelectItem>
                        <SelectItem value="unit_leader">Quản lý đơn vị</SelectItem>
                        <SelectItem value="csvc_manager">Quản lý CSVC</SelectItem>
                        <SelectItem value="technician">Nhân viên kỹ thuật</SelectItem>
                        <SelectItem value="admin">Quản trị viên (Admin)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full h-16 rounded-[1.8rem] bg-emerald-600 text-white font-black uppercase mt-4" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Xác nhận đăng ký"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
          <DialogContent className="rounded-[3rem] p-10 border-none">
            <DialogHeader><DialogTitle className="uppercase font-black text-primary">Đặt lại mật khẩu</DialogTitle></DialogHeader>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input placeholder="Số điện thoại" className="h-14 rounded-2xl" value={forgotData.phone} onChange={e => setForgotData(prev => ({...prev, phone: e.target.value}))} required />
              <Input type="password" placeholder="Mật khẩu mới" className="h-14 rounded-2xl" value={forgotData.newPass} onChange={e => setForgotData(prev => ({...prev, newPass: e.target.value}))} required />
              <Input type="password" placeholder="Xác nhận mật khẩu" className="h-14 rounded-2xl" value={forgotData.confirmPass} onChange={e => setForgotData(prev => ({...prev, confirmPass: e.target.value}))} required />
              <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black" disabled={isSubmitting || !forgotPassValidation.match}>Xác nhận</Button>
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

  return (
    <div className="space-y-8 pb-24">
      <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
         <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-3xl font-black">Chào, {currentUser.name.split(' ').pop()}!</h1>
              <div className="flex items-center gap-2 pt-2">
                 <Building className="h-4 w-4 opacity-60" />
                 <p className="text-sm font-bold opacity-80">{currentUser.unit}</p>
              </div>
            </div>
            <Badge className="bg-white/20 border-none font-black text-[11px] uppercase tracking-tighter px-5 py-2 rounded-full">
              {getRoleLabel(currentUser.role)}
            </Badge>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tất cả phiếu', value: roleFilteredRequests.length, icon: User },
          { label: 'Đang xử lý', value: roleFilteredRequests.filter(r => ['assigned', 'in_progress'].includes(r.status)).length, icon: Wrench },
          { label: 'Hoàn thành', value: roleFilteredRequests.filter(r => r.status === 'closed').length, icon: CheckCircle2 },
          { label: 'Cần duyệt', value: roleFilteredRequests.filter(r => r.status === 'pending_approval' || r.status === 'verified').length, icon: ShieldCheck },
        ].map((stat, i) => (
          <Card key={i} className="rounded-[2rem] bg-white card-shadow border-none">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-1">
              <stat.icon className="h-5 w-5 text-slate-200 mb-2" />
              <p className="text-[10px] font-black text-slate-400 uppercase">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black text-slate-800 uppercase px-4 tracking-widest">Hoạt động gần đây</h3>
        <div className="grid gap-4">
          {roleFilteredRequests.slice(0, 5).map(req => (
            <Link key={req.id} href={`/requests/${req.id}`}>
               <Card className="rounded-[2rem] bg-white border-none card-shadow hover:bg-slate-50 transition-all">
                  <CardContent className="p-7 flex items-center justify-between">
                     <div className="space-y-1.5">
                        <p className="font-black text-base text-slate-800">{req.title}</p>
                        <div className="flex items-center gap-2">
                           <Badge variant="secondary" className="text-[9px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500">
                             {req.equipmentName}
                           </Badge>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{req.status.replace('_', ' ')}</p>
                        </div>
                     </div>
                     <ChevronRight className="h-6 w-6 text-slate-200" />
                  </CardContent>
               </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
