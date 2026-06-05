
"use client"

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Package, Edit, Trash2, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function EquipmentCatalog() {
  const { equipment } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Danh mục thiết bị</h1>
          <p className="text-muted-foreground">Quản lý các loại tài sản và thiết bị trong hệ thống</p>
        </div>
        <Button className="bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Thêm thiết bị
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm thiết bị..." className="pl-9" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Lọc
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {equipment.map((item) => (
          <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Package className="h-5 w-5 text-accent" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-1">{item.name}</CardTitle>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary">{item.category}</Badge>
                <span className="text-xs text-muted-foreground">ID: {item.id}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
