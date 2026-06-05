
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Play, CheckCircle2, Eye, ClipboardPen, Loader2 } from 'lucide-react';
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
import { Label } from '@/components/ui/label';

export default function TasksPage() {
  const { requests, currentUser, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [reportText, setReportText] = useState('');

  // Lọc nhiệm vụ được phân công cho kỹ thuật viên hiện tại
  const myTasks = requests.filter(r => r.technicianId === currentUser?.id);

  const handleStart = (id: string) => {
    updateRequestStatus(id, 'in_progress');
    toast({ 
      title: "Đã nhận việc", 
      description: "Trạng thái đã chuyển sang 'Đang thực hiện'. Hãy cập nhật kết quả khi hoàn tất." 
    });
  };

  const handleOpenReport = (id: string) => {
    setReportingId(id);
    setReportText('');
  };

  const handleSubmitReport = () => {
    if (!reportingId || !reportText.trim()) return;

    updateRequestStatus(reportingId, 'completed', { 
      technicianReport: reportText 
    });

    toast({
      title: "Đã báo cáo hoàn thành",
      description: "Thông tin đã được gửi cho Quản lý CSVC nghiệm thu."
    });
    setReportingId(null);
    setReportText('');
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'assigned': return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Mới giao</Badge>;
      case 'in_progress': return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Đang xử lý</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Đã xong - Chờ duyệt</Badge>;
      case 'verified': return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Đã nghiệm thu</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Wrench className="h-6 w-6 text-accent" />
            Nhiệm vụ sửa chữa của tôi
          </h1>
          <p className="text-muted-foreground">Nhận việc và cập nhật tiến độ xử lý các sự cố được giao</p>
        </div>
      </div>

      <div className="grid gap-4">
        {myTasks.map(req => (
          <Card key={req.id} className="border-none shadow-sm overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg truncate">{req.title}</h3>
                  {getStatusBadge(req.status)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
                  <p>Phòng/Đơn vị: <span className="text-foreground font-medium">{req.unit}</span></p>
                  <p>Thiết bị: <span className="text-foreground font-medium">{req.equipmentName}</span></p>
                </div>
                {req.technicianReport && (
                  <p className="text-xs mt-2 italic text-emerald-600 bg-emerald-50 p-2 rounded line-clamp-1">
                    Báo cáo: "{req.technicianReport}"
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    <Eye className="h-4 w-4" /> Chi tiết
                  </Button>
                </Link>

                {req.status === 'assigned' && (
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 gap-1 flex-1 md:flex-none" 
                    onClick={() => handleStart(req.id)}
                  >
                    <Play className="h-4 w-4" /> Nhận việc
                  </Button>
                )}

                {req.status === 'in_progress' && (
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700 gap-1 flex-1 md:flex-none" 
                    onClick={() => handleOpenReport(req.id)}
                  >
                    <ClipboardPen className="h-4 w-4" /> Báo cáo kết quả
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {myTasks.length === 0 && (
          <div className="text-center py-20 bg-card rounded-xl border-2 border-dashed">
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold">Chưa có nhiệm vụ nào được giao</h3>
            <p className="text-muted-foreground">Khi Quản lý CSVC phân công, các phiếu sẽ xuất hiện ở đây.</p>
          </div>
        )}
      </div>

      {/* Dialog Báo cáo kết quả */}
      <Dialog open={!!reportingId} onOpenChange={(open) => !open && setReportingId(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardPen className="h-5 w-5 text-primary" />
              Báo cáo kết quả xử lý
            </DialogTitle>
            <DialogDescription>
              Mô tả chi tiết quá trình sửa chữa, các linh kiện đã thay thế (nếu có) để gửi Quản lý CSVC nghiệm thu.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report">Chi tiết xử lý</Label>
              <Textarea 
                id="report"
                placeholder="Ví dụ: Đã thay dây cáp HDMI mới, máy chiếu hoạt động bình thường..." 
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportingId(null)}>Hủy</Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700" 
              onClick={handleSubmitReport} 
              disabled={!reportText.trim()}
            >
              Gửi báo cáo hoàn thành
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
