
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
  UserCheck
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

export default function RequestDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const { requests, currentUser, updateRequestStatus, users } = useAppStore();
  const [report, setReport] = useState('');
  const [selectedTechId, setSelectedTechId] = useState('');

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
    toast({
      title: "Cập nhật thành công",
      description: `Phiếu đã chuyển sang trạng thái: ${status}`
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_approval': return <Badge className="bg-rose-500">Chờ phê duyệt</Badge>;
      case 'approved': return <Badge className="bg-indigo-500">Đã phê duyệt</Badge>;
      case 'assigned': return <Badge className="bg-blue-500">Đã phân công</Badge>;
      case 'in_progress': return <Badge className="bg-amber-500">Đang thực hiện</Badge>;
      case 'completed': return <Badge className="bg-emerald-500">Kỹ thuật đã xong</Badge>;
      case 'verified': return <Badge className="bg-green-600">Đã nghiệm thu</Badge>;
      case 'rejected': return <Badge variant="destructive">Đã từ chối</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold truncate">Chi tiết phiếu {req.id}</h1>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Printer className="h-4 w-4" /> In phiếu
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{req.title}</CardTitle>
                {getStatusBadge(req.status)}
              </div>
              <CardDescription>Cập nhật lần cuối: {new Date(req.createdAt).toLocaleString('vi-VN')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-xs uppercase text-muted-foreground font-bold">Mô tả sự cố từ người dùng</Label>
                <p className="mt-1 text-sm bg-accent/5 p-4 rounded-lg border border-accent/10 leading-relaxed italic">
                  "{req.description}"
                </p>
              </div>

              {req.aiSuggestions && (
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Sparkles className="h-4 w-4" /> Phân tích bởi FixFlow AI
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-semibold">CÁC NGUYÊN NHÂN CÓ THỂ:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {req.aiSuggestions.causes.map((c, i) => (
                        <li key={i} className="text-xs flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-accent" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {req.technicianReport && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                  <Label className="text-xs uppercase text-emerald-700 font-bold flex items-center gap-2 mb-2">
                    <Wrench className="h-4 w-4" /> Báo cáo hoàn thành từ kỹ thuật
                  </Label>
                  <p className="text-sm text-emerald-900 leading-relaxed">
                    {req.technicianReport}
                  </p>
                </div>
              )}

              {req.rejectionReason && (
                <div className="bg-rose-50 border border-rose-100 rounded-lg p-4">
                  <Label className="text-xs uppercase text-rose-700 font-bold mb-2 block">Lý do từ chối phê duyệt</Label>
                  <p className="text-sm text-rose-900 italic">"{req.rejectionReason}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role Actions Container */}
          <Card className="border-none shadow-sm overflow-hidden border-t-4 border-t-accent">
            <CardHeader className="bg-accent/5 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                 <ShieldAlert className="h-5 w-5 text-accent" /> Thao tác nghiệp vụ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                {/* Lãnh đạo duyệt */}
                {currentUser?.role === 'unit_leader' && req.status === 'pending_approval' && (
                  <div className="flex gap-3">
                    <Button className="bg-primary" onClick={() => handleAction('approved')}>Phê duyệt</Button>
                    <Button variant="destructive" onClick={() => handleAction('rejected', { rejectionReason: 'Không phù hợp mục tiêu đơn vị.' })}>Từ chối</Button>
                  </div>
                )}

                {/* Quản lý CSVC Phân công */}
                {currentUser?.role === 'csvc_manager' && req.status === 'approved' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Chọn kỹ thuật viên phụ trách:</Label>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Select onValueChange={setSelectedTechId} value={selectedTechId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn nhân viên..." />
                          </SelectTrigger>
                          <SelectContent>
                            {technicians.map(t => (
                              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        className="bg-primary gap-2" 
                        disabled={!selectedTechId}
                        onClick={() => {
                          const tech = technicians.find(t => t.id === selectedTechId);
                          handleAction('assigned', { 
                            technicianId: tech?.id, 
                            technicianName: tech?.name 
                          });
                        }}
                      >
                        <UserCheck className="h-4 w-4" /> Giao việc
                      </Button>
                    </div>
                  </div>
                )}

                {/* Quản lý CSVC Nghiệm thu kỹ thuật */}
                {currentUser?.role === 'csvc_manager' && req.status === 'completed' && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Bạn cần kiểm tra kết quả sửa chữa của kỹ thuật viên trước khi hoàn tất phiếu.</p>
                    <div className="flex gap-3">
                      <Button className="bg-emerald-600 gap-2" onClick={() => handleAction('verified')}>
                        <CheckCircle2 className="h-4 w-4" /> Duyệt kết quả & Nghiệm thu
                      </Button>
                      <Button variant="outline" className="text-destructive border-destructive/20" onClick={() => handleAction('in_progress')}>
                        Yêu cầu kỹ thuật kiểm tra lại
                      </Button>
                    </div>
                  </div>
                )}

                {/* Kỹ thuật viên báo cáo */}
                {currentUser?.role === 'technician' && req.status === 'assigned' && (
                  <Button className="bg-amber-500" onClick={() => handleAction('in_progress')}>Bắt đầu thực hiện</Button>
                )}
                {currentUser?.role === 'technician' && req.status === 'in_progress' && (
                  <div className="space-y-3">
                    <Label>Báo cáo kết quả xử lý:</Label>
                    <Textarea 
                      placeholder="Ghi chú các linh kiện đã thay thế, kết quả kiểm tra..." 
                      className="min-h-[100px]"
                      value={report}
                      onChange={e => setReport(e.target.value)}
                    />
                    <Button 
                      className="bg-emerald-600 w-full" 
                      disabled={!report.trim()}
                      onClick={() => handleAction('completed', { technicianReport: report })}
                    >
                      Báo cáo hoàn thành (Gửi Quản lý CSVC)
                    </Button>
                  </div>
                )}

                {/* Người yêu cầu xác nhận cuối cùng (Nếu cần) */}
                {currentUser?.role === 'requester' && req.status === 'verified' && (
                   <div className="p-4 bg-green-50 rounded-lg text-green-700 text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" /> Phiếu đã được Quản lý CSVC nghiệm thu và đóng lại.
                   </div>
                )}

                <div className="text-sm text-muted-foreground italic">
                  {!['pending_approval', 'approved', 'assigned', 'in_progress', 'completed'].includes(req.status) && 
                   req.status !== 'rejected' && req.status !== 'verified' && "Trạng thái này chưa yêu cầu thao tác từ bạn."}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Thông tin phối hợp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full"><User className="h-4 w-4 text-muted-foreground" /></div>
                <div><p className="text-xs text-muted-foreground">Người yêu cầu</p><p className="text-sm font-semibold">{req.requesterName}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full"><FileText className="h-4 w-4 text-muted-foreground" /></div>
                <div><p className="text-xs text-muted-foreground">Đơn vị</p><p className="text-sm font-semibold">{req.unit}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full"><HardDrive className="h-4 w-4 text-muted-foreground" /></div>
                <div><p className="text-xs text-muted-foreground">Thiết bị</p><p className="text-sm font-semibold">{req.equipmentName}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full"><Wrench className="h-4 w-4 text-muted-foreground" /></div>
                <div><p className="text-xs text-muted-foreground">Kỹ thuật viên</p><p className="text-sm font-semibold text-primary">{req.technicianName || 'Đang chờ điều phối'}</p></div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full"><Calendar className="h-4 w-4 text-muted-foreground" /></div>
                <div><p className="text-xs text-muted-foreground">Ngày khởi tạo</p><p className="text-sm font-semibold">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</p></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
