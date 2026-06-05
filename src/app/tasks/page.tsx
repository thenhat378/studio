
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Play, CheckCircle2, Eye, ClipboardPen, Bell, Printer, Search, Clock } from 'lucide-react';
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
    toast({ 
      title: "Đã bắt đầu", 
      description: "Hệ thống đã ghi nhận bạn bắt đầu xử lý phiếu này." 
    });
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

    toast({
      title: "Đã gửi báo cáo hoàn thành",
      description: "Thông báo đã được gửi đến Người yêu cầu và Quản lý CSVC."
    });
    
    setReportingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'assigned': return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Mới nhận việc</Badge>;
      case 'in_progress': return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Đang thực hiện</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-cyan-50 text-cyan-600 border-cyan-200">Đã báo xong</Badge>;
      case 'verified': return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Đang nghiệm thu</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Wrench className="h-6 w-6 text-accent" />
            Nhiệm vụ của tôi
          </h1>
          <p className="text-muted-foreground">Theo dõi tiến độ xử lý và in phiếu báo cáo lưu trữ</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Tìm nhiệm vụ theo tên, thiết bị hoặc đơn vị..." 
          className="pl-9 h-11 bg-white border-primary/20"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[500px] h-12 p-1 bg-muted/50">
          <TabsTrigger value="active" className="gap-2 text-sm font-bold data-[state=active]:bg-white">
            Đang thực hiện
            {activeTasks.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                {activeTasks.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="closed" className="gap-2 text-sm font-bold data-[state=active]:bg-white">
            Đã hoàn tất & In phiếu
            {closedTasks.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                {closedTasks.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {activeTasks.map(req => (
            <Card key={req.id} className="border-none shadow-sm overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg truncate">{req.title}</h3>
                    {getStatusBadge(req.status)}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground mt-2">
                    <p className="flex items-center gap-1.5"><span className="font-bold">Đơn vị:</span> {req.unit}</p>
                    <p className="flex items-center gap-1.5"><span className="font-bold">Thiết bị:</span> {req.equipmentName}</p>
                    <p className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Báo hỏng: {new Date(req.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="outline" size="sm" className="w-full gap-1 font-bold">
                      <Eye className="h-4 w-4" /> Chi tiết
                    </Button>
                  </Link>

                  {req.status === 'assigned' && (
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 gap-1 flex-1 md:flex-none font-bold" 
                      onClick={() => handleStart(req.id)}
                    >
                      <Play className="h-4 w-4" /> Bắt đầu làm
                    </Button>
                  )}

                  {req.status === 'in_progress' && (
                    <Button 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700 gap-1 flex-1 md:flex-none font-bold" 
                      onClick={() => handleOpenReport(req.id)}
                    >
                      <ClipboardPen className="h-4 w-4" /> Báo cáo hoàn thành
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {activeTasks.length === 0 && (
            <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed border-muted-foreground/20">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-semibold text-muted-foreground">Hiện tại không có nhiệm vụ mới</h3>
            </div>
          )}
        </TabsContent>

        <TabsContent value="closed" className="space-y-4 mt-6">
          {closedTasks.map(req => (
            <Card key={req.id} className="border-none shadow-sm overflow-hidden border-l-4 border-l-emerald-500">
              <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg truncate">{req.title}</h3>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Đã hoàn thành</Badge>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-bold">Nghiệm thu lúc:</span> {req.completedAt && new Date(req.completedAt).toLocaleString('vi-VN')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-bold">Đánh giá:</span> {req.rating || 0}/5 sao
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="w-full">
                    <Button variant="default" className="w-full bg-primary hover:bg-primary/90 gap-1 font-bold">
                      <Printer className="h-4 w-4" /> Xem & In phiếu
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          {closedTasks.length === 0 && (
            <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed border-muted-foreground/20">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-semibold text-muted-foreground">Chưa có nhiệm vụ nào được đóng</h3>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog Báo cáo - Dành cho in-progress */}
      <Dialog open={!!reportingId} onOpenChange={(open) => !open && setReportingId(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 uppercase tracking-tighter font-black text-xl">
              <ClipboardPen className="h-6 w-6 text-primary" />
              Báo cáo hoàn thành công việc
            </DialogTitle>
            <DialogDescription>Chọn hình thức xử lý và mô tả chi tiết công việc đã thực hiện.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Hình thức sửa chữa</Label>
              <Select value={repairType} onValueChange={(val) => setRepairType(val as RepairType)}>
                <SelectTrigger className="h-12 border-primary/20 rounded-xl">
                  <SelectValue placeholder="Chọn hình thức xử lý..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="replacement">Thay mới thiết bị</SelectItem>
                  <SelectItem value="backup_replacement">Thay bằng thiết bị dự phòng</SelectItem>
                  <SelectItem value="repair_only">Sửa chữa không thay thế</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="report" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Chi tiết nội dung xử lý</Label>
              <Textarea 
                id="report"
                placeholder="Mô tả cụ thể những gì đã làm, vật tư đã sử dụng..." 
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="min-h-[150px] border-primary/20 rounded-xl"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100">
               <Bell className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
               <p className="text-xs text-blue-700 font-bold">Hệ thống sẽ thông báo cho Người yêu cầu và Quản lý ngay khi bạn gửi báo cáo này.</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="h-12 px-6 rounded-xl font-bold" onClick={() => setReportingId(null)}>Hủy</Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 rounded-xl font-bold text-white shadow-lg shadow-emerald-100" 
              onClick={handleSubmitReport} 
              disabled={!reportText.trim() || !repairType}
            >
              Gửi báo cáo hoàn thành
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
