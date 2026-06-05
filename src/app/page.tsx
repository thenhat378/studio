
"use client"

import { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

export default function Overview() {
  const { 
    currentUser, 
    login,
    register,
    requests, 
    isInitialized
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
      toast({ title: "Đăng nhập thành công", description: "Chào mừng bạn trở lại." });
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Lỗi đăng nhập", 
        description: error.message || "Số điện thoại hoặc mật khẩu không đúng." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.name || !regData.phone || !regData.pass || !regData.unit) {
      toast({ variant: "destructive", title: "Thiếu thông tin", description: "Vui lòng điền đầy đủ các trường." });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await register(regData);
      toast({ 
        title: "Đăng ký thành công!", 
        description: "Tài khoản của bạn đã được tạo và lưu vào hệ thống." 
      });
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Không thể đăng ký", 
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#F4F7FE]">
        <div className="w-full max-w-[450px] space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-3">
             <div className="inline-flex p-5 bg-white rounded-[2.5rem] shadow-2xl mb-2 border border-slate-100">
                <Wrench className="h-10 w-10 text-primary" />
             </div>
            <h1 className="text-3xl font-black text-[#0054A4] uppercase tracking-tighter">REQUISITION DUE</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hệ thống quản lý sửa chữa chuyên nghiệp</p>
          </div>

          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-16 bg-white border-b p-0">
                <TabsTrigger value="login" className="h-full rounded-none font-black text-xs uppercase tracking-widest data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register" className="h-full rounded-none font-black text-xs uppercase tracking-widest data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Đăng ký mới</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="p-10">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <Input 
                        placeholder="Nhập số điện thoại..." 
                        className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
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
                        className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                        value={loginPass}
                        onChange={e => setLoginPass(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button className="w-full h-14 rounded-2xl bg-[#0054A4] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 mt-2" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Vào hệ thống"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="p-10">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Họ và tên</Label>
                    <Input 
                      placeholder="Nhập họ và tên..." 
                      className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                      value={regData.name}
                      onChange={e => setRegData(prev => ({...prev, name: e.target.value}))}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Số điện thoại</Label>
                      <Input 
                        placeholder="Số điện thoại..." 
                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                        value={regData.phone}
                        onChange={e => setRegData(prev => ({...prev, phone: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mật khẩu</Label>
                      <Input 
                        type="password"
                        placeholder="Mật khẩu" 
                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                        value={regData.pass}
                        onChange={e => setRegData(prev => ({...prev, pass: e.target.value}))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Đơn vị / Khoa</Label>
                    <Input 
                      placeholder="Ví dụ: Phòng QLCL" 
                      className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                      value={regData.unit}
                      onChange={e => setRegData(prev => ({...prev, unit: e.target.value}))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Vai trò</Label>
                    <Select value={regData.role} onValueChange={(val: any) => setRegData(prev => ({...prev, role: val}))}>
                      <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="requester">Nhân viên / Giảng viên</SelectItem>
                        <SelectItem value="unit_leader">Lãnh đạo đơn vị</SelectItem>
                        <SelectItem value="csvc_manager">Quản lý CSVC</SelectItem>
                        <SelectItem value="technician">Kỹ thuật viên</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full h-14 rounded-2xl bg-[#00A651] font-black uppercase tracking-widest text-xs mt-4 shadow-xl shadow-emerald-100" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "XÁC NHẬN ĐĂNG KÝ"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          
          <div className="flex flex-col items-center gap-4">
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">
              Hệ thống quản lý nội bộ trường ĐH Kinh tế - ĐHĐN
            </p>
            <div className="flex gap-2 opacity-30 hover:opacity-100 transition-opacity">
               <button onClick={() => login('requester', '123')} className="text-[8px] font-bold uppercase border px-2 py-1 rounded-full text-slate-400">Demo User</button>
               <button onClick={() => login('tech', '123')} className="text-[8px] font-bold uppercase border px-2 py-1 rounded-full text-slate-400">Demo Tech</button>
            </div>
          </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm rounded-[2rem] bg-white">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Phiếu của tôi</p>
            <p className="text-2xl font-black text-slate-800">{roleFilteredRequests.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-3">
           <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Phiếu mới cập nhật</h3>
           <Link href="/requests" className="text-[10px] font-black text-primary uppercase">Tất cả</Link>
        </div>
        
        <div className="grid gap-4">
          {roleFilteredRequests.slice(0, 3).map(req => (
            <Link key={req.id} href={`/requests/${req.id}`}>
               <Card className="border-none shadow-sm rounded-3xl bg-white hover:bg-slate-50 transition-colors">
                  <CardContent className="p-6 flex items-center justify-between">
                     <div>
                        <p className="font-black text-sm text-slate-800">{req.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{req.equipmentName} • {req.status}</p>
                     </div>
                     <ChevronRight className="h-5 w-5 text-slate-200" />
                  </CardContent>
               </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
