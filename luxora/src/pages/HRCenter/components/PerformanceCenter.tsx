import { Target, TrendingUp } from 'lucide-react';
import { useHRCenter } from '../hooks/useHRCenter';
import { HRStatusBadge } from './HRStatusBadge';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export const PerformanceCenter = () => {
  const { reviews, allEmployees } = useHRCenter();

  const getRatingColor = (rating: string) => {
    switch(rating) {
      case 'Outstanding': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Exceeds Expectations': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Meets Expectations': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Needs Improvement': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Unsatisfactory': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Target className="w-6 h-6 mr-3 text-gold-500" />
            Performance & Goals
          </h2>
          <p className="text-gray-500 mt-1">Track KPIs, employee performance reviews, and career development.</p>
        </div>
        <div className="flex space-x-3">
          <GhostButton><TrendingUp className="w-4 h-4 mr-2" /> View Analytics</GhostButton>
          <GoldButton>Start Review Cycle</GoldButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => {
          const emp = allEmployees.find(e => e.id === review.employeeId);
          const reviewer = allEmployees.find(e => e.id === review.reviewerId);
          
          return (
            <div key={review.id} className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100 dark:border-ink-light">
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-lg">
                    {emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-500">{emp?.position}</div>
                </div>
                <HRStatusBadge status={review.rating} className={getRatingColor(review.rating)} />
              </div>
              
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Period: </span> 
                  <span className="text-gray-600 dark:text-gray-400">{review.period}</span>
                </div>
                
                <div className="bg-gray-50 dark:bg-ink-dark rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400 italic">
                  "{review.feedback}"
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-ink-light">
                  <span>Reviewer: {reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : 'Unknown'}</span>
                  <span>Completed: {review.dateCompleted}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
