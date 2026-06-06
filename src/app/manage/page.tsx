
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  UserCheck, 
  ShieldCheck,
  Star,
  Timer,
  BarChart3,
  Download,
  PieChart as PieChartIcon,
  MapPin,
  Settings2,
  TrendingUp,
  History
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
import { format, formatDistanceStrict } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#0054A4', '#F58220', '#009E49', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ManagementPage() {
  const { requests, users, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  const [selectedTechs, setSelectedTechs] = useState<Record<string, string>>({});

  const pendingAssignment = useMemo(() => requests.filter(r => r.status === 'approved'), [requests]);
  const pendingVerification = useMemo(() => requests.filter(r => r.status === 'completed'), [requests]);
  const historyRequests = useMemo(() => requests.filter(r => r.technicianId && (['closed', 'verified', 'completed'].includes(r.status))), [requests]);

  const technicians = useMemo(() => users.filter(u => u.role === 'technician'), [users]);

  // Statistics Data
  const stats = useMemo(() => {
    // 1. Incidents by Location (Room)
    const locationMap: Record<string, number> = {};
    requests.forEach(r => {
      const loc = r.location || 'Chưa rõ';
      locationMap[loc] = (locationMap[loc] || 0) + 1;
    });
    const locationData = Object.entries(locationMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 2. Incidents by Category
    const categoryMap: Record<string, number> = {};
    requests.forEach(r => {
      categoryMap[r.category] = (categoryMap[r.category] || 0) + 1;
    });
    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    // 3. Resolution Method
    const methodMap = {
      'Sửa chữa': 0,
      'Thay mới': 0,
      'Khác': 0
    };
    requests.forEach(r => {
      if (r.repairType === 'repair_only') methodMap['Sửa chữa']++;
      else if (r.repairType === 'backup_replacement') methodMap['Thay mới']++;
      else if (r.repairType === 'pending_purchase') methodMap['Khác']++;
    });
    const methodData = Object.entries(methodMap).map(([name, value]) => ({ name, value }));

    return { locationData, categoryData, methodData };
  }, [requests]);

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

  const exportToExcel = () => {
    const headers = ["ID Phiếu", "Vị trí", "Thiết bị", "Nhóm", "Người báo", "Đơn vị", "Kỹ thuật viên", "Trạng thái", "Ngày tạo", "Ngày xong", "Hình thức"];
    const csvContent = [
      headers.join(","),
      ...requests.map(r => [
        r.id.slice(-6),
        `"${r.location}"`,
        `"${r.equipmentName}"`,
        `"${r.category}"`,
        `"${r.requesterName}"`,
        `"${r.unit}"`,
        `"${r.technicianName || 'Chưa có'}"`,
        r.status,
        r.createdAt,
        r.completedAt || '',
        r.repairType || ''
      ].join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Bao_cao_sua_chua_DUE_${format(new Date(), 'dd_MM_yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "Đã xuất file", description: "Dữ liệu đã được tải về máy của bạn." });
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
    <div className="space-y-6 pb-24 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tighter">
            <ClipboardList className="h-8 w-8 text-primary" />
            Điều phối & Quản lý CSVC
          </h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 opacity-80">GIÁM SÁT KPI & LẬP KẾ HOẠCH BẢO TRÌ</p>
        </div>
        <Button onClick={exportToExcel} className="bg-secondary hover:bg-secondary/90 text-white rounded-2xl h-14 px-6 font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-secondary/10 active:scale-95 transition-all">
          <Download className="h-5 w-5" /> Xuất file báo cáo
        </Button>
      </div>

      <Tabs defaultValue="assign" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1.5 bg-white rounded-3xl shadow-sm border mb-8">
          <TabsTrigger value="assign" className="h-14 rounded-2xl text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
            <Settings2 className="h-4 w-4" />
            Giao việc {pendingAssignment.length > 0 && <Badge variant="destructive" className="h-5 w-5 p-0">{pendingAssignment.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="verify" className="h-14 rounded-2xl text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
            <ShieldCheck className="h-4 w-4" />
            Duyệt xong {pendingVerification.length > 0 && <Badge className="bg-cyan-500 h-5 w-5 p-0">{pendingVerification.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="history" className="h-14 rounded-2xl text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
            <History className="h-4 w-4" />
            Giám sát KPI
          </TabsTrigger>
          <TabsTrigger value="analytics" className="h-14 rounded-2xl text-[10px] font-black uppercase tracking-tighter data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
            <TrendingUp className="h-4 w-4" />
            Phân tích
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assign" className="space-y-4">
          {pendingAssignment.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow border-l-8 border-l-primary/30 overflow-hidden active:scale-[0.99] transition-all">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0 space-y-3">
                  <h3 className="font-black text-lg text-slate-800 truncate uppercase tracking-tight">
                    <span className="text-primary mr-2">[{req.location}]</span>
                    {req.equipmentName} / <span className="text-slate-400 font-bold">{req.unit}</span>
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Badge variant="secondary" className="bg-slate-50 text-[9px] font-black uppercase px-3 py-1">{req.category}</Badge>
                    <span>Báo hỏng: {formatDate(req.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Select value={selectedTechs[req.id] || ""} onValueChange={(val) => setSelectedTechs(prev => ({ ...prev, [req.id]: val }))}>
                    <SelectTrigger className="h-14 min-w-[200px] rounded-xl bg-slate-50 border-none font-bold text-xs px-5 shadow-inner">
                      <SelectValue placeholder="Chọn nhân viên kỹ thuật..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                      {technicians.map(t => <SelectItem key={t.id} value={t.id} className="rounded-xl h-12 font-bold">{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button className="bg-primary h-14 px-8 rounded-xl text-white font-black text-[10px] uppercase gap-2 shadow-2xl shadow-primary/10 transition-all active:scale-95" onClick={() => handleAssign(req.id)} disabled={!selectedTechs[req.id]}>
                    <UserCheck className="h-5 w-5" /> Giao việc
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingAssignment.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[4rem] card-shadow border-2 border-dashed border-slate-100">
               <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Tất cả phiếu đã được phân công</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="verify" className="space-y-4">
          {pendingVerification.map(req => (
            <Card key={req.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow border-l-8 border-l-cyan-500 overflow-hidden">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 min-w-0 space-y-2">
                  <h3 className="font-black text-lg text-slate-800 truncate uppercase">
                    <span className="text-cyan-600 mr-2">[{req.location}]</span>
                    {req.equipmentName} / <span className="text-slate-400 font-bold">{req.unit}</span>
                  </h3>
                  <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="text-slate-800 font-black">Kỹ thuật: {req.technicianName}</span>
                    <span className="flex items-center gap-1.5"><Timer className="h-3 w-3" /> Xong trong: {getDuration(req.assignedAt, req.completedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Link href={`/requests/${req.id}`} className="flex-1 md:flex-none">
                    <Button variant="ghost" className="w-full h-14 px-6 rounded-xl font-black text-[10px] uppercase border-2">Chi tiết báo cáo</Button>
                  </Link>
                  <Button className="bg-cyan-600 h-14 px-8 rounded-xl text-white font-black text-[10px] uppercase gap-2 shadow-2xl shadow-cyan-100 active:scale-95 transition-all" onClick={() => handleVerify(req.id)}>
                    <ShieldCheck className="h-5 w-5" /> Duyệt hoàn thành
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingVerification.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[4rem] card-shadow border-2 border-dashed border-slate-100">
               <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Chưa có báo cáo kỹ thuật chờ duyệt</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
           {historyRequests.map(req => (
             <Card key={req.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow overflow-hidden p-8 hover:bg-slate-50 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="space-y-3">
                      <h3 className="font-black text-base text-slate-800 uppercase tracking-tight">
                        <span className="text-slate-400 mr-2">[{req.location}]</span>
                        {req.equipmentName} / <span className="text-slate-400">{req.unit}</span>
                      </h3>
                      <div className="flex flex-wrap items-center gap-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                         <span className="text-primary flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5" /> {req.technicianName}</span>
                         <span className="flex items-center gap-1.5"><Timer className="h-3.5 w-3.5" /> Thời gian xử lý: {getDuration(req.assignedAt, req.completedAt)}</span>
                         <span>Ngày xong: {formatDate(req.completedAt)}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      {req.rating && (
                        <div className="flex gap-1 bg-amber-50 px-4 py-2 rounded-full">
                          {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-4 w-4", s <= req.rating! ? "fill-amber-400 text-amber-400" : "text-slate-200")} />)}
                        </div>
                      )}
                      <Badge variant="secondary" className="bg-slate-100 text-[10px] font-black uppercase px-4 py-2 rounded-xl text-slate-500">{req.status}</Badge>
                   </div>
                </div>
             </Card>
           ))}
           {historyRequests.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[4rem] card-shadow border-2 border-dashed border-slate-100">
               <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Chưa có dữ liệu lịch sử</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-8 animate-slide-up">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-[3rem] border-none bg-white card-shadow p-8">
              <CardHeader className="px-0 pt-0 pb-6">
                <CardTitle className="text-sm font-black uppercase text-slate-800 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" /> Top Vị trí phát sinh sự cố
                </CardTitle>
              </CardHeader>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.locationData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" fill="#0054A4" radius={[0, 10, 10, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="rounded-[3rem] border-none bg-white card-shadow p-8">
              <CardHeader className="px-0 pt-0 pb-6">
                <CardTitle className="text-sm font-black uppercase text-slate-800 flex items-center gap-3">
                  <PieChartIcon className="h-5 w-5 text-accent" /> Cơ cấu Nhóm thiết bị hỏng
                </CardTitle>
              </CardHeader>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', paddingTop: '20px' }} />
                    <RechartsTooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="rounded-[3rem] border-none bg-white card-shadow p-8">
              <CardHeader className="px-0 pt-0 pb-6">
                <CardTitle className="text-sm font-black uppercase text-slate-800 flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-secondary" /> Hình thức xử lý (Sửa vs Thay mới)
                </CardTitle>
              </CardHeader>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.methodData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#009E49" radius={[10, 10, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="rounded-[3rem] border-none bg-primary text-white card-shadow p-10 flex flex-col justify-center items-center text-center space-y-4">
              <div className="p-5 bg-white/20 rounded-[2rem]">
                 <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h4 className="text-2xl font-black uppercase tracking-tighter">Tổng kết hệ thống</h4>
                <p className="text-sm font-bold opacity-80 mt-2">Dựa trên {requests.length} phiếu yêu cầu đã ghi nhận</p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full pt-4">
                <div className="bg-white/10 p-4 rounded-2xl">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Hiệu suất</p>
                   <p className="text-xl font-black">{((historyRequests.length / (requests.length || 1)) * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Thay mới</p>
                   <p className="text-xl font-black">{stats.methodData.find(m => m.name === 'Thay mới')?.value || 0} ca</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
