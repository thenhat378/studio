
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Printer, 
  ShieldAlert, 
  Clock, 
  Star, 
  ThumbsUp,
  CheckCircle,
  ShieldCheck,
  CheckCircle2,
  Package,
  FileText
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
        <h2 className="text-lg font-bold">Không tìm thấy phiếu yêu cầu</h2>
        <Button variant="link" onClick={() => router.push('/requests')}>Quay lại</Button>
      </div>
    );
  }

  const handleAction = (status: any, extra?: any) => {
    updateRequestStatus(req.id, status, extra);
    toast({ title: "Đã cập nhật", description: "Hệ thống đã ghi nhận thay đổi của bạn." });
  };

  const handleRequesterConfirm = () => {
    updateRequestStatus(req.id, req.status, { requesterConfirmed: true });
    toast({ title: "Xác nhận hài lòng", description: "Cảm ơn bạn đã phản hồi!" });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_approval': return <Badge className="bg-rose-500 text-[10px]">Chờ duyệt</Badge>;
      case 'approved': return <Badge className="bg-indigo-500 text-[10px]">Đã duyệt</Badge>;
      case 'assigned': return <Badge className="bg-blue-500 text-[10px]">Đã giao việc</Badge>;
      case 'in_progress': return <Badge className="bg-amber-500 text-[10px]">Đang xử lý</Badge>;
      case 'completed': return <Badge className="bg-cyan-600 text-[10px]">Kỹ thuật xong</Badge>;
      case 'verified': return <Badge className="bg-emerald-600 text-[10px]">Chờ nghiệm thu</Badge>;
      case 'closed': return <Badge className="bg-green-700 text-[10px]">Đã hoàn thành</Badge>;
      case 'rejected': return <Badge variant="destructive" className="text-[10px]">Đã từ chối</Badge>;
      default: return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  const getRepairTypeText = (type?: RepairType) => {
    switch(type) {
      case 'replacement': return 'Thay mới';
      case 'backup_replacement': return 'Dự phòng';
      case 'repair_only': return 'Sửa chữa';
      default: return 'N/A';
    }
  };

  const handlePrint = () => { window.print(); };

  return (
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
      {/* Nav Header */}
      <div className="flex items-center justify-between no-print bg-white/50 p-2 rounded-xl">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1 font-bold">
          <ChevronLeft className="h-4 w-4" /> Trở về
        </Button>
        {req.status === 'closed' && (
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1 font-bold border-primary text-primary">
            <Printer className="h-4 w-4" /> In phiếu
          </Button>
        )}
      </div>

      {/* Official Print View - Only shown on print */}
      <div className="print-only p-8 space-y-8 bg-white text-black font-serif">
        <div className="flex justify-between items-start border-b-2 border-black pb-4">
          <div className="text-center space-y-1">
            <p className="font-bold text-xs uppercase">PHÒNG QUẢN TRỊ CSVC</p>
            <p className="text-xs">Số: {req.id}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="font-bold text-xs underline">Độc lập - Tự do - Hạnh phúc</p>
            <p className="text-[10px] italic">{new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
        <h1 className="text-xl font-bold uppercase text-center">PHIẾU BÁO CÁO SỬA CHỮA</h1>
        <div className="space-y-3 text-sm">
          <p><span className="font-bold">Tiêu đề:</span> {req.title}</p>
          <p><span className="font-bold">Người báo:</span> {req.requesterName} ({req.unit})</p>
          <p><span className="font-bold">Thiết bị:</span> {req.equipmentName}</p>
          <p><span className="font-bold">Kỹ thuật:</span> {req.technicianName || '...'}</p>
          <p><span className="font-bold">Nội dung:</span> {req.technicianReport || '...'}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-10 text-center text-xs font-bold">
          <div className="space-y-16"><p>NGƯỜI YÊU CẦU</p><p className="font-normal">(Ký tên)</p></div>
          <div className="space-y-16"><p>LÃNH ĐẠO ĐƠN VỊ</p><p className="font-normal">(Ký, đóng dấu)</p></div>
        </div>
      </div>

      {/* Main App View */}
      <div className="no-print space-y-4">
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 pb-4">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <CardTitle className="text-lg md:text-xl font-black text-slate-800 break-words leading-tight">{req.title}</CardTitle>
                <div className="flex flex-col gap-1 mt-2">
                   <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                     <Clock className="h-3 w-3" /> {new Date(req.createdAt).toLocaleString('vi-VN')}
                   </p>
                </div>
              </div>
              {getStatusBadge(req.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="bg-slate-50 p-3 rounded-xl">
              <Label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Yêu cầu:</Label>
              <p className="text-sm text-slate-700">{req.description}</p>
              <Badge variant="secondary" className="mt-2 text-[10px] bg-white border border-slate-200">{req.equipmentName}</Badge>
            </div>

            {req.technicianReport && (
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <Label className="text-[10px] font-black uppercase text-blue-500 mb-1 block">Kỹ thuật xử lý: {getRepairTypeText(req.repairType)}</Label>
                <p className="text-sm text-blue-900">{req.technicianReport}</p>
              </div>
            )}

            {/* Stepper style progress on mobile */}
            <div className="grid grid-cols-3 gap-2 py-2">
              {[
                { label: 'CSVC', active: req.csvcManagerApproved },
                { label: 'User', active: req.requesterConfirmed },
                { label: 'Đóng', active: req.status === 'closed' }
              ].map((step, i) => (
                <div key={i} className={cn(
                  "flex flex-col items-center gap-1.5 p-2 rounded-lg border text-center transition-colors",
                  step.active ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-100 text-slate-300"
                )}>
                  <CheckCircle2 className={cn("h-4 w-4", step.active ? "text-emerald-500" : "text-slate-200")} />
                  <span className="text-[9px] font-black uppercase">{step.label}</span>
                </div>
              ))}
            </div>

            {req.rating && (
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-tighter">Đánh giá nghiệm thu:</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-4 w-4", s <= req.rating! ? "fill-amber-400 text-amber-400" : "text-amber-200")} />)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business Logic Area */}
        <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 py-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#F58220]" /> Thao tác nghiệp vụ
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 pb-6">
            <div className="space-y-4">
              {currentUser?.role === 'unit_leader' && req.status === 'pending_approval' && (
                <div className="flex flex-col gap-3">
                  <Button className="w-full bg-[#00A651] h-12 font-bold rounded-xl" onClick={() => handleAction('approved')}>Phê duyệt ngay</Button>
                  <Button variant="ghost" className="w-full text-rose-500 font-bold h-12" onClick={() => handleAction('rejected', { rejectionReason: 'Từ chối.' })}>Không duyệt</Button>
                </div>
              )}

              {currentUser?.role === 'csvc_manager' && req.status === 'approved' && (
                <div className="flex flex-col gap-3">
                  <Select onValueChange={setSelectedTechId} value={selectedTechId}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Chọn kỹ thuật viên..." /></SelectTrigger>
                    <SelectContent>
                      {technicians.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button className="w-full bg-primary h-12 font-bold rounded-xl" disabled={!selectedTechId} onClick={() => {
                     const tech = technicians.find(t => t.id === selectedTechId);
                     handleAction('assigned', { technicianId: tech?.id, technicianName: tech?.name });
                  }}>Giao việc ngay</Button>
                </div>
              )}

              {currentUser?.role === 'csvc_manager' && req.status === 'completed' && (
                <Button className="w-full bg-emerald-600 h-14 font-black rounded-xl text-white shadow-lg" onClick={() => handleAction('verified', { csvcManagerApproved: true })}>
                  DUYỆT HOÀN THÀNH KỸ THUẬT
                </Button>
              )}

              {currentUser?.role === 'technician' && (
                <>
                  {req.status === 'assigned' && (
                    <Button className="w-full bg-amber-500 h-14 font-black rounded-xl text-white shadow-lg" onClick={() => handleAction('in_progress')}>BẮT ĐẦU SỬA CHỮA</Button>
                  )}
                  {req.status === 'in_progress' && (
                    <div className="space-y-3 p-4 border-2 border-dashed rounded-2xl bg-slate-50">
                      <Label className="font-bold text-xs uppercase text-slate-500">Báo cáo kết quả</Label>
                      <Select onValueChange={(val) => setRepairType(val as RepairType)}>
                        <SelectTrigger className="h-12 rounded-xl bg-white"><SelectValue placeholder="Hình thức xử lý..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="replacement">Thay mới</SelectItem>
                          <SelectItem value="repair_only">Sửa chữa</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea placeholder="Chi tiết nội dung đã làm..." className="min-h-[100px] rounded-xl bg-white" value={report} onChange={e => setReport(e.target.value)} />
                      <Button className="w-full bg-emerald-600 h-12 font-bold rounded-xl" disabled={!report.trim() || !repairType} onClick={() => handleAction('completed', { technicianReport: report, repairType, completedAt: new Date().toISOString() })}>Hoàn thành & Báo cáo</Button>
                    </div>
                  )}
                </>
              )}

              {currentUser?.role === 'requester' && req.status === 'verified' && !req.requesterConfirmed && (
                <Button className="w-full bg-primary h-14 font-black rounded-xl text-white shadow-lg flex gap-2" onClick={handleRequesterConfirm}>
                  <ThumbsUp className="h-5 w-5" /> XÁC NHẬN HÀI LÒNG
                </Button>
              )}

              {currentUser?.role === 'unit_leader' && req.status === 'verified' && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-3 py-4 bg-slate-50 rounded-2xl border">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Đánh giá chất lượng phục vụ</Label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-10 w-10 cursor-pointer transition-all", s <= rating ? "fill-amber-400 text-amber-400 scale-110" : "text-slate-200")} onClick={() => setRating(s)} />)}
                    </div>
                  </div>
                  <Button className="w-full bg-emerald-700 h-14 font-black rounded-xl text-white shadow-lg" disabled={!req.requesterConfirmed} onClick={() => handleAction('closed', { rating })}>
                    XÁC NHẬN & ĐÓNG PHIẾU
                  </Button>
                  {!req.requesterConfirmed && <p className="text-center text-[10px] text-rose-500 font-bold">Chờ người yêu cầu xác nhận trước...</p>}
                </div>
              )}

              {req.status === 'closed' && (
                <div className="text-center py-6">
                  <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-emerald-800 font-black text-lg">NGHIỆM THU HOÀN TẤT</p>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1">Phiếu đã được đóng & lưu trữ</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
