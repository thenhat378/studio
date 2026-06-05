
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Eye, Check, X, FileText, CheckCircle2 } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ApprovalsPage() {
  const { requests, currentUser, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Lọc các yêu cầu của đơn vị lãnh đạo
  const unitRequests = requests.filter(r => 
    !currentUser?.unit || r.unit === currentUser.unit
  );

  // 1. Chờ phê duyệt (Mới tạo)
  const pendingRequests = unitRequests.filter(r => r.status === 'pending_approval');
  
  // 2. Chờ nghiệm thu (CSVC đã kiểm tra kỹ thuật xong)
  const pendingConfirmation = unitRequests.filter(r => r.status === 'verified');

  const handleApprove = (id: string) => {
    updateRequestStatus(id, 'approved');
    toast({
      title: "Đã phê duyệt",
      description: "Yêu cầu đã được chuyển cho Quản lý CSVC để phân công."
    });
  };

  const handleConfirmAcceptance = (id: string) => {
    updateRequestStatus(id, 'closed');
    toast({
      title: "Đã nghiệm thu",
      description: "Đơn vị đã xác nhận hoàn thành và đóng phiếu yêu cầu."
    });
  };

  const handleReject = () => {
    if (!rejectingId || !rejectionReason.trim()) return;
    
    updateRequestStatus(rejectingId, 'rejected', { rejectionReason });
    toast({
      variant: "destructive",
      title: "Đã từ chối",
      description: "Yêu cầu đã bị từ chối phê duyệt."
    });
    setRejectingId(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-accent" />
            Phê duyệt & Nghiệm thu ({currentUser?.unit})
          </h1>
          <p className="text-muted-foreground">Xét duyệt và xác nhận kết quả sửa chữa của đơn vị</p>
        </div>
        <Button variant="outline" className="gap-2 border-primary/20 text-primary">
          <FileText className="h-4 w-4" /> Xuất báo cáo đơn vị
        </Button>
      </div>

      <Tabs defaultValue="approve" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="approve" className="gap-2">
            Chờ phê duyệt
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirm" className="gap-2">
            Chờ nghiệm thu
            {pendingConfirmation.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                {pendingConfirmation.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approve" className="space-y-4 mt-6">
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
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <Eye className="h-4 w-4" /> Chi tiết
                    </Button>
                  </Link>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1 flex-1 md:flex-none" onClick={() => handleApprove(req.id)}>
                    <Check className="h-4 w-4" /> Duyệt
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-1 flex-1 md:flex-none" onClick={() => setRejectingId(req.id)}>
                    <X className="h-4 w-4" /> Từ chối
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingRequests.length === 0 && (
            <div className="text-center py-16 bg-card rounded-xl border-2 border-dashed">
              <p className="text-muted-foreground">Không có yêu cầu nào đang chờ phê duyệt.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirm" className="space-y-4 mt-6">
          {pendingConfirmation.map(req => (
            <Card key={req.id} className="border-none shadow-sm overflow-hidden border-l-4 border-l-emerald-500">
              <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg truncate">{req.title}</h3>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Chờ đơn vị xác nhận</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Đã sửa xong & CSVC đã nghiệm thu kỹ thuật. Vui lòng kiểm tra thực tế.
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <Eye className="h-4 w-4" /> Xem báo cáo
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 gap-1 flex-1 md:flex-none" 
                    onClick={() => handleConfirmAcceptance(req.id)}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Nghiệm thu & Đóng phiếu
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingConfirmation.length === 0 && (
            <div className="text-center py-16 bg-card rounded-xl border-2 border-dashed">
              <p className="text-muted-foreground">Không có yêu cầu nào đang chờ nghiệm thu cuối cùng.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lý do từ chối phê duyệt</DialogTitle>
            <DialogDescription>Nhập lý do cụ thể để nhân viên nắm được thông tin.</DialogDescription>
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
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>Xác nhận từ chối</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
