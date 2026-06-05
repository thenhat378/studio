
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, UserCheck, Wrench, CheckCircle2, AlertCircle, Eye, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { useState } from 'react';

export default function ManagementPage() {
  const { requests, users, updateRequestStatus, logout } = useAppStore();
  const { toast } = useToast();
  const [selectedTechs, setSelectedTechs] = useState<Record<string, string>>({});

  // 1. Danh sách phiếu đã được lãnh đạo duyệt, đang chờ phân công
  const pendingAssignment = requests.filter(r => r.status === 'approved');
  
  // 2. Danh sách phiếu kỹ thuật đã báo hoàn thành, chờ quản lý CSVC kiểm tra/duyệt
  const pendingReview = requests.filter(r => r.status === 'completed');

  const technicians = users.filter(u => u.role === 'technician');

  const handleAssign = (requestId: string) => {
    const techId = selectedTechs[requestId];
    if (!techId) {
      toast({
        variant: "destructive",
        title: "Thông báo",
        description: "Vui lòng chọn kỹ thuật viên trước khi giao việc."
      });
      return;
    }

    const tech = technicians.find(t => t.id === techId);
    if (!tech) return;

    updateRequestStatus(requestId, 'assigned', {
      technicianId: tech.id,
      technicianName: tech.name
    });

    toast({
      title: "Đã phân công",
      description: `Phiếu đã được giao cho kỹ thuật viên: ${tech.name}`
    });
    
    // Clear selection for this request
    const newSelections = { ...selectedTechs };
    delete newSelections[requestId];
    setSelectedTechs(newSelections);
  };

  const handleVerify = (id: string) => {
    updateRequestStatus(id, 'verified');
    toast({
      title: "Đã nghiệm thu kỹ thuật",
      description: "Kết quả sửa chữa đã được xác nhận. Chờ đơn vị yêu cầu xác nhận cuối cùng."
    });
  };

  const handleRejectTechnical = (id: string) => {
    updateRequestStatus(id, 'in_progress');
    toast({
      variant: "destructive",
      title: "Đã yêu cầu làm lại",
      description: "Phiếu đã được chuyển về trạng thái 'Đang thực hiện' để kỹ thuật viên xử lý lại."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-accent" />
            Điều phối & Quản lý kỹ thuật
          </h1>
          <p className="text-muted-foreground">Phân công nhân sự và kiểm soát chất lượng sửa chữa</p>
        </div>
        <Button 
          variant="outline" 
          className="border-destructive/20 text-destructive hover:bg-destructive/10 gap-2 font-bold"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" /> Đăng xuất
        </Button>
      </div>

      <Tabs defaultValue="assign" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="assign" className="gap-2">
            Chờ phân công
            {pendingAssignment.length > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                {pendingAssignment.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="review" className="gap-2">
            Chờ duyệt kết quả
            {pendingReview.length > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                {pendingReview.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: PHÂN CÔNG VIỆC */}
        <TabsContent value="assign" className="mt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">Có {pendingAssignment.length} yêu cầu mới cần giao việc.</span>
          </div>
          
          {pendingAssignment.map(req => (
            <Card key={req.id} className="border-none shadow-sm overflow-hidden border-l-4 border-l-indigo-500">
              <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{req.title}</h3>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">Đã duyệt</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground mt-2">
                    <p>Đơn vị: <span className="text-foreground font-medium">{req.unit}</span></p>
                    <p>Thiết bị: <span className="text-foreground font-medium">{req.equipmentName}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="min-w-[220px] flex-1">
                    <Select 
                      value={selectedTechs[req.id] || ""} 
                      onValueChange={(val) => setSelectedTechs(prev => ({ ...prev, [req.id]: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn kỹ thuật viên..." />
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
                    onClick={() => handleAssign(req.id)}
                    disabled={!selectedTechs[req.id]}
                  >
                     <UserCheck className="h-4 w-4" /> Giao việc
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingAssignment.length === 0 && (
            <div className="text-center py-20 bg-card rounded-xl border-2 border-dashed">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-semibold text-muted-foreground">Không có phiếu chờ điều phối</h3>
            </div>
          )}
        </TabsContent>

        {/* TAB 2: KIỂM TRA & DUYỆT KẾT QUẢ */}
        <TabsContent value="review" className="mt-6 space-y-4">
           <div className="flex items-center gap-2 mb-4 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Có {pendingReview.length} phiếu đã hoàn thành cần duyệt kỹ thuật.</span>
          </div>

          {pendingReview.map(req => (
            <Card key={req.id} className="border-none shadow-sm overflow-hidden border-l-4 border-l-emerald-500">
              <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{req.title}</h3>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Kỹ thuật đã báo xong</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Kỹ thuật viên: <span className="font-medium text-foreground">{req.technicianName}</span>
                  </p>
                  <div className="mt-2 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 italic text-sm text-emerald-800">
                    "{req.technicianReport || 'Không có báo cáo chi tiết'}"
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <Eye className="h-4 w-4" /> Chi tiết
                    </Button>
                  </Link>
                  <Button 
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 gap-1 flex-1 md:flex-none"
                    onClick={() => handleVerify(req.id)}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Duyệt
                  </Button>
                  <Button 
                    size="sm"
                    variant="destructive"
                    className="gap-1 flex-1 md:flex-none"
                    onClick={() => handleRejectTechnical(req.id)}
                  >
                    Làm lại
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingReview.length === 0 && (
            <div className="text-center py-20 bg-card rounded-xl border-2 border-dashed">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-semibold text-muted-foreground">Không có phiếu cần duyệt kết quả</h3>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
