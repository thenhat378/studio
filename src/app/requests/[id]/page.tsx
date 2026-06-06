
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
  Timer,
  Building2,
  MapPin,
  Camera,
  ImagePlus,
  ArrowRight
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
  const [techImages, setTechImages] = useState<string[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    location: '',
    description: '',
    equipmentId: ''
  });

  const req = requests.find(r => r.id === id);
  const technicians = users.filter(u => u.role === 'technician');

  useEffect(() => {
    if (req) {
      setEditData({
        location: req.location || '',
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

  const handleTechImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // Tăng giới hạn lên 500MB (500 * 1024 * 1024 bytes)
      if (file.size > 500 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Ảnh quá lớn",
          description: "Vui lòng chọn ảnh dưới 500MB."
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setTechImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeTechImage = (index: number) => {
    setTechImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRequesterConfirm = () => {
    updateRequestStatus(req.id, req.status, { 
      requesterConfirmed: true,
      requesterFeedback: feedback 
    });
    toast({ title: "Xác nhận hài lòng", description: "Cảm ơn bạn đã phản hồi kết quả sửa chữa!" });
  };

  const handleResend = () => {
    if (!editData.location || !editData.description || !editData.equipmentId) {
      toast({ variant: "destructive", title: "Thiếu thông tin", description: "Vui lòng điền đầy đủ thông tin trước khi gửi lại." });
      return;
    }

    const equip = equipment.find(e => e.id === editData.equipmentId);
    
    updateRequestStatus(req.id, 'pending_approval', {
      location: editData.location,
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
      case 'pending_approval': return <Badge className="bg-accent text-white border-none font-black text-[10px] uppercase px-3 py-1">Chờ duyệt đơn vị</Badge>;
      case 'approved': return <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase px-3 py-1">Chờ phân công</Badge>;
      case 'assigned': return <Badge className="bg-primary/80 text-white border-none font-black text-[10px] uppercase px-3 py-1">Đã giao kỹ thuật</Badge>;
      case 'in_progress': return <Badge className="bg-accent text-white border-none font-black text-[10px] uppercase px-3 py-1 animate-pulse">Đang sửa chữa</Badge>;
      case 'completed': return <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase px-3 py-1">Kỹ thuật báo xong</Badge>;
      case 'verified': return <Badge className="bg-secondary text-white border-none font-black text-[10px] uppercase px-3 py-1">Chờ nghiệm thu</Badge>;
      case 'closed': return <Badge className="bg-secondary/90 text-white border-none font-black text-[10px] uppercase px-3 py-1">Đã đóng hồ sơ</Badge>;
      case 'rejected': return <Badge variant="destructive" className="text-[10px] font-black uppercase px-3 py-1">Đã từ chối</Badge>;
      default: return <Badge variant="outline" className="text-[10px] font-black uppercase px-3 py-1">{status}</Badge>;
    }
  };

  const getRepairTypeText = (type?: RepairType) => {
    switch(type) {
      case 'repair_only': return 'Sửa chữa, khắc phục không cần thay thế thiết bị';
      case 'backup_replacement': return 'Thay mới bằng thiết bị dự phòng';
      case 'pending_purchase': return 'Chờ thiết bị mua mới';
      default: return 'Chưa xác định';
    }
  };

  const handlePrint = () => { window.print(); };

  const canPrint = req.status === 'closed' || req.status === 'verified';

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

  const getFormattedSequenceId = (fullId: string) => {
    const numericPart = fullId.replace(/\D/g, '');
    if (numericPart.length > 0) {
      return numericPart.slice(-7).padStart(7, '0');
    }
    let hash = 0;
    for (let i = 0; i < fullId.length; i++) {
      hash = ((hash << 5) - hash) + fullId.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString().slice(-7).padStart(7, '0');
  };

  // 5 Steps Progress Tracking
  const steps = [
    { label: 'Tạo phiếu', active: true, done: true },
    { label: 'Đơn vị Duyệt', active: req.status !== 'pending_approval' && req.status !== 'rejected', done: !['pending_approval', 'rejected'].includes(req.status) },
    { label: 'CSVC Giao việc', active: !!req.technicianId, done: !!req.technicianId },
    { label: 'Kỹ thuật xong', active: ['completed', 'verified', 'closed'].includes(req.status), done: ['completed', 'verified', 'closed'].includes(req.status) },
    { label: 'Nghiệm thu', active: req.status === 'closed', done: req.status === 'closed' }
  ];

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

      {/* Print View Hidden on Screen */}
      <div className="print-only p-12 space-y-8 bg-white text-black" style={{ fontFamily: '"Times New Roman", Times, serif', minHeight: '29.7cm' }}>
        <div className="flex justify-between items-start">
          <div className="text-center w-[45%] space-y-1">
            <p className="font-normal text-[13px] uppercase">ĐẠI HỌC ĐÀ NẴNG</p>
            <p className="font-bold text-[14px] uppercase">TRƯỜNG ĐẠI HỌC KINH TẾ</p>
            <div className="w-32 h-[1px] bg-black mx-auto mt-1" />
          </div>
          <div className="text-center w-[55%] space-y-1">
            <p className="font-bold text-[14px] uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="font-bold text-[14px]">Độc lập - Tự do - Hạnh phúc</p>
            <div className="w-40 h-[1px] bg-black mx-auto mt-1" />
            <p className="text-[12px] italic pt-3 font-normal">Đà Nẵng, ngày {format(new Date(), 'dd')} tháng {format(new Date(), 'MM')} năm {format(new Date(), 'yyyy')}</p>
          </div>
        </div>

        <div className="text-center space-y-2 pt-10">
          <h1 className="text-xl font-bold uppercase tracking-tight">PHIẾU XÁC NHẬN SỬA CHỮA THIẾT BỊ</h1>
          <p className="text-[12px] font-normal">Số phiếu: {getFormattedSequenceId(req.id)}</p>
        </div>

        <table className="w-full border-collapse border border-black text-[14px]">
          <tbody>
            <tr>
              <td colSpan={2} className="border border-black p-4 bg-gray-50">
                <p className="font-bold uppercase">I. THÔNG TIN NGƯỜI YÊU CẦU</p>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-3 w-1/3">Họ và tên:</td>
              <td className="border border-black p-3">{req.requesterName}</td>
            </tr>
            <tr>
              <td className="border border-black p-3">Đơn vị công tác:</td>
              <td className="border border-black p-3">{req.unit.toUpperCase()}</td>
            </tr>
            <tr>
              <td className="border border-black p-3">Vị trí sự cố:</td>
              <td className="border border-black p-3">{req.location}</td>
            </tr>
            <tr>
              <td className="border border-black p-3">Mô tả hỏng hóc:</td>
              <td className="border border-black p-3">{req.description}</td>
            </tr>
            <tr>
              <td className="border border-black p-3">Thời điểm báo:</td>
              <td className="border border-black p-3">{formatDate(req.createdAt)}</td>
            </tr>

            <tr>
              <td colSpan={2} className="border border-black p-4 bg-gray-50">
                <p className="font-bold uppercase">II. KẾT QUẢ XỬ LÝ KỸ THUẬT</p>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-3">Thiết bị xử lý:</td>
              <td className="border border-black p-3">{req.equipmentName}</td>
            </tr>
            <tr>
              <td className="border border-black p-3">Nhân viên kỹ thuật:</td>
              <td className="border border-black p-3">{req.technicianName || 'N/A'}</td>
            </tr>
            <tr>
              <td className="border border-black p-3">Hình thức xử lý:</td>
              <td className="border border-black p-3">{getRepairTypeText(req.repairType)}</td>
            </tr>
            <tr>
              <td className="border border-black p-3">Nội dung đã làm:</td>
              <td className="border border-black p-3">{req.technicianReport || 'N/A'}</td>
            </tr>
            <tr>
              <td className="border border-black p-3">Thời gian thực hiện:</td>
              <td className="border border-black p-3">
                Từ {formatDate(req.assignedAt)} đến {formatDate(req.completedAt)}
                <br />
                (Tổng thời gian: {getDuration(req.assignedAt, req.completedAt)})
              </td>
            </tr>

            <tr>
              <td colSpan={2} className="border border-black p-4 bg-gray-50">
                <p className="font-bold uppercase">III. Ý KIẾN NGHIỆM THU</p>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-3">Đánh giá hài lòng:</td>
              <td className="border border-black p-3">{req.rating ? `${req.rating}/5 sao` : 'Đã xác nhận hài lòng'}</td>
            </tr>
            <tr>
              <td className="border border-black p-3">Phản hồi thêm:</td>
              <td className="border border-black p-3">{req.requesterFeedback || 'Không'}</td>
            </tr>
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-4 pt-20 text-center text-[14px]">
          <div className="space-y-24">
            <p className="font-bold uppercase">PHÒNG TCHC</p>
            <p className="italic font-normal text-[12px]">(Ký tên và đóng dấu)</p>
          </div>
          <div className="space-y-24">
            <p className="font-bold uppercase">PHÒNG CƠ SỞ VẬT CHẤT</p>
            <p className="italic font-normal text-[12px]">(Ký tên và đóng dấu)</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6 no-print">
        <Card className="border-none shadow-sm rounded-[3rem] bg-white overflow-hidden card-shadow border-t-8 border-t-primary/10">
          <CardHeader className="bg-slate-50/50 pb-8 p-8 md:p-10">
            <div className="flex justify-between items-start gap-6">
              <div className="space-y-4 flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input 
                        value={editData.location}
                        onChange={e => setEditData(prev => ({ ...prev, location: e.target.value }))}
                        className="h-14 text-lg font-black bg-white rounded-2xl border-primary/20 pl-11"
                        placeholder="Vị trí sự cố..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase px-3 py-1 flex items-center gap-1.5 w-fit">
                      <MapPin className="h-3.5 w-3.5" /> {req.location}
                    </Badge>
                    <CardTitle className="text-xl md:text-2xl font-black text-slate-800 leading-tight tracking-tight uppercase">Báo cáo sửa chữa thiết bị</CardTitle>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/60 p-5 rounded-[2rem] border border-white">
                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                     <Clock className="h-4 w-4 text-slate-400" /> 
                     <span>Báo hỏng:</span>
                     <span className="text-slate-800 ml-auto">{formatDate(req.createdAt)}</span>
                   </div>
                   {req.completedAt && (
                     <div className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-tighter">
                       <CheckCircle2 className="h-4 w-4 text-secondary/60" /> 
                       <span>Xong kỹ thuật:</span>
                       <span className="text-secondary ml-auto font-black">{formatDate(req.completedAt)}</span>
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
                       <Wrench className="h-3 w-3 mr-1" /> {req.equipmentName}
                     </Badge>
                   )}
                   <Badge variant="secondary" className="text-[9px] font-black uppercase px-3 py-1 rounded-lg bg-white border border-slate-100 text-slate-500">
                     <Building2 className="h-3 w-3 mr-1" /> {req.unit}
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
              <Label className="text-[10px] font-black uppercase text-slate-400 mb-3 block tracking-widest ml-1">Mô tả cụ thể từ {req.requesterName}:</Label>
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
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-widest ml-1">
                  <ImageIcon className="h-4 w-4 text-primary" /> Hình ảnh báo lỗi:
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
                     <Wrench className="h-5 w-5 text-primary" />
                     <Label className="text-[10px] font-black uppercase text-primary tracking-widest">Báo cáo kỹ thuật ({req.technicianName}):</Label>
                   </div>
                   <Badge className="bg-primary text-[9px] font-black uppercase px-3 py-1">{getRepairTypeText(req.repairType)}</Badge>
                </div>
                <p className="text-sm md:text-base font-bold text-slate-700 leading-relaxed bg-white/50 p-6 rounded-2xl border border-blue-50">{req.technicianReport}</p>
                
                {req.technicianImages && req.technicianImages.length > 0 && (
                  <div className="space-y-4 pt-4">
                    <Label className="text-[10px] font-black uppercase text-primary/60 flex items-center gap-2 tracking-widest ml-1">
                      <ImageIcon className="h-4 w-4" /> Hình ảnh minh chứng sửa chữa:
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {req.technicianImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-[2.5rem] overflow-hidden border-2 border-blue-50 shadow-sm group">
                          <Image src={img} alt={`Repair photo ${idx + 1}`} fill className="object-cover transition-transform group-hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {req.requesterConfirmed && (
              <div className="bg-secondary/10 p-6 md:p-8 rounded-[2.5rem] border border-secondary/20 space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-secondary" />
                  <Label className="text-[10px] font-black uppercase text-secondary tracking-widest">Phản hồi từ người dùng:</Label>
                </div>
                <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase">
                     <Check className="h-4 w-4" /> Đã xác nhận hài lòng
                   </div>
                   {req.requesterFeedback && (
                     <p className="text-sm font-bold text-slate-700 italic bg-white/50 p-6 rounded-2xl border border-secondary/10 leading-relaxed">
                       "{req.requesterFeedback}"
                     </p>
                   )}
                </div>
              </div>
            )}

            {/* Stepper Progress Bar */}
            <div className="flex justify-between gap-1 pt-6 px-2 relative">
              <div className="absolute top-[calc(1.5rem+6px)] left-8 right-8 h-[2px] bg-slate-100 z-0" />
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-3 z-10 flex-1">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-500 border-2",
                    step.done ? "bg-secondary border-secondary text-white shadow-lg shadow-secondary/20" : (step.active ? "bg-white border-primary text-primary" : "bg-white border-slate-100 text-slate-300")
                  )}>
                    {step.done ? <Check className="h-4 w-4" /> : <span className="text-[10px] font-black">{i + 1}</span>}
                  </div>
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-tighter text-center leading-tight transition-colors",
                    step.active ? "text-slate-800" : "text-slate-300"
                  )}>{step.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Controls Card */}
        <Card className="border-none shadow-sm rounded-[3rem] bg-white overflow-hidden card-shadow border-t-8 border-t-accent/10">
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
                          <Button className="flex-1 bg-secondary hover:bg-secondary/90 h-16 font-black rounded-[1.8rem] text-white shadow-xl gap-2 transition-all active:scale-95" onClick={handleResend}>
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
                      <Button className="w-full bg-primary h-16 rounded-[1.8rem] text-white font-black uppercase tracking-widest gap-2 shadow-2xl shadow-primary/20 active-scale" onClick={handleRequesterConfirm}>
                        <ThumbsUp className="h-5 w-5" /> Xác nhận hài lòng
                      </Button>
                    </div>
                  )}
                </>
              )}

              {currentUser?.role === 'unit_leader' && req.status === 'pending_approval' && (
                <div className="flex flex-col gap-4">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 h-16 font-black rounded-[1.8rem] text-white shadow-xl transition-all active:scale-95" onClick={() => handleAction('approved')}>PHÊ DUYỆT CHUYỂN PHÒNG CSVC</Button>
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
                <Button className="w-full bg-secondary hover:bg-secondary/90 h-16 font-black rounded-[1.8rem] text-white shadow-xl transition-all active:scale-95" onClick={() => handleAction('verified', { csvcManagerApproved: true })}>
                  DUYỆT HOÀN THÀNH KỸ THUẬT
                </Button>
              )}

              {currentUser?.role === 'technician' && req.technicianId === currentUser.id && (
                <>
                  {req.status === 'assigned' && (
                    <Button className="w-full bg-accent h-16 font-black rounded-[1.8rem] text-white shadow-xl transition-all active:scale-95" onClick={() => handleAction('in_progress')}>BẮT ĐẦU SỬA CHỮA</Button>
                  )}
                  {req.status === 'in_progress' && (
                    <div className="space-y-6 p-8 border-2 border-dashed rounded-[3rem] bg-slate-50 shadow-inner">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Hình thức xử lý</Label>
                        <Select value={repairType} onValueChange={(val) => setRepairType(val as RepairType)}>
                          <SelectTrigger className="h-16 rounded-[1.8rem] bg-white border-none font-bold px-6 shadow-sm">
                            <SelectValue placeholder="Chọn hình thức..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl">
                            <SelectItem value="repair_only" className="rounded-xl font-bold">Sửa chữa, khắc phục không cần thay thế thiết bị</SelectItem>
                            <SelectItem value="backup_replacement" className="rounded-xl font-bold">Thay mới bằng thiết bị dự phòng</SelectItem>
                            <SelectItem value="pending_purchase" className="rounded-xl font-bold">Chờ thiết bị mua mới</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Báo cáo chi tiết công việc</Label>
                        <Textarea placeholder="Nội dung công việc, linh kiện thay thế..." className="min-h-[140px] rounded-[2rem] bg-white border-none shadow-sm font-bold p-6 leading-relaxed" value={report} onChange={e => setReport(e.target.value)} />
                      </div>

                      <div className="space-y-4 pt-4">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2 tracking-widest">
                          <Camera className="h-4 w-4 text-primary" /> Hình ảnh minh chứng sửa chữa
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          {techImages.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-slate-50 group shadow-sm">
                              <Image src={img} alt="Preview" fill className="object-cover" />
                              <button 
                                type="button"
                                onClick={() => removeTechImage(idx)}
                                className="absolute top-2 right-2 bg-rose-500 text-white p-2 rounded-full shadow-lg"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <label className="aspect-square rounded-[2rem] border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-all bg-primary/5 active:scale-95 shadow-sm">
                            <Camera className="h-8 w-8 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase text-center px-4 leading-tight">Mở máy ảnh</span>
                            <input 
                              type="file" 
                              multiple 
                              accept="image/*" 
                              capture="environment" 
                              className="hidden" 
                              onChange={handleTechImageChange} 
                            />
                          </label>
                          <label className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                            <ImagePlus className="h-8 w-8 text-slate-300" />
                            <span className="text-[10px] font-black text-slate-400 uppercase">Thư viện</span>
                            <input 
                              type="file" 
                              multiple 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleTechImageChange} 
                            />
                          </label>
                        </div>
                      </div>

                      <Button className="w-full bg-secondary h-16 font-black rounded-[1.8rem] text-white shadow-xl transition-all active:scale-95" disabled={!report.trim() || !repairType} onClick={() => handleAction('completed', { technicianReport: report, repairType: repairType as RepairType, technicianImages: techImages, completedAt: new Date().toISOString() })}>XÁC NHẬN HOÀN THÀNH</Button>
                    </div>
                  )}
                </>
              )}

              {currentUser?.role === 'unit_leader' && req.status === 'verified' && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-6 py-10 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner">
                    <div className="flex gap-4">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={cn("h-12 w-12 cursor-pointer transition-all", s <= rating ? "fill-accent text-accent scale-110 drop-shadow-md" : "text-slate-200")} onClick={() => setRating(s)} />
                      ))}
                    </div>
                    <p className="text-[10px] font-black text-accent uppercase tracking-tighter">Đánh giá chất lượng phục vụ: {rating}/5 sao</p>
                  </div>
                  <Button className="w-full bg-secondary h-18 rounded-[2rem] font-black text-lg text-white shadow-2xl transition-all active:scale-95" onClick={() => handleAction('closed', { rating })}>XÁC NHẬN NGHIỆM THU & ĐÓNG PHIẾU</Button>
                </div>
              )}

              {req.status === 'closed' && (
                <div className="text-center py-12 bg-secondary/5 rounded-[3rem] border-2 border-dashed border-secondary/10">
                  <p className="text-secondary font-black text-2xl uppercase tracking-tighter">Hồ sơ đã hoàn tất</p>
                  <p className="text-[10px] text-secondary/60 font-black uppercase tracking-[0.2em]">Đã nghiệm thu & Đóng hồ sơ lưu trữ</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
