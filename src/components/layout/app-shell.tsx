"use client"

import React, { useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ClipboardList, 
  Power,
  Wrench,
  ShieldCheck,
  Package,
  Menu,
  Bell,
  Search,
  Users,
  UserCircle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, isInitialized, requests } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !currentUser && pathname !== '/') {
      router.push('/');
    }
  }, [currentUser, isInitialized, pathname, router]);

  const pendingCounts = useMemo(() => {
    if (!currentUser) return {};
    
    const counts: Record<string, number> = {};
    const userUnit = (currentUser.unit || '').trim().toLowerCase();

    if (currentUser.role === 'unit_leader') {
      counts['/approvals'] = requests.filter(r => 
        (r.unit || '').trim().toLowerCase() === userUnit && 
        (r.status === 'pending_approval' || r.status === 'verified')
      ).length;
    }

    if (currentUser.role === 'csvc_manager') {
      counts['/manage'] = requests.filter(r => 
        r.status === 'approved' || r.status === 'completed'
      ).length;
    }

    if (currentUser.role === 'technician') {
      counts['/tasks'] = requests.filter(r => 
        r.technicianId === currentUser.id && 
        (r.status === 'assigned' || r.status === 'in_progress')
      ).length;
    }

    if (currentUser.role === 'requester') {
      counts['/requests'] = requests.filter(r => 
        r.requesterId === currentUser.id && 
        (r.status === 'verified' || r.status === 'completed') && 
        !r.requesterConfirmed
      ).length;
    }

    return counts;
  }, [requests, currentUser]);

  if (!isInitialized) return null;
  if (!currentUser) {
    return <div className="min-h-screen bg-[#F4F7FE]">{children}</div>;
  }

  const navigation = [
    { name: 'Trang chủ', href: '/', icon: LayoutDashboard },
    { name: 'Phiếu', href: '/requests', icon: ClipboardList, roles: ['requester', 'unit_leader', 'csvc_manager'] },
    { name: 'Phê duyệt', href: '/approvals', icon: ShieldCheck, roles: ['unit_leader'] },
    { name: 'Điều phối', href: '/manage', icon: ClipboardList, roles: ['csvc_manager'] },
    { name: 'Nhiệm vụ', href: '/tasks', icon: Wrench, roles: ['technician'] },
    { name: 'Thiết bị', href: '/equipment', icon: Package, roles: ['admin'] },
    { name: 'Người dùng', href: '/users', icon: Users, roles: ['admin'] },
  ];

  const filteredNav = navigation.filter(item => !item.roles || item.roles.includes(currentUser.role));
  const bottomNavItems = filteredNav.slice(0, 4);

  const getRoleDisplayName = (role: string) => {
    switch(role) {
      case 'admin': return 'Quản trị viên';
      case 'csvc_manager': return 'Quản lý CSVC';
      case 'unit_leader': return 'Lãnh đạo đơn vị';
      case 'technician': return 'Kỹ thuật viên';
      default: return 'Nhân viên';
    }
  };

  const getPageTitle = () => {
    const item = navigation.find(n => n.href === pathname);
    return item ? item.name.toUpperCase() : 'DUE SYSTEM';
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r bg-white no-print fixed h-full z-40 shadow-sm">
        <div className="flex h-20 items-center px-8 border-b shrink-0">
          <Link href="/" className="flex items-center gap-3 font-black text-sm tracking-tighter uppercase">
            <div className="h-10 w-10 bg-accent rounded-[1.2rem] flex items-center justify-center text-white shadow-lg shadow-accent/20">
              <Wrench className="h-6 w-6" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] text-slate-400 font-black tracking-widest">REQUISITION FORM</span>
              <span className="text-[18px] font-black">
                <span className="text-accent">D</span><span className="text-secondary">U</span><span className="text-primary">E</span>
              </span>
            </div>
          </Link>
        </div>
        <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {filteredNav.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 h-14 px-5 text-[13px] font-bold rounded-[1.2rem] transition-all relative",
                  pathname === item.href 
                    ? "bg-primary/5 text-primary" 
                    : "text-slate-400 hover:bg-slate-50"
                )}
              >
                <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "text-slate-300")} />
                {item.name}
                {pendingCounts[item.href] > 0 && (
                  <Badge variant="destructive" className="ml-auto h-5 min-w-[20px] px-1 flex items-center justify-center font-black text-[9px] rounded-full">
                    {pendingCounts[item.href]}
                  </Badge>
                )}
              </Button>
            </Link>
          ))}
        </div>
        <div className="p-6 border-t bg-slate-50/50">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12 border-4 border-white shadow-sm">
              <AvatarFallback className="bg-primary text-white font-black text-sm">
                {currentUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-black text-sm text-slate-800 truncate">{currentUser.name}</p>
              <p className="text-[9px] font-black text-primary uppercase tracking-tighter">{getRoleDisplayName(currentUser.role)}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-rose-500 hover:bg-rose-50 h-12 rounded-[1rem] font-black text-[11px] uppercase p-0 px-4" 
            onClick={() => logout()}
          >
            <Power className="h-4 w-4" /> Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-72">
        {/* Mobile Header - Optimized for Safe Area */}
        <header className="md:hidden glass-morphism fixed top-0 left-0 w-full h-20 flex items-end justify-between px-6 pb-3 z-50">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-[1.2rem] bg-accent flex items-center justify-center text-white font-black text-lg shadow-lg shadow-accent/20">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] leading-none mb-1">HỆ THỐNG DUE</p>
              <p className="text-[14px] font-black text-slate-800 leading-none">{currentUser.name.split(' ').pop()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-[1.2rem] bg-slate-100/30 relative">
              <Bell className="h-5 w-5 text-slate-600" />
              {Object.values(pendingCounts).reduce((a, b) => a + b, 0) > 0 && (
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full" />
              )}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-[1.2rem] bg-slate-100/30">
                  <Menu className="h-6 w-6 text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] rounded-l-[3.5rem] p-0 border-none shadow-2xl">
                <div className="flex flex-col h-full bg-white p-10">
                  <div className="flex items-center gap-5 mb-10 pt-4">
                    <div className="h-16 w-16 rounded-[2rem] bg-accent flex items-center justify-center text-white text-3xl font-black">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-xl tracking-tighter text-slate-800">{currentUser.name}</p>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                        {getRoleDisplayName(currentUser.role)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
                    {filteredNav.map((item) => (
                      <SheetClose asChild key={item.name}>
                        <Link href={item.href}>
                          <Button variant="ghost" className="w-full justify-start gap-5 h-16 rounded-[1.5rem] font-black text-slate-700 hover:bg-slate-50 transition-all">
                            <item.icon className="h-6 w-6 text-slate-300" /> 
                            {item.name}
                            {pendingCounts[item.href] > 0 && (
                              <Badge variant="destructive" className="ml-auto h-6 min-w-[24px] rounded-full font-black">
                                {pendingCounts[item.href]}
                              </Badge>
                            )}
                          </Button>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-5 h-16 rounded-[1.5rem] font-black text-rose-500 mt-6 bg-rose-50"
                    onClick={() => logout()}
                  >
                    <Power className="h-6 w-6" /> Đăng xuất
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-24 items-center justify-between px-10 bg-transparent no-print">
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">
            {getPageTitle()}
          </h2>
          <div className="flex items-center gap-6">
            <div className="h-12 w-12 rounded-[1.2rem] bg-white flex items-center justify-center shadow-sm border border-slate-50 hover:bg-slate-50 cursor-pointer relative">
              <Bell className="h-6 w-6 text-slate-400" />
              {Object.values(pendingCounts).reduce((a, b) => a + b, 0) > 0 && (
                <span className="absolute top-3 right-3 h-2 w-2 bg-rose-500 rounded-full" />
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-10 pt-24 md:pt-4 pb-safe overflow-y-auto no-scrollbar">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation - Tối ưu kích thước chừa khớp mobile */}
        <nav className="md:hidden glass-morphism fixed bottom-0 left-0 w-full h-24 px-6 flex items-start justify-around z-50 rounded-t-[3rem] pt-3">
          {bottomNavItems.map((item) => (
            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1.5 active-scale relative">
              <div className={cn(
                "p-3 rounded-[1.2rem] transition-all duration-300",
                pathname === item.href ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" : "text-slate-300"
              )}>
                <item.icon className="h-5 w-5" />
                {pendingCounts[item.href] > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 min-w-[18px] px-1 border-2 border-white flex items-center justify-center font-black text-[7px] rounded-full">
                    {pendingCounts[item.href]}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest",
                pathname === item.href ? "text-primary" : "text-slate-400"
              )}>
                {item.name}
              </span>
            </Link>
          ))}
          {currentUser.role === 'requester' && (
            <Link href="/requests/new" className="absolute -top-10 left-1/2 -translate-x-1/2 active-scale">
              <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center text-white shadow-2xl shadow-green-200 border-[6px] border-[#F4F7FE]">
                <PlusCircle className="h-9 w-9" />
              </div>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
