
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
  Wrench,
  ChevronRight,
  User,
  ShieldCheck,
  HardDrive,
  Lock,
  Mail,
  Star,
  BarChart3,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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

  const dueLogo = PlaceHolderImages.find(img => img.id === 'due-logo');

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
      login('requester');
      setIsLoading(false);
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng bạn quay trở lại!`
      });
    }, 800);
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-slate-50/50">
        <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
               <div className="relative w-40 h-40 p-4 bg-white rounded-3xl shadow-2xl flex items-center justify-center group overflow-hidden border border-white/20">
                  {dueLogo && (
                    <Image 
                      src={dueLogo.imageUrl}
                      alt={dueLogo.description}
                      width={160}
                      height={160}
                      className="object-contain mix-blend-multiply scale-110 group-hover:scale-125 transition-transform duration-700"
                      data-ai-hint={dueLogo.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent"></div>
               </div>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-primary uppercase drop-shadow-sm">Ứng dụng Quản lý sửa chữa</h1>
          </div>

          <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-md overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-accent via-secondary to-primary"></div>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold tracking-tight">Đăng nhập</CardTitle>
              <CardDescription>Vui lòng nhập thông tin tài khoản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Tên đăng nhập</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="username" 
                      placeholder="Username hoặc Email" 
                      className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end pt-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="px-0 font-bold text-xs text-primary h-auto py-0 hover:text-accent">
                          Quên mật khẩu?
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-3xl">
                        <DialogHeader>
                          <DialogTitle>Khôi phục mật khẩu</DialogTitle>
                          <DialogDescription>
                            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <Label htmlFor="reset-email">Email công tác</Label>
                          <div className="relative mt-2">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="reset-email" placeholder="email@tochuc.com" className="pl-10 h-11" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button className="w-full h-11 font-bold rounded-xl" onClick={() => toast({ title: "Đã gửi yêu cầu", description: "Vui lòng kiểm tra email của bạn." })}>
                            Gửi mã khôi phục
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 font-black rounded-xl bg-primary shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all uppercase tracking-widest text-xs" disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : "Đăng nhập ngay"}
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                  <span className="bg-white px-3 text-muted-foreground/60">Truy cập nhanh Demo</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Button onClick={() => login('requester')} variant="outline" size="sm" className="justify-start text-[10px] h-10 px-3 gap-2 rounded-xl border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all font-bold">
                  <User className="h-3.5 w-3.5 text-primary" /> Người yêu cầu
                </Button>
                <Button onClick={() => login('unit_leader')} variant="outline" size="sm" className="justify-start text-[10px] h-10 px-3 gap-2 rounded-xl border-slate-100 hover:border-accent/30 hover:bg-accent/5 transition-all font-bold">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Lãnh đạo đơn vị
                </Button>
                <Button onClick={() => login('csvc_manager')} variant="outline" size="sm" className="justify-start text-[10px] h-10 px-3 gap-2 rounded-xl border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all font-bold">
                  <ClipboardList className="h-3.5 w-3.5 text-primary/80" /> Quản lý CSVC
                </Button>
                <Button onClick={() => login('technician')} variant="outline" size="sm" className="justify-start text-[10px] h-10 px-3 gap-2 rounded-xl border-slate-100 hover:border-secondary/30 hover:bg-secondary/5 transition-all font-bold">
                  <Wrench className="h-3.5 w-3.5 text-secondary" /> Kỹ thuật viên
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center space-y-1">
            <p className="text-[11px] font-bold text-muted-foreground/60 tracking-tight">
              © 2026 Hệ thống quản lý sửa chữa v1.0
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">
              Phát triển bởi Phòng Cơ sở vật chất
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
    { label: 'Tổng yêu cầu', value: roleFilteredRequests.length, icon: ClipboardList, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Đang xử lý', value: roleFilteredRequests.filter(r => ['assigned', 'in_progress', 'completed', 'verified'].includes(r.status)).length, icon: Clock, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Chờ phê duyệt', value: roleFilteredRequests.filter(r => r.status === 'pending_approval').length, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Đã hoàn thành', value: roleFilteredRequests.filter(r => r.status === 'closed').length, icon: CheckCircle2, color: 'text-secondary', bg: 'bg-secondary/10' },
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
      case 'approved': return <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">Đã duyệt</Badge>;
      case 'assigned': return <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">Đã phân công</Badge>;
      case 'in_progress': return <Badge variant="outline" className="border-accent/20 text-accent bg-accent/5">Đang thực hiện</Badge>;
      case 'completed': return <Badge variant="outline" className="border-secondary/20 text-secondary bg-secondary/5">Kỹ thuật đã xong</Badge>;
      case 'verified': return <Badge variant="outline" className="border-secondary/20 text-secondary bg-secondary/5">Đã duyệt hoàn thành</Badge>;
      case 'closed': return <Badge variant="outline" className="border-secondary/30 text-secondary bg-secondary/10">Đã đóng</Badge>;
      case 'rejected': return <Badge variant="destructive">Đã từ chối</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">Chào buổi sáng, {currentUser.name}!</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Vai trò: <span className="font-bold text-foreground uppercase">{currentUser.role.replace('_', ' ')}</span>
            {currentUser.unit && ` • Đơn vị: ${currentUser.unit}`}
          </p>
        </div>
        <div className="flex gap-2">
          {currentUser.role === 'requester' && (
             <Link href="/requests/new">
              <Button size="lg" className="bg-primary shadow-lg shadow-primary/20 gap-2 font-bold rounded-xl">
                <ClipboardList className="h-5 w-5" /> Tạo yêu cầu mới
              </Button>
             </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black">{stat.value}</p>
                </div>
                <div className={cn("p-4 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("h-7 w-7", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentUser.role === 'csvc_manager' && (
        <Card className="border-none shadow-xl overflow-hidden rounded-3xl border-t-4 border-t-accent">
          <CardHeader className="flex flex-row items-center justify-between bg-white/50 backdrop-blur-sm px-8 py-6">
            <div>
              <CardTitle className="text-xl flex items-center gap-2 font-black tracking-tight text-primary">
                <BarChart3 className="h-6 w-6 text-accent" />
                Hiệu suất xử lý của Kỹ thuật viên
              </CardTitle>
              <CardDescription className="font-medium">Cơ sở đánh giá năng suất và chất lượng phục vụ</CardDescription>
            </div>
            <div className="p-3 bg-accent/10 rounded-2xl shadow-inner">
               <Users className="h-6 w-6 text-accent" />
            </div>
          </CardHeader>
          <CardContent className="p-0 border-t">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-black uppercase text-[10px] tracking-widest px-8">Kỹ thuật viên</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Đang xử lý</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Đã hoàn thành</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Đánh giá (Sao)</TableHead>
                  <TableHead className="text-right font-black uppercase text-[10px] tracking-widest px-8">Tỷ lệ hoàn thành</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {techPerformance.map((tech) => (
                  <TableRow key={tech.id} className="hover:bg-primary/[0.02] transition-colors border-b-slate-100">
                    <TableCell className="font-bold flex items-center gap-3 px-8 py-5">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                        {tech.name.charAt(0)}
                      </div>
                      <span className="text-slate-700">{tech.name}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20 font-bold px-3 py-1">
                        {tech.inProgress} phiếu
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 font-bold px-3 py-1">
                        {tech.completed} phiếu
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5 font-black text-amber-500 bg-amber-50 w-fit mx-auto px-3 py-1 rounded-lg">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        {tech.avgRating}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <span className="text-lg font-black text-primary">
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

      <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-white/50 px-8 py-5">
          <div>
            <CardTitle className="text-xl font-black text-primary tracking-tight">Cập nhật mới nhất</CardTitle>
            <CardDescription className="font-medium">Các hoạt động sửa chữa liên quan đến bạn</CardDescription>
          </div>
          <Link href="/requests">
            <Button variant="ghost" className="text-primary font-black text-xs gap-1 hover:bg-primary/5 uppercase tracking-widest">
              Xem toàn bộ <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {recentRequests.map((req) => (
              <Link key={req.id} href={`/requests/${req.id}`}>
                <div className="flex items-center justify-between p-6 hover:bg-primary/[0.02] transition-all cursor-pointer group">
                  <div className="flex gap-5 items-center min-w-0">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-md transition-all border border-slate-100">
                      <HardDrive className="h-7 w-7 text-primary/40 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-lg truncate text-slate-700 group-hover:text-primary transition-colors tracking-tight">{req.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5 font-bold uppercase tracking-wider">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[9px] px-2 py-0.5 rounded-md">{req.equipmentName}</Badge>
                        <span className="text-slate-200">|</span>
                        <span className="truncate">{req.unit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-2.5 ml-4">
                    {getStatusBadge(req.status)}
                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                      {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            {recentRequests.length === 0 && (
              <div className="text-center py-24">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ClipboardList className="h-10 w-10 text-slate-200" />
                </div>
                <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Không có dữ liệu yêu cầu</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
