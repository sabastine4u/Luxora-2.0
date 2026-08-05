import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Building2, CheckCircle, XCircle, Eye, Send, MoreHorizontal, ShieldAlert, Edit, Globe, EyeOff, Star, ShieldOff, ArchiveRestore, Archive, Trash2, History, FileCheck, Users } from 'lucide-react';
import { GhostButton } from '../../../ui/ui';
import { DataTable } from './DataTable';
import { EnterpriseStatusBadge } from '../../../enterprise/EnterpriseStatusBadge';
import type { AdminListing } from '../../../../types/admin';

export type ListingManagementAction =
  | 'view_listing'
  | 'edit'
  | 'publish'
  | 'unpublish'
  | 'suspend'
  | 'restore'
  | 'archive'
  | 'delete'
  | 'feature'
  | 'unfeature'
  | 'view_history'
  | 'audit_log'
  | 'agent_assignment';

export interface ListingTableProps {
  data: AdminListing[];
  mode?: 'operational' | 'oversight' | 'management';
  selectedRows?: Set<string>;
  onToggleSelection?: (id: string) => void;
  onToggleAll?: () => void;
  onReview?: (item: AdminListing) => void;
  onApprove?: (item: AdminListing) => void;
  onReject?: (item: AdminListing) => void;
  onAssignAgency?: (item: AdminListing) => void;
  onOverride?: (item: AdminListing) => void;
  onMenuAction?: (action: ListingManagementAction, item: AdminListing) => void;
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
  onOverride,
  onMenuAction
}: ListingTableProps) {
  const [menuConfig, setMenuConfig] = useState<{ id: string, top: number, left: number, placement: 'top' | 'bottom' } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuConfig) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuConfig(null);
    };
    const handleScroll = (e: Event) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      }
      setMenuConfig(null);
    };
    const handleClickOutside = (e: MouseEvent) => {
      // If clicking inside the menu, do not close
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      }
      setMenuConfig(null);
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll, true); // true for capture phase to catch all scrolls
    // Small timeout to prevent immediate close from the button click
    setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [menuConfig]);

  const handleMenuClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (menuConfig?.id === id) {
      setMenuConfig(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const placement = spaceBelow > 380 ? 'bottom' : 'top'; // 380 is approx menu height
    
    setMenuConfig({
      id,
      top: placement === 'bottom' ? rect.bottom + 8 : rect.top - 8,
      left: rect.right,
      placement
    });
  };

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
              <button 
                onClick={() => {
                  if (mode === 'management') {
                    onMenuAction?.('view_listing', item);
                  } else {
                    onReview?.(item);
                  }
                }} 
                className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors" 
                title={mode === 'management' ? 'View Listing' : 'Review Verification'}
              >
                <Eye className="h-4 w-4" />
              </button>
              {mode === 'operational' && item.verification?.status === 'Approved' && item.assignment?.status === 'Ready for Agency Assignment' && (
                <button onClick={() => onAssignAgency?.(item)} className="rounded-lg p-2 text-ink/40 hover:bg-gold-400/10 hover:text-gold-400 transition-colors" title="Assign Agency">
                  <Send className="h-4 w-4" />
                </button>
              )}
              {mode === 'management' && (
                <div className="relative">
                  <button 
                    onClick={(e) => handleMenuClick(e, item.id)}
                    className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors relative z-10"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {menuConfig?.id === item.id && createPortal(
                    <div 
                      ref={menuRef}
                      style={{ 
                        position: 'fixed',
                        top: menuConfig.top,
                        left: menuConfig.left,
                        transform: menuConfig.placement === 'bottom' ? 'translateX(-100%)' : 'translate(-100%, -100%)',
                      }}
                      className="w-64 rounded-xl border border-white/10 bg-navy-800 shadow-2xl z-[150] overflow-hidden text-left ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2 flex flex-col max-h-[350px] overflow-y-auto custom-scrollbar">
                        {/* Viewing & Editing */}
                        <div className="px-3 py-1.5 text-[10px] font-semibold text-ink/40 uppercase tracking-wider">Viewing & Editing</div>
                        <button onClick={() => { onMenuAction?.('view_listing', item); setMenuConfig(null); }} className="flex items-center gap-3 px-3 py-2 text-sm text-cream hover:bg-white/5 rounded-lg text-left transition-colors">
                          <Eye className="h-4 w-4 text-ink/60" /> View Listing
                        </button>
                        <button onClick={() => { onMenuAction?.('edit', item); setMenuConfig(null); }} className="flex items-center gap-3 px-3 py-2 text-sm text-cream hover:bg-white/5 rounded-lg text-left transition-colors">
                          <Edit className="h-4 w-4 text-ink/60" /> Edit Listing
                        </button>
                        
                        <div className="h-px bg-white/5 my-2 mx-2" />
                        {/* Publishing */}
                        <div className="px-3 py-1.5 text-[10px] font-semibold text-ink/40 uppercase tracking-wider">Publishing</div>
                        <button onClick={() => { onMenuAction?.('publish', item); setMenuConfig(null); }} className="flex items-center gap-3 px-3 py-2 text-sm text-emerald-400 hover:bg-emerald-400/10 rounded-lg text-left transition-colors">
                          <Globe className="h-4 w-4" /> Publish
                        </button>
                        <button onClick={() => { onMenuAction?.('unpublish', item); setMenuConfig(null); }} className="flex items-center gap-3 px-3 py-2 text-sm text-cream hover:bg-white/5 rounded-lg text-left transition-colors">
                          <EyeOff className="h-4 w-4 text-ink/60" /> Unpublish
                        </button>
                        
                        <div className="h-px bg-white/5 my-2 mx-2" />
                        {/* Featuring */}
                        <div className="px-3 py-1.5 text-[10px] font-semibold text-ink/40 uppercase tracking-wider">Featuring</div>
                        <button onClick={() => { onMenuAction?.('feature', item); setMenuConfig(null); }} className="flex items-center gap-3 px-3 py-2 text-sm text-gold-400 hover:bg-gold-400/10 rounded-lg text-left transition-colors">
                          <Star className="h-4 w-4" /> Feature
                        </button>
                        <button onClick={() => { onMenuAction?.('unfeature', item); setMenuConfig(null); }} className="flex items-center gap-3 px-3 py-2 text-sm text-cream hover:bg-white/5 rounded-lg text-left transition-colors">
                          <Star className="h-4 w-4 text-ink/60" /> Remove Feature
                        </button>
                        
                        <div className="h-px bg-white/5 my-2 mx-2" />
                        {/* Assignment & History */}
                        <div className="px-3 py-1.5 text-[10px] font-semibold text-ink/40 uppercase tracking-wider">Assignment & History</div>
                        <button onClick={() => { onMenuAction?.('agent_assignment', item); setMenuConfig(null); }} className="flex items-center gap-3 px-3 py-2 text-sm text-cream hover:bg-white/5 rounded-lg text-left transition-colors">
                          <Users className="h-4 w-4 text-ink/60" /> Assign Agent
                        </button>
                        <button onClick={() => { onMenuAction?.('view_history', item); setMenuConfig(null); }} className="flex items-center gap-3 px-3 py-2 text-sm text-cream hover:bg-white/5 rounded-lg text-left transition-colors">
                          <History className="h-4 w-4 text-ink/60" /> View History
                        </button>
                        <button onClick={() => { onMenuAction?.('audit_log', item); setMenuConfig(null); }} className="flex items-center gap-3 px-3 py-2 text-sm text-cream hover:bg-white/5 rounded-lg text-left transition-colors">
                          <FileCheck className="h-4 w-4 text-ink/60" /> Audit Log
                        </button>
                        
                        <div className="h-px bg-white/5 my-2 mx-2" />
                        {/* Listing State */}
                        <div className="px-3 py-1.5 text-[10px] font-semibold text-ink/40 uppercase tracking-wider">Listing State</div>
                        <button onClick={() => { onMenuAction?.('suspend', item); setMenuConfig(null); }} className="flex items-center gap-3 px-3 py-2 text-sm text-yellow-400 hover:bg-yellow-400/10 rounded-lg text-left transition-colors">
                          <ShieldOff className="h-4 w-4" /> Suspend
                        </button>
                        <button onClick={() => { onMenuAction?.('restore', item); setMenuConfig(null); }} className="flex items-center gap-3 px-3 py-2 text-sm text-cream hover:bg-white/5 rounded-lg text-left transition-colors">
                          <ArchiveRestore className="h-4 w-4 text-ink/60" /> Restore
                        </button>
                        <button onClick={() => { onMenuAction?.('archive', item); setMenuConfig(null); }} className="flex items-center gap-3 px-3 py-2 text-sm text-cream hover:bg-white/5 rounded-lg text-left transition-colors">
                          <Archive className="h-4 w-4 text-ink/60" /> Archive
                        </button>
                        
                        <div className="h-px bg-rose-400/20 my-2 mx-2" />
                        {/* Danger Zone */}
                        <div className="px-3 py-1.5 text-[10px] font-semibold text-rose-400/60 uppercase tracking-wider">Danger Zone</div>
                        <button onClick={() => { onMenuAction?.('delete', item); setMenuConfig(null); }} className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-rose-400 hover:bg-rose-400/10 rounded-lg text-left transition-colors">
                          <Trash2 className="h-4 w-4" /> Delete Listing
                        </button>
                      </div>
                    </div>,
                    document.body
                  )}
                </div>
              )}
            </div>
          )
        }
      ]}
    />
  );
}
