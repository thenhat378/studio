
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
  X,
  MessageSquareQuote,
  Timer
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
import { format, formatDistanceStrict } from 'date-fns';
import { vi } from 'date-fns/locale';

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
  const [feedback, setFeedback] = useState('');

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
      if (req.requesterFeedback) setFeedback(req.requesterFeedback);
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
    updateRequestStatus(req.id, req.status, { 
      requesterConfirmed: true,
      requesterFeedback: feedback 
    });
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
      rejectionReason: "" 
    });

    setIsEditing(false);
    toast({ title: "Đã gửi lại phiếu", description: "Yêu cầu đã được cập nhật và gửi lại cho Quản lý đơn vị." });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_approval': return <Badge className="bg-rose-500 text-[10px] font-black uppercase px-3 py-1">Chờ duyệt đơn vị</Badge>;
      case 'approved': return <Badge className="bg-indigo-500 text-[10px] font-black uppercase px-3 py-1">Chờ phân công</Badge>;
      case 'assigned': return <Badge className="bg-blue-500 text-[10px] font-black uppercase px-3 py-1">Đã giao kỹ thuật</Badge>;
      case 'in_progress': return <Badge className="bg-amber-500 text-[10px] font-black uppercase px-3 py-1">Đang sửa chữa</Badge>;
      case 'completed': return <Badge className="bg-cyan-600 text-[10px] font-black uppercase px-3 py-1">Kỹ thuật báo xong</Badge>;
      case 'verified': return <Badge className="bg-emerald-600 text-[10px] font-black uppercase px-3 py-1">Chờ nghiệm thu</Badge>;
      case 'closed': return <Badge className="bg-green-700 text-[10px] font-black uppercase px-3 py-1">Đã đóng</Badge>;
      case 'rejected': return <Badge variant="destructive" className="text-[10px] font-black uppercase px-3 py-1">Đã từ chối</Badge>;
      default: return <Badge variant="outline" className="text-[10px] font-black uppercase px-3 py-1">{status}</Badge>;
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

  const canPrint = req.status === 'closed' && (
    currentUser?.role === 'admin' || 
    currentUser?.role === 'technician' || 
    currentUser?.role === 'csvc_manager' || 
    currentUser?.role === 'unit_leader'
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), 'HH:mm - dd/MM/yyyy');
    } catch (e) {
      return "N/A";
    }
  };

  const getDuration = (start?: string, end?: string) => {
    if (!start || !end) return "N/A";
    try {
      return formatDistanceStrict(new Date(start), new Date(end), { locale: vi });
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 pb-20 animate-slide-up">
      <div className="flex items-center justify-between no-print bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-white/20 sticky top-24 z-30">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 font-black text-[10px] uppercase tracking-widest">
          <ChevronLeft className="h-4 w-4" /> Trở về
        </Button>
        {canPrint && (
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 font-black text-[10px] uppercase tracking-widest border-primary text-primary hover:bg-primary/5">
            <Printer className="h-4 w-4" /> In phiếu lưu trữ
          </Button>
        )}
      </div>

      <div className="space-y-4 md:space-y-6">
        <Card className="border-none shadow-sm rounded-[3rem] bg-white overflow-hidden card-shadow border-t-8 border-t-primary/10">
          <CardHeader className="bg-slate-50/50 pb-8 p-8 md:p-10">
            <div className="flex justify-between items-start gap-6">
              <div className="space-y-4 flex-1">
                {isEditing ? (
                  <Input 
                    value={editData.title}
                    onChange={e => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="h-14 text-lg font-black bg-white rounded-2xl border-primary/20"
                    placeholder="Tiêu đề mới..."
                  />
                ) : (
                  <CardTitle className="text-xl md:text-2xl font-black text-slate-800 leading-tight tracking-tight">{req.title}</CardTitle>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/60 p-5 rounded-[2rem] border border-white">
                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                     <Clock className="h-4 w-4 text-slate-400" /> 
                     <span>Báo hỏng:</span>
                     <span className="text-slate-800 ml-auto">{formatDate(req.createdAt)}</span>
                   </div>
                   {req.completedAt && (
                     <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
                       <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 
                       <span>Hoàn thành kỹ thuật:</span>
                       <span className="text-emerald-700 ml-auto">{formatDate(req.completedAt)}</span>
                     </div>
                   )}
                   {req.assignedAt && (
                     <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-tighter col-span-full border-t border-slate-100 pt-2 mt-1">
                       <Timer className="h-4 w-4 text-blue-400" /> 
                       <span>Nhận việc lúc:</span>
                       <span className="text-blue-700 ml-auto">{formatDate(req.assignedAt)}</span>
                     </div>
                   )}
                   {req.assignedAt && req.completedAt && (
                     <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-tighter col-span-full">
                       <Timer className="h-4 w-4 text-indigo-400" /> 
                       <span>Tổng thời gian xử lý:</span>
                       <span className="text-indigo-800 ml-auto">{getDuration(req.assignedAt, req.completedAt)}</span>
                     </div>
                   )}
                </div>

                <div className="flex items-center gap-2">
                   {isEditing ? (
                     <Select value={editData.equipmentId} onValueChange={val => setEditData(prev => ({ ...prev, equipmentId: val }))}>
                       <SelectTrigger className="h-12 text-[10px] font-black bg-white rounded-xl w-60">
                         <SelectValue placeholder="Chọn thiết bị..." />
                       </SelectTrigger>
                       <SelectContent className="rounded-2xl">
                         {equipment.map(e => <SelectItem key={e.id} value={e.id} className="rounded-xl font-bold">{e.name}</SelectItem>)}
                       </SelectContent>
                     </Select>
                   ) : (
                     <Badge variant="secondary" className="text-[9px] font-black uppercase px-3 py-1 rounded-lg bg-white border border-slate-100 text-primary">
                       {req.equipmentName}
                     </Badge>
                   )}
                   <Badge variant="secondary" className="text-[9px] font-black uppercase px-3 py-1 rounded-lg bg-white border border-slate-100 text-slate-500">
                     Đơn vị: {req.unit}
                   </Badge>
                </div>
              </div>
              <div className="no-print">
                {getStatusBadge(req.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-8 md:p-10 pt-0">
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100">
              <Label className="text-[10px] font-black uppercase text-slate-400 mb-3 block tracking-widest ml-1">Mô tả sự cố từ {req.requesterName}:</Label>
              {isEditing ? (
                <Textarea 
                  value={editData.description}
                  onChange={e => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[120px] bg-white rounded-[2rem] font-bold p-6 border-primary/10 leading-relaxed shadow-sm"
                />
              ) : (
                <p className="text-sm md:text-base font-bold text-slate-700 leading-relaxed">{req.description}</p>
              )}
            </div>

            {req.images && req.images.length > 0 && (
              <div className="space-y-4 no-print">
                <Label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-widest ml-1">
                  <ImageIcon className="h-4 w-4 text-primary" /> Hình ảnh minh chứng:
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {req.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-[2.5rem] overflow-hidden border-2 border-slate-50 shadow-sm group">
                      <Image src={img} alt={`Incident photo ${idx + 1}`} fill className="object-cover transition-transform group-hover:scale-105" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {req.technicianReport && (
              <div className="bg-blue-50/50 p-6 md:p-8 rounded-[2.5rem] border border-blue-100 space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <Wrench className="h-5 w-5 text-blue-500" />
                     <Label className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Báo cáo kỹ thuật ({req.technicianName}):</Label>
                   </div>
                   <Badge className="bg-blue-500 text-[9px] font-black uppercase px-3 py-1">{getRepairTypeText(req.repairType)}</Badge>
                </div>
                <p className="text-sm md:text-base font-bold text-blue-900 leading-relaxed bg-white/50 p-6 rounded-2xl border border-blue-50">{req.technicianReport}</p>
              </div>
            )}

            {req.requesterConfirmed && (
              <div className="bg-emerald-50/50 p-6 md:p-8 rounded-[2.5rem] border border-emerald-100 space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-emerald-500" />
                  <Label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Phản hồi từ người dùng:</Label>
                </div>
                <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-2 text-[10px] font-black text-emerald-700 uppercase">
                     <Check className="h-4 w-4" /> Đã xác nhận hài lòng
                   </div>
                   {req.requesterFeedback && (
                     <p className="text-sm font-bold text-emerald-900 italic bg-white/50 p-6 rounded-2xl border border-emerald-50 leading-relaxed">
                       "{req.requesterFeedback}"
                     </p>
                   )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 no-print pt-4">
              {[
                { label: 'Đơn vị Duyệt', active: req.status !== 'pending_approval' && req.status !== 'rejected', icon: ShieldCheck },
                { label: 'CSVC Giao việc', active: !!req.technicianId, icon: Wrench },
                { label: 'Hoàn tất hồ sơ', active: req.status === 'closed', icon: CheckCircle2 }
              ].map((step, i) => (
                <div key={i} className={cn(
                  "flex flex-col items-center gap-3 p-4 md:p-6 rounded-[2rem] border transition-all duration-500",
                  step.active 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm" 
                    : "bg-slate-50/50 border-slate-100 text-slate-300"
                )}>
                  <step.icon className={cn("h-6 w-6 md:h-8 md:w-8", step.active ? "text-emerald-500 animate-pulse" : "text-slate-200")} />
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-center">{step.label}</span>
                </div>
              ))}
            </div>

            <div className="print-only mt-24 grid grid-cols-2 gap-20 text-center">
               <div className="space-y-24">
                  <p className="font-black text-base">ĐƠN VỊ SỬ DỤNG</p>
                  <p className="text-[10px] text-slate-400 italic font-medium">(Ký và ghi rõ họ tên)</p>
               </div>
               <div className="space-y-24">
                  <p className="font-black text-base">NHÂN VIÊN KỸ THUẬT</p>
                  <p className="text-[10px] text-slate-400 italic font-medium">(Ký và ghi rõ họ tên)</p>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[3rem] bg-white overflow-hidden card-shadow no-print border-t-8 border-t-accent/10">
          <CardHeader className="bg-slate-50/50 py-6 px-8 md:px-10">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-slate-800">
              <ShieldAlert className="h-5 w-5 text-accent" /> Thao tác nghiệp vụ xử lý
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 md:p-10">
            <div className="space-y-6">
              {currentUser?.role === 'requester' && req.requesterId === currentUser.id && (
                <>
                  {(req.status === 'pending_approval' || req.status === 'rejected') && (
                    <div className="space-y-4">
                      {isEditing ? (
                        <div className="flex gap-4">
                          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-16 font-black rounded-[1.8rem] text-white shadow-xl gap-2 transition-all active:scale-95" onClick={handleResend}>
                            <Send className="h-5 w-5" /> CẬP NHẬT & GỬI LẠI
                          </Button>
                          <Button variant="ghost" className="h-16 w-16 rounded-[1.8rem] text-slate-400 bg-slate-100" onClick={() => setIsEditing(false)}>
                            <X className="h-6 w-6" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary/5 h-16 font-black rounded-[1.8rem] shadow-sm gap-2 transition-all active:scale-95" onClick={() => setIsEditing(true)}>
                          <Edit3 className="h-5 w-5" /> CHỈNH SỬA & GỬI LẠI PHIẾU
                        </Button>
                      )}
                    </div>
                  )}

                  {(req.status === 'completed' || req.status === 'verified') && !req.requesterConfirmed && (
                    <div className="space-y-4 p-8 border-2 border-dashed border-primary/20 rounded-[2.5rem] bg-primary/5">
                      <div className="flex items-center gap-3 mb-2">
                        <MessageSquareQuote className="h-6 w-6 text-primary" />
                        <h4 className="font-black text-sm text-primary uppercase tracking-tighter">Phản hồi & Xác nhận hài lòng</h4>
                      </div>
                      <Textarea 
                        placeholder="Nhập ý kiến phản hồi của bạn..." 
                        className="min-h-[100px] rounded-[1.5rem] bg-white border-none shadow-sm font-bold p-5"
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                      />
                      <Button className="w-full bg-primary h-16 rounded-[1.8rem] text-white font-black uppercase tracking-widest gap-2 shadow-2xl shadow-primary/20 active:scale-95 transition-all" onClick={handleRequesterConfirm}>
                        <ThumbsUp className="h-5 w-5" /> Xác nhận hài lòng
                      </Button>
                    </div>
                  )}
                </>
              )}

              {currentUser?.role === 'unit_leader' && req.status === 'pending_approval' && (
                <div className="flex flex-col gap-4">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-16 font-black rounded-[1.8rem] text-white shadow-xl transition-all active:scale-95" onClick={() => handleAction('approved')}>PHÊ DUYỆT CHUYỂN PHÒNG CSVC</Button>
                  <Button variant="ghost" className="w-full text-rose-500 font-black h-14 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-rose-50" onClick={() => handleAction('rejected', { rejectionReason: 'Từ chối tại đơn vị.' })}>TỪ CHỐI PHÊ DUYỆT</Button>
                </div>
              )}

              {currentUser?.role === 'csvc_manager' && req.status === 'approved' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Chọn nhân viên kỹ thuật thực hiện</Label>
                    <Select onValueChange={setSelectedTechId} value={selectedTechId}>
                      <SelectTrigger className="h-16 rounded-[1.8rem] bg-slate-50 border-none font-bold px-6 shadow-sm">
                        <SelectValue placeholder="Chọn từ danh sách..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-[2rem] border-none shadow-2xl p-2">
                        {technicians.map(t => <SelectItem key={t.id} value={t.id} className="rounded-xl h-12 font-bold">{t.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-primary h-16 font-black rounded-[1.8rem] text-white shadow-xl shadow-primary/20 transition-all active:scale-95" disabled={!selectedTechId} onClick={() => {
                     const tech = technicians.find(t => t.id === selectedTechId);
                     handleAction('assigned', { technicianId: tech?.id, technicianName: tech?.name });
                  }}>GIAO NHIỆM VỤ KỸ THUẬT</Button>
                </div>
              )}

              {currentUser?.role === 'csvc_manager' && req.status === 'completed' && (
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-16 font-black rounded-[1.8rem] text-white shadow-xl transition-all active:scale-95" onClick={() => handleAction('verified', { csvcManagerApproved: true })}>
                  DUYỆT HOÀN THÀNH KỸ THUẬT
                </Button>
              )}

              {currentUser?.role === 'technician' && req.technicianId === currentUser.id && (
                <>
                  {req.status === 'assigned' && (
                    <Button className="w-full bg-amber-500 h-16 font-black rounded-[1.8rem] text-white shadow-xl transition-all active:scale-95" onClick={() => handleAction('in_progress')}>BẮT ĐẦU SỬA CHỮA</Button>
                  )}
                  {req.status === 'in_progress' && (
                    <div className="space-y-6 p-8 border-2 border-dashed rounded-[3rem] bg-slate-50 shadow-inner">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Báo cáo chi tiết công việc</Label>
                        <Textarea placeholder="Nội dung công việc, linh kiện thay thế..." className="min-h-[140px] rounded-[2rem] bg-white border-none shadow-sm font-bold p-6 leading-relaxed" value={report} onChange={e => setReport(e.target.value)} />
                      </div>
                      <Button className="w-full bg-emerald-600 h-16 font-black rounded-[1.8rem] text-white shadow-xl transition-all active:scale-95" disabled={!report.trim()} onClick={() => handleAction('completed', { technicianReport: report, completedAt: new Date().toISOString() })}>XÁC NHẬN HOÀN THÀNH</Button>
                    </div>
                  )}
                </>
              )}

              {currentUser?.role === 'unit_leader' && req.status === 'verified' && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-6 py-10 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner">
                    <div className="flex gap-4">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={cn("h-12 w-12 cursor-pointer transition-all", s <= rating ? "fill-amber-400 text-amber-400 scale-110 drop-shadow-md" : "text-slate-200")} onClick={() => setRating(s)} />
                      ))}
                    </div>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-tighter">Đánh giá chất lượng phục vụ: {rating}/5 sao</p>
                  </div>
                  <Button className="w-full bg-emerald-700 hover:bg-emerald-800 h-18 rounded-[2rem] font-black text-lg text-white shadow-2xl transition-all active:scale-95" onClick={() => handleAction('closed', { rating })}>XÁC NHẬN NGHIỆM THU & ĐÓNG PHIẾU</Button>
                </div>
              )}

              {req.status === 'closed' && (
                <div className="text-center py-12 bg-emerald-50/30 rounded-[3rem] border-2 border-dashed border-emerald-100">
                  <p className="text-emerald-800 font-black text-2xl uppercase tracking-tighter">Hồ sơ đã hoàn tất</p>
                  <p className="text-[10px] text-emerald-600/60 font-black uppercase tracking-[0.2em]">Đã nghiệm thu & Đóng hồ sơ lưu trữ</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
