
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
  CheckCircle2,
  ShieldCheck,
  Wrench,
  User,
  Info,
  ImageIcon
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
import Image from 'next/image';

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
      case 'pending_approval': return <Badge className="bg-rose-500 text-[10px] font-black uppercase">Chờ duyệt</Badge>;
      case 'approved': return <Badge className="bg-indigo-500 text-[10px] font-black uppercase">Đã duyệt</Badge>;
      case 'assigned': return <Badge className="bg-blue-500 text-[10px] font-black uppercase">Đã giao việc</Badge>;
      case 'in_progress': return <Badge className="bg-amber-500 text-[10px] font-black uppercase">Đang xử lý</Badge>;
      case 'completed': return <Badge className="bg-cyan-600 text-[10px] font-black uppercase">Kỹ thuật xong</Badge>;
      case 'verified': return <Badge className="bg-emerald-600 text-[10px] font-black uppercase">Chờ nghiệm thu</Badge>;
      case 'closed': return <Badge className="bg-green-700 text-[10px] font-black uppercase">Đã hoàn thành</Badge>;
      case 'rejected': return <Badge variant="destructive" className="text-[10px] font-black uppercase">Đã từ chối</Badge>;
      default: return <Badge variant="outline" className="text-[10px] font-black uppercase">{status}</Badge>;
    }
  };

  const getRepairTypeText = (type?: RepairType) => {
    switch(type) {
      case 'replacement': return 'Thay mới thiết bị';
      case 'backup_replacement': return 'Thay bằng thiết bị dự phòng';
      case 'repair_only': return 'Sửa chữa tại chỗ';
      default: return 'N/A';
    }
  };

  const handlePrint = () => { window.print(); };

  const currentDate = new Date();
  const dateStr = `Đà Nẵng, ngày ${currentDate.getDate()} tháng ${currentDate.getMonth() + 1} năm ${currentDate.getFullYear()}`;

  return (
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 pb-20">
      {/* Header điều hướng */}
      <div className="flex items-center justify-between no-print bg-white/50 p-2 rounded-xl">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1 font-bold">
          <ChevronLeft className="h-4 w-4" /> Trở về
        </Button>
        {(req.status === 'closed' || (currentUser?.role === 'technician' && req.status === 'closed')) && (
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1 font-bold border-primary text-primary">
            <Printer className="h-4 w-4" /> In phiếu lưu trữ
          </Button>
        )}
      </div>

      {/* Giao diện in ấn (Chỉ hiện khi in) */}
      <div 
        className="print-only p-8 space-y-8 bg-white text-black" 
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <div className="flex justify-between items-start pb-4">
          <div className="text-center space-y-0.5">
            <p className="text-[11px] uppercase">ĐẠI HỌC ĐÀ NẴNG</p>
            <p className="font-bold text-[11px] uppercase underline decoration-1 underline-offset-4">TRƯỜNG ĐẠI HỌC KINH TẾ</p>
            <p className="text-[10px] mt-1 font-bold">Mã phiếu: {req.id}</p>
          </div>
          <div className="text-center space-y-0.5">
            <p className="font-bold text-[11px] uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="font-bold text-[11px] underline decoration-1 underline-offset-4">Độc lập - Tự do - Hạnh phúc</p>
            <p className="text-[10px] italic mt-2">{dateStr}</p>
          </div>
        </div>

        <div className="pt-6">
          <h1 className="text-xl font-bold uppercase text-center">PHIẾU BÁO CÁO KẾT QUẢ SỬA CHỮA</h1>
          <p className="text-center italic text-xs mt-1">(Hồ sơ quản lý cơ sở vật chất)</p>
        </div>

        <div className="space-y-4 text-sm pt-4">
          <div className="grid grid-cols-1 gap-2">
            <p><span className="font-bold">1. Nội dung yêu cầu:</span> {req.title}</p>
            <p><span className="font-bold">2. Đơn vị yêu cầu:</span> {req.unit}</p>
            <p><span className="font-bold">3. Người báo hỏng:</span> {req.requesterName}</p>
            <p><span className="font-bold">4. Thiết bị:</span> {req.equipmentName} ({req.category})</p>
            <p><span className="font-bold">5. Hình thức xử lý:</span> {getRepairTypeText(req.repairType)}</p>
            <p><span className="font-bold">6. Nội dung kỹ thuật xử lý:</span></p>
            <div className="pl-4 italic text-slate-800 border-l-2 ml-2 py-1">
              {req.technicianReport || 'Chưa cập nhật nội dung.'}
            </div>
            {req.images && req.images.length > 0 && (
              <div>
                <p className="font-bold mb-2">7. Hình ảnh sự cố:</p>
                <div className="grid grid-cols-3 gap-2">
                  {req.images.map((img, i) => (
                    <div key={i} className="relative aspect-square border">
                       <Image src={img} alt="Incident" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p><span className="font-bold">8. Kết quả nghiệm thu:</span> {req.status === 'closed' ? `Đã hoàn thành - Đánh giá: ${req.rating}/5 sao` : 'Đang thực hiện'}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-16 text-center text-[10px] font-bold uppercase">
          <div className="space-y-24">
            <p>NGƯỜI YÊU CẦU</p>
            <p className="font-normal italic text-[9px] mt-16">(Ký và ghi rõ họ tên)</p>
          </div>
          <div className="space-y-24">
            <p>PHÒNG CƠ SỞ VẬT CHẤT</p>
            <p className="font-normal italic text-[9px] mt-16">(Ký và ghi rõ họ tên)</p>
          </div>
          <div className="space-y-24">
            <p>LÃNH ĐẠO ĐƠN VỊ</p>
            <p className="font-normal italic text-[9px] mt-16">(Ký và đóng dấu)</p>
          </div>
        </div>
      </div>

      {/* Giao diện ứng dụng */}
      <div className="no-print space-y-4">
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden card-shadow">
          <CardHeader className="bg-slate-50/50 pb-6 p-8">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <CardTitle className="text-xl md:text-2xl font-black text-slate-800 leading-tight">{req.title}</CardTitle>
                <div className="flex items-center gap-3">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                     <Clock className="h-3.5 w-3.5" /> {new Date(req.createdAt).toLocaleString('vi-VN')}
                   </p>
                   <Badge variant="outline" className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md border-slate-200">
                     {req.equipmentName}
                   </Badge>
                </div>
              </div>
              {getStatusBadge(req.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-8 pt-0">
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <Label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Mô tả sự cố:</Label>
              <p className="text-sm font-bold text-slate-700 leading-relaxed">{req.description}</p>
            </div>

            {/* Hiển thị hình ảnh đính kèm */}
            {req.images && req.images.length > 0 && (
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-widest">
                  <ImageIcon className="h-3.5 w-3.5" /> Hình ảnh sự cố:
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {req.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                      <Image src={img} alt={`Incident photo ${idx + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {req.technicianReport && (
              <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 space-y-3">
                <div className="flex justify-between items-center">
                   <Label className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Báo cáo kỹ thuật:</Label>
                   <Badge className="bg-blue-500 text-[9px] font-black uppercase">{getRepairTypeText(req.repairType)}</Badge>
                </div>
                <p className="text-sm font-bold text-blue-900 leading-relaxed">{req.technicianReport}</p>
                <div className="flex items-center gap-2 pt-1">
                   <User className="h-3 w-3 text-blue-400" />
                   <span className="text-[10px] font-black text-blue-400 uppercase">Kỹ thuật: {req.technicianName}</span>
                </div>
              </div>
            )}

            {/* Tiến độ xử lý */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'CSVC Duyệt', active: req.csvcManagerApproved, icon: ShieldCheck },
                { label: 'Hài lòng', active: req.requesterConfirmed, icon: ThumbsUp },
                { label: 'Đã đóng', active: req.status === 'closed', icon: CheckCircle2 }
              ].map((step, i) => (
                <div key={i} className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300",
                  step.active 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm" 
                    : "bg-slate-50/50 border-slate-100 text-slate-300"
                )}>
                  <step.icon className={cn("h-5 w-5", step.active ? "text-emerald-500" : "text-slate-200")} />
                  <span className="text-[9px] font-black uppercase tracking-tighter">{step.label}</span>
                </div>
              ))}
            </div>

            {req.rating && (
              <div className="flex items-center justify-between p-5 bg-amber-50 rounded-3xl border border-amber-100">
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Đánh giá cuối cùng:</span>
                <div className="flex gap-1.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-5 w-5", s <= req.rating! ? "fill-amber-400 text-amber-400" : "text-amber-200")} />)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Khu vực thao tác nghiệp vụ */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden card-shadow">
          <CardHeader className="bg-slate-50/50 py-4 px-8">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-800">
              <ShieldAlert className="h-4 w-4 text-accent" /> Thao tác nghiệp vụ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {/* 1. Lãnh đạo đơn vị phê duyệt bước đầu */}
              {currentUser?.role === 'unit_leader' && req.status === 'pending_approval' && (
                <div className="flex flex-col gap-3">
                  <Button className="w-full bg-[#00A651] h-14 font-black rounded-2xl text-white shadow-lg active:scale-95 transition-transform" onClick={() => handleAction('approved')}>PHÊ DUYỆT YÊU CẦU</Button>
                  <Button variant="ghost" className="w-full text-rose-500 font-black h-12 rounded-2xl uppercase text-[10px] tracking-widest" onClick={() => handleAction('rejected', { rejectionReason: 'Từ chối tại đơn vị.' })}>TỪ CHỐI</Button>
                </div>
              )}

              {/* 2. Quản lý CSVC phân công */}
              {currentUser?.role === 'csvc_manager' && req.status === 'approved' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Chọn nhân viên kỹ thuật</Label>
                    <Select onValueChange={setSelectedTechId} value={selectedTechId}>
                      <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold">
                        <SelectValue placeholder="Chọn kỹ thuật viên..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-xl">
                        {technicians.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-primary h-14 font-black rounded-2xl text-white shadow-lg shadow-blue-100" disabled={!selectedTechId} onClick={() => {
                     const tech = technicians.find(t => t.id === selectedTechId);
                     handleAction('assigned', { technicianId: tech?.id, technicianName: tech?.name });
                  }}>GIAO VIỆC NGAY</Button>
                </div>
              )}

              {/* 3. Quản lý CSVC duyệt hoàn thành kỹ thuật */}
              {currentUser?.role === 'csvc_manager' && req.status === 'completed' && (
                <div className="space-y-4">
                   <div className="bg-blue-50 p-5 rounded-3xl flex items-start gap-4 border border-blue-100">
                      <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] font-bold text-blue-700 leading-relaxed">
                        Kỹ thuật đã báo cáo xong. Vui lòng kiểm tra và duyệt để chuyển về cho Đơn vị sử dụng nghiệm thu.
                      </p>
                   </div>
                   <Button className="w-full bg-emerald-600 h-14 font-black rounded-2xl text-white shadow-lg" onClick={() => handleAction('verified', { csvcManagerApproved: true })}>
                     DUYỆT HOÀN THÀNH KỸ THUẬT
                   </Button>
                </div>
              )}

              {/* 4. Kỹ thuật viên xử lý */}
              {currentUser?.role === 'technician' && (
                <>
                  {req.status === 'assigned' && (
                    <Button className="w-full bg-amber-500 h-14 font-black rounded-xl text-white shadow-lg" onClick={() => handleAction('in_progress')}>BẮT ĐẦU THỰC HIỆN</Button>
                  )}
                  {req.status === 'in_progress' && (
                    <div className="space-y-4 p-6 border-2 border-dashed rounded-[2rem] bg-slate-50">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Hình thức xử lý</Label>
                        <Select onValueChange={(val) => setRepairType(val as RepairType)}>
                          <SelectTrigger className="h-14 rounded-2xl bg-white border-none shadow-sm font-bold">
                            <SelectValue placeholder="Chọn hình thức..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl">
                            <SelectItem value="repair_only">Sửa chữa tại chỗ</SelectItem>
                            <SelectItem value="replacement">Thay mới thiết bị</SelectItem>
                            <SelectItem value="backup_replacement">Dùng thiết bị dự phòng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nội dung báo cáo</Label>
                        <Textarea placeholder="Chi tiết công việc đã làm..." className="min-h-[120px] rounded-2xl bg-white border-none shadow-sm font-bold p-4" value={report} onChange={e => setReport(e.target.value)} />
                      </div>
                      <Button className="w-full bg-emerald-600 h-14 font-black rounded-2xl text-white shadow-lg" disabled={!report.trim() || !repairType} onClick={() => handleAction('completed', { technicianReport: report, repairType, completedAt: new Date().toISOString() })}>HOÀN THÀNH & BÁO CÁO</Button>
                    </div>
                  )}
                </>
              )}

              {/* 5. Nhân viên xác nhận hài lòng */}
              {currentUser?.role === 'requester' && req.status === 'verified' && !req.requesterConfirmed && (
                <div className="space-y-4">
                  <p className="text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">Vui lòng phản hồi kết quả sửa chữa</p>
                  <Button className="w-full bg-primary h-16 font-black rounded-2xl text-white shadow-xl shadow-blue-100 flex gap-3 active:scale-95 transition-transform" onClick={handleRequesterConfirm}>
                    <ThumbsUp className="h-6 w-6" /> XÁC NHẬN HÀI LÒNG
                  </Button>
                </div>
              )}

              {/* 6. Lãnh đạo đơn vị nghiệm thu & Đóng phiếu */}
              {currentUser?.role === 'unit_leader' && req.status === 'verified' && (
                <div className="space-y-5">
                  <div className="flex flex-col items-center gap-4 py-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Đánh giá chất lượng phục vụ</Label>
                    <div className="flex gap-3">
                      {[1,2,3,4,5].map(s => (
                        <Star 
                          key={s} 
                          className={cn("h-10 w-10 cursor-pointer transition-all", s <= rating ? "fill-amber-400 text-amber-400 scale-110" : "text-slate-200 hover:text-amber-200")} 
                          onClick={() => setRating(s)} 
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-tighter">
                      {rating === 5 ? "Rất hài lòng" : rating === 4 ? "Hài lòng" : rating === 3 ? "Bình thường" : "Không hài lòng"}
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-emerald-700 h-16 font-black rounded-2xl text-white shadow-xl shadow-emerald-100 disabled:opacity-50" 
                    disabled={!req.requesterConfirmed} 
                    onClick={() => handleAction('closed', { rating })}
                  >
                    XÁC NHẬN & ĐÓNG PHIẾU
                  </Button>
                  
                  {!req.requesterConfirmed && (
                    <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center gap-3">
                       <Info className="h-4 w-4 text-rose-500 shrink-0" />
                       <p className="text-[10px] text-rose-600 font-bold leading-relaxed">
                         Đang chờ Người yêu cầu xác nhận hài lòng trước khi Đóng phiếu.
                       </p>
                    </div>
                  )}
                </div>
              )}

              {/* 7. Phiếu đã đóng */}
              {req.status === 'closed' && (
                <div className="text-center py-10 space-y-4">
                  <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-emerald-800 font-black text-xl uppercase tracking-tighter">Nghiệm thu hoàn tất</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Hồ sơ đã được đóng & lưu trữ</p>
                  </div>
                </div>
              )}

              {/* Thông báo từ chối */}
              {req.status === 'rejected' && (
                <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100 space-y-2">
                  <p className="text-rose-700 font-black text-sm uppercase tracking-tighter">Yêu cầu bị từ chối</p>
                  <p className="text-xs font-bold text-rose-600">Lý do: {req.rejectionReason || 'Không có lý do chi tiết.'}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
