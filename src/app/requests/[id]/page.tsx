
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Wrench, 
  User, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  Printer,
  ShieldAlert,
  HardDrive,
  UserCheck,
  XCircle,
  Clock,
  Star
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
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

export default function RequestDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const { requests, currentUser, updateRequestStatus, users } = useAppStore();
  const [report, setReport] = useState('');
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
    toast({
      title: "Cập nhật thành công",
      description: `Phiếu #${req.id} đã chuyển sang trạng thái mới.`
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_approval': return <Badge className="bg-rose-500">Chờ phê duyệt</Badge>;
      case 'approved': return <Badge className="bg-indigo-500">Đã phê duyệt</Badge>;
      case 'assigned': return <Badge className="bg-blue-500">Đã phân công</Badge>;
      case 'in_progress': return <Badge className="bg-amber-500">Đang thực hiện</Badge>;
      case 'completed': return <Badge className="bg-emerald-500">Kỹ thuật đã xong</Badge>;
      case 'verified': return <Badge className="bg-cyan-600">CSVC đã duyệt hoàn thành</Badge>;
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Print Header */}
      <div className="print-only mb-8 text-center border-b pb-6">
        <h1 className="text-3xl font-bold text-primary mb-2 uppercase">FIXFLOW PRO - PHIẾU YÊU CẦU SỬA CHỮA</h1>
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
                <CardDescription className="flex items-center gap-2 text-foreground font-medium">
                  <Clock className="h-3.5 w-3.5 text-primary" /> Thời gian báo hỏng: {new Date(req.createdAt).toLocaleString('vi-VN')}
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

              {req.aiSuggestions && (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4 no-print">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Sparkles className="h-5 w-5" /> Phân tích FixFlow AI
                  </div>
                  <Separator className="bg-primary/10" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Nguyên nhân dự đoán</p>
                      <ul className="space-y-1.5">
                        {req.aiSuggestions.causes.map((c, i) => (
                          <li key={i} className="text-sm flex items-center gap-2 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Vật tư gợi ý</p>
                      <div className="flex flex-wrap gap-1.5">
                        {req.aiSuggestions.recommendedEquipment.map((eq, i) => (
                          <Badge key={i} variant="secondary" className="bg-white/50 border-primary/10">{eq}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {req.technicianReport && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                  <Label className="text-xs uppercase text-emerald-700 font-extrabold tracking-widest flex items-center gap-2 mb-3">
                    <Wrench className="h-4 w-4" /> Báo cáo kỹ thuật
                  </Label>
                  <p className="text-sm text-emerald-900 leading-relaxed font-medium">
                    {req.technicianReport}
                  </p>
                </div>
              )}

              {req.status === 'closed' && req.rating && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                  <Label className="text-xs uppercase text-amber-700 font-extrabold tracking-widest flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 fill-amber-400" /> Đánh giá hài lòng của đơn vị
                  </Label>
                  <div className="flex flex-col gap-2">
                    <StarRating value={req.rating} readOnly />
                    <p className="text-sm font-medium text-amber-900">
                      Mức độ: {req.rating}/5 sao
                    </p>
                  </div>
                </div>
              )}

              {req.rejectionReason && (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
                  <Label className="text-xs uppercase text-rose-700 font-extrabold mb-3 block tracking-widest">Lý do từ chối</Label>
                  <p className="text-sm text-rose-900 italic font-medium">"{req.rejectionReason}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role Actions - NO PRINT */}
          <Card className="border-none shadow-sm overflow-hidden border-t-4 border-t-accent no-print">
            <CardHeader className="bg-accent/5 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 font-bold uppercase tracking-tight">
                 <ShieldAlert className="h-5 w-5 text-accent" /> Thao tác xử lý
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                {currentUser?.role === 'unit_leader' && req.status === 'pending_approval' && (
                  <div className="flex gap-3">
                    <Button className="bg-primary flex-1 h-12 text-md font-bold" onClick={() => handleAction('approved')}>Duyệt phiếu</Button>
                    <Button variant="destructive" className="flex-1 h-12 text-md font-bold" onClick={() => handleAction('rejected', { rejectionReason: 'Yêu cầu không phù hợp hoặc không nằm trong danh mục CSVC quản lý.' })}>Từ chối</Button>
                  </div>
                )}

                {currentUser?.role === 'unit_leader' && req.status === 'verified' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-sm text-emerald-800 font-bold mb-2">Xác nhận nghiệm thu & Đánh giá:</p>
                      <p className="text-xs text-emerald-600 mb-4">Vui lòng kiểm tra thiết bị và đánh giá mức độ hài lòng về cách xử lý của kỹ thuật viên.</p>
                      
                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">Mức độ hài lòng</Label>
                        <StarRating value={rating} onChange={setRating} />
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="bg-primary flex-1 h-12 text-md font-bold gap-2" onClick={() => handleAction('closed', { rating })}>
                        <CheckCircle2 className="h-5 w-5" /> Nghiệm thu & Đóng phiếu
                      </Button>
                      <Button variant="outline" className="flex-1 h-12 text-md font-bold text-destructive border-destructive/20" onClick={() => handleAction('in_progress')}>
                        Cần sửa lại
                      </Button>
                    </div>
                  </div>
                )}

                {currentUser?.role === 'csvc_manager' && req.status === 'approved' && (
                  <div className="space-y-4">
                    <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Phân công kỹ thuật:</Label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <Select onValueChange={setSelectedTechId} value={selectedTechId}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Chọn kỹ thuật viên..." />
                          </SelectTrigger>
                          <SelectContent>
                            {technicians.map(t => (
                              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="bg-primary h-12 px-8 font-bold" disabled={!selectedTechId} onClick={() => {
                        const tech = technicians.find(t => t.id === selectedTechId);
                        handleAction('assigned', { technicianId: tech?.id, technicianName: tech?.name });
                      }}>
                        Giao việc
                      </Button>
                    </div>
                  </div>
                )}

                {currentUser?.role === 'csvc_manager' && req.status === 'completed' && (
                  <div className="flex gap-3">
                    <Button className="bg-emerald-600 flex-1 h-12 text-md font-bold gap-2" onClick={() => handleAction('verified')}>
                      <CheckCircle2 className="h-5 w-5" /> Duyệt hoàn thành
                    </Button>
                    <Button variant="outline" className="flex-1 h-12 text-md font-bold text-destructive border-destructive/20" onClick={() => handleAction('in_progress')}>
                      Yêu cầu làm lại
                    </Button>
                  </div>
                )}

                {currentUser?.role === 'technician' && req.status === 'assigned' && (
                  <Button className="bg-amber-500 h-14 text-lg font-bold" onClick={() => handleAction('in_progress')}>
                    Bắt đầu sửa chữa
                  </Button>
                )}
                
                {currentUser?.role === 'technician' && req.status === 'in_progress' && (
                  <div className="space-y-4">
                    <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Báo cáo kết quả:</Label>
                    <Textarea placeholder="Mô tả các bước đã xử lý..." className="min-h-[120px]" value={report} onChange={e => setReport(e.target.value)} />
                    <Button className="bg-emerald-600 w-full h-12 text-md font-bold" disabled={!report.trim()} onClick={() => handleAction('completed', { technicianReport: report })}>
                      Gửi báo cáo hoàn thành
                    </Button>
                  </div>
                )}

                {req.status === 'closed' && (
                   <div className="p-6 bg-green-50 rounded-2xl text-green-700 font-bold flex flex-col items-center gap-2 border border-green-200">
                      <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                      Yêu cầu đã hoàn tất và được nghiệm thu.
                   </div>
                )}

                {req.status === 'rejected' && (
                   <div className="p-6 bg-rose-50 rounded-2xl text-rose-700 font-bold flex flex-col items-center gap-2 border border-rose-200">
                      <XCircle className="h-10 w-10 text-rose-500 mb-2" />
                      Yêu cầu đã bị từ chối.
                   </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/5">
              <CardTitle className="text-xs font-black uppercase text-muted-foreground tracking-widest">Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-muted rounded-xl"><User className="h-5 w-5 text-muted-foreground" /></div>
                <div><p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Người yêu cầu</p><p className="text-sm font-bold">{req.requesterName}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-muted rounded-xl"><FileText className="h-5 w-5 text-muted-foreground" /></div>
                <div><p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Đơn vị</p><p className="text-sm font-bold">{req.unit}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-muted rounded-xl"><HardDrive className="h-5 w-5 text-muted-foreground" /></div>
                <div><p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Thiết bị</p><p className="text-sm font-bold">{req.equipmentName}</p></div>
              </div>
              <Separator className="bg-muted/30" />
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-primary/5 rounded-xl"><Wrench className="h-5 w-5 text-primary" /></div>
                <div><p className="text-[10px] uppercase font-bold text-primary tracking-wider">Kỹ thuật viên</p><p className="text-sm font-bold">{req.technicianName || 'Chưa phân công'}</p></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print Footer */}
      <div className="print-only mt-12 grid grid-cols-3 text-center gap-8">
        <div className="space-y-16"><p className="font-bold">Người yêu cầu</p><p className="text-sm">(Ký tên)</p></div>
        <div className="space-y-16"><p className="font-bold">Kỹ thuật viên</p><p className="text-sm">(Ký tên)</p></div>
        <div className="space-y-16"><p className="font-bold">Xác nhận đơn vị</p><p className="text-sm">(Ký tên, đóng dấu)</p></div>
      </div>
    </div>
  );
}
