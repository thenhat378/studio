
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Eye, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function ApprovalsPage() {
  const { requests, currentUser, updateRequestStatus } = useAppStore();
  const { toast } = useToast();

  const pendingRequests = requests.filter(r => r.status === 'pending_approval' && (currentUser?.role === 'unit_leader' ? r.unit === currentUser.unit : true));

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    updateRequestStatus(id, status);
    toast({
      title: status === 'approved' ? "Đã phê duyệt" : "Đã từ chối",
      description: `Yêu cầu ${id} đã được xử lý.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-accent" />
          Phê duyệt yêu cầu
        </h1>
        <p className="text-muted-foreground">Các phiếu yêu cầu đang chờ bạn xác nhận</p>
      </div>

      <div className="grid gap-4">
        {pendingRequests.map(req => (
          <Card key={req.id} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{req.title}</h3>
                  <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200">Chờ duyệt</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Người yêu cầu: <span className="font-medium text-foreground">{req.requesterName}</span> • 
                  Thiết bị: <span className="font-medium text-foreground">{req.equipmentName}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1 italic">"{req.description.substring(0, 100)}..."</p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    <Eye className="h-4 w-4" /> Chi tiết
                  </Button>
                </Link>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1 flex-1 md:flex-none" onClick={() => handleAction(req.id, 'approved')}>
                  <Check className="h-4 w-4" /> Duyệt
                </Button>
                <Button size="sm" variant="destructive" className="gap-1 flex-1 md:flex-none" onClick={() => handleAction(req.id, 'rejected')}>
                  <X className="h-4 w-4" /> Từ chối
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {pendingRequests.length === 0 && (
          <div className="text-center py-20 bg-card rounded-xl border-2 border-dashed">
            <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold">Không có yêu cầu chờ duyệt</h3>
            <p className="text-muted-foreground">Tất cả các phiếu đã được xử lý xong.</p>
          </div>
        )}
      </div>
    </div>
  );
}
