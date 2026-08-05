import { Building2, CheckCircle, XCircle, Eye, Send, MoreHorizontal, ShieldAlert } from 'lucide-react';
import { GhostButton } from '../../../ui/ui';
import { DataTable } from './DataTable';
import { EnterpriseStatusBadge } from '../../../enterprise/EnterpriseStatusBadge';
import type { AdminListing } from '../../../../types/admin';

export interface ListingTableProps {
  data: AdminListing[];
  mode?: 'operational' | 'oversight';
  selectedRows?: Set<string>;
  onToggleSelection?: (id: string) => void;
  onToggleAll?: () => void;
  onReview?: (item: AdminListing) => void;
  onApprove?: (item: AdminListing) => void;
  onReject?: (item: AdminListing) => void;
  onAssignAgency?: (item: AdminListing) => void;
  onOverride?: (item: AdminListing) => void;
}

export function ListingTable({
  data,
  mode = 'operational',
  selectedRows,
  onToggleSelection,
  onToggleAll,
  onReview,
  onApprove,
  onReject,
  onAssignAgency,
  onOverride
}: ListingTableProps) {
  return (
    <DataTable
      data={data}
      keyExtractor={(item) => item.id}
      columns={[
        ...(onToggleSelection && selectedRows ? [{
          header: (
            <input 
              type="checkbox" 
              className="rounded border-white/20 bg-navy-900/50 text-gold-400 focus:ring-gold-400/50"
              checked={selectedRows.size === data.length && data.length > 0}
              onChange={onToggleAll}
            />
          ),
          className: "w-10 text-center",
          render: (item: AdminListing) => (
            <input 
              type="checkbox" 
              className="rounded border-white/20 bg-navy-900/50 text-gold-400 focus:ring-gold-400/50"
              checked={selectedRows.has(item.id)}
              onChange={() => onToggleSelection(item.id)}
            />
          )
        }] : []),
        {
          header: "Listing ID",
          render: (item: AdminListing) => <span className="font-medium text-cream">{item.id}</span>
        },
        {
          header: "Property / Owner",
          render: (item: AdminListing) => (
            <>
              <div className="font-semibold text-cream flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gold-400" />
                {item.title}
              </div>
              <div className="text-xs text-ink/50 mt-1">{item.owner}</div>
            </>
          )
        },
        {
          header: "Location",
          render: (item: AdminListing) => <span className="text-ink/60">{item.location}</span>
        },
        {
          header: "Status",
          render: (item: AdminListing) => (
            <div className="flex flex-col gap-1">
              <div className="w-fit">
                <EnterpriseStatusBadge status={item.verification?.status || item.status} />
              </div>
              {item.priority === 'High' && (
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase w-fit text-rose-400 bg-rose-400/10 border-rose-400/20">
                  Priority Review
                </span>
              )}
            </div>
          )
        },
        {
          header: <div className="text-right">Actions</div>,
          className: "text-right",
          render: (item: AdminListing) => (
            <div className="flex items-center justify-end gap-2">
              {mode === 'operational' && (
                <>
                  <button onClick={() => onApprove?.(item)} className="rounded-lg p-2 text-ink/40 hover:bg-emerald-400/10 hover:text-emerald-400 transition-colors" title="Approve">
                    <CheckCircle className="h-4 w-4" />
                  </button>
                  <button onClick={() => onReject?.(item)} className="rounded-lg p-2 text-ink/40 hover:bg-rose-400/10 hover:text-rose-400 transition-colors" title="Reject">
                    <XCircle className="h-4 w-4" />
                  </button>
                </>
              )}
              {mode === 'oversight' && (
                <GhostButton size="sm" onClick={() => onOverride?.(item)} className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4" /> Override
                </GhostButton>
              )}
              <button onClick={() => onReview?.(item)} className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors" title="Review Verification">
                <Eye className="h-4 w-4" />
              </button>
              {mode === 'operational' && item.verification?.status === 'Approved' && item.assignment?.status === 'Ready for Agency Assignment' && (
                <button onClick={() => onAssignAgency?.(item)} className="rounded-lg p-2 text-ink/40 hover:bg-gold-400/10 hover:text-gold-400 transition-colors" title="Assign Agency">
                  <Send className="h-4 w-4" />
                </button>
              )}
              <button className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          )
        }
      ]}
    />
  );
}
