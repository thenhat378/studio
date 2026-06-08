"use client"

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, ChevronLeft, CheckCircle2, ImagePlus, X, ImageIcon, Camera, AlertCircle, MapPin, Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { aiAssistedRequestCreation } from '@/ai/flows/ai-assisted-request-creation-flow';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/lib/image-utils';
import Image from 'next/image';

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
    quantity: '' as any // Ô nhập liệu trống cho phép nhân viên tự nhập
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

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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
    
    const userUnit = currentUser?.unit?.trim();
    if (!userUnit) {
      toast({
        variant: "destructive",
        title: "Thiếu đơn vị công tác",
        description: "Vui lòng cập nhật thông tin đơn vị trong hồ sơ trước khi tạo phiếu."
      });
      return;
    }

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
    
    const requestData: any = {
      location: formData.location.trim(),
      description: formData.description.trim(),
      quantity: Number(formData.quantity),
      equipmentId: formData.equipmentId,
      equipmentName: equip?.name || 'Thiết bị không xác định',
      category: equip?.category || 'General',
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      unit: userUnit,
      images: images,
    };

    if (aiSuggestions) {
      requestData.aiSuggestions = {
        causes: aiSuggestions.causes || [],
        recommendedEquipment: aiSuggestions.recommendedEquipment || []
      };
    }

    try {
      await addRequest(requestData);
      toast({
        title: "Thành công",
        description: "Yêu cầu của bạn đã được gửi và đang chờ Quản lý đơn vị duyệt."
      });
      router.push('/requests');
    } catch (error: any) {
      console.error("Submit error:", error);
      toast({
        variant: "destructive",
        title: "Lỗi gửi yêu cầu",
        description: error.message || "Đã xảy ra lỗi hệ thống, vui lòng thử lại."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-safe animate-slide-up">
      <div className="flex items-center gap-3 mb-6 px-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl bg-white shadow-sm h-12 w-12">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Tạo phiếu mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4">
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-[3rem] bg-white card-shadow overflow-hidden">
            <CardHeader className="bg-slate-50/50 p-8">
              <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tighter">Thông tin sự cố</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-3">
                <Label htmlFor="location" className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Vị trí hư hỏng (Tiêu đề ngắn)</Label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                  <Input 
                    id="location" 
                    placeholder="Ví dụ: Phòng 302, Hội trường A..." 
                    className="h-16 rounded-2xl bg-slate-50 border-none font-bold pl-14 pr-6"
                    value={formData.location}
                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="description" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mô tả chi tiết lỗi</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:text-accent font-black text-[10px] uppercase tracking-widest h-8"
                    onClick={handleAiAssist}
                    disabled={isAiLoading || !formData.description}
                  >
                    {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Phân tích AI
                  </Button>
                </div>
                <Textarea 
                  id="description" 
                  placeholder="Mô tả cụ thể tình trạng lỗi..." 
                  className="min-h-[160px] rounded-[2rem] bg-slate-50 border-none font-bold p-6 leading-relaxed"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              {/* Ô Số lượng tự nhập ngay sau phần mô tả */}
              <div className="space-y-3">
                <Label htmlFor="quantity" className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Số lượng thiết bị</Label>
                <div className="relative">
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                  <Input 
                    id="quantity" 
                    type="number"
                    min="1"
                    className="h-16 rounded-2xl bg-slate-50 border-none font-bold pl-14 pr-6"
                    value={formData.quantity}
                    onChange={e => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="Nhập số lượng..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="equipment" className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Thiết bị sự cố</Label>
                <Select 
                  value={formData.equipmentId} 
                  onValueChange={val => setFormData(prev => ({ ...prev, equipmentId: val }))}
                >
                  <SelectTrigger className="h-16 rounded-2xl bg-slate-50 border-none font-bold px-6">
                    <SelectValue placeholder="Chọn thiết bị từ danh mục" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[2rem] border-none shadow-2xl p-2">
                    {equipment.map(e => (
                      <SelectItem key={e.id} value={e.id} className="rounded-xl h-12 font-bold">{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-4">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2 tracking-widest">
                  <Camera className="h-4 w-4 text-primary" /> Hình ảnh minh chứng (Tự động nén)
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="aspect-square rounded-[2rem] border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-all bg-primary/5 active:scale-95 shadow-sm">
                    <Camera className="h-8 w-8 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase text-center px-4 leading-tight">Mở máy ảnh</span>
                    <input type="file" multiple accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
                  </label>
                  <label className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                    <ImagePlus className="h-8 w-8 text-slate-300" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Thư viện</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button type="submit" className="w-full bg-primary h-18 rounded-[2rem] font-black text-base uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all active:scale-95" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Gửi phiếu phê duyệt"}
          </Button>
        </div>
      </form>
    </div>
  );
}
