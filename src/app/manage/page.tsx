
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  UserCheck, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  ShieldCheck,
  History,
  Star,
  Clock,
  User,
  ChevronRight
} from 'lucide-react';
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
import { cn } from '@/lib/utils';

export default function ManagementPage() {
  const { requests, users, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  const [selectedTechs, setSelectedTechs] = useState<Record<string, string>>({});

  // 1. Chờ phân công (Đã được Đơn vị phê duyệt 'approved')
  const pendingAssignment = requests.filter(r => r.status === 'approved');
  
  // 2. Chờ duyệt hoàn thành kỹ thuật (Kỹ thuật đã báo xong 'completed')
  const pendingVerification = requests.filter(r => r.status === 'completed');

  // 3. Lịch sử theo dõi
  const historyRequests = requests.filter(r => r.status === 'closed' || r.status === 'verified');

  const technicians = users.filter(u => u.role === 'technician');

  const handleAssign = (requestId: string) => {
    const techId = selectedTechs[requestId];
    if (!techId) {
      toast({
        variant: "destructive",
        title: "Thông báo",
        description: "Vui lòng chọn nhân viên kỹ thuật trước khi giao việc."
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
      description: "Yêu cầu đã được chuyển cho đơn vị sử dụng để nghiệm thu."
    });
  };

  const getProcessingTime = (start: string, end?: string) => {
    if (!end) return 'N/A';
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diffMs = endTime - startTime;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diffHrs > 0) return `${diffHrs} giờ ${diffMins} phút`;
    return `${diffMins} phút`;
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
            <ClipboardList className="h-7 w-7 text-primary" />
            Điều phối & Quản lý CSVC
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vai trò: Phó Trưởng phòng CSVC</p>
        </div>
      </div>

      <Tabs defaultValue="assign" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[500px] h-14 p-1 bg-white rounded-2xl shadow-sm border mb-6">
          <TabsTrigger value="assign" className="gap-2 text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
            Phân công KT
            {pendingAssignment.length > 0 && (
              <Badge variant="destructive" className="h-5 min-w-5 p-0 flex items-center justify-center rounded-full text-[9px] border-none">
                {pendingAssignment.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="verify" className="gap-2 text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
            Duyệt kỹ thuật
            {pendingVerification.length > 0 && (
              <Badge className="bg-cyan-500 h-5 min-w-5 p-0 flex items-center justify-center rounded-full text-[9px] border-none text-white">
                {pendingVerification.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
            Giám sát chung
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assign" className="space-y-4">
          {pendingAssignment.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2rem] bg-white card-shadow overflow-hidden border-l-8 border-l-indigo-500">
              <CardContent className="p-7 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-black text-lg text-slate-800 truncate">{req.title}</h3>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200 text-[9px] font-black uppercase">Chờ phân công</Badge>
                  </div>
                  <div className="flex flex-col gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    <p>Đơn vị: <span className="text-slate-800">{req.unit}</span></p>
                    <p>Thiết bị: <span className="text-slate-800">{req.equipmentName}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="min-w-[180px] flex-1">
                    <Select 
                      value={selectedTechs[req.id] || ""} 
                      onValueChange={(val) => setSelectedTechs(prev => ({ ...prev, [req.id]: val }))}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold text-xs">
                        <SelectValue placeholder="Chọn nhân viên..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl">
                        {technicians.map(t => (
                          <SelectItem key={t.id} value={t.id} className="font-bold">{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary/90 h-12 rounded-xl text-white font-black text-[10px] uppercase tracking-widest gap-2 flex-1 md:flex-none shadow-lg shadow-blue-100"
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
            <div className="text-center py-20 bg-white rounded-[3rem] card-shadow border-2 border-dashed">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Không có phiếu chờ phân công kỹ thuật</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="verify" className="space-y-4">
          {pendingVerification.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2rem] bg-white card-shadow overflow-hidden border-l-8 border-l-cyan-500">
              <CardContent className="p-7 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-black text-lg text-slate-800 truncate">{req.title}</h3>
                    <Badge variant="outline" className="bg-cyan-50 text-cyan-600 border-cyan-200 text-[9px] font-black uppercase">Kỹ thuật báo xong</Badge>
                  </div>
                  <div className="flex flex-col gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    <p>Thực hiện: <span className="text-slate-800">{req.technicianName}</span></p>
                    <p>Đơn vị: <span className="text-slate-800">{req.unit}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="ghost" size="sm" className="w-full h-12 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest">
                      <Eye className="h-4 w-4 mr-2" /> Xem báo cáo
                    </Button>
                  </Link>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl text-white font-black text-[10px] uppercase tracking-widest gap-2 flex-1 md:flex-none shadow-lg shadow-emerald-100"
                    onClick={() => handleVerify(req.id)}
                  >
                    <ShieldCheck className="h-4 w-4" /> Duyệt kỹ thuật
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingVerification.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] card-shadow border-2 border-dashed">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Không có phiếu chờ duyệt kỹ thuật</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {historyRequests.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow overflow-hidden group hover:bg-slate-50 transition-all">
              <CardContent className="p-7">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                       <h3 className="font-black text-base text-slate-800">{req.title}</h3>
                       {req.status === 'closed' && (
                         <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={cn("h-3 w-3", s <= (req.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-100")} />
                            ))}
                         </div>
                       )}
                       <Badge variant="outline" className="text-[8px] font-black uppercase">
                         {req.status === 'closed' ? 'Đã đóng' : 'Chờ nghiệm thu'}
                       </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kỹ thuật viên</p>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                             <User className="h-3.5 w-3.5 text-primary" /> {req.technicianName}
                          </div>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Thời gian sửa</p>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                             <Clock className="h-3.5 w-3.5" /> {getProcessingTime(req.createdAt, req.completedAt)}
                          </div>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Đơn vị yêu cầu</p>
                          <div className="text-[11px] font-bold text-slate-700">{req.unit}</div>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</p>
                          <Badge className={cn(
                            "text-[9px] font-black uppercase px-2 py-0.5 border-none",
                            req.status === 'closed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                          )}>
                            {req.status === 'closed' ? 'Hoàn tất' : 'Chờ nghiệm thu'}
                          </Badge>
                       </div>
                    </div>
                  </div>
                  
                  <Link href={`/requests/${req.id}`}>
                    <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 bg-slate-100 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                       <ChevronRight className="h-6 w-6" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          {historyRequests.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] card-shadow">
              <History className="h-16 w-16 text-slate-100 mx-auto mb-6" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Chưa có dữ liệu lịch sử hoàn thành</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
