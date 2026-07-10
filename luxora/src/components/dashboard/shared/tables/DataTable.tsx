import type { ReactNode } from 'react';
import React from 'react';

export interface ColumnDef<T> {
  header: ReactNode | string;
  accessorKey?: keyof T | string;
  render?: (row: T, index: number) => ReactNode;
  className?: string; // Appended to <td>
  headerClassName?: string; // Appended to <th>
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  onRowClick?: (item: T) => void;
  selectedRows?: (string | number)[];
  emptyState?: ReactNode;
  isLoading?: boolean;
  renderExpandedRow?: (item: T) => ReactNode;
  expandedRowIds?: (string | number)[];
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  selectedRows = [],
  emptyState,
  isLoading = false,
  renderExpandedRow,
  expandedRowIds = [],
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50 p-8 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-gold-400 border-t-transparent animate-spin"></div>
          <div className="text-sm text-ink/50">Loading data...</div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-12">
        {emptyState || (
          <div className="text-center text-ink/50 py-8">
            No data available.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`py-4 font-semibold ${col.headerClassName || 'px-6'}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, rowIdx) => {
              const rowKey = keyExtractor(row, rowIdx);
              const isSelected = selectedRows.includes(rowKey);
              const isExpanded = expandedRowIds.includes(rowKey);
              
              return (
                <React.Fragment key={rowKey}>
                  <tr 
                    className={`transition-colors hover:bg-white/[0.02] ${onRowClick ? 'cursor-pointer' : ''} ${isSelected ? 'bg-gold-400/[0.02]' : ''}`}
                    onClick={(e) => {
                      if (!onRowClick) return;
                      const target = e.target as HTMLElement;
                      if (target.tagName !== 'INPUT' && !target.closest('button')) {
                        onRowClick(row);
                      }
                    }}
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className={`py-4 ${col.className || 'px-6'}`}>
                        {col.render 
                          ? col.render(row, rowIdx) 
                          : col.accessorKey 
                            ? String((row as Record<string, unknown>)[col.accessorKey as string] ?? '') 
                            : null}
                      </td>
                    ))}
                  </tr>
                  {isExpanded && renderExpandedRow && (
                    <tr>
                      <td colSpan={columns.length} className="p-0 bg-black/10">
                        {renderExpandedRow(row)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
