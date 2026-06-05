
"use client"

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle, Wrench, Clock, ThumbsUp, ChevronRight, HardDrive, User, ClipboardList, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function RequestsList() {
  const { requests, currentUser } = useAppStore();
  const [search, setSearch] = useState('');

  const filteredRequests = requests.filter(r => 
    (r.title.toLowerCase().includes(search.toLowerCase()) || 
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
    <div className="space-y-6 pb-24">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Danh sách phiếu</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Theo dõi tiến độ sửa chữa</p>
          </div>
          {currentUser?.role === 'requester' && (
            <Link href="/requests/new" className="hidden md:block">
              <Button className="bg-[#0054A4] rounded-2xl h-11 font-bold gap-2">
                <Plus className="h-4 w-4" /> Tạo phiếu mới
              </Button>
            </Link>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Tìm theo tiêu đề, thiết bị..." 
            className="pl-12 h-14 rounded-2xl bg-white border-none shadow-sm font-bold text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.map(req => {
          const status = getStatusInfo(req.status);
          return (
            <Link key={req.id} href={`/requests/${req.id}`}>
              <Card className="border-none shadow-sm rounded-[2rem] bg-white card-shadow overflow-hidden hover:scale-[1.01] transition-transform">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <HardDrive className="h-6 w-6 text-primary/30" />
                    </div>
                    <Badge className={cn("border-none font-black text-[9px] uppercase px-3 py-1", status.bg, status.color)}>
                      {status.label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-black text-lg text-slate-800 leading-tight">{req.title}</h3>
                    <div className="flex flex-wrap gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                      <span className="flex items-center gap-1.5"><Wrench className="h-3.5 w-3.5" /> {req.equipmentName}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(req.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                           <User className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{req.requesterName}</span>
                     </div>
                     <ChevronRight className="h-5 w-5 text-slate-200" />
                  </div>
                  
                  {req.status === 'verified' && !req.requesterConfirmed && currentUser?.role === 'requester' && (
                    <div className="mt-4">
                      <Button className="w-full bg-primary h-12 rounded-xl font-bold gap-2 text-xs uppercase tracking-widest shadow-lg shadow-blue-100">
                        <ThumbsUp className="h-4 w-4" /> Xác nhận hài lòng
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {filteredRequests.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] card-shadow">
            <ClipboardList className="h-16 w-16 text-slate-100 mx-auto mb-6" />
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Không tìm thấy phiếu nào</p>
          </div>
        )}
      </div>

      {/* Mobile Floating Action Button */}
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
