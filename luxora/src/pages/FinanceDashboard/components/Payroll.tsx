import { useState } from 'react';
import { Users, UserPlus, FileSpreadsheet } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge, EnterpriseExportMenu, EnterpriseDetailDrawer } from '../../../components/enterprise';
import { Modal } from '../../../components/ui/Modal';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { useToast } from '../../../contexts/ToastContext';

interface EmployeeItem {
  id: string;
  name: string;
  role: string;
  department: string;
  salary: string;
  status: string;
  nextPay: string;
}

export default function Payroll() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<EmployeeItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const employees = [
    { id: 'EMP-001', name: 'James Carter', role: 'Senior Analyst', department: 'Finance', salary: '₦850,000', status: 'Active', nextPay: 'Oct 31, 2026' },
    { id: 'EMP-002', name: 'Linda Okafor', role: 'Marketing Manager', department: 'Marketing', salary: '₦720,000', status: 'Active', nextPay: 'Oct 31, 2026' },
    { id: 'EMP-003', name: 'David Smith', role: 'Software Engineer', department: 'Engineering', salary: '₦950,000', status: 'On Leave', nextPay: 'Oct 31, 2026' },
    { id: 'EMP-004', name: 'Chioma Eze', role: 'HR Specialist', department: 'Human Resources', salary: '₦450,000', status: 'Active', nextPay: 'Oct 31, 2026' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Corporate Payroll</h2>
          <p className="text-sm text-ink/60">Manage employee salaries, benefits, and payroll processing.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export Payroll as ${f.toUpperCase()}`)} />
          <GoldButton onClick={() => setIsProcessModalOpen(true)}>
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Process Payroll
          </GoldButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard 
          title="Total Monthly Payroll"
          value="₦24.5M"
          icon={Users}
          trend="+1.2% from last month"
          trendColor="text-ink/40"
          iconColor="text-gold-400"
          backgroundColor="bg-gold-400/10"
        />
        <KPICard 
          title="Active Employees"
          value="45"
          icon={Users}
          trend="+2 new hires"
          trendColor="text-emerald-400"
          iconColor="text-blue-400"
          backgroundColor="bg-blue-400/10"
        />
        <KPICard 
          title="Upcoming Taxes & Deductions"
          value="₦4.2M"
          icon={FileSpreadsheet}
          trend="Due Oct 31, 2026"
          trendColor="text-ink/40"
          iconColor="text-rose-400"
          backgroundColor="bg-rose-400/10"
        />
      </div>

      <div className="space-y-4">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search employees..."
          showFilter
          onFilter={() => handleAction('Filter Employees')}
          actions={
            <GhostButton className="px-4" onClick={() => handleAction('Add New Employee')}>
              <UserPlus className="h-4 w-4 mr-2" /> Add Employee
            </GhostButton>
          }
        />

        <DataTable
          data={employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(emp) => emp.id}
          onRowClick={(emp: EmployeeItem) => { setSelectedEmp(emp); setIsDrawerOpen(true); }}
          columns={[
            {
              header: "Employee",
              render: (emp) => (
                <div className="font-semibold text-cream flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-navy-900 border border-white/10 flex items-center justify-center text-xs text-gold-400">
                    {emp.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  {emp.name}
                </div>
              )
            },
            {
              header: "Role",
              render: (emp) => <span className="text-ink/60">{emp.role}</span>
            },
            {
              header: "Department",
              render: (emp) => <span className="text-ink/60">{emp.department}</span>
            },
            {
              header: "Status",
              render: (emp) => <EnterpriseStatusBadge status={emp.status} />
            },
            {
              header: "Next Pay Date",
              render: (emp) => <span className="text-ink/60">{emp.nextPay}</span>
            },
            {
              header: <div className="text-right">Base Salary (Monthly)</div>,
              className: "text-right font-bold text-gold-400",
              render: (emp) => emp.salary
            }
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Employee Payroll Profile"
        subtitle={selectedEmp?.id}
        footerActions={
          <>
            <GhostButton onClick={() => handleAction('Download Payslip')}>Download Last Payslip</GhostButton>
            <GoldButton onClick={() => handleAction('Edit Compensation')}>Edit Compensation</GoldButton>
          </>
        }
      >
        {selectedEmp && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Status</span>
              <EnterpriseStatusBadge status={selectedEmp.status} />
            </div>
            
            <div className="space-y-4 rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Name</span>
                <span className="text-sm font-medium text-cream">{selectedEmp.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Role</span>
                <span className="text-sm font-medium text-cream">{selectedEmp.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Department</span>
                <span className="text-sm font-medium text-cream">{selectedEmp.department}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 mt-4">
                <span className="text-sm font-bold text-cream">Gross Base Salary</span>
                <span className="text-lg font-bold text-gold-400">{selectedEmp.salary}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cream">Current Deductions & Benefits</h4>
              <div className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-3">
                 <div className="flex justify-between text-sm">
                   <span className="text-ink/60">Pension (RSA)</span>
                   <span className="text-rose-400 font-medium">-₦68,000</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-ink/60">PAYE Tax</span>
                   <span className="text-rose-400 font-medium">-₦125,000</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-ink/60">Health Insurance (HMO)</span>
                   <span className="text-emerald-400 font-medium">Provided</span>
                 </div>
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <Modal
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
        title="Process Monthly Payroll"
        size="md"
        actionButton={
          <GoldButton onClick={() => { handleAction('Run Payroll'); setIsProcessModalOpen(false); }}>
            Run Payroll
          </GoldButton>
        }
      >
        <div className="space-y-6">
          <p className="text-sm text-ink/60">
            You are about to run the payroll for <strong>October 2026</strong>. This will process direct deposits for 45 employees and calculate all applicable taxes.
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Payroll Period</label>
            <select className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
              <option>October 2026</option>
              <option>September 2026</option>
            </select>
          </div>
          
          <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-ink/60">Gross Payroll</span>
                <span className="text-cream font-medium">₦24,500,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink/60">Total Deductions</span>
                <span className="text-rose-400 font-medium">-₦4,200,000</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-3">
                <span className="text-cream">Net Payout</span>
                <span className="text-gold-400">₦20,300,000</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
