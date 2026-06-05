
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, UserCheck, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function ManagementPage() {
  const { requests, users, updateRequestStatus } = useAppStore();
  const { toast } = useToast();

  const approvedRequests = requests.filter(r => r.status === 'approved');
  const technicians = users.filter(u => u.role === 'technician');

  const handleAssign = (id: string, techId: string) => {
    const tech = technicians.find(t => t.id === techId);
    if (!tech) return;

    updateRequestStatus(id, 'assigned', {
      technicianId: tech.id,
      technicianName: tech.name
    });

    toast({
      title: "Đã phân công",
      description: `Phiếu đã được giao cho ${tech.name}`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-accent" />
          Điều phối & Phân công
        </h1>
        <p className="text-muted-foreground">Phân bổ kỹ thuật viên xử lý các phiếu đã được duyệt</p>
      </div>

      <div className="grid gap-4">
        {approvedRequests.map(req => (
          <Card key={req.id} className="border-none shadow-sm">
            <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{req.title}</h3>
                  <Badge className="bg-indigo-500">Đã phê duyệt</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-2">
                  <p>Đơn vị: <span className="text-foreground font-medium">{req.unit}</span></p>
                  <p>Thiết bị: <span className="text-foreground font-medium">{req.equipmentName}</span></p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="min-w-[200px] flex-1">
                  <Select onValueChange={(val) => handleAssign(req.id, val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn kỹ thuật viên" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-primary gap-2">
                   <UserCheck className="h-4 w-4" /> Giao việc
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {approvedRequests.length === 0 && (
          <div className="text-center py-20 bg-card rounded-xl border-2 border-dashed">
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold">Chưa có phiếu mới cần điều phối</h3>
            <p className="text-muted-foreground">Vui lòng chờ Lãnh đạo đơn vị phê duyệt yêu cầu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
