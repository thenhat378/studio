
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Play, CheckCircle2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function TasksPage() {
  const { requests, currentUser, updateRequestStatus } = useAppStore();
  const { toast } = useToast();

  const myTasks = requests.filter(r => r.technicianId === currentUser?.id);

  const handleStart = (id: string) => {
    updateRequestStatus(id, 'in_progress');
    toast({ title: "Đã bắt đầu", description: "Vui lòng cập nhật tiến độ thường xuyên." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Wrench className="h-6 w-6 text-accent" />
          Nhiệm vụ sửa chữa
        </h1>
        <p className="text-muted-foreground">Danh sách công việc đã được phân công cho bạn</p>
      </div>

      <div className="grid gap-4">
        {myTasks.map(req => (
          <Card key={req.id} className="border-none shadow-sm border-l-4 border-l-primary">
            <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{req.title}</h3>
                  <Badge variant="outline" className={
                    req.status === 'assigned' ? "bg-blue-50 text-blue-600 border-blue-200" :
                    req.status === 'in_progress' ? "bg-amber-50 text-amber-600 border-amber-200" :
                    "bg-emerald-50 text-emerald-600 border-emerald-200"
                  }>
                    {req.status === 'assigned' ? 'Mới giao' : req.status === 'in_progress' ? 'Đang làm' : 'Đã xong'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Phòng: <span className="text-foreground font-medium">{req.unit}</span> • 
                  Thiết bị: <span className="text-foreground font-medium">{req.equipmentName}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    <Eye className="h-4 w-4" /> Chi tiết
                  </Button>
                </Link>
                {req.status === 'assigned' && (
                  <Button size="sm" className="bg-primary gap-1 flex-1 md:flex-none" onClick={() => handleStart(req.id)}>
                    <Play className="h-4 w-4" /> Bắt đầu
                  </Button>
                )}
                {req.status === 'in_progress' && (
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1 w-full">
                      <CheckCircle2 className="h-4 w-4" /> Báo cáo xong
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {myTasks.length === 0 && (
          <div className="text-center py-20 bg-card rounded-xl border-2 border-dashed">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold">Bạn chưa có nhiệm vụ nào</h3>
            <p className="text-muted-foreground">Các công việc mới sẽ xuất hiện ở đây khi được điều phối.</p>
          </div>
        )}
      </div>
    </div>
  );
}
