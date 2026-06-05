
"use client"

import { useAppStore } from '@/lib/store';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
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
  Mail,
  Star,
  BarChart3,
  Users,
  Smartphone,
  Info,
  Apple
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
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
  const { currentUser, login, logout, requests, users, isInitialized } = useAppStore();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isInitialized) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        variant: "destructive",
        title: "Lỗi đăng nhập",
        description: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu."
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      if (username === 'requester') login('requester');
      else if (username === 'leader') login('unit_leader');
      else if (username === 'manager') login('csvc_manager');
      else if (username === 'tech') login('technician');
      else {
        toast({
          variant: "destructive",
          title: "Sai tài khoản",
          description: "Vui lòng sử dụng: requester, leader, manager hoặc tech"
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng bạn quay trở lại!`
      });
    }, 800);
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#F0F2F5]">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="text-center space-y-4">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#0054A4] uppercase leading-tight drop-shadow-sm px-4">
              Quản lý sửa chữa DUE
            </h1>
          </div>

          <Card className="border-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] bg-white overflow-hidden rounded-[2rem] relative">
            <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-[#F58220] via-[#00A651] to-[#0054A4]"></div>
            <CardHeader className="text-center pt-8 pb-2">
              <CardTitle className="text-xl font-bold text-slate-800">Đăng nhập hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4 px-6 md:px-10 pb-10">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs font-bold text-slate-600 ml-1">Tài khoản</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#0054A4] transition-colors" />
                    <Input 
                      id="username" 
                      placeholder="requester, leader, manager, tech" 
                      className="pl-12 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#0054A4]/10 transition-all text-sm border-2 hover:border-slate-100"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-600 ml-1">Mật khẩu</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#0054A4] transition-colors" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-12 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#0054A4]/10 transition-all text-sm border-2 hover:border-slate-100"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between items-center pt-1 px-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="px-0 font-bold text-[10px] text-[#0054A4]/60 h-auto py-0 hover:text-[#0054A4]">
                          <Smartphone className="h-3 w-3 mr-1" /> Cài đặt App
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-3xl border-none shadow-2xl max-w-[90vw] mx-auto">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-black text-[#0054A4] flex items-center gap-2">
                            <Smartphone className="h-5 w-5" /> Cài đặt ứng dụng
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          <div className="space-y-2">
                            <p className="text-sm font-bold flex items-center gap-2 text-slate-700">
                              <Apple className="h-4 w-4" /> iPhone (Safari):
                            </p>
                            <ol className="text-xs space-y-1 text-slate-500 list-decimal pl-4">
                              <li>Bấm biểu tượng <b>Chia sẻ</b> ở dưới cùng.</li>
                              <li>Chọn <b>"Thêm vào màn hình chính"</b>.</li>
                            </ol>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-bold flex items-center gap-2 text-slate-700">
                              <Smartphone className="h-4 w-4" /> Android (Chrome):
                            </p>
                            <ol className="text-xs space-y-1 text-slate-500 list-decimal pl-4">
                              <li>Bấm dấu <b>3 chấm</b> ở góc trên.</li>
                              <li>Chọn <b>"Cài đặt ứng dụng"</b>.</li>
                            </ol>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="link" className="px-0 font-bold text-[10px] text-[#0054A4] h-auto py-0">Quên mật khẩu?</Button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 font-black rounded-xl bg-[#0054A4] hover:bg-[#003d7a] transition-all uppercase tracking-widest text-xs shadow-lg shadow-[#0054A4]/20" disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="text-center opacity-50">
            <p className="text-[10px] font-bold text-slate-400">© 2026 Quản lý sửa chữa DUE • v1.0</p>
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
    { label: 'Tổng số', value: roleFilteredRequests.length, icon: ClipboardList, color: 'text-[#0054A4]', bg: 'bg-[#0054A4]/10' },
    { label: 'Đang xử lý', value: roleFilteredRequests.filter(r => ['assigned', 'in_progress', 'completed', 'verified'].includes(r.status)).length, icon: Clock, color: 'text-[#F58220]', bg: 'bg-[#F58220]/10' },
    { label: 'Chờ duyệt', value: roleFilteredRequests.filter(r => r.status === 'pending_approval').length, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Xong', value: roleFilteredRequests.filter(r => r.status === 'closed').length, icon: CheckCircle2, color: 'text-[#00A651]', bg: 'bg-[#00A651]/10' },
  ];

  const recentRequests = roleFilteredRequests.slice(0, 5);

  const technicians = users.filter(u => u.role === 'technician');
  const techPerformance = technicians.map(tech => {
    const techReqs = requests.filter(r => r.technicianId === tech.id);
    const completedCount = techReqs.filter(r => r.status === 'closed').length;
    const inProgressCount = techReqs.filter(r => ['assigned', 'in_progress', 'completed', 'verified'].includes(r.status)).length;
    const ratings = techReqs.filter(r => r.rating !== undefined).map(r => r.rating as number);
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '0';

    return { id: tech.id, name: tech.name, completed: completedCount, inProgress: inProgressCount, avgRating, total: techReqs.length };
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_approval': return <Badge variant="outline" className="text-rose-600 bg-rose-50 text-[10px]">Chờ duyệt</Badge>;
      case 'closed': return <Badge variant="outline" className="text-[#00A651] bg-[#00A651]/10 text-[10px]">Đã đóng</Badge>;
      default: return <Badge variant="outline" className="text-slate-500 text-[10px]">Đang xử lý</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl md:text-2xl font-black text-[#0054A4]">Chào, {currentUser.name}!</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Badge className="bg-primary hover:bg-primary px-2 py-0.5 rounded-md text-[10px]">{currentUser.role.replace('_', ' ')}</Badge>
          {currentUser.unit && <span className="text-slate-400">Đơn vị: {currentUser.unit}</span>}
        </div>
      </div>

      {/* Stats - 2 columns on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm rounded-2xl bg-white">
            <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
              <div className={cn("p-2 md:p-3 rounded-xl mb-2", stat.bg)}>
                <stat.icon className={cn("h-5 w-5 md:h-6 md:w-6", stat.color)} />
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl md:text-2xl font-black text-slate-800">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentUser.role === 'csvc_manager' && (
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden border-t-4 border-t-[#F58220]">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-base md:text-lg flex items-center gap-2 font-black text-[#0054A4]">
              <BarChart3 className="h-5 w-5 text-[#F58220]" />
              Hiệu suất kỹ thuật
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="text-[10px] font-black uppercase px-6">Tên</TableHead>
                  <TableHead className="text-center text-[10px] font-black uppercase">Xong</TableHead>
                  <TableHead className="text-center text-[10px] font-black uppercase">Sao</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {techPerformance.map((tech) => (
                  <TableRow key={tech.id} className="text-xs">
                    <TableCell className="font-bold px-6">{tech.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none font-bold">{tech.completed}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-black text-amber-500">{tech.avgRating} ★</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <CardTitle className="text-base md:text-lg font-black text-[#0054A4]">Yêu cầu gần đây</CardTitle>
          <Link href="/requests">
            <Button variant="ghost" size="sm" className="text-[10px] font-bold text-[#0054A4] uppercase">Tất cả <ChevronRight className="h-3 w-3 ml-1" /></Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            {recentRequests.map((req) => (
              <Link key={req.id} href={`/requests/${req.id}`}>
                <div className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                  <div className="flex gap-3 items-center min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <HardDrive className="h-5 w-5 text-[#0054A4]/50" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate text-slate-800">{req.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{req.unit} • {req.equipmentName}</p>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {getStatusBadge(req.status)}
                    <p className="text-[9px] font-bold text-slate-300">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </Link>
            ))}
            {recentRequests.length === 0 && (
              <div className="text-center py-10">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Không có dữ liệu</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {currentUser.role === 'requester' && (
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
          <Link href="/requests/new">
            <Button size="icon" className="h-14 w-14 rounded-full bg-[#0054A4] shadow-2xl shadow-[#0054A4]/50">
              <PlusCircle className="h-7 w-7" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
