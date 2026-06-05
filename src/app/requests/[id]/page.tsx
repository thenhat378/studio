
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
        <h2 className="text-xl font-bold">Không tìm thấy yêu cầu</h2>
        <Button variant="link" onClick={() => router.push('/requests')}>Quay lại danh sách</Button>
      </div>
    );
  }

  const handleAction = (status: any, extra?: any) => {
    updateRequestStatus(req.id, status, extra);
    
    let msg = "Cập nhật thành công";
    if (status === 'completed') msg = "Đã gửi báo cáo hoàn thành. Thông báo đã được gửi đến Người yêu cầu và Quản lý.";
    if (status === 'verified') msg = "Đã duyệt chất lượng kỹ thuật. Chờ đơn vị nghiệm thu.";
    if (status === 'closed') msg = "Nghiệm thu hoàn tất. Phiếu đã được đóng.";

    toast({ title: "Thông báo hệ thống", description: msg });
  };

  const handleRequesterConfirm = () => {
    updateRequestStatus(req.id, req.status, { requesterConfirmed: true });
    toast({
      title: "Xác nhận hài lòng",
      description: "Đã ghi nhận ý kiến. Chờ Lãnh đạo đơn vị ký đóng phiếu."
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_approval': return <Badge className="bg-rose-500">Chờ duyệt</Badge>;
      case 'approved': return <Badge className="bg-indigo-500">Chờ phân công</Badge>;
      case 'assigned': return <Badge className="bg-blue-500">Đã phân công</Badge>;
      case 'in_progress': return <Badge className="bg-amber-500">Đang thực hiện</Badge>;
      case 'completed': return <Badge className="bg-cyan-500 text-white">Chờ QL CSVC duyệt</Badge>;
      case 'verified': return <Badge className="bg-emerald-500 text-white">Chờ nghiệm thu</Badge>;
      case 'closed': return <Badge className="bg-green-700 text-white">Đã hoàn tất & Đóng phiếu</Badge>;
      case 'rejected': return <Badge variant="destructive">Đã từ chối</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRepairTypeText = (type?: RepairType) => {
    switch(type) {
      case 'replacement': return 'Thay mới thiết bị';
      case 'backup_replacement': return 'Thay bằng thiết bị dự phòng';
      case 'repair_only': return 'Sửa chữa không thay thế';
      default: return 'N/A';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header điều hướng - Ẩn khi in */}
      <div className="flex items-center justify-between no-print">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Quay lại
        </Button>
        {req.status === 'closed' && (
          <Button variant="default" onClick={handlePrint} className="gap-2 bg-primary font-bold">
            <Printer className="h-4 w-4" /> In phiếu lưu trữ
          </Button>
        )}
      </div>

      {/* BIỂU MẪU IN CHÍNH THỨC - Chỉ hiển thị khi in */}
      <div className="print-only p-8 space-y-8 bg-white text-black font-serif">
        <div className="flex justify-between items-start border-b-2 border-black pb-4">
          <div className="text-center space-y-1">
            <p className="font-bold text-sm uppercase">CƠ QUAN CHỦ QUẢN</p>
            <p className="font-bold text-lg uppercase underline">PHÒNG QUẢN TRỊ CSVC</p>
            <p className="text-xs">Số: {req.id}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="font-bold text-sm">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="font-bold text-sm underline">Độc lập - Tự do - Hạnh phúc</p>
            <p className="text-xs italic">Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold uppercase">PHIẾU BÁO CÁO KẾT QUẢ SỬA CHỮA</h1>
          <p className="italic">(Dành cho lưu trữ hồ sơ kỹ thuật)</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <p><span className="font-bold">Tiêu đề:</span> {req.title}</p>
            <p><span className="font-bold">Mã phiếu:</span> {req.id}</p>
            <p><span className="font-bold">Người yêu cầu:</span> {req.requesterName}</p>
            <p><span className="font-bold">Đơn vị:</span> {req.unit}</p>
            <p><span className="font-bold">Thiết bị:</span> {req.equipmentName}</p>
            <p><span className="font-bold">Kỹ thuật viên:</span> {req.technicianName || 'N/A'}</p>
          </div>

          <div className="border border-black p-3 rounded">
            <p className="font-bold mb-1 underline">Mô tả sự cố:</p>
            <p className="italic">{req.description}</p>
          </div>

          <div className="border border-black p-3 rounded">
            <p className="font-bold mb-1 underline">Kết quả xử lý kỹ thuật:</p>
            <p><span className="font-medium">- Hình thức:</span> {getRepairTypeText(req.repairType)}</p>
            <p><span className="font-medium">- Chi tiết:</span> {req.technicianReport || 'Chưa có báo cáo'}</p>
            <p><span className="font-medium">- Thời gian báo hỏng:</span> {new Date(req.createdAt).toLocaleString('vi-VN')}</p>
            <p><span className="font-medium">- Thời gian hoàn thành:</span> {req.completedAt ? new Date(req.completedAt).toLocaleString('vi-VN') : 'N/A'}</p>
          </div>

          <div className="flex items-center gap-2">
            <p className="font-bold">Đánh giá nghiệm thu:</p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(s => (
                <span key={s} className="text-xl">{s <= (req.rating || 0) ? '★' : '☆'}</span>
              ))}
            </div>
            <p className="italic">({req.rating || 0}/5 sao)</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-10 text-center text-sm font-bold">
          <div className="space-y-20">
            <p>NGƯỜI YÊU CẦU</p>
            <p className="font-normal">(Ký, ghi rõ họ tên)</p>
          </div>
          <div className="space-y-20">
            <p>KỸ THUẬT VIÊN</p>
            <p className="font-normal">(Ký, ghi rõ họ tên)</p>
          </div>
          <div className="space-y-20">
            <p>QUẢN LÝ CSVC</p>
            <p className="font-normal">(Ký, ghi rõ họ tên)</p>
          </div>
          <div className="space-y-20">
            <p>LÃNH ĐẠO ĐƠN VỊ</p>
            <p className="font-normal">(Ký, đóng dấu)</p>
          </div>
        </div>
      </div>

      {/* GIAO DIỆN HIỂN THỊ TRÊN APP - Ẩn khi in */}
      <div className="no-print space-y-6">
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/10">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  {req.title}
                </CardTitle>
                <div className="flex flex-col gap-1">
                  <p className="flex items-center gap-2 text-sm font-bold text-primary">
                    <Clock className="h-4 w-4" /> Thời gian báo hỏng: {new Date(req.createdAt).toLocaleString('vi-VN')}
                  </p>
                  {req.completedAt && (
                    <p className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                      <CheckCircle className="h-4 w-4" /> Thời gian kỹ thuật báo xong: {new Date(req.completedAt).toLocaleString('vi-VN')}
                    </p>
                  )}
                </div>
              </div>
              {getStatusBadge(req.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-accent/5 p-4 rounded-xl border border-accent/10">
                <Label className="text-xs font-black uppercase text-muted-foreground mb-2 block">Thông tin sự cố</Label>
                <p className="text-foreground font-medium mb-2">{req.description}</p>
                <Badge variant="outline" className="bg-white gap-1"><Package className="h-3 w-3" /> {req.equipmentName}</Badge>
              </div>

              {req.technicianReport && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <Label className="text-xs font-black uppercase text-blue-700 mb-2 block">Báo cáo kỹ thuật ({getRepairTypeText(req.repairType)})</Label>
                  <p className="text-blue-900 font-medium">{req.technicianReport}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={cn("p-3 rounded-lg border", req.csvcManagerApproved ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-muted/20 border-dashed")}>
                <p className="text-xs font-bold uppercase tracking-tight">1. QL CSVC Duyệt kỹ thuật</p>
                <p className="text-sm font-bold">{req.csvcManagerApproved ? "✓ Đã duyệt xong" : "● Đang chờ"}</p>
              </div>
              <div className={cn("p-3 rounded-lg border", req.requesterConfirmed ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-muted/20 border-dashed")}>
                <p className="text-xs font-bold uppercase tracking-tight">2. Người yêu cầu xác nhận</p>
                <p className="text-sm font-bold">{req.requesterConfirmed ? "✓ Đã hài lòng" : "● Đang chờ"}</p>
              </div>
              <div className={cn("p-3 rounded-lg border", req.status === 'closed' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-muted/20 border-dashed")}>
                <p className="text-xs font-bold uppercase tracking-tight">3. Lãnh đạo Đóng phiếu</p>
                <p className="text-sm font-bold">{req.status === 'closed' ? "✓ Đã hoàn tất" : "● Đang chờ"}</p>
              </div>
            </div>
            
            {req.rating && (
              <div className="flex items-center gap-2 py-4 bg-amber-50 rounded-xl px-4 border border-amber-100">
                <span className="text-sm font-bold text-amber-800">Đánh giá nghiệm thu:</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={cn("h-5 w-5", s <= req.rating! ? "fill-amber-400 text-amber-400" : "text-amber-200")} />
                  ))}
                </div>
                <span className="text-sm font-black text-amber-600 ml-2">({req.rating}/5 sao)</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* KHU VỰC XỬ LÝ THEO VAI TRÒ */}
        <Card className="border-none shadow-sm">
          <CardHeader className="bg-accent/5">
            <CardTitle className="text-lg flex items-center gap-2 font-bold">
              <ShieldAlert className="h-5 w-5" /> Khu vực xử lý nghiệp vụ
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              
              {currentUser?.role === 'unit_leader' && req.status === 'pending_approval' && (
                <div className="flex gap-3">
                  <Button className="bg-primary flex-1 font-bold h-12" onClick={() => handleAction('approved')}>Phê duyệt ngay</Button>
                  <Button variant="destructive" className="flex-1 font-bold h-12" onClick={() => handleAction('rejected', { rejectionReason: 'Từ chối bởi lãnh đạo.' })}>Từ chối</Button>
                </div>
              )}

              {currentUser?.role === 'csvc_manager' && req.status === 'approved' && (
                <div className="flex flex-col gap-3">
                  <Select onValueChange={setSelectedTechId} value={selectedTechId}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Chọn kỹ thuật viên để giao việc..." /></SelectTrigger>
                    <SelectContent>
                      {technicians.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button className="bg-primary h-12 font-bold" disabled={!selectedTechId} onClick={() => {
                     const tech = technicians.find(t => t.id === selectedTechId);
                     handleAction('assigned', { technicianId: tech?.id, technicianName: tech?.name });
                  }}>Phân công kỹ thuật viên</Button>
                </div>
              )}

              {currentUser?.role === 'csvc_manager' && req.status === 'completed' && (
                <Button className="w-full bg-emerald-600 h-14 font-bold gap-2 text-lg" onClick={() => handleAction('verified', { csvcManagerApproved: true })}>
                  <ShieldCheck className="h-6 w-6" /> Duyệt hoàn thành chất lượng kỹ thuật
                </Button>
              )}

              {currentUser?.role === 'technician' && (
                <>
                  {req.status === 'assigned' && (
                    <Button className="w-full bg-amber-500 h-14 font-bold text-xl text-white shadow-lg shadow-amber-200" onClick={() => handleAction('in_progress')}>Bắt đầu sửa chữa ngay</Button>
                  )}
                  {req.status === 'in_progress' && (
                    <div className="space-y-4 p-4 border-2 border-dashed border-primary/20 rounded-2xl">
                      <Label className="font-bold text-primary">Báo cáo hoàn thành công việc</Label>
                      <Select onValueChange={(val) => setRepairType(val as RepairType)}>
                        <SelectTrigger className="h-12 border-primary/30"><SelectValue placeholder="Chọn hình thức xử lý..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="replacement">Thay mới thiết bị</SelectItem>
                          <SelectItem value="backup_replacement">Thay bằng thiết bị dự phòng</SelectItem>
                          <SelectItem value="repair_only">Sửa chữa không thay thế</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea placeholder="Chi tiết các hạng mục đã thực hiện..." className="min-h-[120px] border-primary/30" value={report} onChange={e => setReport(e.target.value)} />
                      <Button className="w-full bg-emerald-600 h-14 font-bold text-lg" disabled={!report.trim() || !repairType} onClick={() => handleAction('completed', { technicianReport: report, repairType, completedAt: new Date().toISOString() })}>Gửi báo cáo hoàn thành</Button>
                    </div>
                  )}
                </>
              )}

              {currentUser?.role === 'requester' && req.status === 'verified' && !req.requesterConfirmed && (
                <div className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <p className="text-sm font-bold text-primary mb-2">Bạn có hài lòng với kết quả sửa chữa này?</p>
                    <Button className="w-full bg-primary h-14 font-bold text-lg gap-2" onClick={handleRequesterConfirm}>
                      <ThumbsUp className="h-6 w-6" /> Xác nhận hài lòng
                    </Button>
                  </div>
                </div>
              )}

              {currentUser?.role === 'unit_leader' && req.status === 'verified' && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-3 py-6 bg-muted/20 rounded-2xl border">
                    <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Đánh giá chất lượng phục vụ</Label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-12 w-12 cursor-pointer transition-all", s <= rating ? "fill-amber-400 text-amber-400 scale-110" : "text-muted hover:text-amber-200")} onClick={() => setRating(s)} />)}
                    </div>
                  </div>
                  <Button className="w-full bg-emerald-700 h-16 font-bold text-xl gap-2 shadow-lg shadow-emerald-200" disabled={!req.requesterConfirmed} onClick={() => handleAction('closed', { rating })}>
                    <CheckCircle2 className="h-7 w-7" /> Xác nhận & Đóng phiếu cuối cùng
                  </Button>
                  {!req.requesterConfirmed && <p className="text-center text-xs text-rose-600 font-bold animate-pulse">Lưu ý: Nhân viên yêu cầu cần xác nhận trước.</p>}
                </div>
              )}

              {req.status === 'closed' && (
                <div className="flex flex-col items-center gap-4 py-8 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-800 font-black text-xl">NGHIỆM THU HOÀN TẤT</p>
                    <p className="text-sm text-emerald-600 font-medium">Phiếu đã được đóng và lưu trữ vào hệ thống.</p>
                  </div>
                  <Button variant="default" className="mt-2 bg-primary font-bold shadow-lg" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> In phiếu lưu trữ ngay
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
