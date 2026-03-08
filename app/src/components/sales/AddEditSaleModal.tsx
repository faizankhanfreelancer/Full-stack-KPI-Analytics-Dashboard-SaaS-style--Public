import React, { useState, useEffect } from 'react';
import type { Sale } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AddEditSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Sale, '_id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  editingData?: Sale | null;
  loading?: boolean;
}

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Health & Beauty',
  'Toys',
  'Food & Beverage',
];

const REGIONS = [
  'North America',
  'Europe',
  'Asia Pacific',
  'Latin America',
  'Middle East',
  'Africa',
];

export const AddEditSaleModal: React.FC<AddEditSaleModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editingData,
  loading = false,
}) => {
  const [formData, setFormData] = useState<Omit<Sale, '_id' | 'createdAt' | 'updatedAt'>>({
    date: new Date().toISOString().split('T')[0],
    product: '',
    category: '',
    region: '',
    salesperson: '',
    orders: 0,
    revenue: 0,
    profit: 0,
    customerName: '',
    city: '',
    country: '',
    latitude: undefined,
    longitude: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingData) {
      setFormData({
        date: editingData.date.split('T')[0],
        product: editingData.product,
        category: editingData.category,
        region: editingData.region,
        salesperson: editingData.salesperson,
        orders: editingData.orders,
        revenue: editingData.revenue,
        profit: editingData.profit,
        customerName: editingData.customerName || '',
        city: editingData.city || '',
        country: editingData.country || '',
        latitude: editingData.latitude,
        longitude: editingData.longitude,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        product: '',
        category: '',
        region: '',
        salesperson: '',
        orders: 0,
        revenue: 0,
        profit: 0,
        customerName: '',
        city: '',
        country: '',
        latitude: undefined,
        longitude: undefined,
      });
    }
    setError(null);
  }, [editingData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.product.trim()) {
      setError('Product name is required');
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      return;
    }
    if (!formData.region) {
      setError('Region is required');
      return;
    }
    if (!formData.salesperson.trim()) {
      setError('Salesperson is required');
      return;
    }
    if (formData.orders < 0) {
      setError('Orders cannot be negative');
      return;
    }
    if (formData.revenue < 0) {
      setError('Revenue cannot be negative');
      return;
    }
    if (formData.profit < 0) {
      setError('Profit cannot be negative');
      return;
    }

    const result = await onSubmit(formData);
    if (result.success) {
      onOpenChange(false);
    } else {
      setError(result.error || 'An error occurred');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingData ? 'Edit Sale Record' : 'Add New Sale Record'}
          </DialogTitle>
          <DialogDescription>
            {editingData
              ? 'Update the sale information below.'
              : 'Fill in the details to add a new sale record.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              disabled={loading}
            />
          </div>

          {/* Product */}
          <div className="space-y-2">
            <Label htmlFor="product">Product Name</Label>
            <Input
              id="product"
              placeholder="e.g. Product 1"
              value={formData.product}
              onChange={(e) =>
                setFormData({ ...formData, product: e.target.value })
              }
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Region */}
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select
              value={formData.region}
              onValueChange={(value) =>
                setFormData({ ...formData, region: value })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((reg) => (
                  <SelectItem key={reg} value={reg}>
                    {reg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Salesperson */}
          <div className="space-y-2">
            <Label htmlFor="salesperson">Salesperson</Label>
            <Input
              id="salesperson"
              placeholder="e.g. John Smith"
              value={formData.salesperson}
              onChange={(e) =>
                setFormData({ ...formData, salesperson: e.target.value })
              }
              disabled={loading}
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="e.g. Berlin"
                value={formData.city || ''}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="e.g. Germany"
                value={formData.country || ''}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="e.g. 52.5200"
                value={formData.latitude ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="e.g. 13.4050"
                value={formData.longitude ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                disabled={loading}
              />
            </div>
          </div>

          {/* Orders, Revenue, Profit Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="orders">Orders</Label>
              <Input
                id="orders"
                type="number"
                min="0"
                value={formData.orders}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    orders: parseInt(e.target.value) || 0,
                  })
                }
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue">Revenue ($)</Label>
              <Input
                id="revenue"
                type="number"
                min="0"
                value={formData.revenue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    revenue: parseInt(e.target.value) || 0,
                  })
                }
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profit">Profit ($)</Label>
              <Input
                id="profit"
                type="number"
                min="0"
                value={formData.profit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profit: parseInt(e.target.value) || 0,
                  })
                }
                disabled={loading}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? 'Saving...'
                : editingData
                ? 'Update Record'
                : 'Add Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
