
"use client"

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, PlusCircle, Wrench, MoreHorizontal, Clock, ThumbsUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function RequestsList() {
  const { requests, currentUser } = useAppStore();
  const [search, setSearch] = useState('');

  const filteredRequests = requests.filter(r => 
    (r.title.toLowerCase().includes(search.toLowerCase()) || 
     r.equipmentName.toLowerCase().includes(search.toLowerCase())) &&
    (currentUser?.role === 'csvc_manager' ? true : r.requesterId === currentUser?.id || r.unit === currentUser?.unit)
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_approval': return <Badge variant="outline" className="text-rose-600 bg-rose-50 border-rose-200">Chờ duyệt</Badge>;
      case 'approved': return <Badge variant="outline" className="text-indigo-600 bg-indigo-50 border-indigo-200">Đã duyệt</Badge>;
      case 'assigned': return <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">Đã phân công</Badge>;
      case 'in_progress': return <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">Đang thực hiện</Badge>;
      case 'completed': return <Badge variant="outline" className="text-cyan-600 bg-cyan-50 border-cyan-200">Chờ CSVC duyệt</Badge>;
      case 'verified': return <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">Chờ nghiệm thu</Badge>;
      case 'closed': return <Badge className="bg-green-700 text-white">Đã hoàn tất</Badge>;
      case 'rejected': return <Badge variant="destructive">Đã từ chối</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Danh sách yêu cầu sửa chữa</h1>
          <p className="text-muted-foreground">Theo dõi và thực hiện nghiệm thu hài lòng</p>
        </div>
        {currentUser?.role === 'requester' && (
          <Link href="/requests/new">
            <Button className="bg-primary font-bold shadow-lg shadow-primary/20">
              <PlusCircle className="mr-2 h-4 w-4" /> Tạo phiếu mới
            </Button>
          </Link>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Tìm theo tiêu đề, thiết bị..." 
          className="pl-9 h-11"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredRequests.map(req => (
          <Card key={req.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg">{req.title}</h3>
                  {getStatusBadge(req.status)}
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Wrench className="h-3 w-3" /> {req.equipmentName}</span>
                  <span className="flex items-center gap-1 text-primary font-bold"><Clock className="h-3 w-3" /> {new Date(req.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {req.status === 'verified' && !req.requesterConfirmed && currentUser?.role === 'requester' && (
                  <Link href={`/requests/${req.id}`}>
                    <Button size="sm" className="bg-primary gap-1 font-bold">
                      <ThumbsUp className="h-4 w-4" /> Xác nhận hài lòng
                    </Button>
                  </Link>
                )}
                <Link href={`/requests/${req.id}`}>
                  <Button variant="secondary" size="sm">Chi tiết</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
