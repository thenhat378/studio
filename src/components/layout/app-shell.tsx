
"use client"

import React, { useEffect } from 'react';
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
  Users
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
    { name: 'Trang chủ', href: '/', icon: LayoutDashboard },
    { name: 'Phiếu', href: '/requests', icon: ClipboardList, roles: ['requester', 'unit_leader'] },
    { name: 'Duyệt đơn vị', href: '/approvals', icon: ShieldCheck, roles: ['unit_leader'] },
    { name: 'Quản lý CSVC', href: '/manage', icon: ClipboardList, roles: ['csvc_manager'] },
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
      case 'unit_leader': return 'Quản lý đơn vị';
      case 'technician': return 'Nhân viên kỹ thuật';
      default: return 'Nhân viên / Giảng viên';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FE]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white no-print fixed h-full z-40">
        <div className="flex h-16 items-center px-6 border-b shrink-0">
          <Link href="/" className="flex items-center gap-2 font-black text-sm tracking-tighter uppercase">
            <Wrench className="h-5 w-5 p-1 bg-primary text-white rounded-lg shrink-0" />
            <span className="text-slate-800">
              Requisition Form <span className="text-accent">D</span><span className="text-secondary">U</span><span className="text-primary">E</span>
            </span>
          </Link>
        </div>
        <div className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {filteredNav.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12 px-4 text-sm font-bold rounded-2xl",
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
          {currentUser.role === 'requester' && (
            <Link href="/requests/new">
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 px-4 text-sm font-bold rounded-2xl text-accent hover:bg-orange-50">
                <PlusCircle className="h-5 w-5" />
                Tạo phiếu mới
              </Button>
            </Link>
          )}
        </div>
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-rose-500 hover:bg-rose-50 h-12 rounded-2xl font-bold" 
            onClick={() => logout()}
          >
            <Power className="mr-3 h-5 w-5" /> Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Mobile Header */}
        <header className="md:hidden glass-morphism fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 z-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary/30">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">Xin chào,</p>
              <p className="text-sm font-black text-slate-800">{currentUser.name.split(' ').pop()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full bg-slate-100/50">
              <Bell className="h-5 w-5 text-slate-600" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-slate-100/50">
                  <Menu className="h-5 w-5 text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] rounded-l-[3rem] p-0 border-none">
                <div className="flex flex-col h-full bg-white p-8">
                  <div className="flex items-center gap-4 mb-8 pt-4">
                    <div className="h-14 w-14 rounded-[2rem] bg-primary flex items-center justify-center text-white text-2xl font-black">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-lg">{currentUser.name}</p>
                      <p className="text-[10px] font-black text-primary uppercase">
                        {getRoleDisplayName(currentUser.role)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    {filteredNav.map((item) => (
                      <SheetClose asChild key={item.name}>
                        <Link href={item.href}>
                          <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-2xl font-bold text-slate-600">
                            <item.icon className="h-5 w-5" /> {item.name}
                          </Button>
                        </Link>
                      </SheetClose>
                    ))}
                    {currentUser.role === 'requester' && (
                      <SheetClose asChild>
                        <Link href="/requests/new">
                          <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-2xl font-bold text-accent">
                            <PlusCircle className="h-5 w-5" /> Tạo phiếu mới
                          </Button>
                        </Link>
                      </SheetClose>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-4 h-14 rounded-2xl font-bold text-rose-500 mt-auto"
                    onClick={() => logout()}
                  >
                    <Power className="h-5 w-5" /> Đăng xuất
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-20 items-center justify-between px-8 bg-transparent no-print">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
            {(pathname === '/' || pathname === '/dashboard') ? '' : (navigation.find(n => n.href === pathname)?.name || '')}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                placeholder="Tìm kiếm nhanh..." 
                className="bg-white border-none rounded-2xl h-11 pl-10 pr-4 w-64 shadow-sm text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-sm border">
              <Bell className="h-5 w-5 text-slate-400" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 pt-20 md:pt-4 pb-safe overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden glass-morphism fixed bottom-0 left-0 w-full h-20 px-6 flex items-center justify-between z-50 rounded-t-[2.5rem] card-shadow">
          {bottomNavItems.map((item) => (
            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 group">
              <div className={cn(
                "p-2 rounded-2xl transition-all duration-300",
                pathname === item.href ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-slate-400"
              )}>
                <item.icon className="h-6 w-6" />
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-tighter",
                pathname === item.href ? "text-primary" : "text-slate-400"
              )}>
                {item.name}
              </span>
            </Link>
          ))}
          {currentUser.role === 'requester' && (
            <Link href="/requests/new" className="absolute -top-8 left-1/2 -translate-x-1/2">
              <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-white shadow-xl shadow-orange-200 border-4 border-[#F4F7FE] active:scale-95 transition-transform">
                <PlusCircle className="h-8 w-8" />
              </div>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
