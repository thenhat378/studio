
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
  PlusCircle,
  FileText,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { currentUser, login, requests, isInitialized } = useAppStore();

  if (!isInitialized) return null;

  if (!currentUser) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Wrench className="h-10 w-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">FixFlow Pro</CardTitle>
            <CardDescription>Vui lòng đăng nhập để tiếp tục</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Button onClick={() => login('requester')} className="w-full bg-primary h-12">
                Đăng nhập (Người yêu cầu)
              </Button>
              <Button onClick={() => login('unit_leader')} variant="outline" className="w-full h-12">
                Đăng nhập (Lãnh đạo đơn vị)
              </Button>
              <Button onClick={() => login('csvc_manager')} variant="outline" className="w-full h-12">
                Đăng nhập (Quản lý CSVC)
              </Button>
              <Button onClick={() => login('technician')} variant="outline" className="w-full h-12">
                Đăng nhập (Nhân viên kỹ thuật)
              </Button>
            </div>
            <div className="text-center mt-4">
              <Button variant="link" className="text-muted-foreground text-sm">
                Quên mật khẩu?
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Tổng yêu cầu', 
      value: requests.length, 
      icon: ClipboardList, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Đang xử lý', 
      value: requests.filter(r => ['assigned', 'in_progress'].includes(r.status)).length, 
      icon: Clock, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50' 
    },
    { 
      label: 'Chờ phê duyệt', 
      value: requests.filter(r => r.status === 'pending_approval').length, 
      icon: AlertCircle, 
      color: 'text-rose-500', 
      bg: 'bg-rose-50' 
    },
    { 
      label: 'Đã hoàn thành', 
      value: requests.filter(r => r.status === 'verified').length, 
      icon: CheckCircle2, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50' 
    },
  ];

  const recentRequests = requests.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_approval': return <Badge variant="outline" className="border-rose-200 text-rose-600 bg-rose-50">Chờ duyệt</Badge>;
      case 'assigned': return <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50">Đã phân công</Badge>;
      case 'in_progress': return <Badge variant="outline" className="border-amber-200 text-amber-600 bg-amber-50">Đang thực hiện</Badge>;
      case 'completed': return <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50">Chờ nghiệm thu</Badge>;
      case 'verified': return <Badge variant="outline" className="border-green-200 text-green-600 bg-green-50">Đã xong</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Xin chào, {currentUser.name}</h1>
        <p className="text-muted-foreground mt-1">
          Hệ thống quản lý FixFlow Pro đang hoạt động ổn định.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={cn("p-3 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Yêu cầu gần đây</CardTitle>
              <CardDescription>Các phiếu sửa chữa vừa được tạo hoặc cập nhật</CardDescription>
            </div>
            <Link href="/requests">
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                Xem tất cả <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors cursor-pointer group">
                  <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-primary opacity-70" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">{req.title}</p>
                      <p className="text-xs text-muted-foreground">{req.equipmentName} • {req.unit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(req.status)}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
              {recentRequests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">Chưa có yêu cầu nào</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Lối tắt nhanh</CardTitle>
            <CardDescription>Thực hiện các tác vụ thường dùng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <Button className="w-full justify-start h-14 bg-primary text-white" asChild>
                <Link href="/requests/new">
                  <PlusCircle className="mr-3 h-5 w-5" />
                  Tạo yêu cầu sửa chữa mới
                </Link>
             </Button>
             <Button variant="outline" className="w-full justify-start h-14 border-primary/20 hover:bg-primary/5" asChild>
                <Link href="/reports">
                  <FileText className="mr-3 h-5 w-5 text-primary" />
                  Xuất báo cáo lưu trữ (PDF)
                </Link>
             </Button>
             <Button variant="outline" className="w-full justify-start h-14 border-primary/20 hover:bg-primary/5" asChild>
                <Link href="/equipment">
                  <Package className="mr-3 h-5 w-5 text-accent" />
                  Tra cứu danh mục thiết bị
                </Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
