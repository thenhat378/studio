
"use client"

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, PlusCircle, Wrench, MoreHorizontal, FileText, ChevronRight } from 'lucide-react';
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
    (currentUser?.role === 'csvc_manager' || 
     currentUser?.role === 'technician' ? true : r.requesterId === currentUser?.id)
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_approval': return <Badge variant="outline" className="border-rose-200 text-rose-600 bg-rose-50">Chờ duyệt</Badge>;
      case 'approved': return <Badge variant="outline" className="border-indigo-200 text-indigo-600 bg-indigo-50">Đã duyệt</Badge>;
      case 'assigned': return <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50">Đã phân công</Badge>;
      case 'in_progress': return <Badge variant="outline" className="border-amber-200 text-amber-600 bg-amber-50">Đang thực hiện</Badge>;
      case 'completed': return <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50">Chờ nghiệm thu</Badge>;
      case 'verified': return <Badge variant="outline" className="border-green-200 text-green-600 bg-green-50">Đã xong</Badge>;
      case 'rejected': return <Badge variant="destructive">Đã từ chối</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Danh sách yêu cầu sửa chữa</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi trạng thái các phiếu sửa chữa</p>
        </div>
        <Link href="/requests/new">
          <Button className="bg-primary w-full md:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo phiếu mới
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm theo tiêu đề hoặc thiết bị..." 
            className="pl-9 h-11"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 px-4 border-primary/20 hover:bg-primary/5">
          <Filter className="mr-2 h-4 w-4 text-primary" />
          Bộ lọc
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredRequests.map(req => (
          <Card key={req.id} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden group">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center p-5 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors truncate">{req.title}</h3>
                    {getStatusBadge(req.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Wrench className="h-3 w-3" /> {req.equipmentName}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" /> {req.unit}
                    </span>
                    <span className="font-mono text-xs opacity-70">
                      ID: {req.id}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                  <div className="text-left md:text-right">
                    <p className="text-xs font-medium text-muted-foreground">Ngày tạo</p>
                    <p className="text-sm">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/requests/${req.id}`}>
                      <Button variant="secondary" size="sm" className="hidden md:flex">
                        Chi tiết
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/requests/${req.id}`}>Chi tiết</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>In phiếu (PDF)</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Xóa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredRequests.length === 0 && (
          <div className="text-center py-20 bg-card rounded-xl border-2 border-dashed">
            <div className="inline-flex p-4 bg-muted rounded-full mb-4">
               <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Không tìm thấy yêu cầu nào</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">Thử thay đổi từ khóa tìm kiếm hoặc lọc theo tiêu chí khác.</p>
          </div>
        )}
      </div>
    </div>
  );
}
