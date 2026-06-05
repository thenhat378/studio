
"use client"

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { aiAssistedRequestCreation } from '@/ai/flows/ai-assisted-request-creation-flow';
import { useToast } from '@/hooks/use-toast';

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

  const [aiSuggestions, setAiSuggestions] = useState<{
    causes: string[];
    category: string;
    recommendedEquipment: string[];
  } | null>(null);

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
        causes: result.suggestedCauses,
        category: result.category,
        recommendedEquipment: result.recommendedEquipment
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
    if (!formData.title || !formData.description || !formData.equipmentId || !currentUser) return;

    setIsSubmitting(true);
    const equip = equipment.find(e => e.id === formData.equipmentId);
    
    addRequest({
      title: formData.title,
      description: formData.description,
      equipmentId: formData.equipmentId,
      equipmentName: equip?.name || '',
      category: equip?.category || 'General',
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      unit: currentUser.unit || 'Unknown',
      aiSuggestions: aiSuggestions ? {
        causes: aiSuggestions.causes,
        recommendedEquipment: aiSuggestions.recommendedEquipment
      } : undefined
    });

    toast({
      title: "Thành công",
      description: "Yêu cầu của bạn đã được gửi đi và đang chờ phê duyệt."
    });

    router.push('/requests');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Tạo phiếu yêu cầu sửa chữa</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Thông tin sự cố</CardTitle>
              <CardDescription>Mô tả chi tiết vấn đề bạn đang gặp phải</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề yêu cầu</Label>
                <Input 
                  id="title" 
                  placeholder="Ví dụ: Máy chiếu phòng 302 không lên" 
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="description">Mô tả sự cố</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:text-accent flex items-center gap-2"
                    onClick={handleAiAssist}
                    disabled={isAiLoading || !formData.description}
                  >
                    {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Phân tích bằng AI
                  </Button>
                </div>
                <Textarea 
                  id="description" 
                  placeholder="Mô tả chi tiết tình trạng, thời điểm xảy ra..." 
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment">Thiết bị cần sửa</Label>
                <Select 
                  value={formData.equipmentId} 
                  onValueChange={val => setFormData(prev => ({ ...prev, equipmentId: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thiết bị từ danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipment.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.name} ({e.category})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {aiSuggestions && (
            <Card className="border-accent/20 bg-accent/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" /> Gợi ý từ FixFlow AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Nguyên nhân có thể:</p>
                  <ul className="space-y-1">
                    {aiSuggestions.causes.map((cause, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Phân loại AI:</p>
                    <p className="text-sm">{aiSuggestions.category}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Vật tư gợi ý:</p>
                    <p className="text-sm">{aiSuggestions.recommendedEquipment.join(', ') || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>Hủy bỏ</Button>
            <Button type="submit" className="bg-primary" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Gửi yêu cầu phê duyệt
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
