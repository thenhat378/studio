
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
  User,
  X
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, isInitialized } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !currentUser && pathname !== '/') {
      router.push('/');
    }
  }, [currentUser, isInitialized, pathname, router]);

  if (!isInitialized) return null;
  if (!currentUser) {
    return <div className="min-h-screen bg-slate-50/50">{children}</div>;
  }

  const navigation = [
    { name: 'Tổng quan', href: '/', icon: LayoutDashboard },
    { name: 'Yêu cầu của tôi', href: '/requests', icon: ClipboardList, roles: ['requester', 'unit_leader'] },
    { name: 'Duyệt yêu cầu', href: '/approvals', icon: ShieldCheck, roles: ['unit_leader'] },
    { name: 'Quản lý phiếu', href: '/manage', icon: ClipboardList, roles: ['csvc_manager'] },
    { name: 'Nhiệm vụ', href: '/tasks', icon: Wrench, roles: ['technician'] },
    { name: 'Thiết bị', href: '/equipment', icon: Package, roles: ['csvc_manager'] },
  ];

  const filteredNav = navigation.filter(item => !item.roles || item.roles.includes(currentUser.role));

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex h-full flex-col gap-4 no-print bg-white">
      <div className="flex h-16 items-center px-6 border-b shrink-0">
        <Link href="/" className="flex items-center gap-2 font-black text-lg text-primary tracking-tighter">
          <Wrench className="h-5 w-5 p-1 bg-primary text-white rounded-lg" />
          <span>Sửa chữa DUE</span>
        </Link>
        {isMobile && (
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="ml-auto md:hidden">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        )}
      </div>
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-black uppercase text-muted-foreground px-3 mb-3 tracking-widest">Menu</p>
        {filteredNav.map((item) => (
          <Link key={item.name} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12 px-4 text-sm font-bold rounded-xl",
                pathname === item.href 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "text-slate-400")} />
              {item.name}
            </Button>
          </Link>
        ))}
      </div>
      <div className="mt-auto p-4 border-t bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white shadow-sm border mb-4">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black truncate">{currentUser.name}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase truncate">{currentUser.role.replace('_', ' ')}</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-12 rounded-xl font-bold" 
          onClick={() => logout()}
        >
          <LogOut className="mr-3 h-5 w-5" /> Đăng xuất
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white no-print fixed h-full z-40">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <header className="flex h-14 md:h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-4 md:px-8 no-print sticky top-0 z-30">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl h-10 w-10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0 border-r-none">
              <SidebarContent isMobile />
            </SheetContent>
          </Sheet>
          <div className="flex-1 md:hidden">
            <Link href="/" className="font-black text-base text-primary flex items-center gap-1.5">
               <Wrench className="h-4 w-4 p-0.5 bg-primary text-white rounded-md" /> 
               <span className="tracking-tighter">DUE Sửa chữa</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-2">
             <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{new Date().toLocaleDateString('vi-VN', { weekday: 'short' })}</span>
                <span className="text-[10px] font-mono text-slate-400">{new Date().toLocaleDateString('vi-VN')}</span>
             </div>
             <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
               <User className="h-5 w-5 text-slate-400" />
             </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          <div className="max-w-5xl mx-auto pb-20 md:pb-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
