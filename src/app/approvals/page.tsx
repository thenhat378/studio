
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Eye, Check, X, CheckCircle2, Clock, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
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

  // Lọc phiếu theo đơn vị của lãnh đạo (không phân biệt hoa thường)
  const unitRequests = requests.filter(r => {
    if (!currentUser?.unit) return true;
    return r.unit?.trim().toLowerCase() === currentUser.unit.trim().toLowerCase();
  });

  // Phiếu chờ duyệt bước 2
  const pendingRequests = unitRequests.filter(r => r.status === 'pending_approval');
  
  // Phiếu chờ nghiệm thu bước 7 (sau khi Quản lý CSVC đã duyệt 'verified')
  const pendingConfirmation = unitRequests.filter(r => r.status === 'verified');

  const handleApprove = (id: string) => {
    updateRequestStatus(id, 'approved');
    toast({
      title: "Đã phê duyệt",
      description: "Yêu cầu đã được chuyển cho Quản lý CSVC để phân công."
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
      title: "Đã nghiệm thu",
      description: "Đã xác nhận hoàn thành & Đóng phiếu yêu cầu. Kỹ thuật viên có thể thực hiện in phiếu."
    });
    setRatingId(null);
  };

  const handleReject = () => {
    if (!rejectingId || !rejectionReason.trim()) return;
    
    updateRequestStatus(rejectingId, 'rejected', { rejectionReason });
    toast({
      variant: "destructive",
      title: "Đã từ chối",
      description: "Yêu cầu đã bị từ chối phê duyệt."
    });
    setRejectingId(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-accent" />
            Xét duyệt & Nghiệm thu ({currentUser?.unit})
          </h1>
          <p className="text-muted-foreground">Quản lý vòng đời phiếu yêu cầu tại đơn vị của bạn</p>
        </div>
      </div>

      <Tabs defaultValue="approve" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-white rounded-2xl shadow-sm border mb-6 max-w-[400px]">
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

        <TabsContent value="approve" className="space-y-4 mt-2">
          {pendingRequests.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2rem] bg-white card-shadow overflow-hidden">
              <CardContent className="p-7 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-black text-lg text-slate-800 truncate">{req.title}</h3>
                    <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 text-[9px] font-black uppercase">Đang chờ duyệt</Badge>
                  </div>
                  <div className="flex flex-col gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    <p>Người yêu cầu: <span className="text-slate-800">{req.requesterName}</span></p>
                    <p className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Ngày báo: {new Date(req.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="ghost" size="sm" className="w-full h-12 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest">
                      <Eye className="h-4 w-4 mr-2" /> Chi tiết
                    </Button>
                  </Link>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl text-white font-black text-[10px] uppercase tracking-widest gap-2 flex-1 md:flex-none" onClick={() => handleApprove(req.id)}>
                    <Check className="h-4 w-4" /> Duyệt
                  </Button>
                  <Button size="sm" variant="destructive" className="h-12 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 flex-1 md:flex-none" onClick={() => setRejectingId(req.id)}>
                    <X className="h-4 w-4" /> Từ chối
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingRequests.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] card-shadow border-2 border-dashed">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Không có yêu cầu chờ duyệt.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirm" className="space-y-4 mt-2">
          {pendingConfirmation.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2rem] bg-white card-shadow overflow-hidden border-l-8 border-l-emerald-500">
              <CardContent className="p-7 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-black text-lg text-slate-800 truncate">{req.title}</h3>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[9px] font-black uppercase">CSVC báo xong</Badge>
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    Phòng CSVC đã duyệt hoàn thành. Lãnh đạo vui lòng xác nhận và đóng phiếu.
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="ghost" size="sm" className="w-full h-12 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest">
                      <Eye className="h-4 w-4 mr-2" /> Kết quả
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 h-12 rounded-xl text-white font-black text-[10px] uppercase tracking-widest gap-2 flex-1 md:flex-none shadow-lg shadow-blue-100" 
                    onClick={() => handleOpenRating(req.id)}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Xác nhận & Đóng
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingConfirmation.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] card-shadow border-2 border-dashed">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Không có phiếu chờ nghiệm thu.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog Đánh giá nghiệm thu */}
      <Dialog open={!!ratingId} onOpenChange={(open) => !open && setRatingId(null)}>
        <DialogContent className="rounded-[3rem] p-10 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-primary uppercase tracking-tighter">Nghiệm thu & Đóng phiếu</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đánh giá mức độ hài lòng về kết quả sửa chữa</DialogDescription>
          </DialogHeader>
          <div className="py-8 flex flex-col items-center gap-4 bg-slate-50 rounded-[2rem] my-4">
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={cn(
                    "h-10 w-10 cursor-pointer transition-all",
                    star <= currentRating ? "fill-amber-400 text-amber-400 scale-110" : "text-slate-200 hover:text-amber-200"
                  )}
                  onClick={() => setCurrentRating(star)}
                />
              ))}
            </div>
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
              {currentRating === 5 ? "Rất hài lòng" : 
               currentRating === 4 ? "Hài lòng" :
               currentRating === 3 ? "Bình thường" :
               currentRating === 2 ? "Không hài lòng" : "Rất kém"}
            </p>
          </div>
          <DialogFooter className="flex flex-row gap-3">
            <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2" onClick={() => setRatingId(null)}>Hủy</Button>
            <Button className="flex-[2] bg-emerald-600 h-14 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-100" onClick={handleConfirmAcceptance}>Xác nhận & Đóng phiếu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Từ chối */}
      <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent className="rounded-[3rem] p-10 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-rose-600 uppercase tracking-tighter">Từ chối yêu cầu</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <Textarea 
              placeholder="Nhập lý do từ chối cụ thể..." 
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[120px] rounded-2xl bg-slate-50 border-none font-bold p-4"
            />
          </div>
          <DialogFooter className="flex flex-row gap-3">
            <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2" onClick={() => setRejectingId(null)}>Hủy</Button>
            <Button variant="destructive" className="flex-[2] h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest" onClick={handleReject} disabled={!rejectionReason.trim()}>Xác nhận từ chối</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
