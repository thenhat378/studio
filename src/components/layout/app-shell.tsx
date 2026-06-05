
"use client"

import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ClipboardList, 
  Settings, 
  LogOut, 
  User, 
  Wrench,
  ShieldCheck,
  Package,
  Menu,
  FileText
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, isInitialized } = useAppStore();
  const pathname = usePathname();

  if (!isInitialized) return null;
  if (!currentUser) return <>{children}</>;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Yêu cầu của tôi', href: '/requests', icon: ClipboardList, roles: ['requester', 'unit_leader'] },
    { name: 'Duyệt yêu cầu', href: '/approvals', icon: ShieldCheck, roles: ['unit_leader'] },
    { name: 'Quản lý phiếu', href: '/manage', icon: ClipboardList, roles: ['csvc_manager'] },
    { name: 'Nhiệm vụ', href: '/tasks', icon: Wrench, roles: ['technician'] },
    { name: 'Thiết bị', href: '/equipment', icon: Package, roles: ['csvc_manager'] },
    { name: 'Báo cáo', href: '/reports', icon: FileText },
  ];

  const filteredNav = navigation.filter(item => !item.roles || item.roles.includes(currentUser.role));

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4">
      <div className="flex h-14 items-center px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Wrench className="h-6 w-6 text-accent" />
          <span>FixFlow Pro</span>
        </Link>
      </div>
      <div className="flex-1 px-4 space-y-1">
        {filteredNav.map((item) => (
          <Link key={item.name} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 px-3",
                pathname === item.href ? "bg-accent/10 text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Button>
          </Link>
        ))}
        {currentUser.role === 'requester' && (
          <Link href="/requests/new">
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tạo yêu cầu
            </Button>
          </Link>
        )}
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">{currentUser.name}</span>
            <span className="text-xs text-muted-foreground truncate uppercase">{currentUser.role.replace('_', ' ')}</span>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
          <LogOut className="mr-3 h-5 w-5" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="flex-1 md:hidden">
            <Link href="/" className="font-bold text-lg text-primary flex items-center gap-2">
               <Wrench className="h-5 w-5 text-accent" /> FixFlow Pro
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
