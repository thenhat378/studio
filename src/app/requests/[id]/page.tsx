
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
  UserCheck,
  ShieldCheck,
  ThumbsUp
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
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Không tìm thấy yêu cầu</h2>
        <Button variant="link" onClick={() => router.push('/requests')}>Quay lại danh sách</Button>
      </div>
    );
  }

  const handleAction = (status: any, extra?: any) => {
    updateRequestStatus(req.id, status, extra);
    
    let msg = "Cập nhật thành công";
    if (status === 'completed') msg = "Kỹ thuật viên đã báo cáo xong. Chờ Quản lý CSVC duyệt.";
    if (status === 'verified') msg = "Quản lý CSVC đã duyệt. Chờ Người dùng & Lãnh đạo nghiệm thu.";
    if (status === 'closed') msg = "Phiếu đã được đóng. Nghiệm thu hoàn tất.";

    toast({ title: "Thông báo", description: msg });
  };

  const handleRequesterConfirm = () => {
    updateRequestStatus(req.id, req.status, { requesterConfirmed: true });
    toast({
      title: "Đã xác nhận hài lòng",
      description: "Yêu cầu đã được chuyển cho Lãnh đạo đơn vị để ký đóng phiếu."
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_approval': return <Badge className="bg-rose-500">Chờ lãnh đạo duyệt</Badge>;
      case 'approved': return <Badge className="bg-indigo-500">Chờ phân công</Badge>;
      case 'assigned': return <Badge className="bg-blue-500">Đã phân công</Badge>;
      case 'in_progress': return <Badge className="bg-amber-500">Đang thực hiện</Badge>;
      case 'completed': return <Badge className="bg-cyan-500 text-white">Chờ QL CSVC duyệt</Badge>;
      case 'verified': return <Badge className="bg-emerald-500 text-white">Đang nghiệm thu sử dụng</Badge>;
      case 'closed': return <Badge className="bg-green-700 text-white">Đã hoàn tất & Đóng phiếu</Badge>;
      case 'rejected': return <Badge variant="destructive">Đã từ chối</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between no-print">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Quay lại
        </Button>
        {req.status === 'closed' && (
          <Button variant="outline" onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" /> In phiếu lưu trữ
          </Button>
        )}
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-muted/10">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{req.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2 font-bold text-primary">
                <Clock className="h-4 w-4" /> Thời gian báo hỏng: {new Date(req.createdAt).toLocaleString('vi-VN')}
              </CardDescription>
            </div>
            {getStatusBadge(req.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-accent/5 p-4 rounded-xl border border-accent/10">
            <Label className="text-xs font-black uppercase text-muted-foreground mb-2 block">Mô tả sự cố</Label>
            <p className="italic text-foreground/80">"{req.description}"</p>
          </div>

          {req.technicianReport && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <Label className="text-xs font-black uppercase text-blue-700 mb-2 block">Báo cáo kỹ thuật ({req.repairType === 'replacement' ? 'Thay mới' : req.repairType === 'backup_replacement' ? 'Thay dự phòng' : 'Sửa chữa'})</Label>
              <p className="text-blue-900 font-medium">{req.technicianReport}</p>
            </div>
          )}

          {/* HIỂN THỊ TRẠNG THÁI XÁC NHẬN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={cn("p-3 rounded-lg border", req.csvcManagerApproved ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-muted/20 border-dashed")}>
              <p className="text-xs font-bold uppercase tracking-tight">1. Quản lý CSVC Duyệt</p>
              <p className="text-sm">{req.csvcManagerApproved ? "✓ Đã duyệt chất lượng kỹ thuật" : "● Đang chờ kỹ thuật/duyệt"}</p>
            </div>
            <div className={cn("p-3 rounded-lg border", req.requesterConfirmed ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-muted/20 border-dashed")}>
              <p className="text-xs font-bold uppercase tracking-tight">2. Người dùng Xác nhận</p>
              <p className="text-sm">{req.requesterConfirmed ? "✓ Đã hài lòng & xác nhận" : "● Đang chờ nghiệm thu"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KHU VỰC XỬ LÝ THEO VAI TRÒ */}
      <Card className="border-none shadow-sm no-print">
        <CardHeader className="bg-accent/5">
          <CardTitle className="text-lg flex items-center gap-2 font-bold">
            <ShieldAlert className="h-5 w-5" /> Xử lý yêu cầu
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            
            {/* LÃNH ĐẠO: PHÊ DUYỆT ĐẦU VÀO */}
            {currentUser?.role === 'unit_leader' && req.status === 'pending_approval' && (
              <div className="flex gap-3">
                <Button className="bg-primary flex-1 font-bold h-12" onClick={() => handleAction('approved')}>Phê duyệt</Button>
                <Button variant="destructive" className="flex-1 font-bold h-12" onClick={() => handleAction('rejected', { rejectionReason: 'Từ chối bởi lãnh đạo.' })}>Từ chối</Button>
              </div>
            )}

            {/* QUẢN LÝ CSVC: GIAO VIỆC */}
            {currentUser?.role === 'csvc_manager' && req.status === 'approved' && (
              <div className="flex flex-col gap-3">
                <Select onValueChange={setSelectedTechId} value={selectedTechId}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Chọn kỹ thuật viên..." /></SelectTrigger>
                  <SelectContent>
                    {technicians.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button className="bg-primary h-12 font-bold" disabled={!selectedTechId} onClick={() => {
                   const tech = technicians.find(t => t.id === selectedTechId);
                   handleAction('assigned', { technicianId: tech?.id, technicianName: tech?.name });
                }}>Giao việc</Button>
              </div>
            )}

            {/* QUẢN LÝ CSVC: DUYỆT HOÀN THÀNH KỸ THUẬT */}
            {currentUser?.role === 'csvc_manager' && req.status === 'completed' && (
              <Button className="w-full bg-emerald-600 h-12 font-bold gap-2" onClick={() => handleAction('verified', { csvcManagerApproved: true })}>
                <ShieldCheck className="h-5 w-5" /> Duyệt hoàn thành chất lượng kỹ thuật
              </Button>
            )}

            {/* KỸ THUẬT VIÊN: BÁO CÁO */}
            {currentUser?.role === 'technician' && (
              <>
                {req.status === 'assigned' && (
                  <Button className="w-full bg-amber-500 h-14 font-bold text-lg text-white" onClick={() => handleAction('in_progress')}>Bắt đầu sửa chữa</Button>
                )}
                {req.status === 'in_progress' && (
                  <div className="space-y-4">
                    <Select onValueChange={(val) => setRepairType(val as RepairType)}>
                      <SelectTrigger className="h-12"><SelectValue placeholder="Hình thức xử lý..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="replacement">Thay mới</SelectItem>
                        <SelectItem value="backup_replacement">Thay mới (Dự phòng)</SelectItem>
                        <SelectItem value="repair_only">Sửa chữa không thay thế</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="Chi tiết xử lý kỹ thuật..." className="min-h-[100px]" value={report} onChange={e => setReport(e.target.value)} />
                    <Button className="w-full bg-emerald-600 h-14 font-bold text-lg" disabled={!report.trim() || !repairType} onClick={() => handleAction('completed', { technicianReport: report, repairType })}>Báo cáo hoàn thành</Button>
                  </div>
                )}
              </>
            )}

            {/* NGƯỜI YÊU CẦU: XÁC NHẬN HÀI LÒNG */}
            {currentUser?.role === 'requester' && req.status === 'verified' && !req.requesterConfirmed && (
              <Button className="w-full bg-primary h-14 font-bold text-lg gap-2" onClick={handleRequesterConfirm}>
                <ThumbsUp className="h-6 w-6" /> Xác nhận hài lòng về kết quả
              </Button>
            )}

            {/* LÃNH ĐẠO: XÁC NHẬN & ĐÓNG PHIẾU */}
            {currentUser?.role === 'unit_leader' && req.status === 'verified' && (
              <div className="space-y-4">
                <div className="flex gap-2 justify-center py-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-8 w-8 cursor-pointer", s <= rating ? "fill-amber-400 text-amber-400" : "text-muted")} onClick={() => setRating(s)} />)}
                </div>
                <Button className="w-full bg-primary h-14 font-bold text-lg gap-2" disabled={!req.requesterConfirmed} onClick={() => handleAction('closed', { rating })}>
                  <CheckCircle2 className="h-6 w-6" /> Xác nhận hoàn thành & Đóng phiếu
                </Button>
                {!req.requesterConfirmed && <p className="text-center text-xs text-rose-600 font-bold">Chờ người yêu cầu xác nhận hài lòng trước khi đóng phiếu.</p>}
              </div>
            )}

            {/* TRẠNG THÁI KHÁC */}
            {req.status === 'closed' && (
              <div className="text-center py-6 text-emerald-600 font-bold">✓ Phiếu đã đóng. Nghiệm thu hoàn tất.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
