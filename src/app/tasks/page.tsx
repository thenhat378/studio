
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Play, CheckCircle2, Eye, ClipboardPen, Bell } from 'lucide-react';
import { Badge } from '@/badge';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RepairType } from '@/lib/types';

export default function TasksPage() {
  const { requests, currentUser, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [reportText, setReportText] = useState('');
  const [repairType, setRepairType] = useState<RepairType | ''>('');

  const myTasks = requests.filter(r => r.technicianId === currentUser?.id);

  const handleStart = (id: string) => {
    updateRequestStatus(id, 'in_progress');
    toast({ 
      title: "Đã bắt đầu xử lý", 
      description: "Trạng thái đã chuyển sang 'Đang thực hiện'. Hãy báo cáo sau khi xong." 
    });
  };

  const handleOpenReport = (id: string) => {
    setReportingId(id);
    setReportText('');
    setRepairType('');
  };

  const handleSubmitReport = () => {
    if (!reportingId || !reportText.trim() || !repairType) return;

    updateRequestStatus(reportingId, 'completed', { 
      technicianReport: reportText,
      repairType: repairType as RepairType
    });

    toast({
      title: "Đã báo cáo hoàn thành",
      description: "Hệ thống đã tự động gửi thông báo đến Người yêu cầu và Quản lý CSVC."
    });
    
    setReportingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'assigned': return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Mới phân công</Badge>;
      case 'in_progress': return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Đang thực hiện</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Đã báo cáo hoàn thành</Badge>;
      case 'verified': return <Badge variant="outline" className="bg-cyan-50 text-cyan-600 border-cyan-200">Đã duyệt hoàn thành</Badge>;
      case 'closed': return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Đã đóng phiếu</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Wrench className="h-6 w-6 text-accent" />
            Nhiệm vụ sửa chữa được giao
          </h1>
          <p className="text-muted-foreground">Theo dõi và báo cáo kết quả xử lý sự cố</p>
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
                  <p>Đơn vị: <span className="text-foreground font-medium">{req.unit}</span></p>
                  <p>Thiết bị: <span className="text-foreground font-medium">{req.equipmentName}</span></p>
                </div>
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
                    className="bg-primary hover:bg-primary/90 gap-1 flex-1 md:flex-none font-bold" 
                    onClick={() => handleStart(req.id)}
                  >
                    <Play className="h-4 w-4" /> Bắt đầu sửa
                  </Button>
                )}

                {req.status === 'in_progress' && (
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700 gap-1 flex-1 md:flex-none font-bold" 
                    onClick={() => handleOpenReport(req.id)}
                  >
                    <ClipboardPen className="h-4 w-4" /> Báo cáo hoàn thành
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {myTasks.length === 0 && (
          <div className="text-center py-20 bg-card rounded-xl border-2 border-dashed">
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold">Chưa có nhiệm vụ nào</h3>
          </div>
        )}
      </div>

      <Dialog open={!!reportingId} onOpenChange={(open) => !open && setReportingId(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 uppercase tracking-tight font-black">
              <ClipboardPen className="h-5 w-5 text-primary" />
              Báo cáo hoàn thành công việc
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Hình thức sửa chữa (Listbox)</Label>
              <Select value={repairType} onValueChange={(val) => setRepairType(val as RepairType)}>
                <SelectTrigger className="h-12 border-primary/20">
                  <SelectValue placeholder="Chọn hình thức..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="replacement">Thay mới</SelectItem>
                  <SelectItem value="backup_replacement">Thay mới bằng thiết bị dự phòng</SelectItem>
                  <SelectItem value="repair_only">Sửa chữa không thay thế thiết bị</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="report" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Chi tiết xử lý</Label>
              <Textarea 
                id="report"
                placeholder="Mô tả cụ thể những gì đã làm..." 
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="min-h-[120px] border-primary/20"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
               <Bell className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
               <p className="text-xs text-blue-700 font-bold">Lưu ý: Sau khi gửi, thông báo sẽ tự động gửi tới Người yêu cầu và Quản lý PCSVC.</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="h-11 px-6 rounded-xl" onClick={() => setReportingId(null)}>Hủy</Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 h-11 px-8 rounded-xl font-bold" 
              onClick={handleSubmitReport} 
              disabled={!reportText.trim() || !repairType}
            >
              Báo cáo hoàn thành
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
