
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Eye, Check, X, FileText, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

export default function ApprovalsPage() {
  const { requests, currentUser, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Lọc các yêu cầu đang chờ duyệt thuộc đơn vị của lãnh đạo
  const pendingRequests = requests.filter(r => 
    r.status === 'pending_approval' && 
    (currentUser?.unit ? r.unit === currentUser.unit : true)
  );

  const handleApprove = (id: string) => {
    updateRequestStatus(id, 'approved');
    toast({
      title: "Đã phê duyệt",
      description: `Yêu cầu ${id} đã được chuyển cho Quản lý CSVC.`
    });
  };

  const handleReject = () => {
    if (!rejectingId || !rejectionReason.trim()) return;
    
    updateRequestStatus(rejectingId, 'rejected', { rejectionReason });
    toast({
      variant: "destructive",
      title: "Đã từ chối",
      description: `Yêu cầu ${rejectingId} đã bị từ chối.`
    });
    setRejectingId(null);
    setRejectionReason('');
  };

  const handleExportReport = () => {
    toast({
      title: "Đang xuất báo cáo",
      description: "Hệ thống đang khởi tạo file PDF báo cáo phê duyệt..."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-accent" />
            Phê duyệt yêu cầu
          </h1>
          <p className="text-muted-foreground">Xét duyệt các phiếu sửa chữa từ nhân viên đơn vị {currentUser?.unit}</p>
        </div>
        <Button variant="outline" className="gap-2 border-primary/20 text-primary" onClick={handleExportReport}>
          <FileText className="h-4 w-4" /> Xuất báo cáo đơn vị
        </Button>
      </div>

      <div className="grid gap-4">
        {pendingRequests.map(req => (
          <Card key={req.id} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg truncate">{req.title}</h3>
                  <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200">Chờ duyệt</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Người yêu cầu: <span className="font-medium text-foreground">{req.requesterName}</span> • 
                  Thiết bị: <span className="font-medium text-foreground">{req.equipmentName}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2 italic line-clamp-1">"{req.description}"</p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    <Eye className="h-4 w-4" /> Chi tiết
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700 gap-1 flex-1 md:flex-none" 
                  onClick={() => handleApprove(req.id)}
                >
                  <Check className="h-4 w-4" /> Duyệt
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="gap-1 flex-1 md:flex-none" 
                  onClick={() => setRejectingId(req.id)}
                >
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
            <p className="text-muted-foreground">Hiện tại không có phiếu nào cần bạn xử lý.</p>
          </div>
        )}
      </div>

      {/* Dialog Từ chối */}
      <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lý do từ chối phê duyệt</DialogTitle>
            <DialogDescription>
              Vui lòng cho biết lý do bạn từ chối yêu cầu này để nhân viên nắm được thông tin.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Nhập lý do tại đây..." 
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingId(null)}>Hủy</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
