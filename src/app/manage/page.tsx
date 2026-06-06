
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
  CheckCircle2
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
  const historyRequests = useMemo(() => requests.filter(r => ['closed', 'verified', 'completed'].includes(r.status)), [requests]);

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
      description: "Phiếu đã được chuyển về cho đơn vị nghiệm thu."
    });
  };

  const getDuration = (start?: string, end?: string) => {
    if (!start || !end) return "N/A";
    try {
      return formatDistanceStrict(new Date(start), new Date(end), { locale: vi });
    } catch (e) {
      return "N/A";
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), 'HH:mm - dd/MM/yyyy');
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
            <ClipboardList className="h-7 w-7 text-primary" />
            Điều phối & Quản lý CSVC
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vai trò: Quản lý CSVC</p>
        </div>
      </div>

      <Tabs defaultValue="assign" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[500px] h-14 p-1 bg-white rounded-2xl shadow-sm border mb-8">
          <TabsTrigger value="assign" className="gap-2 text-[10px] font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl">
            Phân công
            {pendingAssignment.length > 0 && <Badge variant="destructive" className="ml-1 h-5 w-5 p-0">{pendingAssignment.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="verify" className="gap-2 text-[10px] font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl">
            Duyệt kỹ thuật
            {pendingVerification.length > 0 && <Badge className="ml-1 bg-cyan-500 h-5 w-5 p-0">{pendingVerification.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 text-[10px] font-black uppercase data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl">
            Hiệu suất & Giám sát
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assign" className="space-y-4">
          {pendingAssignment.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow border-l-8 border-l-indigo-500 overflow-hidden">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg text-slate-800 truncate mb-2">{req.title}</h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Báo hỏng: {formatDate(req.createdAt)}</span>
                    <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {req.unit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Select value={selectedTechs[req.id] || ""} onValueChange={(val) => setSelectedTechs(prev => ({ ...prev, [req.id]: val }))}>
                    <SelectTrigger className="h-14 min-w-[200px] rounded-[1.2rem] bg-slate-50 border-none font-bold text-xs px-5 shadow-sm">
                      <SelectValue placeholder="Chọn nhân viên..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                      {technicians.map(t => <SelectItem key={t.id} value={t.id} className="rounded-xl h-11 font-bold">{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button className="bg-primary hover:bg-primary/90 h-14 px-6 rounded-[1.2rem] text-white font-black text-[10px] uppercase gap-2 shadow-xl shadow-primary/10 transition-all active:scale-95" onClick={() => handleAssign(req.id)} disabled={!selectedTechs[req.id]}>
                    <UserCheck className="h-5 w-5" /> Giao việc
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingAssignment.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] card-shadow border-2 border-dashed border-slate-100">
              <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Không có phiếu chờ phân công</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="verify" className="space-y-4">
          {pendingVerification.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow border-l-8 border-l-cyan-500 overflow-hidden">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg text-slate-800 truncate mb-2">{req.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-blue-500" /> KT: {req.technicianName}</span>
                    <span className="flex items-center gap-1.5"><Timer className="h-3.5 w-3.5 text-blue-500" /> Thời gian xử lý: {getDuration(req.assignedAt, req.completedAt)}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-slate-400" /> Nhận việc: {formatDate(req.assignedAt)}</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Báo xong: {formatDate(req.completedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/requests/${req.id}`}>
                    <Button variant="ghost" size="sm" className="h-14 px-6 rounded-[1.2rem] border-2 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                      <Eye className="h-5 w-5 mr-2" /> Chi tiết
                    </Button>
                  </Link>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 h-14 px-6 rounded-[1.2rem] text-white font-black text-[10px] uppercase gap-2 shadow-xl shadow-emerald-100 transition-all active:scale-95" onClick={() => handleVerify(req.id)}>
                    <ShieldCheck className="h-5 w-5" /> Duyệt hoàn thành
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingVerification.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] card-shadow border-2 border-dashed border-slate-100">
              <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Không có phiếu chờ duyệt kỹ thuật</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-6">
            {historyRequests.map(req => (
              <Card key={req.id} className="border-none shadow-sm rounded-[3rem] bg-white card-shadow overflow-hidden group hover:bg-slate-50 transition-all border-l-8 border-l-slate-100 hover:border-l-primary/30">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1 space-y-4 w-full">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <h3 className="font-black text-lg text-slate-800 tracking-tight">{req.title}</h3>
                           {req.status === 'closed' && (
                             <div className="flex gap-0.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-3 w-3", s <= (req.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-100")} />)}
                             </div>
                           )}
                         </div>
                         <Badge className={cn("text-[9px] font-black uppercase px-3 py-1 border-none", req.status === 'closed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                            {req.status === 'closed' ? 'Đã đóng hồ sơ' : req.status === 'verified' ? 'Chờ đơn vị nghiệm thu' : 'Chờ CSVC duyệt'}
                         </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                         <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kỹ thuật viên</p>
                            <div className="text-[11px] font-black text-slate-700">{req.technicianName || 'N/A'}</div>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Thời gian xử lý</p>
                            <div className="text-[11px] font-black text-blue-600 flex items-center gap-1.5">
                              <Timer className="h-3.5 w-3.5" />
                              {getDuration(req.assignedAt, req.completedAt)}
                            </div>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Thời điểm nhận việc</p>
                            <div className="text-[11px] font-bold text-slate-700">{formatDate(req.assignedAt)}</div>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Thời điểm báo xong</p>
                            <div className="text-[11px] font-bold text-emerald-600">{formatDate(req.completedAt)}</div>
                         </div>
                      </div>

                      {req.requesterFeedback && (
                        <div className="flex items-start gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-50">
                           <MessageSquareQuote className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                           <p className="text-[11px] font-bold text-emerald-800 italic leading-relaxed">"{req.requesterFeedback}"</p>
                        </div>
                      )}
                    </div>
                    <Link href={`/requests/${req.id}`}>
                      <Button variant="ghost" size="icon" className="rounded-[1.5rem] h-14 w-14 bg-white shadow-sm text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                         <ChevronRight className="h-7 w-7" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {historyRequests.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[4rem] card-shadow border-2 border-dashed border-slate-100">
               <History className="h-20 w-20 text-slate-100 mx-auto mb-6" />
               <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">CHƯA CÓ DỮ LIỆU GIÁM SÁT</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
