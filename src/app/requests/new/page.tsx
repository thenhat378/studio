
"use client"

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, ChevronLeft, CheckCircle2, ImagePlus, X, ImageIcon, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { aiAssistedRequestCreation } from '@/ai/flows/ai-assisted-request-creation-flow';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function NewRequest() {
  const { equipment, addRequest, currentUser } = useAppStore();
  const { toast } = useToast();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    equipmentId: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<{
    causes: string[];
    category: string;
    recommendedEquipment: string[];
  } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // Giới hạn dung lượng ảnh khoảng 1MB để tránh lỗi Firestore payload (Firestore doc limit is 1MB)
      if (file.size > 1 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Ảnh quá lớn",
          description: "Vui lòng chọn ảnh dưới 1MB."
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
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
    if (!formData.title || !formData.description || !formData.equipmentId || !currentUser) {
      toast({
        variant: "destructive",
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ các trường bắt buộc."
      });
      return;
    }

    setIsSubmitting(true);
    const equip = equipment.find(e => e.id === formData.equipmentId);
    
    const requestData: any = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      equipmentId: formData.equipmentId,
      equipmentName: equip?.name || 'Thiết bị không xác định',
      category: equip?.category || 'General',
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      unit: currentUser.unit || 'Đơn vị không xác định',
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
        description: "Yêu cầu của bạn đã được gửi đi."
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
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-black text-slate-800">Tạo phiếu yêu cầu</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem] bg-white card-shadow overflow-hidden">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tighter">Thông tin sự cố</CardTitle>
              <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mô tả chi tiết vấn đề cần xử lý</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[10px] font-black uppercase text-slate-400 ml-1">Tiêu đề yêu cầu</Label>
                <Input 
                  id="title" 
                  placeholder="Ví dụ: Máy chiếu phòng 302 không lên" 
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="description" className="text-[10px] font-black uppercase text-slate-400">Mô tả sự cố</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:text-accent font-black text-[10px] uppercase tracking-widest"
                    onClick={handleAiAssist}
                    disabled={isAiLoading || !formData.description}
                  >
                    {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Sparkles className="h-4 w-4 mr-1" />}
                    Phân tích bằng AI
                  </Button>
                </div>
                <Textarea 
                  id="description" 
                  placeholder="Mô tả tình trạng lỗi..." 
                  className="min-h-[120px] rounded-2xl bg-slate-50 border-none font-bold p-4"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment" className="text-[10px] font-black uppercase text-slate-400 ml-1">Thiết bị cần sửa</Label>
                <Select 
                  value={formData.equipmentId} 
                  onValueChange={val => setFormData(prev => ({ ...prev, equipmentId: val }))}
                >
                  <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold">
                    <SelectValue placeholder="Chọn thiết bị từ danh mục" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl">
                    {equipment.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                  <Camera className="h-3.5 w-3.5 text-primary" /> Hình ảnh sự cố (Đính kèm minh chứng hình ảnh)
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group">
                      <Image src={img} alt="Preview" fill className="object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors bg-slate-50/50">
                    <Camera className="h-8 w-8 text-primary/60" />
                    <span className="text-[9px] font-black text-primary/60 uppercase text-center px-1">Mở máy ảnh</span>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      capture="environment" 
                      className="hidden" 
                      onChange={handleImageChange} 
                    />
                  </label>
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                    <ImagePlus className="h-8 w-8 text-slate-300" />
                    <span className="text-[9px] font-black text-slate-400 uppercase">Thư viện</span>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange} 
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {aiSuggestions && (
            <Card className="border-accent/20 bg-accent/5 rounded-[2rem] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black flex items-center gap-2 text-primary uppercase tracking-widest">
                  <Sparkles className="h-4 w-4" /> Gợi ý từ FixFlow AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6 pt-0">
                <div className="bg-white/50 p-4 rounded-2xl">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Phân tích nguyên nhân:</p>
                  <ul className="space-y-1">
                    {aiSuggestions.causes.map((cause, i) => (
                      <li key={i} className="text-xs font-bold flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="h-3 w-3 text-accent mt-0.5 shrink-0" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Phân loại AI:</p>
                    <p className="text-xs font-bold text-primary">{aiSuggestions.category}</p>
                  </div>
                  <div className="bg-white/50 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Vật tư gợi ý:</p>
                    <p className="text-xs font-bold text-primary">{aiSuggestions.recommendedEquipment.join(', ') || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full bg-primary h-16 rounded-2xl font-black text-base uppercase tracking-widest shadow-xl shadow-blue-100 transition-all active:scale-95" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Gửi yêu cầu phê duyệt"}
            </Button>
            <Button type="button" variant="ghost" className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400" onClick={() => router.back()}>
              Hủy bỏ yêu cầu
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
