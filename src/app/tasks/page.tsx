
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Play, CheckCircle2, Eye, ClipboardPen, Clock, MapPin, HardDrive } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RepairType } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

export default function TasksPage() {
  const { requests, currentUser, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [reportText, setReportText] = useState('');
  const [repairType, setRepairType] = useState<RepairType | ''>('');

  const myTasks = useMemo(() => requests.filter(r => r.technicianId === currentUser?.id), [requests, currentUser?.id]);
  const activeTasks = useMemo(() => myTasks.filter(r => ['assigned', 'in_progress'].includes(r.status)), [myTasks]);
  const finishedTasks = useMemo(() => myTasks.filter(r => ['completed', 'verified', 'closed'].includes(r.status)), [myTasks]);

  const handleStart = (id: string) => {
    updateRequestStatus(id, 'in_progress');
    toast({ title: "Đã bắt đầu làm", description: "Thời gian bắt đầu đã được ghi nhận." });
  };

  const handleSubmitReport = () => {
    if (!reportingId || !reportText.trim() || !repairType) return;
    updateRequestStatus(reportingId, 'completed', { 
      technicianReport: reportText,
      repairType: repairType as RepairType,
      completedAt: new Date().toISOString()
    });
    toast({ title: "Báo cáo hoàn thành", description: "Đã gửi báo cáo lên Phòng CSVC." });
    setReportingId(null);
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
            <Card key={req.id} className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardContent className="p-7">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  <Badge className={cn("text-[9px] font-black uppercase px-3 py-1 border-none", req.status === 'assigned' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600")}>
                    {req.status === 'assigned' ? 'Bước 3: Mới nhận' : 'Bước 4: Đang sửa'}
                  </Badge>
                </div>
                <h3 className="font-black text-lg text-slate-800 mb-4">{req.title}</h3>
                <div className="grid grid-cols-1 gap-3 mb-6 text-[11px] font-bold text-slate-500 uppercase">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-rose-400" /> {req.unit}</p>
                  <p className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-blue-400" /> {req.equipmentName}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/requests/${req.id}`} className="flex-1">
                    <Button variant="ghost" className="w-full h-12 rounded-xl font-black text-[10px] uppercase border-2">Xem chi tiết</Button>
                  </Link>
                  {req.status === 'assigned' ? (
                    <Button className="flex-[2] bg-primary h-12 rounded-xl text-white font-black text-[10px] uppercase shadow-lg shadow-blue-100" onClick={() => handleStart(req.id)}>
                      <Play className="h-4 w-4 mr-2" /> Bắt đầu làm
                    </Button>
                  ) : (
                    <Button className="flex-[2] bg-emerald-600 h-12 rounded-xl text-white font-black text-[10px] uppercase shadow-lg shadow-emerald-100" onClick={() => { setReportingId(req.id); setReportText(''); }}>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Báo cáo hoàn thành
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="finished" className="space-y-4">
          {finishedTasks.map(req => (
            <Link key={req.id} href={`/requests/${req.id}`}>
              <Card className="border-none shadow-sm rounded-2xl bg-white p-6 hover:bg-slate-50 transition-all opacity-90">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-black text-sm text-slate-800 truncate mb-1">{req.title}</p>
                    <Badge variant="outline" className="text-[8px] font-black uppercase">{req.status}</Badge>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300" />
                </div>
              </Card>
            </Link>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!reportingId} onOpenChange={(open) => !open && setReportingId(null)}>
        <DialogContent className="rounded-[3rem] p-8 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-primary uppercase tracking-tighter">Báo cáo hoàn thành</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Hình thức xử lý</Label>
              <Select value={repairType} onValueChange={(val) => setRepairType(val as RepairType)}>
                <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-bold">
                  <SelectValue placeholder="Chọn hình thức..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="repair_only">Sửa chữa tại chỗ</SelectItem>
                  <SelectItem value="replacement">Thay mới thiết bị</SelectItem>
                  <SelectItem value="backup_replacement">Dùng thiết bị dự phòng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Chi tiết công việc</Label>
              <Textarea placeholder="Linh kiện thay thế, nội dung đã sửa..." value={reportText} onChange={(e) => setReportText(e.target.value)} className="min-h-[150px] bg-slate-50 border-none rounded-2xl font-bold p-4" />
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-3">
            <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase border-2" onClick={() => setReportingId(null)}>Hủy</Button>
            <Button className="flex-[2] bg-emerald-600 h-14 rounded-2xl text-white font-black text-[10px] uppercase shadow-xl" onClick={handleSubmitReport} disabled={!reportText.trim() || !repairType}>
              Gửi báo cáo xong
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
