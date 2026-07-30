import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { MapPin, Home, Bed, Bath, Square, CheckCircle, XCircle, AlertTriangle, Clock, Image as ImageIcon, FileText, Download } from 'lucide-react';
import type { AdminListing } from '../../../types/admin';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';

export interface ListingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: AdminListing | null;
  onAction?: (actionType: 'approve' | 'return' | 'hold' | 'reject') => void;
}

export function ListingDetailModal({ isOpen, onClose, listing, onAction }: ListingDetailModalProps) {
  const [notes, setNotes] = useState(listing?.verification?.notes || '');
  
  if (!listing) return null;

  const features = [
    { icon: Bed, label: '4 Beds' },
    { icon: Bath, label: '3.5 Baths' },
    { icon: Square, label: '4,200 sqft' },
  ];

  const defaultChecklist = [
    { id: '1', text: 'Ownership Verified', checked: true },
    { id: '2', text: 'Documents Verified', checked: false },
    { id: '3', text: 'Location Verified', checked: true },
    { id: '4', text: 'Images Reviewed', checked: false },
    { id: '5', text: 'Pricing Reviewed', checked: true },
  ];

  const checklist = listing.verification?.checklist || defaultChecklist;
  const documents = listing.verification?.documents || [
    { name: 'Title_Document.pdf', type: 'PDF', size: '2.4 MB' }
  ];
  const history = listing.verification?.history || [
    { title: 'Submitted by Owner', time: '2 hours ago', type: 'Owner' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setNotes('');
        onClose();
      }}
      title={`Listing Review: ${listing.title}`}
      size="5xl"
      actionButton={
        <div className="flex flex-wrap gap-2 justify-end">
          <GhostButton size="sm" className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10" onClick={() => onAction?.('reject')}>
            <XCircle className="h-4 w-4 mr-2" /> Reject
          </GhostButton>
          <GhostButton size="sm" className="text-ink/60 hover:text-cream hover:bg-white/10" onClick={() => onAction?.('hold')}>
            <Clock className="h-4 w-4 mr-2" /> Hold
          </GhostButton>
          <GhostButton size="sm" className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10" onClick={() => onAction?.('return')}>
            <AlertTriangle className="h-4 w-4 mr-2" /> Return for Correction
          </GhostButton>
          <GoldButton size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-white" onClick={() => onAction?.('approve')}>
            <CheckCircle className="h-4 w-4 mr-2" /> Approve
          </GoldButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Images & Documents */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Property Information */}
          <div>
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">Property Information</h4>
            <div className="rounded-2xl border border-white/10 bg-navy-900/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-cream">{listing.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-ink/60 mt-1">
                    <MapPin className="h-4 w-4" /> {listing.location}
                  </div>
                  <div className="text-sm text-ink/60 mt-1">
                    Owner: <span className="font-semibold text-cream">{listing.owner}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {listing.assignment?.status && (
                      <EnterpriseStatusBadge status={listing.assignment.status} />
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gold-400">{listing.price}</div>
                  <div className="text-xs text-ink/50 uppercase tracking-wider">Asking Price</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-cream">
                    <feat.icon className="h-4 w-4 text-ink/40" />
                    {feat.label}
                  </div>
                ))}
                <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-cream">
                  <Home className="h-4 w-4 text-ink/40" />
                  Property
                </div>
              </div>
            </div>
          </div>

          {/* Property Gallery */}
          <div>
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">Property Gallery</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 row-span-2 flex items-center justify-center rounded-xl bg-navy-900/50 border border-white/10 aspect-video">
                <ImageIcon className="h-12 w-12 text-ink/20" />
              </div>
              <div className="flex items-center justify-center rounded-xl bg-navy-900/50 border border-white/10 aspect-video">
                <ImageIcon className="h-6 w-6 text-ink/20" />
              </div>
              <div className="flex items-center justify-center rounded-xl bg-navy-900/50 border border-white/10 aspect-video">
                <ImageIcon className="h-6 w-6 text-ink/20" />
              </div>
              <div className="flex items-center justify-center rounded-xl bg-navy-900/50 border border-white/10 aspect-video relative group cursor-pointer">
                <ImageIcon className="h-6 w-6 text-ink/20" />
                <div className="absolute inset-0 bg-navy-900/80 flex items-center justify-center rounded-xl font-semibold text-cream text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  View All
                </div>
                <div className="absolute inset-0 bg-navy-900/40 flex items-center justify-center rounded-xl font-semibold text-cream text-sm group-hover:opacity-0 transition-opacity">
                  +8 more
                </div>
              </div>
            </div>
          </div>

          {/* Property Documents */}
          <div>
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">Property Documents</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-navy-900/50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-800 text-gold-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-cream truncate w-32 md:w-48">{doc.name}</div>
                      <div className="text-xs text-ink/50">{doc.type} • {doc.size || 'Unknown size'}</div>
                    </div>
                  </div>
                  <button className="p-2 text-ink/40 hover:text-gold-400 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Notes */}
          <div>
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">Verification Notes</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add structured verification comments (e.g., Missing documentation, Incorrect pricing, Awaiting owner response)..."
              className="w-full h-32 rounded-xl border border-white/10 bg-navy-900/50 p-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none resize-none"
            />
          </div>

          {/* Assignment Details */}
          {listing.assignment && (
            <div>
              <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">Assignment Details</h4>
              <div className="rounded-xl border border-white/10 bg-navy-900/50 p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Assignment ID</div>
                    <div className="font-semibold text-cream">{listing.assignment.id || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Status</div>
                    <EnterpriseStatusBadge status={listing.assignment.status} />
                  </div>
                  {listing.assignment.priority && (
                    <div>
                      <div className="text-xs text-ink/60 mb-1">Priority</div>
                      <div className="font-semibold text-cream">{listing.assignment.priority}</div>
                    </div>
                  )}
                  {listing.assignment.agencyName && (
                    <div>
                      <div className="text-xs text-ink/60 mb-1">Assigned Agency</div>
                      <div className="font-semibold text-cream">{listing.assignment.agencyName}</div>
                    </div>
                  )}
                  {listing.assignment.assignedBy && (
                    <div>
                      <div className="text-xs text-ink/60 mb-1">Assigned By</div>
                      <div className="font-semibold text-cream">{listing.assignment.assignedBy}</div>
                    </div>
                  )}
                  {listing.assignment.assignedAt && (
                    <div>
                      <div className="text-xs text-ink/60 mb-1">Assigned At</div>
                      <div className="font-semibold text-cream">{listing.assignment.assignedAt}</div>
                    </div>
                  )}
                  {listing.assignment.acknowledgedAt && (
                    <div>
                      <div className="text-xs text-ink/60 mb-1">Acknowledged At</div>
                      <div className="font-semibold text-cream">{listing.assignment.acknowledgedAt}</div>
                    </div>
                  )}
                </div>
                {listing.assignment.notes && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs text-ink/60 mb-1">Internal Notes</div>
                    <div className="text-sm text-cream">{listing.assignment.notes}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: History & Checklist */}
        <div className="space-y-8 lg:border-l lg:border-white/10 lg:pl-8">
          
          <div>
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">Verification Checklist</h4>
            <div className="space-y-3">
              {checklist.map((item) => (
                <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-white/20 bg-navy-900 group-hover:border-gold-400/50 transition-colors">
                    {item.checked && <CheckCircle className="h-3 w-3 text-gold-400" />}
                  </div>
                  <span className="text-sm text-ink/60 group-hover:text-cream transition-colors">{item.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h4 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-6">Verification History</h4>
            <div className="space-y-6">
              {history.map((event, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-2.5 w-2.5 rounded-full ${event.title.includes('Reject') ? 'bg-rose-400' : event.title.includes('Return') || event.title.includes('Hold') ? 'bg-yellow-400' : event.title.includes('Approve') ? 'bg-emerald-400' : 'bg-gold-400'}`} />
                    {idx < history.length - 1 && <div className="h-full w-px bg-white/10 mt-2" />}
                  </div>
                  <div className="pb-2 text-sm">
                    <div className="text-cream font-medium">{event.title}</div>
                    <div className="text-ink/50 text-xs flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" /> {event.time} • {event.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </Modal>
  );
}
