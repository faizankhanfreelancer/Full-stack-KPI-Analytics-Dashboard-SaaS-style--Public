import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Edit2,
  Trash2,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Sale, SalesPagination } from '@/types';
import { cn } from '@/lib/utils';

interface SalesDataTableProps {
  data: Sale[];
  pagination: SalesPagination;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  onEdit?: (sale: Sale) => void;
  onDelete?: (id: string, productName: string) => void;
}

type SortField = 'date' | 'product' | 'category' | 'region' | 'salesperson' | 'orders' | 'revenue' | 'profit';
type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  field: SortField;
  direction: SortDirection;
}

const formatCurrency = (value: number) => {
  const locale = navigator.language || 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  const locale = navigator.language || 'en-US';
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Electronics: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Clothing: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'Home & Garden': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Sports: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    Books: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Health & Beauty': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    Toys: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Food & Beverage': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
};

export const SalesDataTable: React.FC<SalesDataTableProps> = ({
  data,
  pagination,
  loading,
  onPageChange,
  onSort,
  onEdit,
  onDelete,
}) => {
  const [sort, setSort] = useState<SortState>({ field: 'date', direction: 'desc' });
  // responsive: ensure horizontal scroll on small screens is available via parent overflow

  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: SortField) => {
    let direction: SortDirection = 'asc';
    if (sort.field === field) {
      if (sort.direction === 'asc') direction = 'desc';
      else if (sort.direction === 'desc') direction = null;
    }
    setSort({ field, direction });
    onSort?.(field, direction || 'asc');
  };

  const getSortIcon = (field: SortField) => {
    if (sort.field !== field) return <ArrowUpDown className="w-4 h-4" />;
    if (sort.direction === 'asc') return <ArrowUp className="w-4 h-4" />;
    if (sort.direction === 'desc') return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4" />;
  };

  const filteredData = searchQuery
    ? data.filter(
        (item) =>
          item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.salesperson.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.region.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4">
          <div className="h-10 bg-muted rounded animate-pulse mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by product, salesperson, category, or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('date')}
                  className="gap-1"
                >
                  Date
                  {getSortIcon('date')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('product')}
                  className="gap-1"
                >
                  Product
                  {getSortIcon('product')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('category')}
                  className="gap-1"
                >
                  Category
                  {getSortIcon('category')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('region')}
                  className="gap-1"
                >
                  Region
                  {getSortIcon('region')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('salesperson')}
                  className="gap-1"
                >
                  Salesperson
                  {getSortIcon('salesperson')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('orders')}
                  className="gap-1 ml-auto"
                >
                  Orders
                  {getSortIcon('orders')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('revenue')}
                  className="gap-1 ml-auto"
                >
                  Revenue
                  {getSortIcon('revenue')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('profit')}
                  className="gap-1 ml-auto"
                >
                  Profit
                  {getSortIcon('profit')}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No sales data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((sale) => (
                <TableRow key={sale._id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{formatDate(sale.date)}</TableCell>
                  <TableCell>{sale.product}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn('font-normal', getCategoryColor(sale.category))}>
                      {sale.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{sale.region}</TableCell>
                  <TableCell>{sale.salesperson}</TableCell>
                  <TableCell className="text-right">{sale.orders}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(sale.revenue)}
                  </TableCell>
                  <TableCell className="text-right text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(sale.profit)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(sale)}
                        className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete?.(sale._id, sale.product)}
                        className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={pagination.page === 1}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm px-2">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pagination.totalPages)}
            disabled={pagination.page === pagination.totalPages}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
