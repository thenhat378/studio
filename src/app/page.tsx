
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
  Key
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
      // Logic đăng nhập demo dựa trên username
      if (username === 'requester') login('requester');
      else if (username === 'leader') login('unit_leader');
      else if (username === 'manager') login('csvc_manager');
      else if (username === 'tech') login('technician');
      else login('requester'); // Mặc định

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
        <div className="w-full max-w-[440px] space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-black tracking-tight text-[#0054A4] uppercase leading-tight drop-shadow-sm px-4">
              Ứng dụng Quản lý sửa chữa
            </h1>
          </div>

          <Card className="border-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] bg-white overflow-hidden rounded-[2.5rem] relative">
            <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-[#F58220] via-[#00A651] to-[#0054A4]"></div>
            <CardHeader className="text-center pt-10 pb-2">
              <CardTitle className="text-2xl font-bold text-slate-800">Đăng nhập</CardTitle>
              <CardDescription className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Hệ thống quản lý nội bộ DUE</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 px-10 pb-12">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-semibold text-slate-600 ml-1">Tên đăng nhập</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#0054A4] transition-colors" />
                    <Input 
                      id="username" 
                      placeholder="Username hoặc Email" 
                      className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#0054A4]/10 transition-all text-base border-2 hover:border-slate-100 placeholder:text-slate-400"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-600 ml-1">Mật khẩu</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#0054A4] transition-colors" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#0054A4]/10 transition-all text-base border-2 hover:border-slate-100 placeholder:text-slate-400"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end pt-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="px-0 font-bold text-xs text-[#0054A4] h-auto py-0 hover:text-[#F58220] transition-colors">
                          Quên mật khẩu?
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2rem] border-none shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-black text-[#0054A4]">Khôi phục mật khẩu</DialogTitle>
                          <DialogDescription className="font-medium">
                            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-6 space-y-3">
                          <Label htmlFor="reset-email" className="text-xs font-bold text-slate-500">Email công tác</Label>
                          <div className="relative mt-2">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                            <Input id="reset-email" placeholder="email@due.udn.vn" className="pl-12 h-14 rounded-2xl bg-slate-50" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button className="w-full h-14 font-black rounded-2xl bg-[#0054A4] shadow-lg shadow-[#0054A4]/20 uppercase tracking-widest" onClick={() => toast({ title: "Đã gửi yêu cầu", description: "Vui lòng kiểm tra email của bạn." })}>
                            Gửi mã khôi phục
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 font-black rounded-2xl bg-[#0054A4] hover:bg-[#003d7a] transition-all uppercase tracking-[0.15em] text-sm shadow-xl shadow-[#0054A4]/20" disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : "Đăng nhập ngay"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="text-center mt-auto py-4">
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.05em] leading-relaxed max-w-[300px] mx-auto opacity-70">
              © 2026 Hệ thống quản lý sửa chữa v1.0 • Phát triển bởi Phòng Cơ sở vật chất
            </p>
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
    { label: 'Tổng yêu cầu', value: roleFilteredRequests.length, icon: ClipboardList, color: 'text-[#0054A4]', bg: 'bg-[#0054A4]/10' },
    { label: 'Đang xử lý', value: roleFilteredRequests.filter(r => ['assigned', 'in_progress', 'completed', 'verified'].includes(r.status)).length, icon: Clock, color: 'text-[#F58220]', bg: 'bg-[#F58220]/10' },
    { label: 'Chờ phê duyệt', value: roleFilteredRequests.filter(r => r.status === 'pending_approval').length, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Đã hoàn thành', value: roleFilteredRequests.filter(r => r.status === 'closed').length, icon: CheckCircle2, color: 'text-[#00A651]', bg: 'bg-[#00A651]/10' },
  ];

  const recentRequests = roleFilteredRequests.slice(0, 6);

  const technicians = users.filter(u => u.role === 'technician');
  const techPerformance = technicians.map(tech => {
    const techReqs = requests.filter(r => r.technicianId === tech.id);
    const completedCount = techReqs.filter(r => r.status === 'closed').length;
    const inProgressCount = techReqs.filter(r => ['assigned', 'in_progress', 'completed', 'verified'].includes(r.status)).length;
    const ratings = techReqs.filter(r => r.rating !== undefined).map(r => r.rating as number);
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A';

    return {
      id: tech.id,
      name: tech.name,
      completed: completedCount,
      inProgress: inProgressCount,
      avgRating,
      total: techReqs.length
    };
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_approval': return <Badge variant="outline" className="border-rose-200 text-rose-600 bg-rose-50">Chờ duyệt</Badge>;
      case 'approved': return <Badge variant="outline" className="border-[#0054A4]/20 text-[#0054A4] bg-[#0054A4]/5">Đã duyệt</Badge>;
      case 'assigned': return <Badge variant="outline" className="border-[#0054A4]/20 text-[#0054A4] bg-[#0054A4]/5">Đã phân công</Badge>;
      case 'in_progress': return <Badge variant="outline" className="border-[#F58220]/20 text-[#F58220] bg-[#F58220]/5">Đang thực hiện</Badge>;
      case 'completed': return <Badge variant="outline" className="border-[#00A651]/20 text-[#00A651] bg-[#00A651]/5">Kỹ thuật đã xong</Badge>;
      case 'verified': return <Badge variant="outline" className="border-[#00A651]/20 text-[#00A651] bg-[#00A651]/5">Đã duyệt hoàn thành</Badge>;
      case 'closed': return <Badge variant="outline" className="border-[#00A651]/30 text-[#00A651] bg-[#00A651]/10">Đã đóng</Badge>;
      case 'rejected': return <Badge variant="destructive">Đã từ chối</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0054A4]">Chào buổi sáng, {currentUser.name}!</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">
            Vai trò: <span className="font-bold text-foreground uppercase tracking-wider">{currentUser.role.replace('_', ' ')}</span>
            {currentUser.unit && <span className="mx-2 opacity-30">|</span>}
            {currentUser.unit && <span className="text-slate-500 font-bold">Đơn vị: {currentUser.unit}</span>}
          </p>
        </div>
        <div className="flex gap-2">
          {currentUser.role === 'requester' && (
             <Link href="/requests/new">
              <Button size="lg" className="bg-[#0054A4] shadow-lg shadow-[#0054A4]/20 gap-2 font-bold rounded-xl h-14 px-8">
                <ClipboardList className="h-5 w-5" /> Tạo yêu cầu mới
              </Button>
             </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl group overflow-hidden bg-white">
            <CardContent className="p-7">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                </div>
                <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("h-7 w-7", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentUser.role === 'csvc_manager' && (
        <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] border-t-4 border-t-[#F58220]">
          <CardHeader className="flex flex-row items-center justify-between bg-white/50 backdrop-blur-sm px-8 py-7">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3 font-black tracking-tight text-[#0054A4]">
                <BarChart3 className="h-7 w-7 text-[#F58220]" />
                Hiệu suất xử lý công việc
              </CardTitle>
              <CardDescription className="font-bold text-slate-400 uppercase tracking-widest text-[11px] mt-1">Cơ sở đánh giá năng suất và chất lượng phục vụ</CardDescription>
            </div>
            <div className="p-4 bg-[#F58220]/10 rounded-2xl shadow-inner">
               <Users className="h-7 w-7 text-[#F58220]" />
            </div>
          </CardHeader>
          <CardContent className="p-0 border-t">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] px-8 h-14">Kỹ thuật viên</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-[0.2em]">Đang xử lý</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-[0.2em]">Đã hoàn thành</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-[0.2em]">Đánh giá (Sao)</TableHead>
                  <TableHead className="text-right font-black uppercase text-[10px] tracking-[0.2em] px-8">Tỷ lệ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {techPerformance.map((tech) => (
                  <TableRow key={tech.id} className="hover:bg-[#0054A4]/[0.02] transition-colors border-b-slate-50">
                    <TableCell className="font-bold flex items-center gap-4 px-8 py-6">
                      <div className="h-11 w-11 rounded-2xl bg-[#0054A4]/10 flex items-center justify-center text-[#0054A4] font-black text-base shadow-sm">
                        {tech.name.charAt(0)}
                      </div>
                      <span className="text-slate-700 font-bold">{tech.name}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-[#F58220]/10 text-[#F58220] hover:bg-[#F58220]/20 font-black px-4 py-1.5 rounded-lg border-none">
                        {tech.inProgress} phiếu
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-[#00A651]/10 text-[#00A651] hover:bg-[#00A651]/20 font-black px-4 py-1.5 rounded-lg border-none">
                        {tech.completed} phiếu
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2 font-black text-amber-500 bg-amber-50 w-fit mx-auto px-4 py-1.5 rounded-xl border border-amber-100/50 shadow-sm">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        {tech.avgRating}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <span className="text-xl font-black text-[#0054A4]">
                        {tech.total > 0 ? Math.round((tech.completed / tech.total) * 100) : 0}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-sm overflow-hidden rounded-[2.5rem] bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-white/50 px-8 py-6">
          <div>
            <CardTitle className="text-2xl font-black text-[#0054A4] tracking-tight">Cập nhật mới nhất</CardTitle>
            <CardDescription className="font-bold text-slate-400 uppercase tracking-widest text-[11px] mt-1">Các hoạt động sửa chữa liên quan đến bạn</CardDescription>
          </div>
          <Link href="/requests">
            <Button variant="ghost" className="text-[#0054A4] font-black text-xs gap-2 hover:bg-[#0054A4]/5 uppercase tracking-[0.2em]">
              Xem toàn bộ <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            {recentRequests.map((req) => (
              <Link key={req.id} href={`/requests/${req.id}`}>
                <div className="flex items-center justify-between p-7 hover:bg-[#0054A4]/[0.02] transition-all cursor-pointer group">
                  <div className="flex gap-6 items-center min-w-0">
                    <div className="h-16 w-16 rounded-[1.25rem] bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-lg transition-all border border-slate-100">
                      <HardDrive className="h-8 w-8 text-[#0054A4]/30 group-hover:text-[#0054A4] transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-xl truncate text-slate-700 group-hover:text-[#0054A4] transition-colors tracking-tight">{req.title}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 font-black uppercase tracking-[0.15em]">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[10px] px-3 py-1 rounded-lg border-none">{req.equipmentName}</Badge>
                        <span className="opacity-30">|</span>
                        <span className="truncate">{req.unit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-3 ml-6">
                    {getStatusBadge(req.status)}
                    <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.25em]">
                      {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            {recentRequests.length === 0 && (
              <div className="text-center py-24">
                <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <ClipboardList className="h-10 w-10 text-slate-200" />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Không có dữ liệu yêu cầu</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
