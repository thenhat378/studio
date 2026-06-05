
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, UserCheck, Wrench, CheckCircle2, AlertCircle, Eye, ShieldCheck } from 'lucide-react';
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
  const { requests, users, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  const [selectedTechs, setSelectedTechs] = useState<Record<string, string>>({});

  // 1. Chờ phân công
  const pendingAssignment = requests.filter(r => r.status === 'approved');
  
  // 2. Chờ duyệt hoàn thành (Kỹ thuật đã báo xong)
  const pendingVerification = requests.filter(r => r.status === 'completed');

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
    
    const newSelections = { ...selectedTechs };
    delete newSelections[requestId];
    setSelectedTechs(newSelections);
  };

  const handleVerify = (id: string) => {
    updateRequestStatus(id, 'verified', { csvcManagerApproved: true });
    toast({
      title: "Đã duyệt hoàn thành kỹ thuật",
      description: "Yêu cầu đã được chuyển cho đơn vị sử dụng để nghiệm thu cuối cùng."
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
          <p className="text-muted-foreground">Phân công nhân sự và phê duyệt hoàn thành kỹ thuật</p>
        </div>
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
          <TabsTrigger value="verify" className="gap-2">
            Duyệt hoàn thành
            {pendingVerification.length > 0 && (
              <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                {pendingVerification.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assign" className="mt-6 space-y-4">
          {pendingAssignment.map(req => (
            <Card key={req.id} className="border-none shadow-sm overflow-hidden border-l-4 border-l-indigo-500">
              <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{req.title}</h3>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">Chờ giao việc</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Đơn vị: {req.unit} | Thiết bị: {req.equipmentName}</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="min-w-[200px]">
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
                    className="bg-primary gap-2 font-bold"
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
              <p className="text-muted-foreground">Không có phiếu chờ phân công</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="verify" className="mt-6 space-y-4">
          {pendingVerification.map(req => (
            <Card key={req.id} className="border-none shadow-sm overflow-hidden border-l-4 border-l-emerald-500">
              <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{req.title}</h3>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Kỹ thuật báo xong</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Kỹ thuật viên: {req.technicianName} | Đơn vị: {req.unit}</p>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`}>
                    <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1" /> Chi tiết</Button>
                  </Link>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold gap-1"
                    onClick={() => handleVerify(req.id)}
                  >
                    <ShieldCheck className="h-4 w-4" /> Duyệt hoàn thành kỹ thuật
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingVerification.length === 0 && (
            <div className="text-center py-20 bg-card rounded-xl border-2 border-dashed">
              <p className="text-muted-foreground">Không có phiếu chờ duyệt hoàn thành kỹ thuật</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
