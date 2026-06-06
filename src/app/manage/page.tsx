
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  UserCheck, 
  ShieldCheck,
  Star,
  Clock,
  Timer,
  CheckCircle2,
  MapPin
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
import { formatDistanceStrict, format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function ManagementPage() {
  const { requests, users, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  const [selectedTechs, setSelectedTechs] = useState<Record<string, string>>({});

  const pendingAssignment = useMemo(() => requests.filter(r => r.status === 'approved'), [requests]);
  const pendingVerification = useMemo(() => requests.filter(r => r.status === 'completed'), [requests]);
  const historyRequests = useMemo(() => requests.filter(r => r.technicianId && (['closed', 'verified', 'completed'].includes(r.status))), [requests]);

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

    toast({ title: "Đã phân công", description: `Phiếu đã được giao cho kỹ thuật viên: ${tech.name}` });
    const newSelections = { ...selectedTechs };
    delete newSelections[requestId];
    setSelectedTechs(newSelections);
  };

  const handleVerify = (id: string) => {
    updateRequestStatus(id, 'verified', { csvcManagerApproved: true });
    toast({ title: "Đã duyệt hoàn thành", description: "Phiếu đã chuyển về đơn vị nghiệm thu." });
  };

  const getDuration = (start?: string, end?: string) => {
    if (!start || !end) return "N/A";
    try { return formatDistanceStrict(new Date(start), new Date(end), { locale: vi }); } catch (e) { return "N/A"; }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try { return format(new Date(dateStr), 'HH:mm - dd/MM/yyyy'); } catch (e) { return "N/A"; }
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
          <ClipboardList className="h-7 w-7 text-primary" />
          Điều phối & Quản lý CSVC
        </h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Quản lý hiệu suất kỹ thuật viên</p>
      </div>

      <Tabs defaultValue="assign" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[500px] h-14 p-1 bg-white rounded-2xl shadow-sm border mb-8">
          <TabsTrigger value="assign" className="text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
            Giao việc {pendingAssignment.length > 0 && <Badge variant="destructive" className="ml-1 h-5 w-5 p-0">{pendingAssignment.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="verify" className="text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
            Duyệt xong {pendingVerification.length > 0 && <Badge className="ml-1 bg-cyan-500 h-5 w-5 p-0">{pendingVerification.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="history" className="text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl transition-all">
            Giám sát KPI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assign" className="space-y-4">
          {pendingAssignment.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow border-l-8 border-l-indigo-500 overflow-hidden">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0 space-y-2">
                  <h3 className="font-black text-lg text-slate-800 truncate">
                    <span className="text-indigo-600 mr-2 uppercase">[{req.location}]</span>
                    {req.equipmentName}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Báo hỏng: {formatDate(req.createdAt)}</span>
                    <span className="uppercase text-slate-600 font-black">{req.unit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Select value={selectedTechs[req.id] || ""} onValueChange={(val) => setSelectedTechs(prev => ({ ...prev, [req.id]: val }))}>
                    <SelectTrigger className="h-14 min-w-[200px] rounded-xl bg-slate-50 border-none font-bold text-xs px-5">
                      <SelectValue placeholder="Chọn nhân viên..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {technicians.map(t => <SelectItem key={t.id} value={t.id} className="rounded-xl font-bold">{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button className="bg-primary h-14 px-6 rounded-xl text-white font-black text-[10px] uppercase gap-2 shadow-xl shadow-primary/10 transition-all active:scale-95" onClick={() => handleAssign(req.id)} disabled={!selectedTechs[req.id]}>
                    <UserCheck className="h-5 w-5" /> Giao việc
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="verify" className="space-y-4">
          {pendingVerification.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow border-l-8 border-l-cyan-500 overflow-hidden">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0 space-y-2">
                  <h3 className="font-black text-lg text-slate-800 truncate">
                    <span className="text-cyan-600 mr-2 uppercase">[{req.location}]</span>
                    {req.equipmentName}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="text-slate-800 font-black">Xử lý: {req.technicianName}</span>
                    <span>T/g: {getDuration(req.assignedAt, req.completedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="ghost" className="w-full h-14 px-6 rounded-xl font-black text-[10px] uppercase border-2">Xem báo cáo</Button>
                  </Link>
                  <Button className="bg-cyan-600 h-14 px-6 rounded-xl text-white font-black text-[10px] uppercase gap-2 shadow-xl shadow-cyan-100" onClick={() => handleVerify(req.id)}>
                    <ShieldCheck className="h-5 w-5" /> Duyệt xong
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
           {historyRequests.map(req => (
             <Card key={req.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow overflow-hidden p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div className="space-y-2">
                      <h3 className="font-black text-base text-slate-800">
                        <span className="text-slate-400 mr-2 uppercase">[{req.location}]</span>
                        {req.equipmentName}
                      </h3>
                      <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase">
                         <span className="text-primary">{req.technicianName}</span>
                         <span className="flex items-center gap-1"><Timer className="h-3 w-3" /> {getDuration(req.assignedAt, req.completedAt)}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      {req.rating && (
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-3.5 w-3.5", s <= req.rating! ? "fill-amber-400 text-amber-400" : "text-slate-100")} />)}
                        </div>
                      )}
                      <Badge variant="secondary" className="bg-slate-50 text-[9px] font-black uppercase px-3 py-1">{req.status}</Badge>
                   </div>
                </div>
             </Card>
           ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
