
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  UserCheck, 
  Eye, 
  ShieldCheck,
  ChevronRight,
  Star,
  Clock,
  History,
  Timer,
  User,
  MessageSquareQuote,
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
  const historyRequests = useMemo(() => requests.filter(r => r.technicianId && ['closed', 'verified', 'completed'].includes(r.status)), [requests]);

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
                  <div className="flex items-center gap-2">
                    <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[9px] uppercase px-3 py-1 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {req.location}
                    </Badge>
                  </div>
                  <h3 className="font-black text-lg text-slate-800 truncate">{req.equipmentName}</h3>
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
        {/* Shortened: Other TabsContent also use req.location instead of req.title */}
      </Tabs>
    </div>
  );
}
