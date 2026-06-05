"use client"

import { useAppStore } from '@/lib/store';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
} from '@/components/ui/card';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  User,
  Wrench,
  PlusCircle,
  Sparkles,
  HardDrive,
  BarChart3,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useFirebase } from '@/firebase';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';

export default function Overview() {
  const { 
    currentUser, 
    loginAsTestAccount,
    sendOtp,
    verifyOtp,
    requests, 
    isInitialized 
  } = useAppStore();
  
  const { auth } = useFirebase();
  const { toast } = useToast();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [unit, setUnit] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  // Khởi tạo Recaptcha tàng hình
  useEffect(() => {
    if (auth && !recaptchaRef.current) {
      try {
        recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          'callback': () => {
            // Recaptcha resolved
          }
        });
      } catch (e) {
        console.error("Recaptcha init error:", e);
      }
    }
    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    };
  }, [auth]);

  if (!isInitialized) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !recaptchaRef.current) {
      toast({ 
        variant: "destructive", 
        title: "Thiếu thông tin", 
        description: "Vui lòng nhập số điện thoại hoặc chờ hệ thống khởi tạo Recaptcha." 
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Chuẩn hóa định dạng số điện thoại Việt Nam
      let formattedPhone = phoneNumber.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = `+84${formattedPhone.slice(1)}`;
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+84${formattedPhone}`;
      }

      const result = await sendOtp(formattedPhone, recaptchaRef.current);
      setConfirmationResult(result);
      setShowOtpInput(true);
      toast({ title: "Đã gửi mã OTP", description: "Vui lòng kiểm tra tin nhắn SMS." });
    } catch (error: any) {
      console.error("Send OTP error:", error);
      let msg = "Không thể gửi OTP. Vui lòng thử lại.";
      if (error.code === 'auth/api-key-not-valid') msg = "Lỗi cấu hình: API Key không hợp lệ. Vui lòng liên hệ Admin.";
      if (error.code === 'auth/invalid-phone-number') msg = "Số điện thoại không đúng định dạng.";
      if (error.code === 'auth/too-many-requests') msg = "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.";
      
      toast({ 
        variant: "destructive", 
        title: `Lỗi: ${error.code || 'Unknown'}`, 
        description: msg 
      });
      
      // Reset Recaptcha nếu lỗi token
      if (recaptchaRef.current) {
        recaptchaRef.current.render().then(widgetId => {
          recaptchaRef.current?.reset(widgetId);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) return;

    setIsLoading(true);
    try {
      await verifyOtp(confirmationResult, otp, { name: fullName, unit });
      toast({ title: "Đăng nhập thành công", description: "Chào mừng bạn quay trở lại!" });
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      let msg = "Mã xác thực không chính xác hoặc đã hết hạn.";
      if (error.code === 'auth/invalid-verification-code') msg = "Mã OTP không đúng.";
      if (error.code === 'auth/code-expired') msg = "Mã OTP đã hết hạn. Vui lòng gửi lại mã.";
      
      toast({ 
        variant: "destructive", 
        title: `Lỗi xác thực: ${error.code}`, 
        description: msg 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#F4F7FE]">
        <div id="recaptcha-container"></div>
        <div className="w-full max-w-[420px] space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="text-center space-y-4">
             <div className="inline-flex p-4 bg-white rounded-[2.5rem] shadow-xl mb-4">
                <Wrench className="h-10 w-10 text-primary p-1" />
             </div>
            <h1 className="text-2xl font-black tracking-tighter text-primary uppercase leading-tight">
              Requisition DUE
            </h1>
          </div>

          <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[3rem] p-4">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl font-black text-slate-800">
                {showOtpInput ? 'Xác thực OTP' : 'Đăng nhập SĐT'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {!showOtpInput ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black text-slate-400 ml-1 uppercase">Số điện thoại (VD: 09xx...)</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Số điện thoại của bạn" 
                        className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm pl-11"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black text-slate-400 ml-1 uppercase">Họ và tên (Chỉ dành cho lần đầu)</Label>
                    <Input 
                      placeholder="Nguyễn Văn A" 
                      className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black text-slate-400 ml-1 uppercase">Đơn vị (Chỉ dành cho lần đầu)</Label>
                    <Input 
                      placeholder="Khoa / Phòng ban" 
                      className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 font-black rounded-xl bg-primary uppercase tracking-widest text-[10px] shadow-lg" disabled={isLoading}>
                    {isLoading ? "Đang gửi SMS..." : "Gửi mã xác nhận"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black text-slate-400 ml-1 uppercase">Mã 6 số từ tin nhắn</Label>
                    <Input 
                      placeholder="123456" 
                      className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm text-center tracking-[0.5rem]"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      autoFocus
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 font-black rounded-xl bg-emerald-600 uppercase tracking-widest text-[10px] shadow-lg" disabled={isLoading}>
                    {isLoading ? "Đang kiểm tra mã..." : "Xác nhận & Vào hệ thống"}
                  </Button>

                  <Button 
                    type="button" 
                    variant="link" 
                    className="w-full text-[10px] font-black uppercase text-slate-400"
                    onClick={() => setShowOtpInput(false)}
                  >
                    Đổi số điện thoại khác
                  </Button>
                </form>
              )}

              <div className="relative flex items-center gap-4 py-2">
                <div className="h-px bg-slate-100 flex-1"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Dùng thử nhanh</span>
                <div className="h-px bg-slate-100 flex-1"></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-12 rounded-xl text-[9px] font-black uppercase hover:bg-blue-50" onClick={() => loginAsTestAccount('requester')}>
                  <User className="h-3 w-3 mr-1 text-blue-500" /> Nhân viên
                </Button>
                <Button variant="outline" className="h-12 rounded-xl text-[9px] font-black uppercase hover:bg-green-50" onClick={() => loginAsTestAccount('unit_leader')}>
                  <ShieldCheck className="h-3 w-3 mr-1 text-green-500" /> Lãnh đạo
                </Button>
                <Button variant="outline" className="h-12 rounded-xl text-[9px] font-black uppercase hover:bg-orange-50" onClick={() => loginAsTestAccount('csvc_manager')}>
                  <UserCheck className="h-3 w-3 mr-1 text-orange-500" /> Quản lý
                </Button>
                <Button variant="outline" className="h-12 rounded-xl text-[9px] font-black uppercase hover:bg-slate-50" onClick={() => loginAsTestAccount('technician')}>
                  <Wrench className="h-3 w-3 mr-1 text-slate-500" /> Kỹ thuật
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Dashboard View logic remains same...
  const roleFilteredRequests = requests.filter(r => {
    if (currentUser.role === 'requester') return r.requesterId === currentUser.id;
    if (currentUser.role === 'unit_leader') return r.unit === currentUser.unit;
    if (currentUser.role === 'technician') return r.technicianId === currentUser.id;
    return true;
  });

  const stats = [
    { label: 'Tổng phiếu', value: roleFilteredRequests.length, icon: ClipboardList, color: 'text-primary', bg: 'bg-blue-50' },
    { label: 'Đang làm', value: roleFilteredRequests.filter(r => ['assigned', 'in_progress', 'completed', 'verified'].includes(r.status)).length, icon: Clock, color: 'text-accent', bg: 'bg-orange-50' },
    { label: 'Chờ duyệt', value: roleFilteredRequests.filter(r => r.status === 'pending_approval').length, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Đã xong', value: roleFilteredRequests.filter(r => r.status === 'closed').length, icon: CheckCircle2, color: 'text-secondary', bg: 'bg-emerald-50' },
  ];

  const recentRequests = roleFilteredRequests.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="relative overflow-hidden bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-100 md:hidden">
         <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
         <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Requisition DUE</p>
         <h1 className="text-2xl font-black">Chào, {currentUser.name.split(' ').pop()}! 👋</h1>
         <div className="mt-4 flex gap-2">
            <Badge className="bg-white/20 hover:bg-white/30 border-none text-[9px] font-black">{currentUser.role.replace('_', ' ')}</Badge>
            {currentUser.unit && <Badge className="bg-white/20 hover:bg-white/30 border-none text-[9px] font-black">{currentUser.unit}</Badge>}
         </div>
      </div>

      {currentUser.role === 'requester' && (
        <Link href="/requests/new">
          <Card className="border-none bg-white rounded-[2rem] card-shadow overflow-hidden group active:scale-95 transition-all">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100">
                  <PlusCircle className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-800">Tạo phiếu yêu cầu mới</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-accent" /> Hỗ trợ AI phân tích lỗi
                  </p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                <ChevronRight className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm rounded-[2rem] bg-white card-shadow">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className={cn("p-3 rounded-2xl mb-3", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-lg font-black text-slate-800">Hoạt động gần đây</h3>
           <Link href="/requests" className="text-xs font-black text-primary uppercase tracking-tighter flex items-center gap-1">
             Tất cả <ArrowUpRight className="h-3 w-3" />
           </Link>
        </div>
        
        <div className="space-y-4">
          {recentRequests.map((req) => (
            <Link key={req.id} href={`/requests/${req.id}`}>
              <Card className="border-none shadow-sm rounded-[2rem] bg-white card-shadow hover:scale-[1.02] transition-transform duration-300 overflow-hidden">
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <HardDrive className="h-7 w-7 text-primary/20" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm text-slate-800 truncate mb-0.5">{req.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{req.equipmentName} • {req.unit}</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      req.status === 'closed' ? "bg-emerald-100 text-secondary" : 
                      req.status === 'pending_approval' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-primary"
                    )}>
                      {req.status === 'closed' ? <CheckCircle2 className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {recentRequests.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] card-shadow">
               <ClipboardList className="h-12 w-12 text-slate-200 mx-auto mb-4" />
               <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Không có dữ liệu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
