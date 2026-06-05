
"use client"

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wrench,
  Phone,
  Lock,
  Loader2,
  ChevronRight,
  User,
  Building,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Check,
  X,
  Info
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

  // Forgot Password states
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotData, setForgotData] = useState({
    phone: '',
    newPass: '',
    confirmPass: ''
  });
  const [forgotPassValidation, setForgotPassValidation] = useState({
    length: false,
    special: false
  });

  // Password validation states
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
      special: /[!@#$%^&*(),.?":{}|<>]/.test(forgotData.newPass)
    });
  }, [forgotData.newPass]);

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
      toast({ variant: "destructive", title: "Thiếu thông tin", description: "Vui lòng điền đầy đủ các trường." });
      return;
    }

    if (!passValidation.length || !passValidation.special) {
      toast({ 
        variant: "destructive", 
        title: "Mật khẩu yếu", 
        description: "Mật khẩu phải từ 8 ký tự và có ký tự đặc biệt." 
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await register(regData);
      toast({ 
        title: "Đăng ký thành công!", 
        description: "Vui lòng đăng nhập bằng tài khoản vừa tạo." 
      });
      setLoginPhone(regData.phone);
      setLoginPass('');
      setActiveTab('login');
      setRegData({
        name: '',
        phone: '',
        pass: '',
        unit: '',
        role: 'requester' as UserRole
      });
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Không thể đăng ký", 
        description: error.message || "Đã xảy ra lỗi hệ thống." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotData.newPass !== forgotData.confirmPass) {
      toast({ variant: "destructive", title: "Lỗi", description: "Mật khẩu xác nhận không khớp." });
      return;
    }
    if (!forgotPassValidation.length || !forgotPassValidation.special) {
      toast({ variant: "destructive", title: "Lỗi", description: "Mật khẩu mới không đủ mạnh." });
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(forgotData.phone, forgotData.newPass);
      toast({ title: "Thành công", description: "Mật khẩu đã được đặt lại." });
      setIsForgotOpen(false);
      setLoginPhone(forgotData.phone);
      setForgotData({ phone: '', newPass: '', confirmPass: '' });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Lỗi", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#F4F7FE]">
        <div className="w-full max-w-[480px] space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-4">
             <div className="inline-flex p-6 bg-white rounded-[2.5rem] shadow-2xl mb-2 border border-slate-100">
                <Wrench className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-4xl font-black text-[#0054A4] uppercase tracking-tighter">REQUISITION DUE</h1>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Cơ sở hạ tầng & Sửa chữa thiết bị</p>
          </div>

          <Card className="border-none shadow-2xl rounded-[3.5rem] overflow-hidden bg-white">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-20 bg-white border-b p-0">
                <TabsTrigger value="login" className="h-full rounded-none font-black text-xs uppercase tracking-widest data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register" className="h-full rounded-none font-black text-xs uppercase tracking-widest data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Đăng ký mới</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="p-10 space-y-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <Input 
                        placeholder="09xx..." 
                        className="pl-14 h-16 rounded-[1.8rem] bg-slate-50 border-none font-bold text-slate-700 text-lg"
                        value={loginPhone}
                        onChange={e => setLoginPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <Input 
                        type="password"
                        placeholder="••••••••" 
                        className="pl-14 h-16 rounded-[1.8rem] bg-slate-50 border-none font-bold text-slate-700 text-lg"
                        value={loginPass}
                        onChange={e => setLoginPass(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-end px-2">
                      <button 
                        type="button" 
                        onClick={() => setIsForgotOpen(true)}
                        className="text-[10px] font-black text-primary uppercase hover:underline tracking-widest"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                  </div>
                  <Button className="w-full h-16 rounded-[1.8rem] bg-[#0054A4] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-100 mt-4 transition-transform active:scale-95" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "VÀO HỆ THỐNG"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="p-10 space-y-5">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Họ và tên</Label>
                    <Input 
                      placeholder="Nguyễn Văn A" 
                      className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                      value={regData.name}
                      onChange={e => setRegData(prev => ({...prev, name: e.target.value}))}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Số điện thoại</Label>
                      <Input 
                        placeholder="09xxx" 
                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                        value={regData.phone}
                        onChange={e => setRegData(prev => ({...prev, phone: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Mật khẩu</Label>
                      <Input 
                        type="password"
                        placeholder="••••••••" 
                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                        value={regData.pass}
                        onChange={e => {
                          setRegData(prev => ({...prev, pass: e.target.value}));
                          setShowPassHint(true);
                        }}
                        onFocus={() => setShowPassHint(true)}
                        required
                      />
                      {showPassHint && (
                        <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <p className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1.5 mb-1">
                            <Info className="h-3 w-3" /> Yêu cầu mật khẩu:
                          </p>
                          <div className="flex items-center gap-2">
                            {passValidation.length ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-rose-400" />}
                            <span className={cn("text-[10px] font-bold uppercase tracking-tighter", passValidation.length ? "text-emerald-600" : "text-slate-400")}>Tối thiểu 8 ký tự</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {passValidation.special ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-rose-400" />}
                            <span className={cn("text-[10px] font-bold uppercase tracking-tighter", passValidation.special ? "text-emerald-600" : "text-slate-400")}>Có ký tự đặc biệt (!@#...)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Đơn vị / Khoa</Label>
                    <Input 
                      placeholder="Phòng QLCL, Khoa CNTT..." 
                      className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                      value={regData.unit}
                      onChange={e => setRegData(prev => ({...prev, unit: e.target.value}))}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Vai trò người dùng</Label>
                    <Select value={regData.role} onValueChange={(val: any) => setRegData(prev => ({...prev, role: val}))}>
                      <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="requester">Nhân viên / Giảng viên</SelectItem>
                        <SelectItem value="unit_leader">Lãnh đạo đơn vị</SelectItem>
                        <SelectItem value="csvc_manager">Quản lý CSVC</SelectItem>
                        <SelectItem value="technician">Kỹ thuật viên</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full h-16 rounded-[1.8rem] bg-[#00A651] font-black uppercase tracking-widest text-xs mt-4 shadow-2xl shadow-emerald-100 transition-transform active:scale-95 disabled:opacity-50" 
                    disabled={isSubmitting || !passValidation.length || !passValidation.special}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "XÁC NHẬN ĐĂNG KÝ"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          
          <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] text-center">
              Internal Management System<br/>DUE - University of Economics
            </p>
            <div className="flex gap-4 opacity-40 hover:opacity-100 transition-opacity">
               <button onClick={() => login('requester', '123')} className="text-[9px] font-black uppercase border-2 px-3 py-1.5 rounded-full text-slate-400 hover:text-primary hover:border-primary">Demo Requester</button>
               <button onClick={() => login('tech', '123')} className="text-[9px] font-black uppercase border-2 px-3 py-1.5 rounded-full text-slate-400 hover:text-primary hover:border-primary">Demo Technician</button>
            </div>
          </div>
        </div>

        {/* Forgot Password Dialog */}
        <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
          <DialogContent className="rounded-[3rem] p-10 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tighter">Đặt lại mật khẩu</DialogTitle>
              <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Nhập số điện thoại và mật khẩu mới của bạn
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleResetPassword} className="space-y-5 py-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Số điện thoại</Label>
                <Input 
                  placeholder="09xx..." 
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                  value={forgotData.phone}
                  onChange={e => setForgotData(prev => ({...prev, phone: e.target.value}))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Mật khẩu mới</Label>
                <Input 
                  type="password"
                  placeholder="••••••••" 
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                  value={forgotData.newPass}
                  onChange={e => setForgotData(prev => ({...prev, newPass: e.target.value}))}
                  required
                />
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    {forgotPassValidation.length ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-rose-400" />}
                    <span className="text-[9px] font-bold uppercase text-slate-400">8+ ký tự</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {forgotPassValidation.special ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-rose-400" />}
                    <span className="text-[9px] font-bold uppercase text-slate-400">Ký tự đặc biệt</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Xác nhận mật khẩu mới</Label>
                <Input 
                  type="password"
                  placeholder="••••••••" 
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                  value={forgotData.confirmPass}
                  onChange={e => setForgotData(prev => ({...prev, confirmPass: e.target.value}))}
                  required
                />
              </div>
              <DialogFooter className="pt-4">
                <Button 
                  className="w-full h-14 rounded-2xl bg-primary font-black uppercase tracking-widest text-xs"
                  disabled={isSubmitting || !forgotPassValidation.length || !forgotPassValidation.special || forgotData.newPass !== forgotData.confirmPass}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "XÁC NHẬN ĐỔI MẬT KHẨU"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const roleFilteredRequests = requests.filter(r => {
    if (currentUser.role === 'requester') return r.requesterId === currentUser.id;
    if (currentUser.role === 'unit_leader') return r.unit === currentUser.unit;
    if (currentUser.role === 'technician') return r.technicianId === currentUser.id;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-200">
         <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase opacity-60 tracking-[0.3em]">Dashboard</p>
              <h1 className="text-3xl font-black">Chào, {currentUser.name.split(' ').pop()}!</h1>
              <div className="flex items-center gap-2 pt-2">
                 <Building className="h-4 w-4 opacity-60" />
                 <p className="text-sm font-bold opacity-80">{currentUser.unit}</p>
              </div>
            </div>
            <Badge className="bg-white/20 border-none font-black text-[11px] uppercase tracking-tighter px-5 py-2 rounded-full">
              {currentUser.role.replace('_', ' ')}
            </Badge>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tất cả phiếu', value: roleFilteredRequests.length, icon: User },
          { label: 'Đang xử lý', value: roleFilteredRequests.filter(r => ['assigned', 'in_progress'].includes(r.status)).length, icon: Wrench },
          { label: 'Hoàn thành', value: roleFilteredRequests.filter(r => r.status === 'closed').length, icon: CheckCircle2 },
          { label: 'Cần duyệt', value: roleFilteredRequests.filter(r => r.status === 'pending_approval').length, icon: ShieldCheck },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white card-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-1">
              <stat.icon className="h-5 w-5 text-slate-200 mb-2" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
           <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Hoạt động gần đây</h3>
           <Link href="/requests" className="text-[10px] font-black text-primary uppercase border-b-2 border-primary/20 pb-1">Xem tất cả</Link>
        </div>
        
        <div className="grid gap-4">
          {roleFilteredRequests.slice(0, 5).map(req => (
            <Link key={req.id} href={`/requests/${req.id}`}>
               <Card className="border-none shadow-sm rounded-[2rem] bg-white hover:bg-slate-50 transition-all active:scale-[0.98] card-shadow">
                  <CardContent className="p-7 flex items-center justify-between">
                     <div className="space-y-1.5">
                        <p className="font-black text-base text-slate-800 leading-none">{req.title}</p>
                        <div className="flex items-center gap-2">
                           <Badge variant="secondary" className="text-[9px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                             {req.equipmentName}
                           </Badge>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{req.status.replace('_', ' ')}</p>
                        </div>
                     </div>
                     <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                        <ChevronRight className="h-6 w-6 text-slate-200" />
                     </div>
                  </CardContent>
               </Card>
            </Link>
          ))}
          {roleFilteredRequests.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] card-shadow border-2 border-dashed">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Chưa có phiếu yêu cầu nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
