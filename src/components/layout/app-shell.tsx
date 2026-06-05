
"use client"

import React, { useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ClipboardList, 
  LogOut, 
  Wrench,
  ShieldCheck,
  Package,
  Menu,
  User
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, isInitialized } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  // Chuyển hướng về trang chủ ngay khi đăng xuất
  useEffect(() => {
    if (isInitialized && !currentUser && pathname !== '/') {
      router.push('/');
    }
  }, [currentUser, isInitialized, pathname, router]);

  if (!isInitialized) return null;

  // Nếu chưa đăng nhập, chỉ hiển thị nội dung (trang chủ hiển thị form login)
  if (!currentUser) {
    return <div className="min-h-screen bg-slate-50/50">{children}</div>;
  }

  const navigation = [
    { name: 'Tổng quan', href: '/', icon: LayoutDashboard },
    { name: 'Yêu cầu của tôi', href: '/requests', icon: ClipboardList, roles: ['requester', 'unit_leader'] },
    { name: 'Duyệt yêu cầu', href: '/approvals', icon: ShieldCheck, roles: ['unit_leader'] },
    { name: 'Quản lý phiếu', href: '/manage', icon: ClipboardList, roles: ['csvc_manager'] },
    { name: 'Nhiệm vụ của tôi', href: '/tasks', icon: Wrench, roles: ['technician'] },
    { name: 'Danh mục thiết bị', href: '/equipment', icon: Package, roles: ['csvc_manager'] },
  ];

  const filteredNav = navigation.filter(item => !item.roles || item.roles.includes(currentUser.role));

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-6 no-print">
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/" className="flex items-center gap-3 font-black text-2xl text-primary tracking-tighter">
          <div className="p-2 bg-primary rounded-xl">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <span>FixFlow Pro</span>
        </Link>
      </div>
      <div className="flex-1 px-4 space-y-2">
        <p className="text-[10px] font-black uppercase text-muted-foreground px-3 mb-2 tracking-widest text-center">Điều hướng hệ thống</p>
        {filteredNav.map((item) => (
          <Link key={item.name} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11 px-4 text-sm font-medium rounded-xl transition-all duration-200",
                pathname === item.href 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "text-muted-foreground")} />
              {item.name}
            </Button>
          </Link>
        ))}
        {currentUser.role === 'requester' && (
          <div className="pt-4 px-2">
            <Link href="/requests/new">
              <Button className="w-full bg-primary hover:bg-primary/90 shadow-md shadow-primary/10 rounded-xl h-11 font-bold">
                <PlusCircle className="mr-2 h-5 w-5" />
                Tạo yêu cầu mới
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="mt-auto p-4 border-t bg-muted/20">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white shadow-sm border mb-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg shadow-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex flex-col overflow-hidden min-w-0">
            <span className="text-sm font-extrabold truncate text-foreground">{currentUser.name}</span>
            <span className="text-[10px] text-primary font-black uppercase tracking-tighter truncate opacity-80">{currentUser.role.replace('_', ' ')}</span>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-11 rounded-xl font-bold" onClick={() => logout()}>
          <LogOut className="mr-3 h-5 w-5" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r bg-white shadow-sm no-print">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-4 md:px-8 no-print sticky top-0 z-30">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 border-r-none">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="flex-1 md:hidden">
            <Link href="/" className="font-black text-xl text-primary flex items-center gap-2">
               <Wrench className="h-6 w-6 p-1 bg-primary text-white rounded-lg" /> FixFlow
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-2 md:gap-4">
             <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{new Date().toLocaleDateString('vi-VN', { weekday: 'long' })}</span>
                <span className="text-[10px] font-mono">{new Date().toLocaleDateString('vi-VN')}</span>
             </div>
             
             {/* Nút đăng xuất trực tiếp trên Header */}
             <Button 
               variant="outline" 
               size="sm" 
               className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 h-9 font-bold px-3"
               onClick={() => logout()}
             >
               <LogOut className="h-4 w-4 md:mr-2" />
               <span className="hidden sm:inline text-xs">Đăng xuất</span>
             </Button>

             <div className="h-9 w-9 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
               <User className="h-5 w-5 text-muted-foreground" />
             </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
