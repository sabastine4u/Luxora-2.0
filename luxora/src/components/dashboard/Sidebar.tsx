import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Landmark,
  Users,
  Wallet,
  Package,
  Brain,
  KeyRound,
  Wrench,
  Handshake,
  UserCircle,
  Shield,
  FileBarChart,
  Settings,
  Crown,
  ChevronLeft,
  LogOut,
  Heart,
  MessageSquare,
  Eye,
  FileCheck,
  Home,
  TrendingUp,
  Calendar,
  AlertCircle,
  Activity,
  Banknote,
  Briefcase,
  ShoppingCart,
  ShieldAlert,
  UserCog,
  PieChart,
  Megaphone,
  ChartBar,
  Calculator,
  LineChart,
  MapPin,
  Map,
  FileText,
} from 'lucide-react';

import {
  useState,
  useEffect,
} from 'react';

import {
  sidebarNav,
  ROLE_NAV_MAP,
} from '../../data/luxoraData';

import {
  useSession,
} from '../../contexts/SessionContext';

import {
  useFavorites,
} from '../../contexts/FavoriteContext';

import {
  agentApi,
} from '../../api/agent.api';

import {
  propertyApi,
} from '../../api/property.api';

import {
  adminApi,
} from '../../api/admin.api';

import {
  PROCUREMENT_DATA_CHANGED,
  procurementApi,
} from '../../api/procurement.api';
import { financeApi } from '../../api/finance.api';
import { intelligenceApi } from '../../api/intelligence.api';
import { PROPERTY_MANAGEMENT_DATA_CHANGED, propertyManagementApi } from '../../api/property-management.api';

const iconMap: Record<
  string,
  React.ComponentType<{
    className?: string;
  }>
> = {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Landmark,
  Users,
  Wallet,
  ChartBar,
  Package,
  Brain,
  KeyRound,
  Wrench,
  Handshake,
  UserCircle,
  Shield,
  FileBarChart,
  Settings,
  Crown,
  ChevronLeft,
  LogOut,
  Heart,
  MessageSquare,
  Eye,
  FileCheck,
  Home,
  TrendingUp,
  Calendar,
  AlertCircle,
  Activity,
  Banknote,
  Briefcase,
  ShoppingCart,
  ShieldAlert,
  UserCog,
  PieChart,
  Megaphone,
  Calculator,
  LineChart,
  MapPin,
  Map,
  FileText,

  Sparkles: Brain,
  Truck: Briefcase,
  Paintbrush: Wrench,
  Zap: Activity,
  Droplet: Activity,
  PenTool: Wrench,
  Palette: Heart,
  Armchair: Building2,
  Wifi: Activity,
  Leaf: Heart,
};

export default function Sidebar({
  active,
  onSelect,
  open,
  onClose,
}: {
  active: string;
  onSelect: (label: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  const {
    user,
    logout,
  } = useSession();

  const {
    favoriteCount,
  } = useFavorites();

  const [agentCount, setAgentCount] =
    useState<number | null>(null);

  const [assignmentCount, setAssignmentCount] =
    useState<number | null>(null);

  const [leadCount, setLeadCount] =
    useState<number | null>(null);

  const [agentAssignmentCount, setAgentAssignmentCount] =
    useState<number | null>(null);

  const [agentListingCount, setAgentListingCount] =
    useState<number | null>(null);

  const [agentClientCount, setAgentClientCount] =
    useState<number | null>(null);

  const [agentLeadCount, setAgentLeadCount] =
    useState<number | null>(null);

  const [agentAppointmentCount, setAgentAppointmentCount] =
    useState<number | null>(null);

  const [agentDealCount, setAgentDealCount] =
    useState<number | null>(null);

  const [agentCommissionCount, setAgentCommissionCount] =
    useState<number | null>(null);

  const [adminListingCount, setAdminListingCount] =
    useState<number | null>(null);

  const [verificationCenterCount, setVerificationCenterCount] =
    useState<number | null>(null);

  const [adminOwnerCount, setAdminOwnerCount] =
    useState<number | null>(null);

  const [adminBuyerCount, setAdminBuyerCount] =
    useState<number | null>(null);

  const [adminAgentCount, setAdminAgentCount] =
    useState<number | null>(null);

  const [adminAgencyCount, setAdminAgencyCount] =
    useState<number | null>(null);

  const [adminStaffCount, setAdminStaffCount] =
    useState<number | null>(null);

  // Real count of active complaints requiring Admin attention.
  const [adminComplaintCount, setAdminComplaintCount] =
    useState<number | null>(null);

  const [procurementCounts, setProcurementCounts] =
    useState<Record<string, number> | null>(null);
  const [financeCounts, setFinanceCounts] = useState<Record<string, number> | null>(null);
  const [intelligenceCounts, setIntelligenceCounts] = useState<Record<string, number> | null>(null);
  const [propertyManagementCounts, setPropertyManagementCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    if (!user?.role) {
      return;
    }

    if (user.role === 'Procurement Officer') {
      const loadProcurementCounts = () => {
        procurementApi
          .getCounts()
          .then((response: any) => {
            const counts = response?.counts;
            setProcurementCounts(
              counts && typeof counts === 'object' ? counts : null,
            );
          })
          .catch(() => setProcurementCounts(null));
      };

      loadProcurementCounts();
      window.addEventListener(
        PROCUREMENT_DATA_CHANGED,
        loadProcurementCounts,
      );
      return () => window.removeEventListener(
        PROCUREMENT_DATA_CHANGED,
        loadProcurementCounts,
      );
    }

    if (user.role === 'Finance Manager') {
      financeApi.getCounts().then((response: any) => setFinanceCounts(response?.counts || null)).catch(() => setFinanceCounts(null));
      return;
    }

    if (user.role === 'Data Analyst') {
      intelligenceApi.getCounts().then((response: any) => setIntelligenceCounts(response?.data || null)).catch(() => setIntelligenceCounts(null));
      return;
    }

    if (user.role === 'Property Manager') {
      const loadPropertyManagementCounts = () => propertyManagementApi.summary()
        .then((response: any) => setPropertyManagementCounts(response?.summary || null))
        .catch(() => setPropertyManagementCounts(null));
      loadPropertyManagementCounts();
      window.addEventListener(PROPERTY_MANAGEMENT_DATA_CHANGED, loadPropertyManagementCounts);
      return () => window.removeEventListener(PROPERTY_MANAGEMENT_DATA_CHANGED, loadPropertyManagementCounts);
    }

    if (
      user.role === 'Admin' ||
      user.role === 'Super Admin'
    ) {
      adminApi
        .getProperties()
        .then((response) => {
          const rawResponse =
            response as any;

          const properties =
            Array.isArray(
              rawResponse?.properties,
            )
              ? rawResponse.properties
              : Array.isArray(
                rawResponse?.data?.properties,
              )
                ? rawResponse.data.properties
                : [];

          setAdminListingCount(
            properties.length,
          );
        })
        .catch(() => {
          setAdminListingCount(null);
        });

      adminApi
        .getVerificationCenterCount()
        .then((response) => {
          const rawResponse =
            response as any;

          const count =
            typeof rawResponse?.count === 'number'
              ? rawResponse.count
              : typeof rawResponse?.data?.count === 'number'
                ? rawResponse.data.count
                : null;

          setVerificationCenterCount(
            count,
          );
        })
        .catch(() => {
          setVerificationCenterCount(null);
        });

      adminApi
        .getOwners()
        .then((response) => {
          const rawResponse =
            response as any;

          const owners =
            Array.isArray(
              rawResponse?.owners,
            )
              ? rawResponse.owners
              : Array.isArray(
                rawResponse?.data?.owners,
              )
                ? rawResponse.data.owners
                : [];

          setAdminOwnerCount(
            owners.length,
          );
        })
        .catch(() => {
          setAdminOwnerCount(null);
        });

      adminApi
        .getBuyers()
        .then((response) => {
          const rawResponse =
            response as any;

          const buyers =
            Array.isArray(
              rawResponse?.buyers,
            )
              ? rawResponse.buyers
              : Array.isArray(
                rawResponse?.data?.buyers,
              )
                ? rawResponse.data.buyers
                : [];

          setAdminBuyerCount(
            buyers.length,
          );
        })
        .catch(() => {
          setAdminBuyerCount(null);
        });

      adminApi
        .getAgents()
        .then((response) => {
          const rawResponse =
            response as any;

          const agents =
            Array.isArray(
              rawResponse?.agents,
            )
              ? rawResponse.agents
              : Array.isArray(
                rawResponse?.data?.agents,
              )
                ? rawResponse.data.agents
                : [];

          setAdminAgentCount(
            agents.length,
          );
        })
        .catch(() => {
          setAdminAgentCount(null);
        });

      adminApi
        .getAgencies()
        .then((response) => {
          const rawResponse =
            response as any;

          const agencies =
            Array.isArray(
              rawResponse?.agencies,
            )
              ? rawResponse.agencies
              : Array.isArray(
                rawResponse?.data?.agencies,
              )
                ? rawResponse.data.agencies
                : [];

          setAdminAgencyCount(
            agencies.length,
          );
        })
        .catch(() => {
          setAdminAgencyCount(null);
        });

      adminApi
        .getInternalStaff()
        .then((response) => {
          const rawResponse =
            response as any;

          const staff =
            Array.isArray(
              rawResponse?.staff,
            )
              ? rawResponse.staff
              : Array.isArray(
                rawResponse?.data?.staff,
              )
                ? rawResponse.data.staff
                : [];

          setAdminStaffCount(
            staff.length,
          );
        })
        .catch(() => {
          setAdminStaffCount(null);
        });

      // Fetch active complaints for the Admin sidebar badge.
      adminApi
        .getComplaints()
        .then((response) => {
          const rawResponse =
            response as any;

          const complaints =
            Array.isArray(
              rawResponse?.complaints,
            )
              ? rawResponse.complaints
              : Array.isArray(
                rawResponse?.data?.complaints,
              )
                ? rawResponse.data.complaints
                : [];

          const activeComplaints =
            complaints.filter(
              (complaint: any) =>
                complaint.status === 'Open' ||
                complaint.status === 'In Progress' ||
                complaint.status === 'Escalated',
            );

          setAdminComplaintCount(
            activeComplaints.length,
          );
        })
        .catch(() => {
          setAdminComplaintCount(null);
        });

      return;
    }

    if (user.role === 'Agency') {
      agentApi
        .getAgents()
        .then((response) => {
          const rawResponse =
            response as any;

          const agents =
            Array.isArray(
              rawResponse?.agents,
            )
              ? rawResponse.agents
              : Array.isArray(
                rawResponse?.data?.agents,
              )
                ? rawResponse.data.agents
                : [];

          setAgentCount(
            agents.length,
          );
        })
        .catch(() => {
          setAgentCount(null);
        });

      propertyApi
        .getAgencyInquiries()
        .then((response) => {
          const rawResponse =
            response as any;

          const inquiries =
            Array.isArray(
              rawResponse?.inquiries,
            )
              ? rawResponse.inquiries
              : Array.isArray(
                rawResponse?.data?.inquiries,
              )
                ? rawResponse.data.inquiries
                : [];

          setLeadCount(
            inquiries.length,
          );
        })
        .catch(() => {
          setLeadCount(null);
        });

      propertyApi
        .getAgencyProperties()
        .then((response) => {
          const rawResponse =
            response as any;

          const properties =
            Array.isArray(
              rawResponse?.properties,
            )
              ? rawResponse.properties
              : Array.isArray(
                rawResponse?.data?.properties,
              )
                ? rawResponse.data.properties
                : [];

          setAssignmentCount(
            properties.length,
          );
        })
        .catch(() => {
          setAssignmentCount(null);
        });

      return;
    }

    if (user.role === 'Agent') {
      agentApi
        .getMyAssignments()
        .then((response) => {
          const rawResponse =
            response as any;

          const properties =
            Array.isArray(
              rawResponse?.properties,
            )
              ? rawResponse.properties
              : Array.isArray(
                rawResponse?.data?.properties,
              )
                ? rawResponse.data.properties
                : [];

          setAgentAssignmentCount(
            properties.length,
          );
        })
        .catch(() => {
          setAgentAssignmentCount(null);
        });

      agentApi
        .getMyListings()
        .then((response) => {
          const rawResponse =
            response as any;

          const properties =
            Array.isArray(
              rawResponse?.properties,
            )
              ? rawResponse.properties
              : Array.isArray(
                rawResponse?.data?.properties,
              )
                ? rawResponse.data.properties
                : [];

          setAgentListingCount(
            properties.length,
          );
        })
        .catch(() => {
          setAgentListingCount(null);
        });

      agentApi
        .getMyClients()
        .then((response) => {
          const rawResponse =
            response as any;

          const clients =
            Array.isArray(
              rawResponse?.clients,
            )
              ? rawResponse.clients
              : Array.isArray(
                rawResponse?.data?.clients,
              )
                ? rawResponse.data.clients
                : [];

          setAgentClientCount(
            clients.length,
          );
        })
        .catch(() => {
          setAgentClientCount(null);
        });

      agentApi
        .getMyLeads()
        .then((response) => {
          const rawResponse =
            response as any;

          const inquiries =
            Array.isArray(
              rawResponse?.inquiries,
            )
              ? rawResponse.inquiries
              : Array.isArray(
                rawResponse?.data?.inquiries,
              )
                ? rawResponse.data.inquiries
                : [];

          setAgentLeadCount(
            inquiries.length,
          );
        })
        .catch(() => {
          setAgentLeadCount(null);
        });

      agentApi
        .getMyAppointments()
        .then((response) => {
          const rawResponse =
            response as any;

          const appointments =
            Array.isArray(
              rawResponse?.appointments,
            )
              ? rawResponse.appointments
              : Array.isArray(
                rawResponse?.data?.appointments,
              )
                ? rawResponse.data.appointments
                : [];

          setAgentAppointmentCount(
            appointments.length,
          );
        })
        .catch(() => {
          setAgentAppointmentCount(null);
        });

      agentApi
        .getMyDeals()
        .then((response) => {
          const rawResponse =
            response as any;

          const deals =
            Array.isArray(
              rawResponse?.offers,
            )
              ? rawResponse.offers
              : Array.isArray(
                rawResponse?.data?.offers,
              )
                ? rawResponse.data.offers
                : [];

          setAgentDealCount(
            deals.length,
          );
        })
        .catch(() => {
          setAgentDealCount(null);
        });

      agentApi
        .getMyCommissions()
        .then((response) => {
          const rawResponse =
            response as any;

          const commissions =
            Array.isArray(
              rawResponse?.commissions,
            )
              ? rawResponse.commissions
              : Array.isArray(
                rawResponse?.data?.commissions,
              )
                ? rawResponse.data.commissions
                : [];

          setAgentCommissionCount(
            commissions.length,
          );
        })
        .catch(() => {
          setAgentCommissionCount(null);
        });

      return;
    }

    // Clear role-specific counts for all other roles.
    setAgentCount(null);
    setAssignmentCount(null);
    setLeadCount(null);

    setAgentAssignmentCount(null);
    setAgentListingCount(null);
    setAgentClientCount(null);
    setAgentLeadCount(null);
    setAgentAppointmentCount(null);
    setAgentDealCount(null);
    setAgentCommissionCount(null);

    setAdminListingCount(null);
    setVerificationCenterCount(null);
    setAdminOwnerCount(null);
    setAdminBuyerCount(null);
    setAdminAgentCount(null);
    setAdminAgencyCount(null);
    setAdminStaffCount(null);
    setAdminComplaintCount(null);
    setProcurementCounts(null);
    setFinanceCounts(null);
  }, [user?.role]);

  const getInitials = (
    name?: string,
  ) => {
    if (!name) {
      return 'U';
    }

    return name
      .split(' ')
      .map(
        (n) => n[0],
      )
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const navItems =
    user?.role &&
      ROLE_NAV_MAP[user.role]
      ? ROLE_NAV_MAP[user.role]
      : sidebarNav;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-navy-950 transition-transform duration-300 lg:translate-x-0 ${
          open
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <button className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-gradient">
              <Crown
                className="h-5 w-5 text-navy-900"
                strokeWidth={2.5}
              />
            </div>

            <div>
              <div className="font-heading text-base font-extrabold text-cream">
                Luxora
                <span className="gold-text">
                  {' '}
                  2.0
                </span>
              </div>

              <div className="text-[10px] uppercase tracking-wider text-gold-300/70">
                Command Center
              </div>
            </div>
          </button>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-ink/60 lg:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-ink/30">
            Main
          </div>

          {navItems.map((item) => {
            const Icon =
              iconMap[item.icon] ??
              LayoutDashboard;

            const isActive =
              active === item.label;

            const badgeValue =
              user?.role === 'Finance Manager' &&
                ({ 'Owner Payments': 'ownerPayments', 'Agency Earnings': 'agencyEarnings', 'Agent Commissions': 'agentCommissions', 'Mortgage Statistics': 'mortgageApplications', Budget: 'procurementBudget', 'Audit Logs': 'auditLogs' } as Record<string, string>)[item.label]
                ? financeCounts?.[({ 'Owner Payments': 'ownerPayments', 'Agency Earnings': 'agencyEarnings', 'Agent Commissions': 'agentCommissions', 'Mortgage Statistics': 'mortgageApplications', Budget: 'procurementBudget', 'Audit Logs': 'auditLogs' } as Record<string, string>)[item.label]]

              : user?.role === 'Finance Manager' && item.label === 'Refunds'
                ? undefined

              : user?.role === 'Data Analyst' && item.label === 'Comparable Properties'
                ? intelligenceCounts?.properties

              : user?.role === 'Procurement Officer' &&
                ({
                  'Vendor Directory': 'vendor',
                  RFQs: 'rfq',
                  'Purchase Requests': 'request',
                  'Purchase Orders': 'order',
                  Contracts: 'contract',
                  Inventory: 'inventory',
                  Assets: 'asset',
                  Invoices: 'invoice',
                  Budget: 'budget',
                  Payments: 'payment',
                } as Record<string, string>)[item.label]
                ? procurementCounts?.[({
                  'Vendor Directory': 'vendor',
                  RFQs: 'rfq',
                  'Purchase Requests': 'request',
                  'Purchase Orders': 'order',
                  Contracts: 'contract',
                  Inventory: 'inventory',
                  Assets: 'asset',
                  Invoices: 'invoice',
                  Budget: 'budget',
                  Payments: 'payment',
                } as Record<string, string>)[item.label]]

              : user?.role === 'Procurement Officer' && item.label === 'Messages'
                ? undefined

              : user?.role === 'Property Manager' &&
                ({ Tenants: 'activeTenants', 'Rent Collection': 'pendingRentPayments', Maintenance: 'openWorkOrders', 'Lease Tracking': 'activeLeases', Inspections: 'pendingInspections', Expenses: 'pendingExpenses' } as Record<string, string>)[item.label]
                ? propertyManagementCounts?.[({ Tenants: 'activeTenants', 'Rent Collection': 'pendingRentPayments', Maintenance: 'openWorkOrders', 'Lease Tracking': 'activeLeases', Inspections: 'pendingInspections', Expenses: 'pendingExpenses' } as Record<string, string>)[item.label]]

              : item.label === 'Listings' &&
                (
                  user?.role === 'Admin' ||
                  user?.role === 'Super Admin'
                ) &&
                adminListingCount !== null
                ? adminListingCount

                : item.label ===
                  'Verification Center' &&
                  (
                    user?.role === 'Admin' ||
                    user?.role === 'Super Admin'
                  ) &&
                  verificationCenterCount !== null
                  ? verificationCenterCount

                  : item.label === 'Owners' &&
                    (
                      user?.role === 'Admin' ||
                      user?.role === 'Super Admin'
                    ) &&
                    adminOwnerCount !== null
                    ? adminOwnerCount

                    : item.label === 'Buyers' &&
                      (
                        user?.role === 'Admin' ||
                        user?.role === 'Super Admin'
                      ) &&
                      adminBuyerCount !== null
                      ? adminBuyerCount

                      : item.label === 'Agents' &&
                        (
                          user?.role === 'Admin' ||
                          user?.role === 'Super Admin'
                        ) &&
                        adminAgentCount !== null
                        ? adminAgentCount

                        : item.label === 'Agencies' &&
                          (
                            user?.role === 'Admin' ||
                            user?.role === 'Super Admin'
                          ) &&
                          adminAgencyCount !== null
                          ? adminAgencyCount

                          : item.label ===
                            'Internal Staff' &&
                            (
                              user?.role === 'Admin' ||
                              user?.role === 'Super Admin'
                            ) &&
                            adminStaffCount !== null
                            ? adminStaffCount

                            // Live active Complaints count.
                            : item.label ===
                              'Complaints' &&
                              (
                                user?.role === 'Admin' ||
                                user?.role === 'Super Admin'
                              ) &&
                              adminComplaintCount !== null
                              ? adminComplaintCount

                              : item.label ===
                                'Assignments' &&
                                user?.role === 'Agent' &&
                                agentAssignmentCount !== null
                                ? agentAssignmentCount

                                : item.label ===
                                  'My Listings' &&
                                  user?.role === 'Agent' &&
                                  agentListingCount !== null
                                  ? agentListingCount

                                  : item.label ===
                                    'Clients' &&
                                    user?.role === 'Agent' &&
                                    agentClientCount !== null
                                    ? agentClientCount

                                    : item.label ===
                                      'Leads' &&
                                      user?.role === 'Agent' &&
                                      agentLeadCount !== null
                                      ? agentLeadCount

                                      : item.label ===
                                        'Appointments' &&
                                        user?.role === 'Agent' &&
                                        agentAppointmentCount !==
                                        null
                                        ? agentAppointmentCount

                                        : item.label ===
                                          'Deals' &&
                                          user?.role ===
                                          'Agent' &&
                                          agentDealCount !==
                                          null
                                          ? agentDealCount

                                          : item.label ===
                                            'Commissions' &&
                                            user?.role ===
                                            'Agent' &&
                                            agentCommissionCount !==
                                            null
                                            ? agentCommissionCount

                                            : item.label ===
                                              'Listings' &&
                                              user?.role ===
                                              'Agency' &&
                                              assignmentCount !==
                                              null
                                              ? assignmentCount

                                              : item.label ===
                                                'Assignment Center' &&
                                                user?.role ===
                                                'Agency' &&
                                                assignmentCount !==
                                                null
                                                ? assignmentCount

                                                : item.label ===
                                                  'Agents' &&
                                                  user?.role ===
                                                  'Agency' &&
                                                  agentCount !==
                                                  null
                                                  ? agentCount

                                                  : item.label ===
                                                    'Leads' &&
                                                    user?.role ===
                                                    'Agency' &&
                                                    leadCount !==
                                                    null
                                                    ? leadCount

                                                    : item.label ===
                                                      'My Favorites'
                                                      ? favoriteCount

                                                      // Never use the old hardcoded Complaints badge.
                                                      : item.label ===
                                                        'Complaints'
                                                        ? undefined

                                                        : item.badge;

            return (
              <button
                key={item.label}
                onClick={() =>
                  onSelect(
                    item.label,
                  )
                }
                className={`group mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  isActive
                    ? 'border border-gold-400/20 bg-gold-400/10 text-gold-200'
                    : 'border border-transparent text-ink/60 hover:bg-white/5 hover:text-cream'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive
                      ? 'text-gold-400'
                      : ''
                  }`}
                />

                <span className="flex-1 text-left font-medium">
                  {item.displayLabel ||
                    item.label}
                </span>

                {badgeValue !==
                  undefined &&
                  badgeValue !== null &&
                  badgeValue !== '' && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-ink/60">
                      {badgeValue}
                    </span>
                  )}

                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={
                  user.name
                }
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient text-sm font-bold text-navy-900">
                {getInitials(
                  user?.name,
                )}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-cream">
                {user?.name ||
                  'Guest'}
              </div>

              <div className="truncate text-[10px] text-ink/50">
                {user?.role ||
                  'Visitor'}
              </div>
            </div>

            <button
              onClick={logout}
              className="text-ink/40 transition-colors hover:text-rose-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
