
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
  Mail
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

export default function Dashboard() {
  const { currentUser, login, requests, isInitialized } = useAppStore();
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
      // Demo logic: mapping roles based on dummy input or just defaulting to requester
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
          <div className="text-center space-y-2">
            <div className="inline-flex p-4 bg-primary/10 rounded-3xl mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
              <Wrench className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary">FixFlow Pro</h1>
            <p className="text-muted-foreground text-lg">Hệ thống quản lý sửa chữa thông minh</p>
          </div>

          <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
              <CardDescription>Nhập thông tin để truy cập hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="username" 
                      placeholder="Username hoặc Email" 
                      className="pl-10 h-11"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="px-0 font-normal text-xs text-primary h-auto">
                          Quên mật khẩu?
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
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
                          <Button className="w-full" onClick={() => toast({ title: "Đã gửi yêu cầu", description: "Vui lòng kiểm tra email của bạn." })}>
                            Gửi mã khôi phục
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 h-11"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 font-bold bg-primary" disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : "Đăng nhập ngay"}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground font-medium">Đăng nhập nhanh (Demo)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => login('requester')} variant="outline" size="sm" className="justify-start text-[11px] h-9 px-2 gap-1.5 border-primary/10">
                  <User className="h-3.5 w-3.5 text-primary" /> Người yêu cầu
                </Button>
                <Button onClick={() => login('unit_leader')} variant="outline" size="sm" className="justify-start text-[11px] h-9 px-2 gap-1.5 border-primary/10">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Lãnh đạo đơn vị
                </Button>
                <Button onClick={() => login('csvc_manager')} variant="outline" size="sm" className="justify-start text-[11px] h-9 px-2 gap-1.5 border-primary/10">
                  <ClipboardList className="h-3.5 w-3.5 text-indigo-600" /> Quản lý CSVC
                </Button>
                <Button onClick={() => login('technician')} variant="outline" size="sm" className="justify-start text-[11px] h-9 px-2 gap-1.5 border-primary/10">
                  <Wrench className="h-3.5 w-3.5 text-emerald-600" /> Kỹ thuật viên
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-center text-xs text-muted-foreground">
            © 2024 FixFlow Pro v1.0 • Phát triển bởi Phòng Công nghệ thông tin
          </p>
        </div>
      </div>
    );
  }

  const roleFilteredRequests = requests.filter(r => {
    if (currentUser.role === 'requester') return r.requesterId === currentUser.id;
    if (currentUser.role === 'unit_leader') return r.unit === currentUser.unit;
    if (currentUser.role === 'technician') return r.technicianId === currentUser.id;
    return true; // CSVC Manager sees all
  });

  const stats = [
    { 
      label: 'Tổng yêu cầu', 
      value: roleFilteredRequests.length, 
      icon: ClipboardList, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Đang xử lý', 
      value: roleFilteredRequests.filter(r => ['assigned', 'in_progress'].includes(r.status)).length, 
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
    { 
      label: 'Chờ phê duyệt', 
      value: roleFilteredRequests.filter(r => r.status === 'pending_approval').length, 
      icon: AlertCircle, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50' 
    },
    { 
      label: 'Đã hoàn thành', 
      value: roleFilteredRequests.filter(r => r.status === 'closed').length, 
      icon: CheckCircle2, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
  ];

  const recentRequests = roleFilteredRequests.slice(0, 6);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_approval': return <Badge variant="outline" className="border-rose-200 text-rose-600 bg-rose-50">Chờ duyệt</Badge>;
      case 'approved': return <Badge variant="outline" className="border-indigo-200 text-indigo-600 bg-indigo-50">Đã duyệt</Badge>;
      case 'assigned': return <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50">Đã phân công</Badge>;
      case 'in_progress': return <Badge variant="outline" className="border-amber-200 text-amber-600 bg-amber-50">Đang thực hiện</Badge>;
      case 'completed': return <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50">Kỹ thuật đã xong</Badge>;
      case 'verified': return <Badge variant="outline" className="border-cyan-200 text-cyan-600 bg-cyan-50">CSVC đã xong</Badge>;
      case 'closed': return <Badge variant="outline" className="border-green-200 text-green-600 bg-green-50">Đã đóng</Badge>;
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
        {currentUser.role === 'requester' && (
           <Link href="/requests/new">
            <Button size="lg" className="bg-primary shadow-lg shadow-primary/20 gap-2">
              <ClipboardList className="h-5 w-5" /> Tạo yêu cầu mới
            </Button>
           </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={cn("p-4 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("h-7 w-7", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 px-6 py-4">
          <div>
            <CardTitle className="text-xl">Yêu cầu vừa cập nhật</CardTitle>
            <CardDescription>Các hoạt động sửa chữa liên quan đến bạn</CardDescription>
          </div>
          <Link href="/requests">
            <Button variant="ghost" className="text-primary font-semibold gap-1 hover:bg-primary/5">
              Xem toàn bộ danh sách <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {recentRequests.map((req) => (
              <Link key={req.id} href={`/requests/${req.id}`}>
                <div className="flex items-center justify-between p-5 hover:bg-accent/5 transition-colors cursor-pointer group">
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                      <HardDrive className="h-6 w-6 text-primary/60 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-base truncate group-hover:text-primary transition-colors">{req.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Badge variant="secondary" className="font-medium text-[10px] px-1.5 py-0 h-4">{req.equipmentName}</Badge>
                        <span className="hidden sm:inline">•</span>
                        <span className="truncate">{req.unit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-2 ml-4">
                    {getStatusBadge(req.status)}
                    <p className="text-[10px] font-mono text-muted-foreground uppercase">
                      {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            {recentRequests.length === 0 && (
              <div className="text-center py-16">
                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                <p className="text-muted-foreground font-medium">Bạn chưa có yêu cầu nào trong hệ thống.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
