"use client"

import { useAppStore } from '@/lib/store';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
} from '@/components/ui/card';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  User,
  Lock,
  Smartphone,
  Apple,
  ArrowUpRight,
  Wrench,
  PlusCircle,
  Sparkles,
  HardDrive,
  Mail,
  Building2,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

export default function Overview() {
  const { currentUser, login, register, resetPassword, requests, users, isInitialized } = useAppStore();
  const { toast } = useToast();
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [unit, setUnit] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isInitialized) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ variant: "destructive", title: "Lỗi", description: "Vui lòng nhập đầy đủ thông tin." });
      return;
    }
    
    setIsLoading(true);
    try {
      if (authMode === 'login') {
        await login(email, password);
        toast({ title: "Đăng nhập thành công" });
      } else {
        if (!fullName || !unit) {
          toast({ variant: "destructive", title: "Lỗi", description: "Vui lòng nhập Họ tên và Đơn vị." });
          setIsLoading(false);
          return;
        }
        await register(email, password, fullName, unit);
        toast({ title: "Đăng ký thành công", description: "Chào mừng bạn đến với hệ thống!" });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let message = "Có lỗi xảy ra trong quá trình xác thực.";
      if (error.code === 'auth/user-not-found') message = "Tài khoản không tồn tại.";
      if (error.code === 'auth/wrong-password') message = "Mật khẩu không chính xác.";
      if (error.code === 'auth/email-already-in-use') message = "Email này đã được sử dụng.";
      if (error.code === 'auth/weak-password') message = "Mật khẩu phải có ít nhất 6 ký tự.";
      if (error.code === 'auth/api-key-not-valid') message = "Lỗi hệ thống: API Key không hợp lệ.";
      
      toast({ variant: "destructive", title: "Lỗi", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({ variant: "destructive", title: "Lỗi", description: "Vui lòng nhập Email để đặt lại mật khẩu." });
      return;
    }
    try {
      await resetPassword(email);
      toast({ title: "Đã gửi Email", description: "Vui lòng kiểm tra hộp thư của bạn." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Lỗi", description: error.message });
    }
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#F4F7FE]">
        <div className="w-full max-w-[420px] space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="text-center space-y-4">
             <div className="inline-flex p-4 bg-white rounded-[2.5rem] shadow-xl mb-4">
                <Wrench className="h-10 w-10 text-primary p-1" />
             </div>
            <h1 className="text-2xl font-black tracking-tighter text-primary uppercase leading-tight">
              Requisition form DUE
            </h1>
          </div>

          <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[3rem] p-4">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl font-black text-slate-800">
                {authMode === 'login' ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
              </CardTitle>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {authMode === 'login' ? 'Đăng nhập để bắt đầu' : 'Đăng ký để gửi yêu cầu sửa chữa'}
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleAuth} className="space-y-5">
                {authMode === 'register' && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Họ và tên</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <Input 
                          placeholder="Nguyễn Văn A" 
                          className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm shadow-sm"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Đơn vị / Phòng ban</Label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <Input 
                          placeholder="Phòng Hành chính" 
                          className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm shadow-sm"
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Email tài khoản</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input 
                      type="email"
                      placeholder="example@due.edu.vn" 
                      className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm shadow-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm shadow-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 font-black rounded-2xl bg-primary hover:bg-primary/90 uppercase tracking-widest text-xs shadow-xl shadow-blue-100" disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : (authMode === 'login' ? "Đăng nhập ngay" : "Đăng ký ngay")}
                </Button>
              </form>

              <div className="flex items-center justify-between px-2">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-[11px] font-black text-primary uppercase"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                >
                  {authMode === 'login' ? 'Đăng ký tài khoản' : 'Đã có tài khoản?'}
                </Button>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-[11px] font-black text-slate-400 uppercase"
                  onClick={handleResetPassword}
                >
                  Quên mật khẩu?
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center gap-4">
             <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-[10px] font-black uppercase text-slate-500">Cài đặt App</Button>
                </DialogTrigger>
                <DialogContent className="rounded-[3rem] border-none shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black text-primary flex items-center gap-2">
                      <Smartphone className="h-6 w-6" /> Cài đặt di động
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="bg-slate-50 p-6 rounded-3xl space-y-3">
                      <p className="font-black text-sm flex items-center gap-2 text-primary">
                        <Apple className="h-5 w-5" /> iPhone (Safari)
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">Nhấn nút <b>Chia sẻ</b> (ô vuông mũi tên) ở dưới cùng, sau đó chọn <b>"Thêm vào màn hình chính"</b>.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl space-y-3">
                      <p className="font-black text-sm flex items-center gap-2 text-primary">
                        <Smartphone className="h-5 w-5" /> Android (Chrome)
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">Nhấn biểu tượng <b>3 chấm</b> ở góc trên bên phải, sau đó chọn <b>"Cài đặt ứng dụng"</b>.</p>
                    </div>
                  </div>
                </DialogContent>
             </Dialog>
             <Button variant="ghost" className="text-[10px] font-black uppercase text-slate-500">Hỗ trợ 24/7</Button>
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

  const stats = [
    { label: 'Tổng phiếu', value: roleFilteredRequests.length, icon: ClipboardList, color: 'text-primary', bg: 'bg-blue-50' },
    { label: 'Đang làm', value: roleFilteredRequests.filter(r => ['assigned', 'in_progress', 'completed', 'verified'].includes(r.status)).length, icon: Clock, color: 'text-accent', bg: 'bg-orange-50' },
    { label: 'Chờ duyệt', value: roleFilteredRequests.filter(r => r.status === 'pending_approval').length, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Đã xong', value: roleFilteredRequests.filter(r => r.status === 'closed').length, icon: CheckCircle2, color: 'text-secondary', bg: 'bg-emerald-50' },
  ];

  const recentRequests = roleFilteredRequests.slice(0, 5);

  const technicians = users.filter(u => u.role === 'technician');
  const techPerformance = technicians.map(tech => {
    const techReqs = requests.filter(r => r.technicianId === tech.id);
    const completedCount = techReqs.filter(r => r.status === 'closed').length;
    const ratings = techReqs.filter(r => r.rating !== undefined).map(r => r.rating as number);
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '5.0';
    return { id: tech.id, name: tech.name, completed: completedCount, avgRating };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="relative overflow-hidden bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-100 md:hidden">
         <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
         <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Requisition form DUE</p>
         <h1 className="text-2xl font-black">Chào, {currentUser.name.split(' ').pop()}! 👋</h1>
         <div className="mt-4 flex gap-2">
            <Badge className="bg-white/20 hover:bg-white/30 border-none text-[9px] font-black">{currentUser.role.replace('_', ' ')}</Badge>
            {currentUser.unit && <Badge className="bg-white/20 hover:bg-white/30 border-none text-[9px] font-black">{currentUser.unit}</Badge>}
         </div>
      </div>

      {currentUser.role === 'requester' && (
        <Link href="/requests/new">
          <Card className="border-none bg-white rounded-[2rem] card-shadow overflow-hidden group active:scale-95 transition-all">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100">
                  <PlusCircle className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-800">Tạo phiếu yêu cầu mới</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-accent" /> Có hỗ trợ AI phân tích lỗi
                  </p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                <ChevronRight className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm rounded-[2rem] bg-white card-shadow">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className={cn("p-3 rounded-2xl mb-3", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentUser.role === 'csvc_manager' && (
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden card-shadow">
          <CardHeader className="px-8 py-6 border-b border-slate-50">
            <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" /> Hiệu suất kỹ thuật
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableBody>
                  {techPerformance.map((tech) => (
                    <TableRow key={tech.id} className="border-none hover:bg-slate-50 transition-colors">
                      <TableCell className="font-bold py-5 px-8 text-sm">{tech.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-emerald-50 text-secondary border-none font-black text-[10px] px-3">
                          {tech.completed} DONE
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8 font-black text-accent text-sm">{tech.avgRating} ★</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-lg font-black text-slate-800">Hoạt động gần đây</h3>
           <Link href="/requests" className="text-xs font-black text-primary uppercase tracking-tighter flex items-center gap-1">
             Tất cả <ArrowUpRight className="h-3 w-3" />
           </Link>
        </div>
        
        <div className="space-y-4">
          {recentRequests.map((req) => (
            <Link key={req.id} href={`/requests/${req.id}`}>
              <Card className="border-none shadow-sm rounded-[2rem] bg-white card-shadow hover:scale-[1.02] transition-transform duration-300 overflow-hidden">
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <HardDrive className="h-7 w-7 text-primary/20" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm text-slate-800 truncate mb-0.5">{req.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{req.equipmentName} • {req.unit}</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      req.status === 'closed' ? "bg-emerald-100 text-secondary" : 
                      req.status === 'pending_approval' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-primary"
                    )}>
                      {req.status === 'closed' ? <CheckCircle2 className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {recentRequests.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] card-shadow">
               <ClipboardList className="h-12 w-12 text-slate-200 mx-auto mb-4" />
               <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Không có dữ liệu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
