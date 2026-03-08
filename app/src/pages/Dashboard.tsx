import React, { useState, Suspense } from 'react';
import { KPIGrid } from '@/components/dashboard/KPIGrid';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { SalesManagementSection } from '@/components/dashboard/SalesManagementSection';
import { MonthlyRevenueChart } from '@/components/charts/MonthlyRevenueChart';
import { OrdersByCategoryChart } from '@/components/charts/OrdersByCategoryChart';
import { SalesByRegionChart } from '@/components/charts/SalesByRegionChart';
import { DailyOrdersChart } from '@/components/charts/DailyOrdersChart';
import { CustomerGrowthChart } from '@/components/charts/CustomerGrowthChart';
const GlobalOrdersMap = React.lazy(() => import('@/components/maps/GlobalOrdersMap'));
import { useKPI } from '@/hooks/useKPI';
import { useSales } from '@/hooks/useSales';
import { useAuth } from '@/hooks/useAuth';
import { uploadService } from '@/services/uploadService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Download, Upload, FileSpreadsheet } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    filters,
    filterOptions,
    updateFilters,
    clearFilters,
    sales,
    pagination,
    fetchSales,
    loading: salesLoading,
    createSale,
    updateSale,
    deleteSale,
  } = useSales();
  const {
    metrics,
    monthlyRevenue,
    ordersByCategory,
    salesByRegion,
    customerGrowth,
    dailyOrders,
    loading: kpiLoading,
    refetch: refetchKPI,
  } = useKPI(filters);

  // wrappers to also refresh charts when sales change
  const handleCreateSale = async (data: any) => {
    const res = await createSale(data);
    if (res.success) {
      refetchKPI();
    }
    return res;
  };

  const handleUpdateSale = async (id: string, data: any) => {
    const res = await updateSale(id, data);
    if (res.success) {
      refetchKPI();
    }
    return res;
  };

  const handleDeleteSale = async (id: string) => {
    const res = await deleteSale(id);
    if (res.success) {
      refetchKPI();
    }
    return res;
  };
  
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleExport = async (format: 'xlsx' | 'csv') => {
    try {
      const blob = await uploadService.exportSales(format, filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadService.uploadSales(selectedFile);
      if (result.success) {
        toast.success(`Successfully imported ${result.imported} records`);
        setUploadDialogOpen(false);
        setSelectedFile(null);
        fetchSales();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const blob = await uploadService.getTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sales-template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! Here's your business overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('xlsx')} className="gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <KPIGrid metrics={metrics} loading={kpiLoading} />

      {/* Global Orders Map */}
      <Suspense
        fallback={
          <div className="h-[460px] w-full rounded-lg border border-border bg-card p-4">
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm text-muted-foreground">Loading map...</span>
            </div>
          </div>
        }
      >
        <GlobalOrdersMap />
      </Suspense>

      {/* Filters */}
      <DashboardFilters
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={updateFilters}
        onClearFilters={clearFilters}
        onExport={() => handleExport('xlsx')}
        onImport={() => setUploadDialogOpen(true)}
        userRole={user?.role}
      />

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MonthlyRevenueChart data={monthlyRevenue} loading={kpiLoading} />
            <OrdersByCategoryChart data={ordersByCategory} loading={kpiLoading} />
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MonthlyRevenueChart data={monthlyRevenue} loading={kpiLoading} />
            <SalesByRegionChart data={salesByRegion} loading={kpiLoading} />
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <OrdersByCategoryChart data={ordersByCategory} loading={kpiLoading} />
            <DailyOrdersChart data={dailyOrders} loading={kpiLoading} />
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CustomerGrowthChart data={customerGrowth} loading={kpiLoading} />
            <SalesByRegionChart data={salesByRegion} loading={kpiLoading} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Sales Data Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Sales Data</h2>
        <SalesManagementSection
          sales={sales}
          pagination={pagination}
          loading={salesLoading}
          userRole={user?.role}
          onPageChange={fetchSales}
          onCreateSale={handleCreateSale}
          onUpdateSale={handleUpdateSale}
          onDeleteSale={handleDeleteSale}
        />
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Sales Data</DialogTitle>
            <DialogDescription>
              Upload an Excel file with sales data. Download the template to see the required format.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button variant="outline" onClick={downloadTemplate} className="w-full gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Download Template
            </Button>
            <div className="space-y-2">
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
              />
            </div>
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
