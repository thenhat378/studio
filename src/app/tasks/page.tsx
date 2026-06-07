
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Play, CheckCircle2, ChevronRight, MapPin, Camera, ImagePlus, X, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { RepairType, RepairRequest } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { compressImage } from '@/lib/image-utils';
import Image from 'next/image';

export default function TasksPage() {
  const { requests, currentUser, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  
  // Dialog State
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<RepairRequest | null>(null);
  const [reportText, setReportText] = useState('');
  const [repairType, setRepairType] = useState<RepairType | ''>('');
  const [techImages, setTechImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myTasks = useMemo(() => requests.filter(r => r.technicianId === currentUser?.id), [requests, currentUser?.id]);
  const activeTasks = useMemo(() => myTasks.filter(r => ['assigned', 'in_progress'].includes(r.status)), [myTasks]);
  const finishedTasks = useMemo(() => myTasks.filter(r => ['completed', 'verified', 'closed'].includes(r.status)), [myTasks]);

  const handleStart = (id: string) => {
    updateRequestStatus(id, 'in_progress');
    toast({ title: "Đã bắt đầu làm", description: "Thời gian bắt đầu đã được ghi nhận." });
  };

  const openReportDialog = (req: RepairRequest) => {
    setActiveRequest(req);
    setReportText(req.technicianReport || '');
    setRepairType(req.repairType || '');
    setTechImages(req.technicianImages || []);
    setIsReportOpen(true);
  };

  const handleTechImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const originalDataUrl = reader.result as string;
        try {
          const compressed = await compressImage(originalDataUrl, 1280, 1280, 0.7);
          setTechImages(prev => [...prev, compressed]);
        } catch (err) {
          console.error("Compression error:", err);
          setTechImages(prev => [...prev, originalDataUrl]);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const removeTechImage = (index: number) => {
    setTechImages(prev => prev.filter((_, i) => i !== index));
  };

  const submitReport = async () => {
    if (!activeRequest || !reportText.trim() || !repairType) return;
    setIsSubmitting(true);
    try {
      await updateRequestStatus(activeRequest.id, 'completed', {
        technicianReport: reportText,
        repairType: repairType as RepairType,
        technicianImages: techImages,
        completedAt: new Date().toISOString()
      });
      toast({ title: "Đã báo cáo hoàn thành", description: "Yêu cầu đã được chuyển lên Quản lý CSVC duyệt." });
      setIsReportOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể gửi báo cáo lúc này." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Nhiệm vụ của tôi</h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vai trò: Nhân viên kỹ thuật</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-white rounded-2xl shadow-sm border mb-6 max-w-[400px]">
          <TabsTrigger value="active" className="text-[10px] font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
            Nhiệm vụ hiện tại
            {activeTasks.length > 0 && <Badge variant="destructive" className="ml-1 h-5 w-5 p-0">{activeTasks.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="finished" className="text-[10px] font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
            Lịch sử & In ấn
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeTasks.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden card-shadow">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                    <Wrench className="h-7 w-7 text-primary" />
                  </div>
                  <Badge className={cn(
                    "text-[9px] font-black uppercase px-4 py-1.5 border-none rounded-lg",
                    req.status === 'assigned' ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                  )}>
                    {req.status === 'assigned' ? 'Bước 3: Mới nhận' : 'Bước 4: Đang sửa'}
                  </Badge>
                </div>
                <h3 className="font-black text-lg text-slate-800 mb-2 leading-tight uppercase tracking-tight">
                  <span className="text-primary mr-2">[{req.location}]</span>
                  {req.equipmentName} / <span className="text-slate-400 font-bold">{req.unit}</span>
                </h3>
                <div className="flex items-center gap-2 mb-6 text-[11px] font-bold text-slate-500 uppercase">
                  <MapPin className="h-4 w-4 text-rose-400" /> {req.location}
                </div>
                <div className="flex gap-3">
                  <Link href={`/requests/${req.id}`} className="flex-1">
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase border-2 hover:bg-slate-50">Chi tiết</Button>
                  </Link>
                  {req.status === 'assigned' ? (
                    <Button className="flex-[2] bg-primary h-14 rounded-2xl text-white font-black text-[10px] uppercase shadow-xl shadow-primary/10 transition-all active:scale-95" onClick={() => handleStart(req.id)}>
                      <Play className="h-4 w-4 mr-2" /> Bắt đầu làm
                    </Button>
                  ) : (
                    <Button className="flex-[2] bg-secondary h-14 rounded-2xl text-white font-black text-[10px] uppercase shadow-xl shadow-secondary/10 transition-all active:scale-95" onClick={() => openReportDialog(req)}>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Báo cáo hoàn thành
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {activeTasks.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] card-shadow border-2 border-dashed border-slate-100">
               <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Hiện không có nhiệm vụ xử lý</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="finished" className="space-y-4">
          {finishedTasks.map(req => (
            <Link key={req.id} href={`/requests/${req.id}`}>
              <Card className="border-none shadow-sm rounded-[2rem] bg-white p-6 hover:bg-slate-50 transition-all active:scale-[0.98]">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-black text-base text-slate-800 truncate mb-1 uppercase tracking-tight">
                      [{req.location}] {req.equipmentName}
                    </p>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-[9px] font-black uppercase px-2 py-0.5 border-slate-200 text-slate-500">{req.status}</Badge>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{req.unit}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300" />
                </div>
              </Card>
            </Link>
          ))}
        </TabsContent>
      </Tabs>

      {/* Report Dialog for Technicians */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="rounded-[3rem] p-8 md:p-10 border-none shadow-2xl max-w-lg w-[90vw] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-primary uppercase tracking-tighter flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 text-accent" /> Báo cáo & Hoàn thành
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Hình thức xử lý</Label>
              <Select value={repairType} onValueChange={(val) => setRepairType(val as RepairType)}>
                <SelectTrigger className="h-16 rounded-[1.8rem] bg-slate-50 border-none font-bold px-6 shadow-sm">
                  <SelectValue placeholder="Chọn hình thức..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="repair_only" className="rounded-xl font-bold">Sửa chữa tại chỗ</SelectItem>
                  <SelectItem value="backup_replacement" className="rounded-xl font-bold">Thay thiết bị dự phòng</SelectItem>
                  <SelectItem value="pending_purchase" className="rounded-xl font-bold">Chờ mua sắm mới</SelectItem>
                  <SelectItem value="new_replacement" className="rounded-xl font-bold">Thay thế bằng thiết bị mua mới</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Chi tiết công việc</Label>
              <Textarea 
                placeholder="Nội dung đã làm, linh kiện đã thay..." 
                className="min-h-[140px] rounded-[2rem] bg-slate-50 border-none font-bold p-6 leading-relaxed" 
                value={reportText} 
                onChange={e => setReportText(e.target.value)} 
              />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2 tracking-widest">
                <Camera className="h-4 w-4 text-primary" /> Hình ảnh minh chứng (Tự động nén)
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {techImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-slate-50 group shadow-sm">
                    <Image src={img} alt="Preview" fill className="object-cover" />
                    <button type="button" onClick={() => removeTechImage(idx)} className="absolute top-2 right-2 bg-rose-500 text-white p-2 rounded-full shadow-lg"><X className="h-4 w-4" /></button>
                  </div>
                ))}
                <label className="aspect-square rounded-[2rem] border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-all bg-primary/5 active:scale-95 shadow-sm">
                  <Camera className="h-8 w-8 text-primary" />
                  <span className="text-[10px] font-black text-primary uppercase text-center px-4 leading-tight">Máy ảnh</span>
                  <input type="file" multiple accept="image/*" capture="environment" className="hidden" onChange={handleTechImageChange} />
                </label>
                <label className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                  <ImagePlus className="h-8 w-8 text-slate-300" />
                  <span className="text-[10px] font-black text-slate-400 uppercase">Thư viện</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleTechImageChange} />
                </label>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4 flex flex-col gap-3 sm:flex-col">
            <Button 
              className="w-full bg-secondary h-18 rounded-[2rem] font-black text-white text-base uppercase tracking-widest shadow-2xl shadow-secondary/10 transition-all active:scale-95" 
              disabled={isSubmitting || !reportText.trim() || !repairType} 
              onClick={submitReport}
            >
              {isSubmitting ? "Đang gửi..." : "Xác nhận hoàn thành"}
            </Button>
            <Button variant="ghost" className="w-full h-12 rounded-2xl font-black text-slate-400 uppercase text-[10px]" onClick={() => setIsReportOpen(false)}>Hủy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
