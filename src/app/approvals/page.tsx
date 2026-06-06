
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Eye, Check, X, CheckCircle2, Clock, Star, AlertCircle, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

export default function ApprovalsPage() {
  const { requests, currentUser, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  const [ratingId, setRatingId] = useState<string | null>(null);
  const [currentRating, setCurrentRating] = useState(5);

  // Lọc phiếu theo đơn vị của lãnh đạo với logic chuẩn hóa mạnh mẽ
  const unitRequests = useMemo(() => {
    if (!currentUser?.unit) return [];
    
    const normalizedUserUnit = currentUser.unit.trim().toLowerCase();
    
    return requests.filter(r => {
      if (!r.unit) return false;
      const normalizedReqUnit = r.unit.trim().toLowerCase();
      return normalizedReqUnit === normalizedUserUnit;
    });
  }, [requests, currentUser?.unit]);

  // Phiếu chờ duyệt bước 2 (Chờ duyệt đơn vị)
  const pendingRequests = useMemo(() => 
    unitRequests.filter(r => r.status === 'pending_approval'),
    [unitRequests]
  );
  
  // Phiếu chờ nghiệm thu bước 7 (sau khi CSVC đã verified)
  const pendingConfirmation = useMemo(() => 
    unitRequests.filter(r => r.status === 'verified'),
    [unitRequests]
  );

  const handleApprove = (id: string) => {
    updateRequestStatus(id, 'approved');
    toast({
      title: "Đã phê duyệt phiếu",
      description: "Yêu cầu đã được chuyển lên Phòng CSVC để điều phối kỹ thuật."
    });
  };

  const handleOpenRating = (id: string) => {
    setRatingId(id);
    setCurrentRating(5);
  };

  const handleConfirmAcceptance = () => {
    if (!ratingId) return;
    
    updateRequestStatus(ratingId, 'closed', { rating: currentRating });
    toast({
      title: "Đã nghiệm thu & Đóng phiếu",
      description: "Cảm ơn bạn đã phản hồi kết quả thực hiện."
    });
    setRatingId(null);
  };

  const handleReject = () => {
    if (!rejectingId || !rejectionReason.trim()) return;
    
    updateRequestStatus(rejectingId, 'rejected', { rejectionReason });
    toast({
      variant: "destructive",
      title: "Đã từ chối phiếu",
      description: "Yêu cầu đã bị hủy bỏ do không được duyệt tại đơn vị."
    });
    setRejectingId(null);
    setRejectionReason('');
  };

  if (!currentUser?.unit) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-[3rem] card-shadow border-2 border-dashed border-rose-100">
        <div className="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-6">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">Thông tin Đơn vị chưa xác định</h2>
        <p className="text-sm text-slate-500 max-w-md font-medium">
          Tài khoản của bạn chưa được thiết lập thông tin Đơn vị công tác. 
          Vui lòng liên hệ Admin để cập nhật thông tin trước khi thực hiện duyệt phiếu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
            <ShieldCheck className="h-7 w-7 text-primary" />
            Xét duyệt & Nghiệm thu
          </h1>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase px-3">
              <Building2 className="h-3 w-3 mr-1" /> {currentUser.unit}
            </Badge>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">Vai trò: Phó Trưởng đơn vị</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="approve" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-white rounded-2xl shadow-sm border mb-8 max-w-[420px]">
          <TabsTrigger value="approve" className="gap-2 text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
            Chờ phê duyệt
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px] border-none">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirm" className="gap-2 text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
            Chờ nghiệm thu
            {pendingConfirmation.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px] border-none">
                {pendingConfirmation.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approve" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {pendingRequests.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow overflow-hidden group hover:bg-slate-50 transition-all border-l-8 border-l-primary/20">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-lg text-slate-800 truncate">{req.title}</h3>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[9px] font-black uppercase">Bước 2: Duyệt đơn vị</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Người yêu cầu</p>
                      <p className="text-xs font-bold text-slate-700">{req.requesterName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ngày báo hỏng</p>
                      <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-300" /> 
                        {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="ghost" size="sm" className="w-full h-12 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest hover:bg-white">
                      <Eye className="h-4 w-4 mr-2" /> Xem xét
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 h-12 rounded-xl text-white font-black text-[10px] uppercase tracking-widest gap-2 flex-1 md:flex-none shadow-lg shadow-blue-100" 
                    onClick={() => handleApprove(req.id)}
                  >
                    <Check className="h-4 w-4" /> Duyệt phiếu
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-12 rounded-xl font-black text-[10px] uppercase tracking-widest text-rose-500 hover:bg-rose-50 flex-1 md:flex-none" 
                    onClick={() => setRejectingId(req.id)}
                  >
                    <X className="h-4 w-4 mr-2" /> Từ chối
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingRequests.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] card-shadow border-2 border-dashed border-slate-100">
              <ShieldCheck className="h-16 w-16 text-slate-100 mx-auto mb-6" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Hiện không có yêu cầu nào cần phê duyệt tại đơn vị.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirm" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {pendingConfirmation.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow overflow-hidden border-l-8 border-l-emerald-500">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-lg text-slate-800 truncate">{req.title}</h3>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[9px] font-black uppercase">Bước 7: Chờ nghiệm thu</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Phòng CSVC đã hoàn tất kỹ thuật. Phó Trưởng đơn vị vui lòng nghiệm thu thực tế & đóng phiếu lưu trữ.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="ghost" size="sm" className="w-full h-12 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest hover:bg-white">
                      <Eye className="h-4 w-4 mr-2" /> Xem kết quả
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl text-white font-black text-[10px] uppercase tracking-widest gap-2 flex-1 md:flex-none shadow-lg shadow-emerald-100" 
                    onClick={() => handleOpenRating(req.id)}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Nghiệm thu & Đóng
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingConfirmation.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] card-shadow border-2 border-dashed border-slate-100">
              <CheckCircle2 className="h-16 w-16 text-slate-100 mx-auto mb-6" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Hiện không có phiếu nào đang chờ nghiệm thu.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog Đánh giá nghiệm thu (Bước 7) */}
      <Dialog open={!!ratingId} onOpenChange={(open) => !open && setRatingId(null)}>
        <DialogContent className="rounded-[3rem] p-10 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-primary uppercase tracking-tighter">Nghiệm thu & Đóng hồ sơ</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Vui lòng đánh giá mức độ hài lòng về chất lượng sửa chữa của Phòng CSVC
            </DialogDescription>
          </DialogHeader>
          <div className="py-10 flex flex-col items-center gap-6 bg-slate-50 rounded-[2.5rem] my-6">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={cn(
                    "h-12 w-12 cursor-pointer transition-all",
                    star <= currentRating ? "fill-amber-400 text-amber-400 scale-110 drop-shadow-md" : "text-slate-200 hover:text-amber-200"
                  )}
                  onClick={() => setCurrentRating(star)}
                />
              ))}
            </div>
            <div className="text-center space-y-1">
              <p className="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em]">
                {currentRating === 5 ? "Rất hài lòng" : 
                 currentRating === 4 ? "Hài lòng" :
                 currentRating === 3 ? "Bình thường" :
                 currentRating === 2 ? "Không hài lòng" : "Rất kém"}
              </p>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Mức độ: {currentRating}/5 sao</p>
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-4 pt-4">
            <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2" onClick={() => setRatingId(null)}>Quay lại</Button>
            <Button 
              className="flex-[2] bg-emerald-600 hover:bg-emerald-700 h-14 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all active:scale-95" 
              onClick={handleConfirmAcceptance}
            >
              Xác nhận & Đóng phiếu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Từ chối phê duyệt (Bước 2) */}
      <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent className="rounded-[3rem] p-10 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-rose-600 uppercase tracking-tighter">Từ chối yêu cầu</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Lý do từ chối sẽ được gửi trực tiếp đến nhân viên yêu cầu
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Textarea 
              placeholder="Nhập lý do cụ thể (Ví dụ: Sai thông tin thiết bị, Đã được sửa chữa trước đó...)" 
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[140px] rounded-[1.8rem] bg-slate-50 border-none font-bold p-6 focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
          <DialogFooter className="flex flex-row gap-4">
            <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2" onClick={() => setRejectingId(null)}>Hủy</Button>
            <Button 
              variant="destructive" 
              className="flex-[2] h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-100" 
              onClick={handleReject} 
              disabled={!rejectionReason.trim()}
            >
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
