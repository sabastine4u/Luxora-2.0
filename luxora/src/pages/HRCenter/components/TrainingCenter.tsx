import { GraduationCap, FileCheck } from 'lucide-react';
import { useHRCenter } from '../hooks/useHRCenter';
import { HRStatusBadge } from './HRStatusBadge';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export const TrainingCenter = () => {
  const { training } = useHRCenter();

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <GraduationCap className="w-6 h-6 mr-3 text-gold-500" />
            Training & Certifications
          </h2>
          <p className="text-gray-500 mt-1">Manage corporate learning, mandatory compliance training, and skill development.</p>
        </div>
        <div className="flex space-x-3">
          <GhostButton><FileCheck className="w-4 h-4 mr-2" /> Matrix</GhostButton>
          <GoldButton>Assign Course</GoldButton>
        </div>
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-ink-light border-b border-gray-200 dark:border-ink-light text-gray-500 dark:text-gray-400 text-sm">
              <th className="p-4 font-medium">Course ID</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Duration</th>
              <th className="p-4 font-medium">Requirement</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-ink-light">
            {training.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-ink-light/50 transition-colors">
                <td className="p-4 text-sm font-bold text-gray-900 dark:text-white">{course.id}</td>
                <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{course.title}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{course.category}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{course.durationHours} hrs</td>
                <td className="p-4 text-sm">
                  {course.mandatory ? (
                    <HRStatusBadge status="Mandatory" className="bg-red-50 text-red-700 border-red-200" />
                  ) : (
                    <HRStatusBadge status="Optional" className="bg-gray-100 text-gray-600 border-gray-200" />
                  )}
                </td>
                <td className="p-4 text-sm text-right">
                  <GhostButton size="sm">Manage Enrollments</GhostButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
