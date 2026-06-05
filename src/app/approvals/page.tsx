
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Eye, Check, X, FileText, CheckCircle2, Clock, Star } from 'lucide-react';
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

  const unitRequests = requests.filter(r => 
    !currentUser?.unit || r.unit === currentUser.unit
  );

  const pendingRequests = unitRequests.filter(r => r.status === 'pending_approval');
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
      description: "Đơn vị đã xác nhận hài lòng và phiếu đã được đóng."
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
          <p className="text-muted-foreground">Quản lý vòng đời phiếu yêu cầu tại đơn vị</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-primary/20 text-primary font-bold">
            <FileText className="h-4 w-4" /> Xuất báo cáo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="approve" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="approve" className="gap-2">
            Chờ phê duyệt
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirm" className="gap-2">
            Chờ nghiệm thu
            {pendingConfirmation.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                {pendingConfirmation.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approve" className="space-y-4 mt-6">
          {pendingRequests.map(req => (
            <Card key={req.id} className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg truncate">{req.title}</h3>
                    <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200">Đang chờ</Badge>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground mt-1">
                    <p>Người yêu cầu: <span className="font-medium text-foreground">{req.requesterName}</span></p>
                    <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> Ngày báo: {new Date(req.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <Eye className="h-4 w-4" /> Chi tiết
                    </Button>
                  </Link>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1 flex-1 md:flex-none font-bold" onClick={() => handleApprove(req.id)}>
                    <Check className="h-4 w-4" /> Duyệt
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-1 flex-1 md:flex-none font-bold" onClick={() => setRejectingId(req.id)}>
                    <X className="h-4 w-4" /> Từ chối
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingRequests.length === 0 && (
            <div className="text-center py-16 bg-card rounded-xl border-2 border-dashed">
              <p className="text-muted-foreground">Không có yêu cầu chờ duyệt.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirm" className="space-y-4 mt-6">
          {pendingConfirmation.map(req => (
            <Card key={req.id} className="border-none shadow-sm overflow-hidden border-l-4 border-l-emerald-500">
              <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg truncate">{req.title}</h3>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Sửa xong</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Kỹ thuật đã xử lý xong. Vui lòng xác nhận kết quả.
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <Eye className="h-4 w-4" /> Xem kết quả
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 gap-1 flex-1 md:flex-none font-bold" 
                    onClick={() => handleOpenRating(req.id)}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Xác nhận hoàn thành
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingConfirmation.length === 0 && (
            <div className="text-center py-16 bg-card rounded-xl border-2 border-dashed">
              <p className="text-muted-foreground">Không có phiếu chờ nghiệm thu.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog Đánh giá nghiệm thu */}
      <Dialog open={!!ratingId} onOpenChange={(open) => !open && setRatingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hoàn thành & Đánh giá</DialogTitle>
            <DialogDescription>Hãy cho chúng tôi biết mức độ hài lòng của bạn về việc xử lý sự cố này.</DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center gap-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={cn(
                    "h-10 w-10 cursor-pointer transition-all",
                    star <= currentRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground hover:text-amber-200"
                  )}
                  onClick={() => setCurrentRating(star)}
                />
              ))}
            </div>
            <p className="text-sm font-bold text-primary uppercase">
              {currentRating === 5 ? "Rất hài lòng" : 
               currentRating === 4 ? "Hài lòng" :
               currentRating === 3 ? "Bình thường" :
               currentRating === 2 ? "Không hài lòng" : "Rất kém"}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRatingId(null)}>Hủy</Button>
            <Button className="bg-emerald-600 font-bold" onClick={handleConfirmAcceptance}>Xác nhận hoàn thành</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lý do từ chối</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Nhập lý do..." 
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingId(null)}>Hủy</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>Xác nhận từ chối</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
