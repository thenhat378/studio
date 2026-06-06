
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
    special: false,
    match: false
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
        description: "Bây giờ bạn có thể đăng nhập bằng tài khoản này." 
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
    if (!forgotPassValidation.match) {
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

  const getRoleLabel = (role: UserRole) => {
    switch(role) {
      case 'requester': return 'Nhân viên / Giảng viên';
      case 'unit_leader': return 'Phó Trưởng đơn vị';
      case 'csvc_manager': return 'Phó Trưởng phòng CSVC';
      case 'technician': return 'Nhân viên kỹ thuật';
      case 'admin': return 'Quản trị viên';
      default: return role;
    }
  };

  if (!currentUser) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center p-6 overflow-hidden bg-[#F4F7FE]">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent/15 blur-[120px] animate-pulse" />
          <div className="absolute top-[20%] -right-[15%] w-[40%] h-[40%] rounded-full bg-secondary/15 blur-[120px]" />
          <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-primary/15 blur-[120px] animate-pulse" />
        </div>

        <div className="w-full max-w-[480px] space-y-8 animate-in fade-in zoom-in duration-700 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tighter drop-shadow-sm">
              <span className="text-slate-800 mr-2">Requisition Form</span>
              <span className="text-accent">D</span><span className="text-secondary">U</span><span className="text-primary">E</span>
            </h1>
            <p className="text-sm font-bold text-slate-500 max-w-[80%] mx-auto">
              Hệ thống quản lý quy trình sửa chữa thiết bị cơ sở vật chất
            </p>
          </div>

          <Card className="border border-white/50 shadow-2xl rounded-[3.5rem] overflow-hidden bg-white/70 backdrop-blur-2xl card-shadow text-left">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-20 bg-transparent border-b border-white/20 p-0">
                <TabsTrigger value="login" className="h-full rounded-none font-black text-xs uppercase tracking-widest data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-white/40 data-[state=active]:shadow-none transition-all">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register" className="h-full rounded-none font-black text-xs uppercase tracking-widest data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-white/40 data-[state=active]:shadow-none transition-all">Đăng ký mới</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="p-10 space-y-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Số điện thoại</Label>
                    <div className="relative group">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="Nhập số điện thoại" 
                        className="pl-14 h-16 rounded-[1.8rem] bg-white/50 border-white/50 focus:bg-white/80 transition-all font-bold text-slate-700 text-lg shadow-inner"
                        value={loginPhone}
                        onChange={e => setLoginPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mật khẩu</Label>
                    <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <Input 
                        type="password"
                        placeholder="••••••••" 
                        className="pl-14 h-16 rounded-[1.8rem] bg-white/50 border-white/50 focus:bg-white/80 transition-all font-bold text-slate-700 text-lg shadow-inner"
                        value={loginPass}
                        onChange={e => setLoginPass(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-end pr-4">
                      <button 
                        type="button" 
                        onClick={() => setIsForgotOpen(true)}
                        className="text-[11px] font-black text-primary hover:underline uppercase tracking-tighter"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                  </div>
                  <Button className="w-full h-16 rounded-[1.8rem] bg-[#0054A4] hover:bg-[#00448a] font-black text-base uppercase tracking-widest shadow-xl shadow-blue-200/50 mt-4 transition-all active:scale-95" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Vào hệ thống"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="p-10 space-y-5">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Họ và tên</Label>
                    <Input 
                      placeholder="Nguyễn Văn A" 
                      className="h-14 rounded-2xl bg-white/50 border-white/50 focus:bg-white/80 transition-all font-bold text-slate-700"
                      value={regData.name}
                      onChange={e => setRegData(prev => ({...prev, name: e.target.value}))}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">SĐT</Label>
                      <Input 
                        placeholder="09xxx" 
                        className="h-14 rounded-2xl bg-white/50 border-white/50 focus:bg-white/80 transition-all font-bold text-slate-700"
                        value={regData.phone}
                        onChange={e => setRegData(prev => ({...prev, phone: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mật khẩu</Label>
                      <Input 
                        type="password"
                        placeholder="••••••••" 
                        className="h-14 rounded-2xl bg-white/50 border-white/50 focus:bg-white/80 transition-all font-bold text-slate-700"
                        value={regData.pass}
                        onChange={e => {
                          setRegData(prev => ({...prev, pass: e.target.value}));
                          setShowPassHint(true);
                        }}
                        onFocus={() => setShowPassHint(true)}
                        required
                      />
                    </div>
                  </div>

                  {showPassHint && (
                    <div className="p-4 bg-white/40 rounded-2xl border border-white/20 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                        <Info className="h-3 w-3" /> Yêu cầu mật khẩu:
                      </p>
                      <div className="flex items-center gap-3">
                        <div className={cn("h-4 w-4 rounded-full flex items-center justify-center", passValidation.length ? "bg-emerald-500" : "bg-slate-200")}>
                          {passValidation.length ? <Check className="h-3 w-3 text-white" /> : <X className="h-3 w-3 text-white" />}
                        </div>
                        <span className={cn("text-[11px] font-bold", passValidation.length ? "text-emerald-600" : "text-slate-400")}>Tối thiểu 8 ký tự</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={cn("h-4 w-4 rounded-full flex items-center justify-center", passValidation.special ? "bg-emerald-500" : "bg-slate-200")}>
                          {passValidation.special ? <Check className="h-3 w-3 text-white" /> : <X className="h-3 w-3 text-white" />}
                        </div>
                        <span className={cn("text-[11px] font-bold", passValidation.special ? "text-emerald-600" : "text-slate-400")}>Có ký tự đặc biệt (!@#...)</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Đơn vị / Khoa / Phòng</Label>
                    <Input 
                      placeholder="Phòng CSVC, Khoa CNTT..." 
                      className="h-14 rounded-2xl bg-white/50 border-white/50 focus:bg-white/80 transition-all font-bold text-slate-700"
                      value={regData.unit}
                      onChange={e => setRegData(prev => ({...prev, unit: e.target.value}))}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Vai trò / Chức danh</Label>
                    <Select value={regData.role} onValueChange={(val: any) => setRegData(prev => ({...prev, role: val}))}>
                      <SelectTrigger className="h-14 rounded-2xl bg-white/50 border-white/50 focus:bg-white/80 transition-all font-bold text-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl backdrop-blur-xl bg-white/90">
                        <SelectItem value="requester">Nhân viên / Giảng viên</SelectItem>
                        <SelectItem value="unit_leader">Phó Trưởng đơn vị</SelectItem>
                        <SelectItem value="csvc_manager">Phó Trưởng phòng CSVC</SelectItem>
                        <SelectItem value="technician">Nhân viên kỹ thuật</SelectItem>
                        <SelectItem value="admin">Quản trị viên (Admin)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full h-16 rounded-[1.8rem] bg-[#00A651] hover:bg-[#008c44] font-black text-base uppercase tracking-widest mt-4 shadow-xl shadow-emerald-200/50 transition-all active:scale-95 disabled:opacity-50" 
                    disabled={isSubmitting || !passValidation.length || !passValidation.special}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Xác nhận đăng ký"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          
          <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center justify-center gap-3">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              2026 Được phát triển bởi Phòng Cơ sở vật chất DUE
            </p>
          </div>
        </div>

        <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
          <DialogContent className="rounded-[3rem] p-10 border-none shadow-2xl bg-white/90 backdrop-blur-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-primary tracking-tighter uppercase">Đặt lại mật khẩu</DialogTitle>
              <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Nhập số điện thoại và mật khẩu mới
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleResetPassword} className="space-y-5 py-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest">Số điện thoại</Label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    placeholder="Nhập số điện thoại" 
                    className="pl-14 h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                    value={forgotData.phone}
                    onChange={e => setForgotData(prev => ({...prev, phone: e.target.value}))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest">Mật khẩu mới</Label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    type="password"
                    placeholder="••••••••" 
                    className="pl-14 h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                    value={forgotData.newPass}
                    onChange={e => setForgotData(prev => ({...prev, newPass: e.target.value}))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    type="password"
                    placeholder="••••••••" 
                    className="pl-14 h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                    value={forgotData.confirmPass}
                    onChange={e => setForgotData(prev => ({...prev, confirmPass: e.target.value}))}
                    required
                  />
                </div>
                
                <div className="mt-4 p-5 bg-white/50 rounded-2xl border border-white/20 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-4 w-4 rounded-full flex items-center justify-center", forgotPassValidation.length ? "bg-emerald-500" : "bg-slate-200")}>
                      {forgotPassValidation.length ? <Check className="h-3 w-3 text-white" /> : <X className="h-3 w-3 text-white" />}
                    </div>
                    <span className={cn("text-[11px] font-bold", forgotPassValidation.length ? "text-emerald-600" : "text-slate-400")}>Tối thiểu 8 ký tự</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn("h-4 w-4 rounded-full flex items-center justify-center", forgotPassValidation.special ? "bg-emerald-500" : "bg-slate-200")}>
                      {forgotPassValidation.special ? <Check className="h-3 w-3 text-white" /> : <X className="h-3 w-3 text-white" />}
                    </div>
                    <span className={cn("text-[11px] font-bold", forgotPassValidation.special ? "text-emerald-600" : "text-slate-400")}>Có ký tự đặc biệt</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn("h-4 w-4 rounded-full flex items-center justify-center", forgotPassValidation.match ? "bg-emerald-500" : "bg-slate-200")}>
                      {forgotPassValidation.match ? <Check className="h-3 w-3 text-white" /> : <X className="h-3 w-3 text-white" />}
                    </div>
                    <span className={cn("text-[11px] font-bold", forgotPassValidation.match ? "text-emerald-600" : "text-slate-400")}>Mật khẩu xác nhận khớp</span>
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-6">
                <Button 
                  className={cn(
                    "w-full h-16 rounded-[1.8rem] font-black text-base uppercase tracking-widest transition-all shadow-xl",
                    (forgotPassValidation.length && forgotPassValidation.special && forgotPassValidation.match && forgotData.phone) 
                      ? "bg-primary text-white shadow-blue-200/50 opacity-100" 
                      : "bg-slate-100 text-slate-400 shadow-none opacity-50 cursor-not-allowed"
                  )}
                  disabled={isSubmitting || !forgotPassValidation.length || !forgotPassValidation.special || !forgotPassValidation.match || !forgotData.phone}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Xác nhận đổi mật khẩu"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Lọc phiếu theo vai trò và chuẩn hóa đơn vị
  const roleFilteredRequests = requests.filter(r => {
    if (currentUser.role === 'requester') return r.requesterId === currentUser.id;
    if (currentUser.role === 'unit_leader') {
      if (!currentUser.unit || !r.unit) return false;
      return r.unit.trim().toLowerCase() === currentUser.unit.trim().toLowerCase();
    }
    if (currentUser.role === 'technician') return r.technicianId === currentUser.id;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
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
