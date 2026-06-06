
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Eye, Check, X, Building2, MapPin, AlertCircle, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

export default function ApprovalsPage() {
  const { requests, currentUser, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [ratingId, setRatingId] = useState<string | null>(null);
  const [currentRating, setCurrentRating] = useState(5);

  const unitRequests = useMemo(() => {
    if (!currentUser?.unit) return [];
    const managerUnit = currentUser.unit.trim().toLowerCase();
    return requests.filter(r => {
      if (!r.unit) return false;
      return r.unit.trim().toLowerCase() === managerUnit;
    });
  }, [requests, currentUser?.unit]);

  const pendingRequests = useMemo(() => 
    unitRequests.filter(r => r.status === 'pending_approval'),
    [unitRequests]
  );
  
  const pendingConfirmation = useMemo(() => 
    unitRequests.filter(r => r.status === 'verified'),
    [unitRequests]
  );

  const handleApprove = (id: string) => {
    updateRequestStatus(id, 'approved');
    toast({
      title: "Đã phê duyệt phiếu",
      description: "Yêu cầu đã được chuyển lên Quản lý CSVC để điều phối."
    });
  };

  const handleConfirmAcceptance = () => {
    if (!ratingId) return;
    updateRequestStatus(ratingId, 'closed', { rating: currentRating });
    toast({
      title: "Đã nghiệm thu & Đóng phiếu",
      description: "Hồ sơ sửa chữa đã hoàn tất và được lưu trữ."
    });
    setRatingId(null);
  };

  const handleReject = () => {
    if (!rejectingId || !rejectionReason.trim()) return;
    updateRequestStatus(rejectingId, 'rejected', { rejectionReason });
    toast({
      variant: "destructive",
      title: "Đã từ chối phiếu",
      description: "Yêu cầu đã bị hủy bỏ."
    });
    setRejectingId(null);
    setRejectionReason('');
  };

  if (!currentUser?.unit) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-[3rem] card-shadow border-2 border-dashed border-rose-100 mx-4">
        <div className="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-6">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">Chưa xác định Đơn vị</h2>
        <p className="text-sm text-slate-500 max-w-md font-medium">Vui lòng cập nhật Đơn vị công tác trước khi thực hiện duyệt phiếu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
            <ShieldCheck className="h-7 w-7 text-primary" />
            Duyệt đơn vị
          </h1>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase px-3">
              <Building2 className="h-3 w-3 mr-1" /> {currentUser.unit}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="approve" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-white rounded-2xl shadow-sm border mb-8 max-w-[420px]">
          <TabsTrigger value="approve" className="gap-2 text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
            Bước 2: Phê duyệt
            {pendingRequests.length > 0 && <Badge variant="destructive" className="ml-1 h-5 w-5 p-0">{pendingRequests.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="confirm" className="gap-2 text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
            Bước 7: Nghiệm thu
            {pendingConfirmation.length > 0 && <Badge variant="destructive" className="ml-1 h-5 w-5 p-0">{pendingConfirmation.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approve" className="space-y-4">
          {pendingRequests.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow overflow-hidden border-l-8 border-l-primary/20">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 min-w-0 space-y-3">
                  <h3 className="font-black text-lg text-slate-800 tracking-tight leading-tight uppercase">
                    <span className="text-primary mr-2">[{req.location}]</span>
                    {req.equipmentName} / <span className="text-slate-400">{req.unit}</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Người báo</p>
                      <p className="text-xs font-bold text-slate-700">{req.requesterName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nhóm</p>
                      <p className="text-xs font-bold text-slate-700">{req.category}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="ghost" size="sm" className="w-full h-12 rounded-xl border-2 font-black text-[10px] uppercase">
                      <Eye className="h-4 w-4 mr-2" /> Xem
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 h-12 rounded-xl text-white font-black text-[10px] uppercase gap-2 flex-1 md:flex-none shadow-lg shadow-blue-100" 
                    onClick={() => handleApprove(req.id)}
                  >
                    <Check className="h-4 w-4" /> Duyệt
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-12 rounded-xl font-black text-[10px] uppercase text-rose-500 flex-1 md:flex-none" 
                    onClick={() => setRejectingId(req.id)}
                  >
                    <X className="h-4 w-4 mr-2" /> Từ chối
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingRequests.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] card-shadow border-2 border-dashed border-slate-100">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Không có phiếu chờ duyệt</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirm" className="space-y-4">
          {pendingConfirmation.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow overflow-hidden border-l-8 border-l-emerald-500">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 min-w-0 space-y-3">
                  <h3 className="font-black text-lg text-slate-800 tracking-tight leading-tight uppercase">
                    <span className="text-emerald-600 mr-2">[{req.location}]</span>
                    {req.equipmentName} / <span className="text-slate-400">{req.unit}</span>
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Xong bởi: {req.technicianName}</span>
                    <span className="text-slate-600 font-black">{req.unit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="ghost" size="sm" className="w-full h-12 rounded-xl border-2 font-black text-[10px] uppercase">
                      <Eye className="h-4 w-4 mr-2" /> Xem báo cáo
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl text-white font-black text-[10px] uppercase gap-2 flex-1 md:flex-none" 
                    onClick={() => setRatingId(req.id)}
                  >
                    <ShieldCheck className="h-4 w-4" /> Nghiệm thu
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingConfirmation.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] card-shadow border-2 border-dashed border-slate-100">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Không có phiếu chờ nghiệm thu</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs for Reject and Rating */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <Card className="w-full max-w-md rounded-[3rem] p-8 space-y-6">
            <h3 className="font-black text-xl text-primary uppercase tracking-tighter">Lý do từ chối phiếu</h3>
            <textarea 
              className="w-full h-32 rounded-2xl bg-slate-50 border-none p-5 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
              placeholder="Nhập nội dung từ chối..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black text-xs uppercase" onClick={() => setRejectingId(null)}>Hủy</Button>
              <Button className="flex-1 bg-rose-500 h-14 rounded-2xl text-white font-black text-xs uppercase" onClick={handleReject} disabled={!rejectionReason.trim()}>Xác nhận từ chối</Button>
            </div>
          </Card>
        </div>
      )}

      {ratingId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <Card className="w-full max-w-md rounded-[3rem] p-8 space-y-8 text-center">
            <h3 className="font-black text-xl text-primary uppercase tracking-tighter">Nghiệm thu & Đánh giá</h3>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <Star 
                  key={s} 
                  className={cn("h-10 w-10 cursor-pointer transition-all", s <= currentRating ? "fill-amber-400 text-amber-400" : "text-slate-200")} 
                  onClick={() => setCurrentRating(s)}
                />
              ))}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mức độ hài lòng của đơn vị: {currentRating}/5 sao</p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black text-xs uppercase" onClick={() => setRatingId(null)}>Hủy</Button>
              <Button className="flex-1 bg-emerald-600 h-14 rounded-2xl text-white font-black text-xs uppercase shadow-xl shadow-emerald-100" onClick={handleConfirmAcceptance}>Xác nhận & Đóng phiếu</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

