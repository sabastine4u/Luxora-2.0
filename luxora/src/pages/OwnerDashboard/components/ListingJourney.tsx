import { useState, useMemo } from 'react';
import { Route, CheckCircle2, Clock, XCircle, AlertTriangle, MessageSquare, Upload, Eye, Download, ArrowRight, User, Building2, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { useToast } from '../../../contexts/ToastContext';
import { mockJourneys } from '../../../data/ownerData';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import UploadDocumentModal from './modals/UploadDocumentModal';
import ExportModal from './modals/ExportModal';

export type StageStatus = 'Completed' | 'Current' | 'Pending' | 'Delayed' | 'Rejected';

export default function ListingJourney() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(mockJourneys.length > 0 ? mockJourneys[0].id : '');
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const journey = useMemo(() => mockJourneys.find(j => j.id === selectedId) || mockJourneys[0], [selectedId]);

  if (mockJourneys.length === 0 || !journey) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<Route className="h-8 w-8 text-gold-400" />}
          title="No listing journey available."
          description="Submit a property to start tracking its journey."
          actionLabel="Submit Property"
          onAction={() => navigate('/owner-dashboard?tab=Listing+Journey')}
        />
      </div>
    );
  }

  const currentStage = journey.stages.find(s => s.status === 'Current');

  const getStatusIcon = (status: StageStatus) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      case 'Current': return <div className="h-3 w-3 rounded-full bg-navy-900" />;
      case 'Delayed': return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'Rejected': return <XCircle className="h-5 w-5 text-rose-400" />;
      default: return <div className="h-2 w-2 rounded-full bg-ink/20" />;
    }
  };

  const getStatusBg = (status: StageStatus) => {
    switch (status) {
      case 'Completed': return 'border-emerald-500 bg-emerald-500/20';
      case 'Current': return 'border-gold-400 bg-gold-400 text-navy-900';
      case 'Delayed': return 'border-yellow-400 bg-yellow-400/20';
      case 'Rejected': return 'border-rose-400 bg-rose-400/20';
      default: return 'border-white/10 bg-navy-900';
    }
  };

  const handleUpload = () => {
    showToast({ type: 'success', title: 'Document Uploaded', description: 'Document has been successfully submitted.' });
    setIsUploadModalOpen(false);
  };

  const handleExport = (format: string) => {
    showToast({ type: 'success', title: 'Timeline Downloaded', description: `Your timeline is being downloaded as ${format.toUpperCase()}.` });
    setIsExportModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-cream">Listing Journey</h2>
        <p className="text-sm text-ink/60">Track your property's complete lifecycle from submission to publication and beyond.</p>
      </div>

      {/* Property Selector */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider mb-2 block">Select Property</label>
            <select 
              className="w-full rounded-xl border border-white/10 bg-navy-900 py-3 px-4 text-cream focus:border-gold-400 focus:outline-none transition-colors"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {mockJourneys.map(j => (
                <option key={j.id} value={j.id}>{j.name} ({j.status})</option>
              ))}
            </select>
            
            <div className="mt-4 rounded-xl overflow-hidden border border-white/10 relative">
              <img src={journey.image} alt={journey.name} className="h-40 w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-flex rounded-full bg-gold-400/20 border border-gold-400/30 px-2 py-0.5 text-[10px] font-bold uppercase text-gold-400 mb-1 backdrop-blur-md">
                  {journey.status}
                </span>
                <h3 className="font-heading font-bold text-cream text-lg leading-tight truncate">{journey.name}</h3>
                <div className="text-xs text-cream/70 flex items-center gap-1 mt-1 truncate">
                  <MapPin className="h-3 w-3" /> {journey.address}
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5 flex flex-col justify-center">
              <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">Property Type</div>
              <div className="font-semibold text-cream flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gold-400" /> {journey.type}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5 flex flex-col justify-center">
              <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">Assigned Agent</div>
              <div className="font-semibold text-cream flex items-center gap-2">
                <img src={journey.agent.avatar} alt="Agent" className="h-6 w-6 rounded-full object-cover" />
                {journey.agent.name}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="sm:col-span-2 mt-auto flex flex-wrap gap-2">
              <GoldButton size="sm" onClick={() => navigate('/owner-dashboard?tab=Messages')}>
                <MessageSquare className="h-4 w-4 mr-2" /> Contact Agent
              </GoldButton>
              <GhostButton size="sm" onClick={() => setIsUploadModalOpen(true)}>
                <Upload className="h-4 w-4 mr-2" /> Upload Missing Docs
              </GhostButton>
              <GhostButton size="sm" onClick={() => navigate(`/properties/${journey.id}`)}>
                <Eye className="h-4 w-4 mr-2" /> View Listing
              </GhostButton>
              <GhostButton size="sm" onClick={() => setIsExportModalOpen(true)}>
                <Download className="h-4 w-4 mr-2" /> Download Timeline
              </GhostButton>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {journey.alerts.map((alert, idx) => (
        <div key={idx} className={`rounded-xl border p-4 flex gap-3 items-center ${
          alert.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
        }`}>
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div className="text-sm font-medium">{alert.message}</div>
        </div>
      ))}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Timeline */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Progress Summary */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="w-full md:w-1/3">
              <div className="text-sm text-ink/60 mb-2">Overall Progress</div>
              <div className="flex items-end gap-3 mb-2">
                <div className="text-3xl font-heading font-bold text-gold-400 leading-none">{journey.progressPercent}%</div>
              </div>
              <div className="h-2 w-full bg-navy-900 rounded-full overflow-hidden">
                <div className="h-full bg-gold-400 rounded-full transition-all duration-500" style={{ width: `${journey.progressPercent}%` }} />
              </div>
            </div>
            <div className="w-full md:w-2/3 grid grid-cols-3 gap-4 text-center md:text-left divide-x divide-white/10">
              <div className="px-2">
                <div className="text-[10px] uppercase text-ink/50 font-semibold mb-1">Days Since Sub.</div>
                <div className="text-xl font-bold text-cream">{journey.daysSinceSubmission}</div>
              </div>
              <div className="px-2">
                <div className="text-[10px] uppercase text-ink/50 font-semibold mb-1">Est. Remaining</div>
                <div className="text-xl font-bold text-cream">{journey.estDaysRemaining}</div>
              </div>
              <div className="px-2">
                <div className="text-[10px] uppercase text-ink/50 font-semibold mb-1">Go Live Date</div>
                <div className="text-lg font-bold text-emerald-400">{journey.expectedGoLive}</div>
              </div>
            </div>
          </div>

          {/* Current Stage Highlight */}
          {currentStage && (
            <div className="rounded-2xl border border-gold-400/30 bg-gold-400/5 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 blur-3xl rounded-full" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/20 px-2 py-1 text-[10px] font-bold uppercase text-gold-400 mb-2 border border-gold-400/30">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400"></span>
                    </span>
                    Current Step
                  </div>
                  <h3 className="font-heading text-xl font-bold text-cream">{currentStage.name}</h3>
                  <p className="text-sm text-ink/70 mt-1">{currentStage.description}</p>
                </div>
                <div className="bg-navy-900/80 rounded-xl p-4 border border-white/5 min-w-[200px]">
                  <div className="text-xs text-ink/50 mb-1">Assigned Team</div>
                  <div className="font-semibold text-cream text-sm mb-3">{currentStage.officer || 'Unassigned'}</div>
                  <div className="text-xs text-ink/50 mb-1">Est. Completion</div>
                  <div className="font-semibold text-emerald-400 text-sm">{currentStage.estCompletion || 'Pending'}</div>
                </div>
              </div>
            </div>
          )}

          {/* The Timeline */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
            <h3 className="font-heading text-xl font-bold text-cream mb-8">Journey Stages</h3>
            <div className="relative">
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-white/5" />
              <div className="space-y-8">
                {journey.stages.map((stage, idx) => {
                  const isCurrent = stage.status === 'Current';
                  const isCompleted = stage.status === 'Completed';
                  const isPending = stage.status === 'Pending';

                  return (
                    <div key={idx} className={`relative flex gap-6 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                      <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 ${getStatusBg(stage.status as StageStatus)}`}>
                        {getStatusIcon(stage.status as StageStatus)}
                      </div>
                      <div className="flex-1 pt-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                          <h4 className={`font-semibold text-lg truncate ${isCurrent ? 'text-gold-400' : isCompleted ? 'text-cream' : 'text-ink/60'}`}>
                            {idx + 1}. {stage.name}
                          </h4>
                          {stage.date && <div className="text-xs text-ink/50 whitespace-nowrap">{stage.date}</div>}
                        </div>
                        <p className="text-sm text-ink/60 mt-1">{stage.description}</p>
                        
                        {(stage.officer || stage.notes) && (
                          <div className="mt-3 p-3 rounded-xl bg-navy-900/50 border border-white/5 space-y-2">
                            {stage.officer && (
                              <div className="flex items-center gap-2 text-xs text-ink/60">
                                <User className="h-3 w-3" /> Responsible: <span className="text-cream">{stage.officer}</span>
                              </div>
                            )}
                            {stage.notes && (
                              <div className="text-sm text-ink/80 italic border-l-2 border-white/10 pl-3">
                                "{stage.notes}"
                              </div>
                            )}
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

        {/* RIGHT COLUMN: Activity Feed */}
        <div className="space-y-8">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div 
              className="flex items-center justify-between cursor-pointer lg:cursor-auto"
              onClick={() => setIsActivityOpen(!isActivityOpen)}
            >
              <h3 className="font-heading text-lg font-bold text-cream">Activity Feed</h3>
              <div className="lg:hidden p-1 text-ink/50 hover:bg-white/5 rounded-md">
                {isActivityOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
            
            <div className={`mt-6 space-y-4 ${!isActivityOpen ? 'hidden lg:block' : 'block'}`}>
              {journey.activityFeed.map((event, idx) => (
                <div key={idx} className="flex gap-4 items-start p-3 rounded-xl bg-navy-900/50 border border-white/5">
                  <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    event.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                    event.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-cream">{event.title}</div>
                    <div className="text-[10px] text-ink/50 mt-1">{event.date}</div>
                  </div>
                </div>
              ))}
              <GhostButton className="w-full text-xs py-2 mt-4" onClick={() => setIsHistoryDrawerOpen(true)}>View Full History</GhostButton>
            </div>
          </div>
        </div>

      </div>
      
      <UploadDocumentModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUpload={handleUpload} 
      />
      
      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        title="Download Timeline"
      />

      <EnterpriseDetailDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        title="Full Journey History"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-cream">Complete Activity Feed</h4>
            <GhostButton size="sm" onClick={() => setIsExportModalOpen(true)}>
              <Download className="h-4 w-4 mr-2" /> Export
            </GhostButton>
          </div>
          <div className="space-y-4">
            {journey.activityFeed.map((event, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-navy-900/50 border border-white/5">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/5 ${
                  event.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                  event.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-cream mb-1">{event.title}</div>
                  <div className="text-xs text-ink/70 mb-2">Recorded by system</div>
                  <div className="text-[10px] uppercase tracking-wider text-ink/50">{event.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}
