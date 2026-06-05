
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Wrench, 
  User, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  Printer,
  ShieldAlert,
  HardDrive,
  XCircle,
  Clock,
  Star,
  Bell,
  Play
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { RepairType } from '@/lib/types';

export default function RequestDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const { requests, currentUser, updateRequestStatus, users } = useAppStore();
  
  const [report, setReport] = useState('');
  const [repairType, setRepairType] = useState<RepairType | ''>('');
  const [selectedTechId, setSelectedTechId] = useState('');
  const [rating, setRating] = useState<number>(5);

  const req = requests.find(r => r.id === id);
  const technicians = users.filter(u => u.role === 'technician');

  if (!req) {
    return (
      <div className="text-center py-20 animate-in fade-in duration-300">
        <h2 className="text-xl font-bold">Không tìm thấy yêu cầu</h2>
        <Button variant="link" onClick={() => router.push('/requests')}>Quay lại danh sách</Button>
      </div>
    );
  }

  const handleAction = (status: any, extra?: any) => {
    updateRequestStatus(req.id, status, extra);
    
    if (status === 'completed') {
       toast({
         title: "Đã báo cáo hoàn thành",
         description: "Hệ thống đã tự động gửi thông báo đến Người yêu cầu và Quản lý CSVC."
       });
    } else if (status === 'closed') {
       toast({
         title: "Đã xác nhận hoàn thành",
         description: "Phiếu yêu cầu hiện đã được đóng và nghiệm thu."
       });
    } else {
       toast({
         title: "Cập nhật thành công",
         description: `Phiếu #${req.id} đã chuyển sang trạng thái mới.`
       });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getRepairTypeLabel = (type?: string) => {
    switch(type) {
      case 'replacement': return 'Thay mới';
      case 'backup_replacement': return 'Thay mới bằng thiết bị dự phòng';
      case 'repair_only': return 'Sửa chữa không thay thế thiết bị';
      default: return '';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_approval': return <Badge className="bg-rose-500">Chờ phê duyệt</Badge>;
      case 'approved': return <Badge className="bg-indigo-500">Đã phê duyệt</Badge>;
      case 'assigned': return <Badge className="bg-blue-500">Đã phân công</Badge>;
      case 'in_progress': return <Badge className="bg-amber-500">Đang thực hiện</Badge>;
      case 'completed': return <Badge className="bg-emerald-500">Kỹ thuật đã báo xong</Badge>;
      case 'verified': return <Badge className="bg-cyan-600">Đã duyệt hoàn thành</Badge>;
      case 'closed': return <Badge className="bg-green-700 text-white">Đã đóng phiếu</Badge>;
      case 'rejected': return <Badge variant="destructive">Đã từ chối</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const StarRating = ({ value, onChange, readOnly = false }: { value: number, onChange?: (val: number) => void, readOnly?: boolean }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={cn(
              "h-6 w-6 transition-all",
              star <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground",
              !readOnly && "cursor-pointer hover:scale-110 active:scale-95"
            )}
            onClick={() => !readOnly && onChange?.(star)}
          />
        ))}
      </div>
    );
  };

  const isRequesterOrLeader = currentUser?.role === 'requester' || currentUser?.role === 'unit_leader';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="print-only mb-8 text-center border-b pb-6">
        <h1 className="text-3xl font-bold text-primary mb-2 uppercase tracking-tighter">FIXFLOW PRO - PHIẾU YÊU CẦU SỬA CHỮA</h1>
        <p className="text-sm font-mono">Mã số phiếu: {req.id} | Ngày in: {new Date().toLocaleString('vi-VN')}</p>
      </div>

      <div className="flex items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight">Chi tiết yêu cầu #{req.id}</h1>
            <p className="text-xs text-muted-foreground uppercase font-mono">{req.category}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2 border-primary/20 text-primary font-semibold" onClick={handlePrint}>
          <Printer className="h-4 w-4" /> In phiếu lưu trữ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b bg-muted/10">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold">{req.title}</CardTitle>
                <div className="scale-110">{getStatusBadge(req.status)}</div>
              </div>
              <div className="flex flex-col gap-1 mt-3">
                <CardDescription className="flex items-center gap-2 text-primary font-bold">
                  <Clock className="h-4 w-4" /> Thời gian báo hỏng: {new Date(req.createdAt).toLocaleString('vi-VN')}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div>
                <Label className="text-xs uppercase text-muted-foreground font-extrabold tracking-widest mb-3 block">Mô tả sự cố</Label>
                <div className="bg-accent/5 p-5 rounded-2xl border border-accent/10 leading-relaxed italic text-foreground/80">
                  "{req.description}"
                </div>
              </div>

              {req.technicianReport && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs uppercase text-emerald-700 font-extrabold tracking-widest flex items-center gap-2">
                      <Wrench className="h-4 w-4" /> Báo cáo công việc kỹ thuật
                    </Label>
                    {req.repairType && (
                      <Badge className="bg-emerald-600 text-white font-bold">{getRepairTypeLabel(req.repairType)}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-emerald-900 leading-relaxed font-medium bg-white/50 p-4 rounded-xl border border-emerald-100">
                    {req.technicianReport}
                  </p>
                </div>
              )}

              {req.status === 'closed' && req.rating && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                  <Label className="text-xs uppercase text-amber-700 font-extrabold tracking-widest flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 fill-amber-400" /> Đánh giá mức độ hài lòng
                  </Label>
                  <StarRating value={req.rating} readOnly />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden border-t-4 border-t-accent no-print">
            <CardHeader className="bg-accent/5 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 font-bold uppercase tracking-tight">
                 <ShieldAlert className="h-5 w-5 text-accent" /> 
                 Xử lý yêu cầu
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                {/* LÃNH ĐẠO PHÊ DUYỆT */}
                {currentUser?.role === 'unit_leader' && req.status === 'pending_approval' && (
                  <div className="flex gap-3">
                    <Button className="bg-primary flex-1 h-12 text-md font-bold" onClick={() => handleAction('approved')}>Phê duyệt yêu cầu</Button>
                    <Button variant="destructive" className="flex-1 h-12 text-md font-bold" onClick={() => handleAction('rejected', { rejectionReason: 'Yêu cầu không phù hợp.' })}>Từ chối</Button>
                  </div>
                )}

                {/* KỸ THUẬT VIÊN BÁO CÁO HOÀN THÀNH */}
                {currentUser?.role === 'technician' && req.status === 'in_progress' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Hình thức sửa chữa (Listbox)</Label>
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
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Chi tiết xử lý</Label>
                      <Textarea placeholder="Mô tả các bước đã xử lý..." className="min-h-[120px] border-primary/20" value={report} onChange={e => setReport(e.target.value)} />
                    </div>

                    <Button 
                      className="bg-emerald-600 w-full h-14 text-md font-bold gap-2" 
                      disabled={!report.trim() || !repairType} 
                      onClick={() => handleAction('completed', { technicianReport: report, repairType })}
                    >
                      <CheckCircle2 className="h-5 w-5" /> Báo cáo hoàn thành
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground italic">Lưu ý: Hệ thống sẽ tự động gửi thông báo cho Người yêu cầu và Quản lý PCSVC.</p>
                  </div>
                )}
                
                {currentUser?.role === 'technician' && req.status === 'assigned' && (
                   <Button className="bg-amber-500 h-14 text-lg font-bold gap-2" onClick={() => handleAction('in_progress')}>
                     <Play className="h-5 w-5" /> Bắt đầu sửa chữa
                   </Button>
                )}

                {/* NGƯỜI YÊU CẦU / LÃNH ĐẠO XÁC NHẬN HOÀN THÀNH */}
                {isRequesterOrLeader && req.status === 'verified' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Đánh giá độ hài lòng của bạn</Label>
                      <StarRating value={rating} onChange={setRating} />
                    </div>
                    <Button className="bg-primary w-full h-14 text-md font-bold gap-2" onClick={() => handleAction('closed', { rating })}>
                      <CheckCircle2 className="h-5 w-5" /> Xác nhận hoàn thành & Đóng phiếu
                    </Button>
                  </div>
                )}

                {/* QUẢN LÝ CSVC PHÂN CÔNG / DUYỆT HOÀN THÀNH */}
                {currentUser?.role === 'csvc_manager' && req.status === 'approved' && (
                  <div className="flex flex-col gap-3">
                    <Select onValueChange={setSelectedTechId} value={selectedTechId}>
                      <SelectTrigger className="h-12"><SelectValue placeholder="Chọn kỹ thuật viên..." /></SelectTrigger>
                      <SelectContent>{technicians.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button className="bg-primary h-12 font-bold" disabled={!selectedTechId} onClick={() => {
                      const tech = technicians.find(t => t.id === selectedTechId);
                      handleAction('assigned', { technicianId: tech?.id, technicianName: tech?.name });
                    }}>Phân công kỹ thuật viên</Button>
                  </div>
                )}

                {currentUser?.role === 'csvc_manager' && req.status === 'completed' && (
                  <Button className="bg-emerald-600 h-14 text-md font-bold gap-2" onClick={() => handleAction('verified')}>
                    <CheckCircle2 className="h-5 w-5" /> Duyệt hoàn thành
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 no-print">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/5">
              <CardTitle className="text-xs font-black uppercase text-muted-foreground tracking-widest">Thông tin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5 text-sm font-medium">
              <div className="flex flex-col gap-1"><p className="text-[10px] uppercase text-muted-foreground">Người yêu cầu</p><p>{req.requesterName} ({req.unit})</p></div>
              <div className="flex flex-col gap-1"><p className="text-[10px] uppercase text-muted-foreground">Thiết bị</p><p>{req.equipmentName}</p></div>
              <div className="flex flex-col gap-1"><p className="text-[10px] uppercase text-muted-foreground">Kỹ thuật viên</p><p>{req.technicianName || 'Chưa phân công'}</p></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
