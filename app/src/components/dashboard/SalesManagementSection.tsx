import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Sale } from '@/types';
import { Button } from '@/components/ui/button';
import { SalesDataTable } from './SalesDataTable';
import { AddEditSaleModal } from '@/components/sales/AddEditSaleModal';
import { DeleteConfirmDialog } from '@/components/sales/DeleteConfirmDialog';
import { toast } from 'sonner';

interface SalesManagementSectionProps {
  sales: Sale[];
  pagination: any;
  loading?: boolean;
  userRole?: string;
  onPageChange: (page: number) => void;
  onCreateSale: (data: Omit<Sale, '_id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  onUpdateSale: (id: string, data: Partial<Sale>) => Promise<{ success: boolean; error?: string }>;
  onDeleteSale: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const SalesManagementSection: React.FC<SalesManagementSectionProps> = ({
  sales,
  pagination,
  loading,
  userRole,
  onPageChange,
  onCreateSale,
  onUpdateSale,
  onDeleteSale,
}) => {
  const canAdd = userRole === 'admin' || userRole === 'manager';
  const canEdit = canAdd;
  const canDelete = userRole === 'admin';

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Sale | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddClick = () => {
    setEditingData(null);
    setAddModalOpen(true);
  };

  const handleEditClick = (sale: Sale) => {
    setEditingData(sale);
    setAddModalOpen(true);
  };

  const handleDeleteClick = (id: string, productName: string) => {
    setDeletingId(id);
    setDeletingProduct(productName);
    setDeleteDialogOpen(true);
  };

  const handleModalSubmit = async (
    data: Omit<Sale, '_id' | 'createdAt' | 'updatedAt'>
  ) => {
    setIsSubmitting(true);
    try {
      const result = editingData
        ? await onUpdateSale(editingData._id, data)
        : await onCreateSale(data);

      if (result.success) {
        toast.success(
          editingData
            ? 'Sale record updated successfully'
            : 'Sale record added successfully'
        );
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      const result = await onDeleteSale(deletingId);
      if (result.success) {
        toast.success('Sale record deleted successfully');
        setDeleteDialogOpen(false);
        setDeletingId(null);
        setDeletingProduct('');
      } else {
        toast.error(result.error || 'Failed to delete sale record');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Sales Data</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your sales records. Click edit or delete to modify.
            </p>
            {!canAdd && (
              <p className="text-sm text-muted-foreground mt-1">
                You have view-only access. Contact your administrator to make changes.
              </p>
            )}
          </div>
          {canAdd && (
            <Button
              onClick={handleAddClick}
              className="gap-2"
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              Add Sale
            </Button>
          )}
        </div>

        <SalesDataTable
          data={sales}
          pagination={pagination}
          loading={loading}
          onPageChange={onPageChange}
          onEdit={canEdit ? handleEditClick : undefined}
          onDelete={canDelete ? handleDeleteClick : undefined}
        />
      </div>

      {/* Add/Edit Modal */}
      <AddEditSaleModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubmit={handleModalSubmit}
        editingData={editingData}
        loading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        productName={deletingProduct}
      />
    </>
  );
};
