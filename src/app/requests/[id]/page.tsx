
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
  ImageIcon,
  Check,
  Edit3,
  Send,
  X
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
  const { requests, currentUser, updateRequestStatus, users, equipment } = useAppStore();
  
  const [report, setReport] = useState('');
  const [repairType, setRepairType] = useState<RepairType | ''>('');
  const [selectedTechId, setSelectedTechId] = useState('');
  const [rating, setRating] = useState<number>(5);

  // States for editing mode (Resend feature)
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    equipmentId: ''
  });

  const req = requests.find(r => r.id === id);
  const technicians = users.filter(u => u.role === 'technician');

  useEffect(() => {
    if (req) {
      setEditData({
        title: req.title,
        description: req.description,
        equipmentId: req.equipmentId
      });
    }
  }, [req]);

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
    toast({ title: "Xác nhận hài lòng", description: "Cảm ơn bạn đã phản hồi kết quả sửa chữa!" });
  };

  const handleResend = () => {
    if (!editData.title || !editData.description || !editData.equipmentId) {
      toast({ variant: "destructive", title: "Thiếu thông tin", description: "Vui lòng điền đầy đủ thông tin trước khi gửi lại." });
      return;
    }

    const equip = equipment.find(e => e.id === editData.equipmentId);
    
    updateRequestStatus(req.id, 'pending_approval', {
      title: editData.title,
      description: editData.description,
      equipmentId: editData.equipmentId,
      equipmentName: equip?.name || req.equipmentName,
      category: equip?.category || req.category,
      rejectionReason: "" // Clear rejection reason if resending
    });

    setIsEditing(false);
    toast({ title: "Đã gửi lại phiếu", description: "Yêu cầu đã được cập nhật và gửi lại cho Quản lý đơn vị." });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_approval': return <Badge className="bg-rose-500 text-[10px] font-black uppercase">Chờ duyệt đơn vị</Badge>;
      case 'approved': return <Badge className="bg-indigo-500 text-[10px] font-black uppercase">Chờ phân công</Badge>;
      case 'assigned': return <Badge className="bg-blue-500 text-[10px] font-black uppercase">Đã giao kỹ thuật</Badge>;
      case 'in_progress': return <Badge className="bg-amber-500 text-[10px] font-black uppercase">Đang sửa chữa</Badge>;
      case 'completed': return <Badge className="bg-cyan-600 text-[10px] font-black uppercase">Kỹ thuật báo xong</Badge>;
      case 'verified': return <Badge className="bg-emerald-600 text-[10px] font-black uppercase">Chờ nghiệm thu</Badge>;
      case 'closed': return <Badge className="bg-green-700 text-[10px] font-black uppercase">Đã đóng</Badge>;
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

  return (
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 pb-20">
      <div className="flex items-center justify-between no-print bg-white/50 p-2 rounded-xl">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1 font-bold">
          <ChevronLeft className="h-4 w-4" /> Trở về
        </Button>
        {req.status === 'closed' && (
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1 font-bold border-primary text-primary">
            <Printer className="h-4 w-4" /> In phiếu lưu trữ
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden card-shadow">
          <CardHeader className="bg-slate-50/50 pb-6 p-8">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 flex-1">
                {isEditing ? (
                  <Input 
                    value={editData.title}
                    onChange={e => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="h-12 text-lg font-black bg-white rounded-xl border-primary/20"
                    placeholder="Tiêu đề mới..."
                  />
                ) : (
                  <CardTitle className="text-xl md:text-2xl font-black text-slate-800 leading-tight">{req.title}</CardTitle>
                )}
                <div className="flex flex-col gap-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                     <Clock className="h-3.5 w-3.5" /> Ngày báo: {new Date(req.createdAt).toLocaleString('vi-VN')}
                   </p>
                   {req.completedAt && (
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                       <Check className="h-3.5 w-3.5" /> Hoàn thành: {new Date(req.completedAt).toLocaleString('vi-VN')}
                     </p>
                   )}
                   <div className="flex items-center gap-2 mt-1">
                      {isEditing ? (
                        <Select value={editData.equipmentId} onValueChange={val => setEditData(prev => ({ ...prev, equipmentId: val }))}>
                          <SelectTrigger className="h-10 text-[10px] font-black bg-white rounded-lg w-48">
                            <SelectValue placeholder="Chọn thiết bị..." />
                          </SelectTrigger>
                          <SelectContent>
                            {equipment.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline" className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md border-slate-200">
                          {req.equipmentName}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md border-slate-200">
                        Đơn vị: {req.unit}
                      </Badge>
                   </div>
                </div>
              </div>
              <div className="no-print">
                {getStatusBadge(req.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-8 pt-0">
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 mt-4">
              <Label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Mô tả sự cố từ {req.requesterName}:</Label>
              {isEditing ? (
                <Textarea 
                  value={editData.description}
                  onChange={e => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px] bg-white rounded-2xl font-bold p-4 border-primary/10"
                />
              ) : (
                <p className="text-sm font-bold text-slate-700 leading-relaxed">{req.description}</p>
              )}
            </div>

            {req.images && req.images.length > 0 && (
              <div className="space-y-3 no-print">
                <Label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-widest">
                  <ImageIcon className="h-3.5 w-3.5" /> Hình ảnh minh chứng:
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
                   <Label className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Báo cáo kỹ thuật ({req.technicianName}):</Label>
                   <Badge className="bg-blue-500 text-[9px] font-black uppercase">{getRepairTypeText(req.repairType)}</Badge>
                </div>
                <p className="text-sm font-bold text-blue-900 leading-relaxed">{req.technicianReport}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 no-print">
              {[
                { label: 'Đơn vị Duyệt', active: req.status !== 'pending_approval' && req.status !== 'rejected', icon: ShieldCheck },
                { label: 'CSVC Giao việc', active: !!req.technicianId, icon: Wrench },
                { label: 'Đã đóng', active: req.status === 'closed', icon: CheckCircle2 }
              ].map((step, i) => (
                <div key={i} className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300",
                  step.active 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm" 
                    : "bg-slate-50/50 border-slate-100 text-slate-300"
                )}>
                  <step.icon className={cn("h-5 w-5", step.active ? "text-emerald-500" : "text-slate-200")} />
                  <span className="text-[9px] font-black uppercase tracking-tighter text-center">{step.label}</span>
                </div>
              ))}
            </div>

            {/* Phần chữ ký khi in */}
            <div className="print-only mt-20 grid grid-cols-2 gap-20 text-center">
               <div className="space-y-20">
                  <p className="font-bold">ĐƠN VỊ SỬ DỤNG</p>
                  <p className="text-xs text-slate-400 italic">(Ký và ghi rõ họ tên)</p>
               </div>
               <div className="space-y-20">
                  <p className="font-bold">NHÂN VIÊN KỸ THUẬT</p>
                  <p className="text-xs text-slate-400 italic">(Ký và ghi rõ họ tên)</p>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden card-shadow no-print">
          <CardHeader className="bg-slate-50/50 py-4 px-8">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-800">
              <ShieldAlert className="h-4 w-4 text-accent" /> Thao tác xử lý
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {/* NHÂN VIÊN/GIẢNG VIÊN - CHỈNH SỬA & GỬI LẠI */}
              {currentUser?.role === 'requester' && req.requesterId === currentUser.id && (req.status === 'pending_approval' || req.status === 'rejected') && (
                <div className="space-y-3">
                  {isEditing ? (
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-emerald-600 h-14 font-black rounded-2xl text-white shadow-lg gap-2" onClick={handleResend}>
                        <Send className="h-5 w-5" /> CẬP NHẬT & GỬI LẠI
                      </Button>
                      <Button variant="ghost" className="h-14 w-14 rounded-2xl text-slate-400" onClick={() => setIsEditing(false)}>
                        <X className="h-6 w-6" />
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5 h-14 font-black rounded-2xl shadow-sm gap-2" onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-5 w-5" /> CHỈNH SỬA & GỬI LẠI PHIẾU
                    </Button>
                  )}
                  {req.status === 'rejected' && !isEditing && (
                    <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                      <p className="text-[10px] font-black text-rose-600 uppercase mb-1">Lý do từ chối:</p>
                      <p className="text-sm font-bold text-rose-800">{req.rejectionReason}</p>
                    </div>
                  )}
                </div>
              )}

              {/* QUẢN LÝ ĐƠN VỊ - PHÊ DUYỆT BAN ĐẦU */}
              {currentUser?.role === 'unit_leader' && req.status === 'pending_approval' && (
                <div className="flex flex-col gap-3">
                  <Button className="w-full bg-emerald-600 h-14 font-black rounded-2xl text-white shadow-lg" onClick={() => handleAction('approved')}>PHÊ DUYỆT CHUYỂN PHÒNG CSVC</Button>
                  <Button variant="ghost" className="w-full text-rose-500 font-black h-12 rounded-2xl uppercase text-[10px] tracking-widest" onClick={() => handleAction('rejected', { rejectionReason: 'Từ chối tại đơn vị.' })}>TỪ CHỐI PHÊ DUYỆT</Button>
                </div>
              )}

              {/* QUẢN LÝ CSVC - PHÂN CÔNG KỸ THUẬT */}
              {currentUser?.role === 'csvc_manager' && req.status === 'approved' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Chọn nhân viên kỹ thuật thực hiện</Label>
                    <Select onValueChange={setSelectedTechId} value={selectedTechId}>
                      <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold">
                        <SelectValue placeholder="Chọn từ danh sách..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-xl">
                        {technicians.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-primary h-14 font-black rounded-2xl text-white shadow-lg" disabled={!selectedTechId} onClick={() => {
                     const tech = technicians.find(t => t.id === selectedTechId);
                     handleAction('assigned', { technicianId: tech?.id, technicianName: tech?.name });
                  }}>GIAO NHIỆM VỤ</Button>
                </div>
              )}

              {/* QUẢN LÝ CSVC - DUYỆT HOÀN THÀNH KỸ THUẬT */}
              {currentUser?.role === 'csvc_manager' && req.status === 'completed' && (
                <div className="space-y-4">
                   <div className="bg-blue-50 p-5 rounded-3xl flex items-start gap-4 border border-blue-100">
                      <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] font-bold text-blue-700 leading-relaxed">
                        Kỹ thuật viên đã báo cáo xong. Bạn vui lòng duyệt kết quả kỹ thuật để chuyển về đơn vị sử dụng nghiệm thu cuối cùng.
                      </p>
                   </div>
                   <Button className="w-full bg-emerald-600 h-14 font-black rounded-2xl text-white shadow-lg" onClick={() => handleAction('verified', { csvcManagerApproved: true })}>
                     DUYỆT HOÀN THÀNH KỸ THUẬT
                   </Button>
                </div>
              )}

              {/* NHÂN VIÊN KỸ THUẬT - THỰC HIỆN */}
              {currentUser?.role === 'technician' && req.technicianId === currentUser.id && (
                <>
                  {req.status === 'assigned' && (
                    <Button className="w-full bg-amber-500 h-14 font-black rounded-xl text-white shadow-lg" onClick={() => handleAction('in_progress')}>BẮT ĐẦU SỬA CHỮA</Button>
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
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Báo cáo chi tiết</Label>
                        <Textarea placeholder="Nội dung công việc, linh kiện thay thế..." className="min-h-[120px] rounded-2xl bg-white border-none shadow-sm font-bold p-4" value={report} onChange={e => setReport(e.target.value)} />
                      </div>
                      <Button className="w-full bg-emerald-600 h-14 font-black rounded-2xl text-white shadow-lg" disabled={!report.trim() || !repairType} onClick={() => handleAction('completed', { technicianReport: report, repairType, completedAt: new Date().toISOString() })}>XÁC NHẬN HOÀN THÀNH</Button>
                    </div>
                  )}
                </>
              )}

              {/* NGƯỜI DÙNG - XÁC NHẬN HÀI LÒNG */}
              {currentUser?.role === 'requester' && req.requesterId === currentUser.id && req.status === 'completed' && !req.requesterConfirmed && (
                <Button className="w-full bg-primary h-14 font-black rounded-2xl text-white shadow-lg gap-2" onClick={handleRequesterConfirm}>
                  <ThumbsUp className="h-5 w-5" /> XÁC NHẬN HÀI LÒNG
                </Button>
              )}

              {/* QUẢN LÝ ĐƠN VỊ - NGHIỆM THU & ĐÓNG PHIẾU */}
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
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-tighter">Mức độ: {rating}/5 sao</p>
                  </div>
                  <Button className="w-full bg-emerald-700 h-16 font-black rounded-2xl text-white shadow-xl" onClick={() => handleAction('closed', { rating })}>XÁC NHẬN NGHIỆM THU & ĐÓNG PHIẾU</Button>
                </div>
              )}

              {req.status === 'closed' && (
                <div className="text-center py-10 space-y-4">
                  <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-emerald-800 font-black text-xl uppercase tracking-tighter">Hồ sơ đã hoàn tất</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Đã nghiệm thu & Đóng phiếu lưu trữ</p>
                  </div>
                </div>
              )}

              {req.status === 'rejected' && !isEditing && (
                <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100 space-y-2">
                  <p className="text-rose-700 font-black text-sm uppercase tracking-tighter">Yêu cầu đã bị hủy bỏ</p>
                  <p className="text-xs font-bold text-rose-600">Lý do từ chối: {req.rejectionReason || 'Không có lý do chi tiết.'}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
