
"use client"

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Plus, Package, Edit, Trash2, Filter, Loader2, RefreshCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const { equipment, addEquipment, updateEquipment, deleteEquipment, resetSystem, currentUser } = useAppStore();
  const { toast } = useToast();
  
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Thiết bị điện tử-CNTT'
  });

  const categories = [
    'Thiết bị điện tử-CNTT',
    'Thiết bị điện',
    'Thiết bị nước',
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

  const handleReset = async () => {
    if (confirm("CẢNH BÁO: Hành động này sẽ xóa TOÀN BỘ Phiếu yêu cầu và Thiết bị để phục vụ kiểm thử lại từ đầu. Bạn có chắc chắn?")) {
      setIsResetting(true);
      try {
        await resetSystem();
        toast({ title: "Đã reset hệ thống", description: "Toàn bộ dữ liệu đã được làm sạch." });
      } catch (error) {
        toast({ variant: "destructive", title: "Lỗi", description: "Không thể làm sạch dữ liệu." });
      } finally {
        setIsResetting(false);
      }
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-black text-rose-500 uppercase">Quyền truy cập bị từ chối</h2>
        <p className="text-sm font-bold text-slate-400 mt-2">Chỉ Quản trị viên mới có thể truy cập trang này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
            <Package className="h-7 w-7 text-primary" />
            Danh mục thiết bị
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Quản trị viên quản lý danh mục gốc</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="rounded-2xl h-14 font-black text-xs uppercase tracking-widest gap-2 text-rose-500 border-rose-100 hover:bg-rose-50">
            {isResetting ? <Loader2 className="animate-spin" /> : <RefreshCcw className="h-5 w-5" />}
            Xóa toàn bộ dữ liệu
          </Button>
          <Button onClick={handleOpenAdd} className="bg-primary hover:bg-primary/90 rounded-2xl h-14 font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-blue-100">
            <Plus className="h-5 w-5" />
            Thêm thiết bị mới
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Tìm theo tên thiết bị hoặc danh mục..." 
            className="pl-12 h-14 bg-white border-none shadow-sm rounded-2xl font-bold text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="border-none shadow-sm rounded-[2.5rem] bg-white card-shadow group hover:bg-slate-50 transition-all overflow-hidden border-t-4 border-t-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
              <div className="p-3 bg-primary/5 rounded-2xl">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-blue-50 text-blue-600" onClick={() => handleOpenEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-50 text-rose-600" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <CardTitle className="text-lg font-black text-slate-800 mb-3">{item.name}</CardTitle>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-black text-[9px] uppercase px-3 py-1">
                  {item.category}
                </Badge>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">ID: {item.id.slice(-6)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[4rem] card-shadow border-2 border-dashed border-slate-100">
           <Package className="h-20 w-20 text-slate-100 mx-auto mb-6" />
           <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Danh mục đang trống</p>
        </div>
      )}

      {/* Dialog Thêm/Sửa */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-[3rem] p-10 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-primary uppercase tracking-tighter">
              {editingItem ? 'Cập nhật thiết bị' : 'Thêm thiết bị mới'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tên thiết bị</Label>
              <Input 
                placeholder="Nhập tên thiết bị..." 
                className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nhóm thiết bị</Label>
              <Select 
                value={formData.category} 
                onValueChange={val => setFormData(prev => ({ ...prev, category: val }))}
              >
                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold">
                  <SelectValue placeholder="Chọn nhóm..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-xl">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-6">
              <Button type="submit" className="w-full bg-primary h-16 rounded-2xl font-black text-base uppercase tracking-widest shadow-xl shadow-blue-100" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Xác nhận lưu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
