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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tighter">
            <Package className="h-8 w-8 text-primary" />
            Danh mục thiết bị
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 opacity-80">THIẾT LẬP DỮ LIỆU GỐC HỆ THỐNG</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-primary hover:bg-primary/90 rounded-2xl h-16 md:h-14 font-black text-xs uppercase tracking-widest gap-2 shadow-2xl shadow-primary/10 active:scale-95 transition-all">
          <Plus className="h-5 w-5" />
          Thêm thiết bị mới
        </Button>
      </div>

      <div className="relative px-4 md:px-0">
        <Search className="absolute left-9 md:left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
        <Input 
          placeholder="Tìm theo tên thiết bị hoặc danh mục..." 
          className="pl-16 md:pl-14 h-16 bg-white border-none shadow-sm rounded-[1.8rem] font-bold text-sm text-slate-700 placeholder:text-slate-300"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4 md:px-0">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="border-none shadow-sm rounded-[3rem] bg-white card-shadow group hover:bg-slate-50 transition-all overflow-hidden border-t-8 border-t-primary/5 active:scale-95">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-8">
              <div className="p-4 bg-primary/5 rounded-[1.5rem]">
                <HardDrive className="h-7 w-7 text-primary" />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-blue-50 text-blue-600" onClick={() => handleOpenEdit(item)}>
                  <Edit className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-rose-50 text-rose-600" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <CardTitle className="text-xl font-black text-slate-800 mb-4 tracking-tight leading-tight">{item.name}</CardTitle>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-none font-black text-[9px] uppercase px-4 py-1.5 rounded-full">
                  {item.category}
                </Badge>
                <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">#{item.id.slice(-4)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[4rem] card-shadow border-2 border-dashed border-slate-100 mx-4 md:mx-0">
           <Package className="h-24 w-24 text-slate-100 mx-auto mb-6" />
           <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">CHƯA CÓ DỮ LIỆU THIẾT BỊ</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-[3.5rem] p-10 border-none shadow-2xl w-[90vw] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary uppercase tracking-tighter">
              {editingItem ? 'Cập nhật thiết bị' : 'Thêm thiết bị mới'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-8 py-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Tên thiết bị</Label>
              <Input 
                placeholder="Ví dụ: Máy chiếu Panasonic VX430" 
                className="h-16 rounded-[1.8rem] bg-slate-50 border-none font-bold px-6"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Nhóm thiết bị</Label>
              <Select 
                value={formData.category} 
                onValueChange={val => setFormData(prev => ({ ...prev, category: val }))}
              >
                <SelectTrigger className="h-16 rounded-[1.8rem] bg-slate-50 border-none font-bold px-6">
                  <SelectValue placeholder="Chọn nhóm phân loại..." />
                </SelectTrigger>
                <SelectContent className="rounded-[2rem] border-none shadow-2xl p-2">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="rounded-xl h-12 font-bold">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-6">
              <Button type="submit" className="w-full bg-primary h-18 rounded-[2rem] font-black text-base uppercase tracking-widest shadow-2xl shadow-primary/10 active:scale-95 transition-all" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Lưu vào danh mục'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}