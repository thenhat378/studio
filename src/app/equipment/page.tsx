"use client"

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Plus, Package, Edit, Trash2, Loader2, HardDrive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Equipment } from '@/lib/types';

export default function EquipmentCatalog() {
  const { equipment, addEquipment, updateEquipment, deleteEquipment, currentUser } = useAppStore();
  const { toast } = useToast();
  
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Thiết bị điện tử-CNTT'
  });

  const categories = [
    'Thiết bị điện tử-CNTT',
    'Thiết bị điện',
    'Thiết bị nước',
    'Thiết bị làm mát',
    'Khóa',
    'Các loại thiết bị khác'
  ];

  const filteredEquipment = equipment.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', category: 'Thiết bị điện tử-CNTT' });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Equipment) => {
    setEditingItem(item);
    setFormData({ name: item.name, category: item.category });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateEquipment(editingItem.id, formData);
        toast({ title: "Đã cập nhật", description: "Thông tin thiết bị đã được thay đổi." });
      } else {
        await addEquipment(formData);
        toast({ title: "Đã thêm mới", description: "Thiết bị đã được thêm vào danh mục." });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể lưu thông tin." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa thiết bị này?")) {
      try {
        await deleteEquipment(id);
        toast({ title: "Đã xóa", description: "Thiết bị đã được gỡ khỏi hệ thống." });
      } catch (error) {
        toast({ variant: "destructive", title: "Lỗi", description: "Không thể xóa thiết bị." });
      }
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-20 px-6 animate-slide-up">
        <h2 className="text-xl font-black text-rose-500 uppercase tracking-tighter">Quyền truy cập bị từ chối</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-safe animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 mt-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tighter">
            <Package className="h-9 w-9 text-primary" />
            Danh mục thiết bị
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 opacity-80">QUẢN TRỊ DỮ LIỆU GỐC</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-primary hover:bg-primary/90 rounded-[1.8rem] h-18 md:h-16 px-8 font-black text-xs uppercase tracking-widest gap-2 shadow-2xl shadow-primary/10 active-scale transition-all">
          <Plus className="h-5 w-5" />
          Thêm thiết bị mới
        </Button>
      </div>

      <div className="relative px-4">
        <Search className="absolute left-10 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
        <Input 
          placeholder="Tìm theo tên thiết bị hoặc danh mục..." 
          className="pl-16 h-18 bg-white border-none shadow-sm rounded-[2rem] font-bold text-base text-slate-700 placeholder:text-slate-300 shadow-inner"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="border-none shadow-sm rounded-[3rem] bg-white card-shadow group hover:bg-slate-50 transition-all overflow-hidden border-t-8 border-t-primary/5 active-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-10">
              <div className="p-5 bg-primary/5 rounded-[1.8rem]">
                <HardDrive className="h-8 w-8 text-primary" />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl hover:bg-blue-50 text-blue-600" onClick={() => handleOpenEdit(item)}>
                  <Edit className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl hover:bg-rose-50 text-rose-600" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-6 w-6" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-0">
              <CardTitle className="text-xl font-black text-slate-800 mb-6 tracking-tight leading-tight uppercase">{item.name}</CardTitle>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-none font-black text-[9px] uppercase px-5 py-2 rounded-full">
                  {item.category}
                </Badge>
                <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">#{item.id.slice(-4)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-[4rem] p-12 border-none shadow-2xl w-[94vw] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tighter">
              {editingItem ? 'Cập nhật thiết bị' : 'Thêm thiết bị mới'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-8 py-10">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Tên thiết bị</Label>
              <Input 
                placeholder="Ví dụ: Máy chiếu Panasonic VX430" 
                className="h-18 rounded-[2rem] bg-slate-50 border-none font-bold px-8 shadow-inner"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Nhóm thiết bị</Label>
              <Select 
                value={formData.category} 
                onValueChange={val => setFormData(prev => ({ ...prev, category: val }))}
              >
                <SelectTrigger className="h-18 rounded-[2rem] bg-slate-50 border-none font-bold text-base px-8 shadow-inner">
                  <SelectValue placeholder="Chọn nhóm phân loại..." />
                </SelectTrigger>
                <SelectContent className="rounded-[2.5rem] p-4">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="rounded-xl h-14 font-bold text-sm mb-1">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-8">
              <Button type="submit" className="w-full bg-primary h-20 rounded-[2.5rem] font-black text-lg uppercase tracking-widest shadow-2xl shadow-primary/10 active-scale transition-all" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : 'LƯU VÀO DANH MỤC'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
