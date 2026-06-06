
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  UserCheck, 
  CheckCircle2, 
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
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

export default function ManagementPage() {
  const { requests, users, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  const [selectedTechs, setSelectedTechs] = useState<Record<string, string>>({});

  const pendingAssignment = useMemo(() => requests.filter(r => r.status === 'approved'), [requests]);
  const pendingVerification = useMemo(() => requests.filter(r => r.status === 'completed'), [requests]);
  const historyRequests = useMemo(() => requests.filter(r => r.status === 'closed' || r.status === 'verified'), [requests]);

  const technicians = useMemo(() => users.filter(u => u.role === 'technician'), [users]);

  const handleAssign = (requestId: string) => {
    const techId = selectedTechs[requestId];
    if (!techId) return;

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
      description: "Phiếu đã được chuyển về cho đơn vị nghiệm thu bước cuối."
    });
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
          <TabsTrigger value="assign" className="gap-2 text-[10px] font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl">
            Bước 3: Phân công
            {pendingAssignment.length > 0 && <Badge variant="destructive" className="ml-1 h-5 w-5 p-0">{pendingAssignment.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="verify" className="gap-2 text-[10px] font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl">
            Bước 5: Duyệt KT
            {pendingVerification.length > 0 && <Badge className="ml-1 bg-cyan-500 h-5 w-5 p-0">{pendingVerification.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 text-[10px] font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl">
            Giám sát chung
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assign" className="space-y-4">
          {pendingAssignment.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2rem] bg-white border-l-8 border-l-indigo-500">
              <CardContent className="p-7 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg text-slate-800 truncate mb-2">{req.title}</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Đơn vị: <span className="text-slate-800">{req.unit}</span></p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Select value={selectedTechs[req.id] || ""} onValueChange={(val) => setSelectedTechs(prev => ({ ...prev, [req.id]: val }))}>
                    <SelectTrigger className="h-12 min-w-[180px] rounded-xl bg-slate-50 border-none font-bold text-xs">
                      <SelectValue placeholder="Chọn nhân viên..." />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button className="bg-primary hover:bg-primary/90 h-12 rounded-xl text-white font-black text-[10px] uppercase gap-2" onClick={() => handleAssign(req.id)} disabled={!selectedTechs[req.id]}>
                    <UserCheck className="h-4 w-4" /> Giao việc
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingAssignment.length === 0 && <div className="text-center py-20 bg-white rounded-[3rem]"><p className="text-[10px] font-black text-slate-300 uppercase">Không có phiếu chờ phân công</p></div>}
        </TabsContent>

        <TabsContent value="verify" className="space-y-4">
          {pendingVerification.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2rem] bg-white border-l-8 border-l-cyan-500">
              <CardContent className="p-7 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg text-slate-800 truncate mb-2">{req.title}</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">KT thực hiện: <span className="text-slate-800">{req.technicianName}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/requests/${req.id}`}>
                    <Button variant="ghost" size="sm" className="h-12 rounded-xl border-2 font-black text-[10px] uppercase"><Eye className="h-4 w-4 mr-2" /> Xem báo cáo</Button>
                  </Link>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl text-white font-black text-[10px] uppercase gap-2" onClick={() => handleVerify(req.id)}>
                    <ShieldCheck className="h-4 w-4" /> Duyệt kỹ thuật
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingVerification.length === 0 && <div className="text-center py-20 bg-white rounded-[3rem]"><p className="text-[10px] font-black text-slate-300 uppercase">Không có phiếu chờ duyệt kỹ thuật</p></div>}
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
                            {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-3 w-3", s <= (req.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-100")} />)}
                         </div>
                       )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Đơn vị yêu cầu</p>
                          <div className="text-[11px] font-bold text-slate-700">{req.unit}</div>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Trạng thái</p>
                          <Badge className={cn("text-[8px] font-black uppercase px-2 py-0.5 border-none", req.status === 'closed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                            {req.status === 'closed' ? 'Đã đóng' : 'Chờ nghiệm thu'}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
