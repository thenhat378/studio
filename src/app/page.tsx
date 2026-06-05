"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Wrench,
  PlusCircle,
  HardDrive,
  Phone,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
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
  const [showFallback, setShowFallback] = useState(false);
  
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  // Quản lý vòng đời Recaptcha triệt để
  useEffect(() => {
    if (auth && !currentUser && !showOtpInput) {
      const container = document.getElementById('recaptcha-container');
      if (container && !recaptchaRef.current) {
        try {
          const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'normal',
            callback: () => {
              console.log("Recaptcha verified");
            },
            'expired-callback': () => {
              console.log("Recaptcha expired");
              if (recaptchaRef.current) {
                recaptchaRef.current.clear();
                recaptchaRef.current = null;
              }
            }
          });
          recaptchaRef.current = verifier;
          verifier.render();
        } catch (e) {
          console.error("Recaptcha initialization error:", e);
        }
      }
    }

    return () => {
      if (recaptchaRef.current) {
        try {
          recaptchaRef.current.clear();
          recaptchaRef.current = null;
        } catch (e) {}
      }
    };
  }, [auth, currentUser, showOtpInput]);

  if (!isInitialized) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !fullName || !unit) {
      toast({ variant: "destructive", title: "Thiếu thông tin", description: "Vui lòng nhập đầy đủ thông tin." });
      return;
    }
    
    setIsLoading(true);
    try {
      let formattedPhone = phoneNumber.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = `+84${formattedPhone.slice(1)}`;
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+84${formattedPhone}`;
      }

      if (!recaptchaRef.current) {
         throw new Error("Trình xác thực chưa sẵn sàng. Thử lại sau giây lát.");
      }

      const result = await sendOtp(formattedPhone, recaptchaRef.current);
      setConfirmationResult(result);
      setShowOtpInput(true);
      toast({ title: "Đã gửi mã OTP", description: "Vui lòng kiểm tra tin nhắn SMS." });
    } catch (error: any) {
      console.error("Auth error:", error);
      setShowFallback(true);
      toast({ 
        variant: "destructive", 
        title: "Lỗi cấu hình xác thực", 
        description: `Mã lỗi: ${error.code}. Bạn có thể sử dụng nút Đăng nhập trực tiếp bên dưới.`
      });
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
      toast({ title: "Thành công", description: "Chào mừng bạn quay lại!" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Lỗi mã OTP", description: "Mã không đúng hoặc đã hết hạn." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFallbackLogin = () => {
    loginAsTestAccount('requester', {
      id: `user-${Date.now()}`,
      name: fullName || 'Thành viên mới',
      unit: unit || 'Đơn vị chưa xác định',
      role: 'requester',
      phoneNumber: phoneNumber
    });
    toast({ title: "Đăng nhập trực tiếp", description: "Đã vào hệ thống thành công (Chế độ dự phòng)." });
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#F4F7FE]">
        <div className="w-full max-w-[400px] space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
             <div className="inline-flex p-4 bg-white rounded-[2rem] shadow-xl mb-2">
                <Wrench className="h-8 w-8 text-primary" />
             </div>
            <h1 className="text-xl font-black text-primary uppercase tracking-tighter">Requisition DUE</h1>
          </div>

          <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg font-black text-slate-800 uppercase">
                {showOtpInput ? 'Xác nhận OTP' : 'Tham gia hệ thống'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {!showOtpInput ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Số điện thoại</Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                          placeholder="09xx..." 
                          className="h-12 rounded-xl bg-slate-50 border-none font-bold pl-11"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Họ và tên</Label>
                      <Input 
                        placeholder="Nhập tên của bạn..." 
                        className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Đơn vị công tác</Label>
                      <Input 
                        placeholder="Khoa / Phòng / Trung tâm" 
                        className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-center my-4 overflow-hidden rounded-xl">
                    <div id="recaptcha-container"></div>
                  </div>

                  <Button type="submit" className="w-full h-12 font-black rounded-xl bg-primary shadow-lg uppercase text-[10px] tracking-widest" disabled={isLoading}>
                    {isLoading ? "Đang xử lý..." : "Gửi mã OTP qua SMS"}
                  </Button>

                  {showFallback && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-12 font-black rounded-xl border-emerald-500 text-emerald-600 uppercase text-[10px] tracking-widest gap-2 shadow-sm"
                      onClick={handleFallbackLogin}
                    >
                      <Lock className="h-4 w-4" /> Đăng nhập trực tiếp ngay
                    </Button>
                  )}
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase text-center block mb-2">Nhập 6 số từ tin nhắn điện thoại</Label>
                    <Input 
                      placeholder="000000" 
                      className="h-14 rounded-xl bg-slate-50 border-none font-black text-2xl text-center tracking-[0.5rem]"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 font-black rounded-xl bg-emerald-600 shadow-lg uppercase text-[10px]" disabled={isLoading}>
                    {isLoading ? "Đang xác thực..." : "Xác nhận & Vào hệ thống"}
                  </Button>
                  <Button variant="link" className="w-full text-xs text-slate-400 font-bold" onClick={() => setShowOtpInput(false)}>Thay đổi thông tin đăng ký</Button>
                </form>
              )}

              <div className="relative py-2 flex items-center gap-3">
                <div className="h-px bg-slate-100 flex-1"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase">Hoặc trải nghiệm nhanh</span>
                <div className="h-px bg-slate-100 flex-1"></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-11 rounded-xl text-[9px] font-black uppercase" onClick={() => loginAsTestAccount('requester')}>Nhân viên</Button>
                <Button variant="outline" className="h-11 rounded-xl text-[9px] font-black uppercase" onClick={() => loginAsTestAccount('unit_leader')}>Lãnh đạo</Button>
                <Button variant="outline" className="h-11 rounded-xl text-[9px] font-black uppercase" onClick={() => loginAsTestAccount('csvc_manager')}>Quản lý</Button>
                <Button variant="outline" className="h-11 rounded-xl text-[9px] font-black uppercase" onClick={() => loginAsTestAccount('technician')}>Kỹ thuật</Button>
              </div>
            </CardContent>
          </Card>
          <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">© 2026 Hệ thống quản lý sửa chữa DUE</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl shadow-blue-100">
         <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase opacity-60 mb-1">DUE Requisition</p>
              <h1 className="text-xl font-black">Chào, {currentUser.name.split(' ').pop()}!</h1>
              <p className="text-[9px] font-bold opacity-80 mt-1">{currentUser.unit}</p>
            </div>
            <Badge className="bg-white/20 border-none font-black text-[9px] uppercase tracking-tighter">{currentUser.role.replace('_', ' ')}</Badge>
         </div>
      </div>

      {currentUser.role === 'requester' && (
        <Link href="/requests/new">
          <Card className="border-none bg-white rounded-[2rem] shadow-sm hover:scale-[1.02] transition-all">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-accent">
                  <PlusCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800">Tạo phiếu mới</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hỗ trợ AI chẩn đoán lỗi</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </CardContent>
          </Card>
        </Link>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm rounded-[1.5rem] bg-white">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className={cn("p-2.5 rounded-xl mb-2", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{stat.label}</p>
              <p className="text-xl font-black text-slate-800">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Hoạt động gần đây</h3>
           <Link href="/requests" className="text-[10px] font-black text-primary uppercase">Xem tất cả</Link>
        </div>
        
        <div className="space-y-3">
          {roleFilteredRequests.slice(0, 5).map((req) => (
            <Link key={req.id} href={`/requests/${req.id}`}>
              <Card className="border-none shadow-sm rounded-[1.5rem] bg-white hover:bg-slate-50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex gap-3 items-center min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                      <HardDrive className="h-5 w-5 text-slate-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-800 truncate">{req.title}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{req.equipmentName} • {req.unit}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-200" />
                </CardContent>
              </Card>
            </Link>
          ))}
          {roleFilteredRequests.length === 0 && (
            <div className="text-center py-12 bg-white rounded-[2rem] border-2 border-dashed">
               <p className="text-[10px] font-black text-slate-300 uppercase">Chưa có dữ liệu hoạt động</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
