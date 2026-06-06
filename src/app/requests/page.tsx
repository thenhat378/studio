
"use client"

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle, Wrench, Clock, ThumbsUp, ChevronRight, HardDrive, User, ClipboardList, Plus, FileText, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function RequestsList() {
  const { requests, currentUser } = useAppStore();
  const [search, setSearch] = useState('');

  const filteredRequests = requests.filter(r => 
    (r.title.toLowerCase().includes(search.toLowerCase()) || 
     r.location.toLowerCase().includes(search.toLowerCase()) ||
     r.equipmentName.toLowerCase().includes(search.toLowerCase())) &&
    (currentUser?.role === 'csvc_manager' ? true : r.requesterId === currentUser?.id || r.unit === currentUser?.unit)
  );

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'pending_approval': return { label: 'Chờ duyệt', color: 'text-rose-500', bg: 'bg-rose-50' };
      case 'approved': return { label: 'Đã duyệt', color: 'text-indigo-500', bg: 'bg-indigo-50' };
      case 'assigned': return { label: 'Giao việc', color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'in_progress': return { label: 'Đang làm', color: 'text-amber-600', bg: 'bg-amber-50' };
      case 'completed': return { label: 'Xong kỹ thuật', color: 'text-cyan-600', bg: 'bg-cyan-50' };
      case 'verified': return { label: 'Nghiệm thu', color: 'text-emerald-600', bg: 'bg-emerald-50' };
      case 'closed': return { label: 'Hoàn tất', color: 'text-green-700', bg: 'bg-green-50' };
      case 'rejected': return { label: 'Từ chối', color: 'text-red-600', bg: 'bg-red-50' };
      default: return { label: status, color: 'text-slate-500', bg: 'bg-slate-50' };
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Danh sách phiếu</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 opacity-80">THEO DÕI TIẾN ĐỘ SỬA</p>
          </div>
          {currentUser?.role === 'requester' && (
            <Link href="/requests/new" className="hidden md:block">
              <Button className="bg-[#0054A4] hover:bg-[#00448a] rounded-2xl h-12 px-6 font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95">
                <Plus className="h-4 w-4" /> Tạo phiếu mới
              </Button>
            </Link>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
          <Input 
            placeholder="Tìm theo tiêu đề, vị trí, thiết bị..." 
            className="pl-14 h-16 rounded-[1.8rem] bg-white border-none shadow-sm font-bold text-sm text-slate-700 placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-primary/10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredRequests.map(req => {
          const status = getStatusInfo(req.status);
          return (
            <Link key={req.id} href={`/requests/${req.id}`}>
              <Card className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow overflow-hidden hover:scale-[1.01] transition-all duration-300 active:scale-100 border-l-8 border-l-slate-100 hover:border-l-primary/30">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <HardDrive className="h-7 w-7 text-primary/20" />
                    </div>
                    <Badge className={cn("border-none font-black text-[10px] uppercase px-4 py-1.5 rounded-full shadow-sm", status.bg, status.color)}>
                      {status.label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase px-3 py-1 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> {req.location}
                      </Badge>
                    </div>
                    <h3 className="font-black text-xl text-slate-800 leading-tight tracking-tight">{req.title}</h3>
                    <div className="flex flex-wrap gap-5 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                      <span className="flex items-center gap-2"><Wrench className="h-4 w-4 text-primary/30" /> {req.equipmentName}</span>
                      <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-200" /> {new Date(req.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm">
                           <User className="h-4 w-4 text-slate-400" />
                        </div>
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">{req.requesterName}</span>
                     </div>
                     <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-primary group-hover:text-white transition-all">
                        <ChevronRight className="h-6 w-6" />
                     </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {filteredRequests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[4rem] card-shadow border-2 border-dashed border-slate-100/50">
            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-slate-200" />
            </div>
            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">KHÔNG TÌM THẤY PHIẾU NÀO</p>
          </div>
        )}
      </div>

      {currentUser?.role === 'requester' && (
        <div className="fixed bottom-24 right-6 z-40 md:hidden">
          <Link href="/requests/new">
            <Button size="icon" className="h-16 w-16 rounded-full bg-[#0054A4] shadow-2xl shadow-blue-200 active:scale-90 transition-transform">
              <PlusCircle className="h-8 w-8" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
