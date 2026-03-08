import React, { useState } from 'react';
import { Filter, Calendar, X, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { SalesFilter, FilterOptions } from '@/types';

interface DashboardFiltersProps {
  filters: SalesFilter;
  filterOptions: FilterOptions;
  onFilterChange: (filters: SalesFilter) => void;
  onClearFilters: () => void;
  onExport?: () => void;
  onImport?: () => void;
  userRole?: string;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  filters,
  filterOptions,
  onFilterChange,
  onClearFilters,
  onExport,
  onImport,
  userRole,
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : undefined
  );

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    onFilterChange({
      ...filters,
      startDate: date ? format(date, 'yyyy-MM-dd') : undefined,
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    onFilterChange({
      ...filters,
      endDate: date ? format(date, 'yyyy-MM-dd') : undefined,
    });
  };

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onClearFilters();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-medium">Filters</h3>
          {hasActiveFilters && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(userRole === 'admin' || userRole === 'manager') && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onImport}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </>
          )}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="gap-2 text-muted-foreground"
            >
              <X className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground'
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground'
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Category</Label>
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) =>
              onFilterChange({ ...filters, category: value === 'all' ? undefined : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {filterOptions.categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region Filter */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Region</Label>
          <Select
            value={filters.region || 'all'}
            onValueChange={(value) =>
              onFilterChange({ ...filters, region: value === 'all' ? undefined : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {filterOptions.regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Salesperson Filter */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Salesperson</Label>
          <Select
            value={filters.salesperson || 'all'}
            onValueChange={(value) =>
              onFilterChange({ ...filters, salesperson: value === 'all' ? undefined : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Salespeople" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Salespeople</SelectItem>
              {filterOptions.salespeople.map((person) => (
                <SelectItem key={person} value={person}>
                  {person}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
