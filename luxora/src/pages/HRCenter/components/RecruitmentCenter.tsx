import { UserPlus, Filter } from 'lucide-react';
import { useHRCenter } from '../hooks/useHRCenter';
import { HRStatusBadge } from './HRStatusBadge';
import { HR_STATUS_COLORS } from '../constants/hrConstants';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export const RecruitmentCenter = () => {
  const { applicants } = useHRCenter();

  const stages = ['Applied', 'Screening', 'Interviewing', 'Offered', 'Hired'];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <UserPlus className="w-6 h-6 mr-3 text-gold-500" />
            Recruitment & ATS Pipeline
          </h2>
          <p className="text-gray-500 mt-1">Manage applicants, interviews, and job offers across all departments.</p>
        </div>
        <div className="flex items-center space-x-3">
          <GhostButton><Filter className="w-4 h-4 mr-2" /> Filter Jobs</GhostButton>
          <GoldButton>Post New Job</GoldButton>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {stages.map(stage => {
          const stageApplicants = applicants.filter(a => a.status === stage);
          
          return (
            <div key={stage} className="w-80 shrink-0 flex flex-col bg-gray-100/50 dark:bg-ink-dark/50 rounded-xl border border-gray-200 dark:border-ink-light p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700 dark:text-gray-300">{stage}</h3>
                <span className="bg-gray-200 dark:bg-ink-light text-gray-600 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded-full">
                  {stageApplicants.length}
                </span>
              </div>
              
              <div className="flex flex-col gap-3">
                {stageApplicants.map(app => (
                  <div key={app.id} className="bg-white dark:bg-ink rounded-lg p-4 border border-gray-200 dark:border-ink-light shadow-sm cursor-pointer hover:border-gold-300 dark:hover:border-gold-700 transition-colors">
                    <div className="font-bold text-gray-900 dark:text-white">{app.firstName} {app.lastName}</div>
                    <div className="text-sm text-gray-500 mb-2">{app.positionApplied}</div>
                    <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-gray-100 dark:border-ink-light">
                      <span className="text-gray-400">{app.department}</span>
                      <HRStatusBadge status={app.status} className={HR_STATUS_COLORS[app.status]} />
                    </div>
                  </div>
                ))}
                {stageApplicants.length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-ink-light rounded-lg">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
