import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, Network, Award, ShieldCheck, Clock } from 'lucide-react';
import { useHRCenter } from '../hooks/useHRCenter';
import { HRStatusBadge } from './HRStatusBadge';
import { HR_STATUS_COLORS } from '../constants/hrConstants';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export const EmployeeProfile = () => {
  const { selectedEmployee, closeEmployeeProfile, allEmployees } = useHRCenter();

  if (!selectedEmployee) return null;

  const manager = selectedEmployee.managerId 
    ? allEmployees.find(e => e.id === selectedEmployee.managerId)
    : null;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="mb-6">
        <button 
          onClick={closeEmployeeProfile}
          className="flex items-center text-gray-500 hover:text-gold-500 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full bg-gold-100 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400 flex items-center justify-center font-bold text-3xl mr-6 shrink-0 shadow-sm border border-gold-200 dark:border-gold-800">
              {selectedEmployee.firstName.charAt(0)}{selectedEmployee.lastName.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                {selectedEmployee.firstName} {selectedEmployee.lastName}
                <HRStatusBadge status={selectedEmployee.status} className={HR_STATUS_COLORS[selectedEmployee.status]} />
              </h2>
              <p className="text-gray-500 mt-1 text-lg">{selectedEmployee.position}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <GhostButton>Message</GhostButton>
            <GoldButton>Edit Profile</GoldButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-ink-light pb-2">Contact & Personal</h3>
            <div className="space-y-4">
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <Mail className="w-4 h-4 mr-3 text-gold-500" /> {selectedEmployee.email}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <Phone className="w-4 h-4 mr-3 text-gold-500" /> {selectedEmployee.phone}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mr-3 text-gold-500" /> {selectedEmployee.location}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-ink-light pb-2">Employment Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center"><Briefcase className="w-4 h-4 mr-2" /> Employee ID</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedEmployee.id}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center"><Calendar className="w-4 h-4 mr-2" /> Hire Date</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedEmployee.hireDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center"><Clock className="w-4 h-4 mr-2" /> Type</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedEmployee.employmentType}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center"><Network className="w-4 h-4 mr-2" /> Department</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedEmployee.department}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Work context */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-ink-light pb-2">Organizational Placement</h3>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6">
              {/* Manager */}
              {manager ? (
                <div className="flex-1 w-full bg-gray-50 dark:bg-ink-dark rounded-lg p-4 text-center border border-gray-100 dark:border-ink-light">
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">Reports To</div>
                  <div className="w-12 h-12 mx-auto rounded-full bg-gray-200 dark:bg-ink-light text-gray-600 dark:text-gray-400 flex items-center justify-center font-bold mb-2">
                    {manager.firstName.charAt(0)}{manager.lastName.charAt(0)}
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm">{manager.firstName} {manager.lastName}</div>
                  <div className="text-xs text-gray-500">{manager.position}</div>
                </div>
              ) : (
                <div className="flex-1 w-full bg-gray-50 dark:bg-ink-dark rounded-lg p-4 text-center border border-gray-100 dark:border-ink-light flex flex-col justify-center items-center">
                  <Award className="w-8 h-8 text-gold-500 mb-2" />
                  <div className="text-sm font-bold text-gray-900 dark:text-white">Top Level Executive</div>
                </div>
              )}
              
              {/* Team */}
              <div className="flex-1 w-full bg-gray-50 dark:bg-ink-dark rounded-lg p-4 text-center border border-gray-100 dark:border-ink-light flex flex-col justify-center items-center">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">Team</div>
                <div className="font-bold text-gray-900 dark:text-white text-lg">{selectedEmployee.team}</div>
                <div className="text-xs text-gray-500 mt-1">{selectedEmployee.department}</div>
              </div>
            </div>
          </div>

          {/* Integration Links Placeholder */}
          <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-ink-light pb-2">Ecosystem Integration</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-ink-dark hover:bg-gold-50 dark:hover:bg-gold-900/10 transition-colors border border-gray-100 dark:border-ink-light group">
                 <ShieldCheck className="w-6 h-6 text-gray-400 group-hover:text-gold-500 mb-2" />
                 <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gold-600 dark:group-hover:text-gold-400">Compliance Profile</span>
               </button>
               {/* Add other integration buttons like CRM, Workflows etc */}
               <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-ink-dark hover:bg-gold-50 dark:hover:bg-gold-900/10 transition-colors border border-gray-100 dark:border-ink-light group">
                 <Network className="w-6 h-6 text-gray-400 group-hover:text-gold-500 mb-2" />
                 <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gold-600 dark:group-hover:text-gold-400">Workflow Participation</span>
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
