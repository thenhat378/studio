
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Play, CheckCircle2, Eye, ClipboardPen, Bell, Printer, Search, Clock, MapPin, HardDrive } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function TasksPage() {
  const { requests, currentUser, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [reportText, setReportText] = useState('');
  const [repairType, setRepairType] = useState<RepairType | ''>('');
  const [search, setSearch] = useState('');

  const myTasks = requests.filter(r => r.technicianId === currentUser?.id);
  
  const filteredTasks = myTasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
    t.unit.toLowerCase().includes(search.toLowerCase())
  );

  const activeTasks = filteredTasks.filter(r => r.status !== 'closed' && r.status !== 'rejected');
  const closedTasks = filteredTasks.filter(r => r.status === 'closed');

  const handleStart = (id: string) => {
    updateRequestStatus(id, 'in_progress');
    toast({ title: "Đã bắt đầu!", description: "Ghi nhận bắt đầu xử lý." });
  };

  const handleOpenReport = (id: string) => {
    setReportingId(id);
    setReportText('');
    setRepairType('');
  };

  const handleSubmitReport = () => {
    if (!reportingId || !reportText.trim() || !repairType) return;
    updateRequestStatus(reportingId, 'completed', { 
      technicianReport: reportText,
      repairType: repairType as RepairType,
      completedAt: new Date().toISOString()
    });
    toast({ title: "Đã báo cáo hoàn thành" });
    setReportingId(null);
  };

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'assigned': return { label: 'Mới nhận', color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'in_progress': return { label: 'Đang làm', color: 'text-amber-600', bg: 'bg-amber-50' };
      case 'completed': return { label: 'Đã báo xong', color: 'text-cyan-600', bg: 'bg-cyan-50' };
      case 'verified': return { label: 'Đang nghiệm thu', color: 'text-emerald-600', bg: 'bg-emerald-50' };
      default: return { label: status, color: 'text-slate-500', bg: 'bg-slate-50' };
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Nhiệm vụ</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Danh sách công việc cần xử lý</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Tìm theo tên, thiết bị..." 
            className="pl-12 h-14 bg-white border-none shadow-sm rounded-2xl font-bold text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-white rounded-2xl shadow-sm border mb-6">
          <TabsTrigger value="active" className="gap-2 text-xs font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
            Đang thực hiện
            {activeTasks.length > 0 && (
              <Badge variant="destructive" className="h-5 min-w-5 p-0 flex items-center justify-center rounded-full text-[10px] border-none">
                {activeTasks.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="closed" className="gap-2 text-xs font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
            Đã hoàn thành
            {closedTasks.length > 0 && (
              <Badge variant="secondary" className="h-5 min-w-5 p-0 flex items-center justify-center rounded-full text-[10px] border-none">
                {closedTasks.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeTasks.map(req => {
            const status = getStatusInfo(req.status);
            return (
              <Card key={req.id} className="border-none shadow-sm rounded-[2rem] bg-white card-shadow overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                      <Wrench className="h-6 w-6 text-primary" />
                    </div>
                    <Badge className={cn("border-none font-black text-[9px] uppercase px-3 py-1", status.bg, status.color)}>
                      {status.label}
                    </Badge>
                  </div>

                  <h3 className="font-black text-lg text-slate-800 leading-tight mb-4">{req.title}</h3>
                  
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                      <MapPin className="h-4 w-4 text-rose-400" /> {req.unit}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                      <HardDrive className="h-4 w-4 text-blue-400" /> {req.equipmentName}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      <Clock className="h-3.5 w-3.5" /> Báo hỏng: {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={`/requests/${req.id}`} className="flex-1">
                      <Button variant="ghost" className="w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-widest border-2">Chi tiết</Button>
                    </Link>

                    {req.status === 'assigned' && (
                      <Button className="flex-[2] bg-primary h-12 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-blue-100" onClick={() => handleStart(req.id)}>
                        <Play className="h-4 w-4 fill-current" /> Bắt đầu
                      </Button>
                    )}

                    {req.status === 'in_progress' && (
                      <Button className="flex-[2] bg-emerald-600 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-emerald-100" onClick={() => handleOpenReport(req.id)}>
                        <ClipboardPen className="h-4 w-4" /> Báo cáo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {activeTasks.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] card-shadow">
              <CheckCircle2 className="h-16 w-16 text-slate-100 mx-auto mb-6" />
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Không có nhiệm vụ</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          {closedTasks.map(req => (
            <Link key={req.id} href={`/requests/${req.id}`}>
              <Card className="border-none shadow-sm rounded-[2rem] bg-white card-shadow overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                <CardContent className="p-6 flex items-center justify-between gap-4">
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm text-slate-800 truncate mb-0.5">{req.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Hoàn thành: {req.completedAt && new Date(req.completedAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <Printer className="h-5 w-5 text-slate-300" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </TabsContent>
      </Tabs>

      {/* Dialog Báo cáo */}
      <Dialog open={!!reportingId} onOpenChange={(open) => !open && setReportingId(null)}>
        <DialogContent className="rounded-[3rem] p-8 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-primary uppercase tracking-tighter">Báo cáo kết quả</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cập nhật nội dung sửa chữa</DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hình thức xử lý</Label>
              <Select value={repairType} onValueChange={(val) => setRepairType(val as RepairType)}>
                <SelectTrigger className="h-14 border-none bg-slate-50 rounded-2xl font-bold">
                  <SelectValue placeholder="Chọn hình thức..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-xl">
                  <SelectItem value="replacement">Thay mới thiết bị</SelectItem>
                  <SelectItem value="backup_replacement">Dùng thiết bị dự phòng</SelectItem>
                  <SelectItem value="repair_only">Sửa chữa tại chỗ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nội dung chi tiết</Label>
              <Textarea 
                placeholder="Mô tả công việc đã làm..." 
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="min-h-[150px] border-none bg-slate-50 rounded-2xl font-bold p-4"
              />
            </div>
            
            <div className="bg-blue-50 p-5 rounded-[1.5rem] flex items-start gap-4">
               <Bell className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
               <p className="text-[11px] text-blue-700 font-bold leading-relaxed">Thông báo sẽ được gửi cho Quản lý và Người yêu cầu ngay khi bạn xác nhận.</p>
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-3">
            <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2" onClick={() => setReportingId(null)}>Hủy</Button>
            <Button 
              className="flex-[2] bg-emerald-600 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-emerald-100" 
              onClick={handleSubmitReport} 
              disabled={!reportText.trim() || !repairType}
            >
              Gửi báo cáo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
