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
  ShieldCheck,
  HardDrive,
  Lock,
  Star,
  BarChart3,
  Smartphone,
  Apple,
  ArrowUpRight,
  Wrench
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Overview() {
  const { currentUser, login, requests, users, isInitialized } = useAppStore();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isInitialized) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast({ variant: "destructive", title: "Lỗi", description: "Vui lòng nhập tài khoản." });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      if (username === 'requester') login('requester');
      else if (username === 'leader') login('unit_leader');
      else if (username === 'manager') login('csvc_manager');
      else if (username === 'tech') login('technician');
      else {
        toast({ variant: "destructive", title: "Sai tài khoản", description: "Sử dụng: requester, leader, manager hoặc tech" });
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      toast({ title: "Đăng nhập thành công" });
    }, 800);
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#F4F7FE]">
        <div className="w-full max-w-[400px] space-y-10 animate-in fade-in zoom-in duration-700">
          <div className="text-center space-y-4">
             <div className="inline-flex p-4 bg-white rounded-[2.5rem] shadow-xl mb-4">
                <Wrench className="h-10 w-10 text-primary p-1" />
             </div>
            <h1 className="text-3xl font-black tracking-tighter text-[#0054A4] uppercase leading-tight">
              Sửa chữa DUE
            </h1>
          </div>

          <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[3rem] p-4">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl font-black text-slate-800">Chào mừng trở lại!</CardTitle>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đăng nhập để bắt đầu</p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Tên tài khoản</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input 
                      placeholder="VD: requester" 
                      className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                      className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 font-black rounded-2xl bg-[#0054A4] hover:bg-[#003d7a] uppercase tracking-widest text-xs shadow-xl shadow-blue-100" disabled={isLoading}>
                  {isLoading ? "Đang kết nối..." : "Đăng nhập ngay"}
                </Button>
              </form>
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
                      <p className="font-black text-sm flex items-center gap-2">
                        <Apple className="h-5 w-5" /> iPhone (Safari)
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">Nhấn nút <b>Chia sẻ</b> (ô vuông mũi tên) ở dưới cùng, sau đó chọn <b>"Thêm vào màn hình chính"</b>.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl space-y-3">
                      <p className="font-black text-sm flex items-center gap-2">
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
    { label: 'Tổng phiếu', value: roleFilteredRequests.length, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Đang làm', value: roleFilteredRequests.filter(r => ['assigned', 'in_progress', 'completed', 'verified'].includes(r.status)).length, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Chờ duyệt', value: roleFilteredRequests.filter(r => r.status === 'pending_approval').length, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Đã xong', value: roleFilteredRequests.filter(r => r.status === 'closed').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
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
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-[#0054A4] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-100 md:hidden">
         <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
         <p className="text-xs font-black uppercase tracking-widest text-blue-200 mb-1">Hệ thống QLSC DUE</p>
         <h1 className="text-2xl font-black">Chào, {currentUser.name.split(' ').pop()}! 👋</h1>
         <div className="mt-4 flex gap-2">
            <Badge className="bg-white/20 hover:bg-white/30 border-none text-[10px] font-black">{currentUser.role.replace('_', ' ')}</Badge>
            {currentUser.unit && <Badge className="bg-white/20 hover:bg-white/30 border-none text-[10px] font-black">{currentUser.unit}</Badge>}
         </div>
      </div>

      {/* Stats Grid - Horizontal Scroll on small screens if needed, but 2x2 grid is better */}
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
              <BarChart3 className="h-5 w-5 text-orange-500" /> Hiệu suất kỹ thuật
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
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] px-3">
                          {tech.completed} DONE
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8 font-black text-amber-500 text-sm">{tech.avgRating} ★</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-lg font-black text-slate-800">Yêu cầu gần đây</h3>
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
                      <HardDrive className="h-7 w-7 text-primary/30" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm text-slate-800 truncate mb-0.5">{req.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{req.equipmentName} • {req.unit}</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      req.status === 'closed' ? "bg-emerald-100 text-emerald-600" : 
                      req.status === 'pending_approval' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
                    )}>
                      {req.status === 'closed' ? <CheckCircle2 className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {recentRequests.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] card-shadow">
               <ClipboardList className="h-12 w-12 text-slate-200 mx-auto mb-4" />
               <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Không có dữ liệu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
