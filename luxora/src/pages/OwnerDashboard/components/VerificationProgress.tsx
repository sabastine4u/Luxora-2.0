import { useState, useMemo } from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, Upload, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { properties } from '../../../data/luxoraData';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';

// Types
type StageStatus = 'completed' | 'current' | 'pending' | 'rejected';
type DocStatus = 'verified' | 'pending' | 'rejected';

interface VerificationProperty {
  id: string;
  name: string;
  image: string;
  submissionDate: string;
  officer: { name: string; avatar: string; email: string };
  status: string;
  progressPercent: number;
  estimatedRemaining: string;
  expectedPublication: string;
  stages: { name: string; status: StageStatus; dateCompleted?: string; officerName?: string; notes?: string }[];
  documents: { name: string; status: DocStatus; type: string }[];
  history: { title: string; date: string; description: string }[];
}

const mockVerifications: VerificationProperty[] = [
  {
    id: 'PR-101',
    name: 'The Sapphire Residences',
    image: properties[0].image,
    submissionDate: '2025-10-12',
    officer: { name: 'David Adebayo', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop', email: 'david@luxora.com' },
    status: 'Document Review',
    progressPercent: 35,
    estimatedRemaining: '5-7 Business Days',
    expectedPublication: 'Nov 02, 2025',
    stages: [
      { name: 'Submitted', status: 'completed', dateCompleted: 'Oct 12, 2025', officerName: 'System', notes: 'Initial request received.' },
      { name: 'Documents Received', status: 'completed', dateCompleted: 'Oct 13, 2025', officerName: 'System', notes: 'All initial files uploaded.' },
      { name: 'Document Review', status: 'current', officerName: 'David Adebayo', notes: 'Reviewing title deed and tax clearance.' },
      { name: 'Inspection Scheduled', status: 'pending' },
      { name: 'Inspection Completed', status: 'pending' },
      { name: 'Compliance Review', status: 'pending' },
      { name: 'Approved', status: 'pending' },
      { name: 'Published', status: 'pending' }
    ],
    documents: [
      { name: 'Title Deed', status: 'pending', type: 'PDF' },
      { name: 'Government ID', status: 'verified', type: 'Image' },
      { name: 'Property Photos', status: 'verified', type: 'Images' },
      { name: 'Survey Plan', status: 'verified', type: 'PDF' },
      { name: 'Tax Clearance', status: 'rejected', type: 'PDF' },
      { name: 'Utility Bill', status: 'verified', type: 'PDF' },
      { name: 'Inspection Form', status: 'pending', type: 'Form' }
    ],
    history: [
      { title: 'Officer Assigned', date: 'Oct 14, 2025', description: 'David Adebayo assigned to review.' },
      { title: 'Documents Uploaded', date: 'Oct 13, 2025', description: '6 documents uploaded by owner.' },
      { title: 'Property Submitted', date: 'Oct 12, 2025', description: 'Verification request initiated.' }
    ]
  },
  {
    id: 'PR-102',
    name: 'Oceanview Villa #4',
    image: properties[1].image,
    submissionDate: '2025-09-28',
    officer: { name: 'Sarah Ken', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop', email: 'sarah@luxora.com' },
    status: 'Published',
    progressPercent: 100,
    estimatedRemaining: 'None',
    expectedPublication: 'Oct 05, 2025',
    stages: [
      { name: 'Submitted', status: 'completed', dateCompleted: 'Sep 28, 2025' },
      { name: 'Documents Received', status: 'completed', dateCompleted: 'Sep 28, 2025' },
      { name: 'Document Review', status: 'completed', dateCompleted: 'Sep 29, 2025' },
      { name: 'Inspection Scheduled', status: 'completed', dateCompleted: 'Sep 30, 2025' },
      { name: 'Inspection Completed', status: 'completed', dateCompleted: 'Oct 02, 2025' },
      { name: 'Compliance Review', status: 'completed', dateCompleted: 'Oct 04, 2025' },
      { name: 'Approved', status: 'completed', dateCompleted: 'Oct 04, 2025' },
      { name: 'Published', status: 'completed', dateCompleted: 'Oct 05, 2025' }
    ],
    documents: [
      { name: 'Title Deed', status: 'verified', type: 'PDF' },
      { name: 'Government ID', status: 'verified', type: 'Image' },
      { name: 'Property Photos', status: 'verified', type: 'Images' },
      { name: 'Survey Plan', status: 'verified', type: 'PDF' },
      { name: 'Tax Clearance', status: 'verified', type: 'PDF' },
      { name: 'Utility Bill', status: 'verified', type: 'PDF' },
      { name: 'Inspection Form', status: 'verified', type: 'Form' }
    ],
    history: [
      { title: 'Published', date: 'Oct 05, 2025', description: 'Property is live.' },
      { title: 'Approval Granted', date: 'Oct 04, 2025', description: 'Final compliance passed.' },
      { title: 'Inspection Completed', date: 'Oct 02, 2025', description: 'Physical inspection passed.' },
      { title: 'Property Submitted', date: 'Sep 28, 2025', description: 'Request initiated.' }
    ]
  }
];

export default function VerificationProgress() {
  const [selectedId, setSelectedId] = useState(mockVerifications[0].id);
  const [isMobileAccordionOpen, setIsMobileAccordionOpen] = useState(false);

  const selectedProp = useMemo(() => mockVerifications.find(p => p.id === selectedId) || mockVerifications[0], [selectedId]);

  const stats = {
    total: mockVerifications.length,
    underReview: mockVerifications.filter(v => v.progressPercent > 0 && v.progressPercent < 100).length,
    verified: mockVerifications.filter(v => v.progressPercent === 100).length,
    rejected: 0
  };

  const hasMissingDocs = selectedProp.documents.some(d => d.status === 'rejected');

  if (mockVerifications.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<ShieldCheck className="h-8 w-8 text-gold-400" />}
          title="No verification process found."
          description="Submit a property to begin the verification and publishing process."
          actionLabel="Submit Property"
          onAction={() => alert('Mock: Submit Property')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Verification Progress</h2>
          <p className="text-sm text-ink/60">Monitor the verification status of every submitted property.</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <div className="rounded-xl bg-navy-800/50 border border-white/5 p-3 min-w-[100px] text-center shrink-0">
            <div className="text-xl font-bold text-cream">{stats.total}</div>
            <div className="text-[10px] text-ink/50 uppercase">Total</div>
          </div>
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 min-w-[100px] text-center shrink-0">
            <div className="text-xl font-bold text-blue-400">{stats.underReview}</div>
            <div className="text-[10px] text-blue-400/70 uppercase">Under Review</div>
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 min-w-[100px] text-center shrink-0">
            <div className="text-xl font-bold text-emerald-400">{stats.verified}</div>
            <div className="text-[10px] text-emerald-400/70 uppercase">Verified</div>
          </div>
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 min-w-[100px] text-center shrink-0">
            <div className="text-xl font-bold text-rose-400">{stats.rejected}</div>
            <div className="text-[10px] text-rose-400/70 uppercase">Rejected</div>
          </div>
        </div>
      </div>

      {/* 2. Property Selector */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-4">
        <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider mb-3 block">Select Property</label>
        <select 
          className="w-full rounded-xl border border-white/10 bg-navy-900 py-3 px-4 text-cream focus:border-gold-400 focus:outline-none transition-colors"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {mockVerifications.map(v => (
            <option key={v.id} value={v.id}>{v.name} ({v.status})</option>
          ))}
        </select>
        
        {/* Selected Property Card */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-navy-900 border border-white/5">
          <img src={selectedProp.image} alt={selectedProp.name} className="h-20 w-28 rounded-lg object-cover" />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-heading font-bold text-cream text-lg">{selectedProp.name}</h3>
            <div className="text-xs text-ink/50 mt-1">Submitted: {selectedProp.submissionDate}</div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-gold-400/20 bg-gold-400/10 px-2 py-0.5 text-xs font-semibold text-gold-400">
              {selectedProp.status}
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center sm:items-end justify-center px-4">
            <div className="text-[10px] text-ink/50 uppercase mb-1">Verification Officer</div>
            <div className="flex items-center gap-2">
              <img src={selectedProp.officer.avatar} alt="Officer" className="h-8 w-8 rounded-full object-cover" />
              <span className="text-sm font-semibold text-cream">{selectedProp.officer.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Desktop = 2 cols, Tablet = stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Progress & Steps */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Progress Overview */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="font-heading text-lg font-bold text-cream">Overall Completion</h3>
                <div className="text-sm text-ink/60">Verification Journey</div>
              </div>
              <div className="text-3xl font-heading font-bold text-gold-400">{selectedProp.progressPercent}%</div>
            </div>
            <div className="h-3 w-full bg-navy-900 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gold-400 rounded-full transition-all duration-500" style={{ width: `${selectedProp.progressPercent}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <div className="text-xs text-ink/50 mb-1">Est. Time Remaining</div>
                <div className="font-semibold text-cream">{selectedProp.estimatedRemaining}</div>
              </div>
              <div>
                <div className="text-xs text-ink/50 mb-1">Expected Publication</div>
                <div className="font-semibold text-emerald-400">{selectedProp.expectedPublication}</div>
              </div>
            </div>
          </div>

          {/* Alert for Missing Docs */}
          {hasMissingDocs && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="h-12 w-12 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 mx-auto">
                  <AlertTriangle className="h-6 w-6 text-rose-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-rose-400 text-lg">Action Required</h4>
                  <p className="text-sm text-rose-400/80">Some documents were rejected or missing. Please upload them to continue.</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
                <GoldButton size="sm" onClick={() => alert('Mock: Upload')}><Upload className="h-4 w-4 mr-2" /> Upload Document</GoldButton>
                <GhostButton size="sm" className="border-rose-400/20 text-rose-400 hover:bg-rose-500/10" onClick={() => alert('Mock: Contact')}>Contact Officer</GhostButton>
              </div>
            </div>
          )}

          {/* Stepper */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-8">Verification Stages</h3>
            <div className="relative">
              <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-white/5" />
              <div className="space-y-8">
                {selectedProp.stages.map((stage, idx) => {
                  const isCompleted = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';
                  const isRejected = stage.status === 'rejected';
                  
                  return (
                    <div key={idx} className="relative flex gap-6">
                      <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-navy-800 ${
                        isCompleted ? 'bg-emerald-500 text-navy-900' :
                        isCurrent ? 'bg-gold-400 text-navy-900' :
                        isRejected ? 'bg-rose-500 text-navy-900' :
                        'bg-navy-900 text-ink/30 border-white/10'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : 
                         isRejected ? <X className="h-6 w-6" /> : 
                         <div className={`h-3 w-3 rounded-full ${isCurrent ? 'bg-navy-900' : 'bg-ink/20'}`} />}
                      </div>
                      <div className="flex-1 pt-1">
                        <h4 className={`font-semibold text-lg ${isCompleted || isCurrent ? 'text-cream' : 'text-ink/50'}`}>{stage.name}</h4>
                        {(stage.dateCompleted || stage.officerName || stage.notes) && (
                          <div className="mt-2 space-y-1 p-4 rounded-xl bg-navy-900/50 border border-white/5">
                            {stage.dateCompleted && <div className="text-xs text-ink/50">Completed: {stage.dateCompleted}</div>}
                            {stage.officerName && <div className="text-xs text-ink/50">By: <span className="text-cream">{stage.officerName}</span></div>}
                            {stage.notes && <div className="text-sm text-ink/80 mt-2 border-t border-white/5 pt-2 italic">"{stage.notes}"</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Checklist & History */}
        <div className="space-y-8">
          
          {/* Document Checklist */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-4">Document Checklist</h3>
            <div className="space-y-3">
              {selectedProp.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-navy-900/50 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      doc.status === 'verified' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                      doc.status === 'rejected' ? 'bg-rose-500/20 border-rose-500 text-rose-400' :
                      'bg-white/5 border-white/10 text-ink/40'
                    }`}>
                      {doc.status === 'verified' ? <Check className="h-3 w-3" /> : 
                       doc.status === 'rejected' ? <X className="h-3 w-3" /> : 
                       <Clock className="h-3 w-3" />}
                    </div>
                    <span className="text-sm font-medium text-cream">{doc.name}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-semibold tracking-wider ${
                    doc.status === 'verified' ? 'text-emerald-400' :
                    doc.status === 'rejected' ? 'text-rose-400' :
                    'text-yellow-400'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification History (Timeline) */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div 
              className="flex items-center justify-between cursor-pointer lg:cursor-auto"
              onClick={() => setIsMobileAccordionOpen(!isMobileAccordionOpen)}
            >
              <h3 className="font-heading text-lg font-bold text-cream">Verification History</h3>
              <div className="lg:hidden p-1 text-ink/50 hover:bg-white/5 rounded-md">
                {isMobileAccordionOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
            
            <div className={`mt-6 ${!isMobileAccordionOpen ? 'hidden lg:block' : 'block'}`}>
              <div className="relative border-l-2 border-white/5 ml-2 space-y-6">
                {selectedProp.history.map((event, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white/10 bg-navy-900" />
                    <div className="text-sm font-semibold text-cream mb-1">{event.title}</div>
                    <div className="text-[10px] text-ink/50 mb-1">{event.date}</div>
                    <div className="text-xs text-ink/70">{event.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
