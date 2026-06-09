"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Play, CheckCircle2, ChevronRight, MapPin, Camera, ImagePlus, X, ShieldAlert, Hash } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
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
  const [techQuantity, setTechQuantity] = useState<string>('');
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
    setTechQuantity(req.quantity?.toString() || '');
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
    if (!activeRequest || !reportText.trim() || !repairType || !techQuantity) {
      toast({ variant: "destructive", title: "Thiếu thông tin", description: "Vui lòng điền đầy đủ các thông tin." });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateRequestStatus(activeRequest.id, 'completed', {
        technicianReport: reportText,
        repairType: repairType as RepairType,
        technicianImages: techImages,
        quantity: Number(techQuantity),
        completedAt: new Date().toISOString()
      });
      toast({ title: "Đã hoàn thành", description: "Báo cáo kỹ thuật đã được gửi." });
      setIsReportOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể gửi báo cáo." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-24 animate-slide-up">
      <div className="px-4 mt-6">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Nhiệm vụ của tôi</h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 opacity-80">TRÌNH KỸ THUẬT VIÊN DUE</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-16 p-1.5 bg-white rounded-[2rem] shadow-sm border mb-8 max-w-[420px] mx-4">
          <TabsTrigger value="active" className="rounded-2xl text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
            Đang thực hiện {activeTasks.length > 0 && <Badge variant="destructive" className="ml-1 h-5 w-5 p-0">{activeTasks.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="finished" className="rounded-2xl text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
            Đã hoàn thành
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6 px-4">
          {activeTasks.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[3rem] bg-white overflow-hidden card-shadow active-scale">
              <CardContent className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="h-16 w-16 rounded-[1.8rem] bg-primary/5 flex items-center justify-center border border-primary/10">
                    <Wrench className="h-8 w-8 text-primary" />
                  </div>
                  <Badge className={cn(
                    "text-[9px] font-black uppercase px-4 py-2 border-none rounded-xl",
                    req.status === 'assigned' ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                  )}>
                    {req.status === 'assigned' ? 'Bước 3: Mới giao' : 'Bước 4: Đang làm'}
                  </Badge>
                </div>
                <h3 className="font-black text-xl text-slate-800 mb-2 leading-tight uppercase tracking-tight">
                  <span className="text-primary mr-2">[{req.location}]</span>
                  {req.equipmentName}
                </h3>
                <div className="flex items-center gap-2 mb-8 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                  <MapPin className="h-4 w-4 text-rose-400" /> {req.unit} 
                  <span className="mx-2 opacity-20">|</span>
                  <Hash className="h-4 w-4 text-primary" /> SL: {req.quantity || 1}
                </div>
                <div className="flex gap-4">
                  {req.status === 'assigned' ? (
                    <Button className="flex-1 bg-primary h-16 rounded-2xl text-white font-black text-xs uppercase shadow-xl shadow-primary/10 transition-all active-scale" onClick={() => handleStart(req.id)}>
                      <Play className="h-5 w-5 mr-2" /> Bắt đầu làm
                    </Button>
                  ) : (
                    <Button className="flex-1 bg-secondary h-16 rounded-2xl text-white font-black text-xs uppercase shadow-xl shadow-secondary/10 transition-all active-scale" onClick={() => openReportDialog(req)}>
                      <CheckCircle2 className="h-5 w-5 mr-2" /> Báo cáo xong
                    </Button>
                  )}
                   <Link href={`/requests/${req.id}`} className="h-16 w-16">
                    <Button variant="ghost" className="h-full w-full rounded-2xl bg-slate-50 text-slate-400">
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          {activeTasks.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[4rem] card-shadow border-2 border-dashed border-slate-100 mx-4">
               <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Hiện không có nhiệm vụ xử lý</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="finished" className="space-y-4 px-4">
          {finishedTasks.map(req => (
            <Link key={req.id} href={`/requests/${req.id}`}>
              <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8 hover:bg-slate-50 transition-all active-scale">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-black text-lg text-slate-800 truncate mb-2 uppercase tracking-tight">
                      [{req.location}] {req.equipmentName}
                    </p>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-[9px] font-black uppercase px-3 py-1 border-slate-100 bg-slate-50 text-slate-500 rounded-lg">{req.status}</Badge>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.unit}</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-200">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="rounded-[4rem] p-10 border-none shadow-2xl max-w-lg w-[94vw] overflow-y-auto max-h-[92vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tighter flex items-center gap-3">
              <ShieldAlert className="h-7 w-7 text-accent" /> Báo cáo hoàn thành
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-8 py-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Hình thức xử lý</Label>
              <Select value={repairType} onValueChange={(val) => setRepairType(val as RepairType)}>
                <SelectTrigger className="h-18 rounded-[2rem] bg-slate-50 border-none font-bold text-base px-8 shadow-inner">
                  <SelectValue placeholder="Chọn hình thức..." />
                </SelectTrigger>
                <SelectContent className="rounded-[2.5rem] p-4">
                  <SelectItem value="repair_only" className="rounded-xl h-14 font-bold text-sm mb-1">Sửa chữa tại chỗ</SelectItem>
                  <SelectItem value="backup_replacement" className="rounded-xl h-14 font-bold text-sm mb-1">Thay thiết bị dự phòng</SelectItem>
                  <SelectItem value="pending_purchase" className="rounded-xl h-14 font-bold text-sm mb-1">Chờ mua sắm mới</SelectItem>
                  <SelectItem value="new_replacement" className="rounded-xl h-14 font-bold text-sm">Thay thiết bị mua mới</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Nội dung chi tiết</Label>
              <Textarea 
                placeholder="Nội dung đã làm, linh kiện đã thay..." 
                className="min-h-[140px] rounded-[2.5rem] bg-slate-50 border-none font-bold p-8 leading-relaxed shadow-inner" 
                value={reportText} 
                onChange={e => setReportText(e.target.value)} 
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Số lượng xử lý</Label>
              <div className="relative">
                <Hash className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
                <Input 
                  type="number"
                  min="1"
                  className="h-18 rounded-[2rem] bg-slate-50 border-none font-bold text-base pl-16 pr-6 shadow-inner"
                  value={techQuantity}
                  onChange={e => setTechQuantity(e.target.value)}
                  placeholder="Nhập số lượng..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 tracking-widest">
                <Camera className="h-4 w-4 text-primary" /> Ảnh minh chứng
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {techImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-slate-50 shadow-sm">
                    <Image src={img} alt="Preview" fill className="object-cover" />
                    <button type="button" onClick={() => removeTechImage(idx)} className="absolute top-3 right-3 bg-rose-500 text-white p-2.5 rounded-full shadow-lg"><X className="h-4 w-4" /></button>
                  </div>
                ))}
                <label className="aspect-square rounded-[2rem] border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-primary/5 transition-all bg-primary/5 active-scale">
                  <div className="p-4 bg-white rounded-2xl">
                    <Camera className="h-7 w-7 text-primary" />
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase text-center px-4 leading-tight">Chụp ảnh</span>
                  <input type="file" multiple accept="image/*" capture="environment" className="hidden" onChange={handleTechImageChange} />
                </label>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4 flex flex-col gap-4">
            <Button 
              className="w-full bg-secondary h-20 rounded-[2.5rem] font-black text-white text-lg uppercase tracking-widest shadow-2xl shadow-secondary/10 transition-all active-scale" 
              disabled={isSubmitting || !reportText.trim() || !repairType || !techQuantity} 
              onClick={submitReport}
            >
              {isSubmitting ? "ĐANG GỬI..." : "XÁC NHẬN HOÀN THÀNH"}
            </Button>
            <Button variant="ghost" className="w-full h-12 rounded-2xl font-black text-slate-400 uppercase text-[10px] tracking-widest" onClick={() => setIsReportOpen(false)}>HỦY BỎ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
