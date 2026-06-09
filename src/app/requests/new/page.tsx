"use client"

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, ChevronLeft, ImagePlus, ImageIcon, Camera, MapPin, Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { aiAssistedRequestCreation } from '@/ai/flows/ai-assisted-request-creation-flow';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/lib/image-utils';

export default function NewRequest() {
  const { equipment, addRequest, currentUser } = useAppStore();
  const { toast } = useToast();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    equipmentId: '',
    quantity: '' as any
  });

  const [images, setImages] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<{
    causes: string[];
    category: string;
    recommendedEquipment: string[];
  } | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const originalDataUrl = reader.result as string;
        try {
          const compressed = await compressImage(originalDataUrl, 1280, 1280, 0.7);
          setImages(prev => [...prev, compressed]);
        } catch (err) {
          console.error("Compression error:", err);
          setImages(prev => [...prev, originalDataUrl]);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleAiAssist = async () => {
    if (!formData.description) {
      toast({
        variant: "destructive",
        title: "Thiếu thông tin",
        description: "Vui lòng nhập mô tả lỗi để AI có thể hỗ trợ."
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await aiAssistedRequestCreation({ problemDescription: formData.description });
      setAiSuggestions({
        causes: result.suggestedCauses || [],
        category: result.category || 'General',
        recommendedEquipment: result.recommendedEquipment || []
      });
      toast({
        title: "Phân tích hoàn tất",
        description: "AI đã đưa ra gợi ý nguyên nhân và phân loại cho bạn."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi AI",
        description: "Không thể nhận hỗ trợ từ AI lúc này."
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location || !formData.description || !formData.equipmentId || !formData.quantity) {
      toast({
        variant: "destructive",
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ các trường bắt buộc, bao gồm cả số lượng."
      });
      return;
    }

    setIsSubmitting(true);
    const equip = equipment.find(e => e.id === formData.equipmentId);
    
    try {
      await addRequest({
        location: formData.location.trim(),
        description: formData.description.trim(),
        quantity: Number(formData.quantity),
        equipmentId: formData.equipmentId,
        equipmentName: equip?.name || 'Thiết bị không xác định',
        category: equip?.category || 'General',
        requesterId: currentUser!.id,
        requesterName: currentUser!.name,
        unit: currentUser!.unit || '',
        images: images,
      });
      toast({
        title: "Thành công",
        description: "Yêu cầu của bạn đã được gửi và đang chờ duyệt."
      });
      router.push('/requests');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi gửi yêu cầu",
        description: "Đã xảy ra lỗi, vui lòng thử lại."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-safe animate-slide-up">
      <div className="flex items-center gap-4 px-4 mt-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl bg-white shadow-sm h-14 w-14">
          <ChevronLeft className="h-7 w-7 text-slate-600" />
        </Button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Gửi phiếu yêu cầu</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hoàn thành các thông tin bên dưới</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 space-y-6">
        <Card className="border-none shadow-sm rounded-[3rem] bg-white card-shadow overflow-hidden">
          <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
            <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Địa điểm & Thiết bị
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8 md:p-10">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Vị trí hư hỏng</Label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
                <Input 
                  placeholder="Ví dụ: Phòng 302, Hội trường A..." 
                  className="h-18 rounded-[2rem] bg-slate-50 border-none font-bold text-base pl-16 pr-6 shadow-inner"
                  value={formData.location}
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-4">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mô tả sự cố</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-accent font-black text-[10px] uppercase tracking-widest h-10 px-4 bg-primary/5 rounded-full"
                  onClick={handleAiAssist}
                  disabled={isAiLoading || !formData.description}
                >
                  {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Phân tích AI
                </Button>
              </div>
              <Textarea 
                placeholder="Ví dụ: Máy chiếu không lên nguồn, đèn tín hiệu nháy đỏ..." 
                className="min-h-[160px] rounded-[2.5rem] bg-slate-50 border-none font-bold p-8 leading-relaxed shadow-inner"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Số lượng</Label>
              <div className="relative">
                <Hash className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
                <Input 
                  type="number"
                  min="1"
                  className="h-18 rounded-[2rem] bg-slate-50 border-none font-bold text-base pl-16 pr-6 shadow-inner"
                  value={formData.quantity}
                  onChange={e => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Nhập số lượng..."
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Tên thiết bị</Label>
              <Select 
                value={formData.equipmentId} 
                onValueChange={val => setFormData(prev => ({ ...prev, equipmentId: val }))}
              >
                <SelectTrigger className="h-18 rounded-[2rem] bg-slate-50 border-none font-bold text-base px-8 shadow-inner">
                  <SelectValue placeholder="Chọn thiết bị hỏng..." />
                </SelectTrigger>
                <SelectContent className="rounded-[2.5rem] border-none shadow-2xl p-4">
                  {equipment.map(e => (
                    <SelectItem key={e.id} value={e.id} className="rounded-xl h-14 font-bold text-sm mb-1">{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 tracking-widest">
                <Camera className="h-4 w-4 text-primary" /> Đính kèm hình ảnh
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <label className="aspect-square rounded-[2.5rem] border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-primary/5 transition-all bg-primary/5 active-scale">
                  <div className="p-4 bg-white rounded-2xl shadow-sm">
                    <Camera className="h-7 w-7 text-primary" />
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase text-center px-6 leading-tight">Chụp ảnh mới</span>
                  <input type="file" multiple accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
                </label>
                <label className="aspect-square rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all active-scale">
                   <div className="p-4 bg-white rounded-2xl shadow-sm">
                    <ImagePlus className="h-7 w-7 text-slate-400" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Thư viện ảnh</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          type="submit" 
          className="w-full bg-primary h-20 rounded-[2.5rem] font-black text-lg uppercase tracking-widest shadow-2xl shadow-primary/20 active-scale" 
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : "Gửi phiếu ngay"}
        </Button>
      </form>
    </div>
  );
}
