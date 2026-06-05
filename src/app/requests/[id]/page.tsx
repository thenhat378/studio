
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Wrench, 
  CheckCircle2, 
  Printer, 
  ShieldAlert, 
  Clock, 
  Star, 
  Bell, 
  Play, 
  ClipboardPen,
  XCircle,
  UserCheck
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
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
         description: "Thông báo đã được gửi đến Người yêu cầu và Quản lý. Chờ Lãnh đạo đơn vị xác nhận đóng phiếu."
       });
    } else if (status === 'closed') {
       toast({
         title: "Đã xác nhận & Đóng phiếu",
         description: "Phiếu đã được đóng. Nhân viên kỹ thuật hiện có thể in phiếu lưu trữ."
       });
    } else if (status === 'approved') {
       toast({
         title: "Đã phê duyệt",
         description: "Yêu cầu đã được chuyển cho Quản lý CSVC để phân công kỹ thuật."
       });
    } else if (status === 'assigned') {
       toast({
         title: "Đã phân công",
         description: `Đã giao nhiệm vụ cho kỹ thuật viên: ${extra?.technicianName}`
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
      case 'pending_approval': return <Badge className="bg-rose-500">Chờ duyệt</Badge>;
      case 'approved': return <Badge className="bg-indigo-500">Đã phê duyệt</Badge>;
      case 'assigned': return <Badge className="bg-blue-500">Đã phân công</Badge>;
      case 'in_progress': return <Badge className="bg-amber-500">Đang thực hiện</Badge>;
      case 'completed': return <Badge className="bg-emerald-500 text-white">Chờ xác nhận đóng phiếu</Badge>;
      case 'closed': return <Badge className="bg-green-700 text-white">Đã hoàn tất & Đóng phiếu</Badge>;
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

  const canConfirm = (currentUser?.role === 'requester' && req.requesterId === currentUser.id) || 
                   (currentUser?.role === 'unit_leader' && req.unit === currentUser.unit);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Print View Header */}
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
        {req.status === 'closed' && (
          <Button variant="outline" size="sm" className="gap-2 border-primary/20 text-primary font-semibold shadow-sm" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> In phiếu lưu trữ
          </Button>
        )}
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

          {/* SECTION: XỬ LÝ YÊU CẦU */}
          <Card className="border-none shadow-sm overflow-hidden border-t-4 border-t-accent no-print">
            <CardHeader className="bg-accent/5 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 font-bold uppercase tracking-tight">
                 <ShieldAlert className="h-5 w-5 text-accent" /> 
                 Xử lý yêu cầu
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                
                {/* 1. LÃNH ĐẠO ĐƠN VỊ: PHÊ DUYỆT BAN ĐẦU */}
                {currentUser?.role === 'unit_leader' && req.status === 'pending_approval' && (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">Phê duyệt yêu cầu này để chuyển cho phòng Quản lý CSVC xử lý.</p>
                    <div className="flex gap-3">
                      <Button className="bg-primary flex-1 h-12 text-md font-bold" onClick={() => handleAction('approved')}>
                        <CheckCircle2 className="h-5 w-5 mr-2" /> Phê duyệt ngay
                      </Button>
                      <Button variant="destructive" className="flex-1 h-12 text-md font-bold" onClick={() => handleAction('rejected', { rejectionReason: 'Yêu cầu bị từ chối bởi lãnh đạo đơn vị.' })}>
                        <XCircle className="h-5 w-5 mr-2" /> Từ chối
                      </Button>
                    </div>
                  </div>
                )}

                {/* 2. QUẢN LÝ CSVC: PHÂN CÔNG KỸ THUẬT */}
                {currentUser?.role === 'csvc_manager' && req.status === 'approved' && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Chọn nhân viên kỹ thuật phù hợp để thực hiện sửa chữa.</p>
                    <div className="flex flex-col gap-3">
                      <Select onValueChange={setSelectedTechId} value={selectedTechId}>
                        <SelectTrigger className="h-12 border-primary/20">
                          <SelectValue placeholder="Chọn kỹ thuật viên..." />
                        </SelectTrigger>
                        <SelectContent>
                          {technicians.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button className="bg-primary h-12 font-bold text-md shadow-lg shadow-primary/20" disabled={!selectedTechId} onClick={() => {
                        const tech = technicians.find(t => t.id === selectedTechId);
                        handleAction('assigned', { technicianId: tech?.id, technicianName: tech?.name });
                      }}>
                        <UserCheck className="h-5 w-5 mr-2" /> Giao việc ngay
                      </Button>
                    </div>
                  </div>
                )}

                {/* 3. NHÂN VIÊN KỸ THUẬT: BẮT ĐẦU VÀ BÁO CÁO */}
                {currentUser?.role === 'technician' && req.status === 'assigned' && (
                  <Button className="bg-amber-500 h-14 text-lg font-bold gap-2 text-white" onClick={() => handleAction('in_progress')}>
                    <Play className="h-6 w-6" /> Bắt đầu thực hiện sửa chữa
                  </Button>
                )}

                {currentUser?.role === 'technician' && req.status === 'in_progress' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Hình thức sửa chữa</Label>
                      <Select value={repairType} onValueChange={(val) => setRepairType(val as RepairType)}>
                        <SelectTrigger className="h-12 border-primary/20">
                          <SelectValue placeholder="Chọn phương án..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="replacement">Thay mới</SelectItem>
                          <SelectItem value="backup_replacement">Thay mới bằng thiết bị dự phòng</SelectItem>
                          <SelectItem value="repair_only">Sửa chữa không thay thế thiết bị</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Chi tiết xử lý kỹ thuật</Label>
                      <Textarea placeholder="Mô tả cụ thể các công việc đã thực hiện..." className="min-h-[120px] border-primary/20" value={report} onChange={e => setReport(e.target.value)} />
                    </div>

                    <Button 
                      className="bg-emerald-600 w-full h-14 text-md font-bold gap-2 shadow-lg shadow-emerald-200" 
                      disabled={!report.trim() || !repairType} 
                      onClick={() => handleAction('completed', { technicianReport: report, repairType })}
                    >
                      <ClipboardPen className="h-5 w-5" /> Gửi báo cáo hoàn thành
                    </Button>
                  </div>
                )}

                {/* 4. NGƯỜI YÊU CẦU / LÃNH ĐẠO: XÁC NHẬN & ĐÓNG PHIẾU */}
                {canConfirm && req.status === 'completed' && (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
                      <Bell className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-emerald-800">Kỹ thuật viên đã báo cáo hoàn thành. Vui lòng kiểm tra và xác nhận để đóng phiếu.</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Đánh giá mức độ hài lòng của bạn</Label>
                      <StarRating value={rating} onChange={setRating} />
                    </div>
                    
                    <Button className="bg-primary w-full h-14 text-md font-bold gap-2 shadow-lg shadow-primary/20" onClick={() => handleAction('closed', { rating })}>
                      <CheckCircle2 className="h-6 w-6" /> Xác nhận hoàn thành & Đóng phiếu
                    </Button>
                  </div>
                )}

                {/* TRẠNG THÁI KHÁC */}
                {(!canConfirm || req.status !== 'completed') && 
                 (currentUser?.role !== 'unit_leader' || req.status !== 'pending_approval') &&
                 (currentUser?.role !== 'csvc_manager' || req.status !== 'approved') &&
                 (currentUser?.role !== 'technician' || (req.status !== 'assigned' && req.status !== 'in_progress')) && (
                  <div className="py-8 text-center bg-muted/20 rounded-xl border-2 border-dashed">
                    <Clock className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Hiện tại không có thao tác xử lý nào dành cho bạn ở trạng thái này.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 no-print">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/5">
              <CardTitle className="text-xs font-black uppercase text-muted-foreground tracking-widest">Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5 text-sm font-medium">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] uppercase text-muted-foreground">Đơn vị yêu cầu</p>
                <p>{req.unit}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] uppercase text-muted-foreground">Người yêu cầu</p>
                <p>{req.requesterName}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] uppercase text-muted-foreground">Thiết bị sự cố</p>
                <Badge variant="secondary" className="w-fit">{req.equipmentName}</Badge>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] uppercase text-muted-foreground">Kỹ thuật viên phụ trách</p>
                <p className="text-primary font-bold">{req.technicianName || 'Chưa phân công'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
