import { useEffect, useState, type FormEvent } from 'react';
import {
  UserCircle,
  Filter,
  Plus,
  FileText,
  ArrowRight,
  Users,
  Home,
  Star,
  Phone,
  Activity,
  X,
} from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { Modal } from '../../../components/ui/Modal';
import type { AgencyClient } from '../../../types/agency';

const CLIENT_STORAGE_KEY = 'luxora-agency-clients';

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clientType, setClientType] = useState<'All' | 'Buyer' | 'Owner'>('All');

  const [selectedClient, setSelectedClient] =
    useState<AgencyClient | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Controls the Add Client modal.
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  // Client records are user-created and persisted locally until the backend is ready.
  const [clients, setClients] = useState<AgencyClient[]>([]);

  // Form state for creating a new client.
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Buyer' as 'Buyer' | 'Owner',
  });

  // Load previously created clients from the browser.
  useEffect(() => {
    try {
      const storedClients = localStorage.getItem(CLIENT_STORAGE_KEY);

      if (!storedClients) return;

      const parsedClients = JSON.parse(storedClients);

      if (Array.isArray(parsedClients)) {
        setClients(parsedClients);
      }
    } catch (error) {
      // Ignore malformed local storage data and keep the page usable.
      console.error('Failed to load agency clients:', error);
    }
  }, []);

  // Persist locally created clients between page refreshes.
  useEffect(() => {
    try {
      localStorage.setItem(
        CLIENT_STORAGE_KEY,
        JSON.stringify(clients)
      );
    } catch (error) {
      console.error('Failed to save agency clients:', error);
    }
  }, [clients]);

  // Apply the existing search and client-type filters.
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      client.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesType =
      clientType === 'All' || client.type === clientType;

    return matchesSearch && matchesType;
  });

  // Open the client detail drawer.
  const handleViewClient = (client: AgencyClient) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

  // Reset the Add Client form.
  const resetClientForm = () => {
    setClientForm({
      name: '',
      email: '',
      phone: '',
      type: 'Buyer',
    });
  };

  // Save a newly created client to local application state.
  const handleAddClient = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = clientForm.name.trim();
    const trimmedEmail = clientForm.email.trim();
    const trimmedPhone = clientForm.phone.trim();

    // Do not create incomplete client records.
    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      return;
    }

    const newClient: AgencyClient = {
      // Temporary frontend ID until the backend provides a real database ID.
      id: `local-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      type: clientForm.type,
      status: 'Active',
      transactions: 0,
      agent: 'Unassigned',
      lastComm: 'Just added',
    };

    // Add the newest client to the top of the table.
    setClients((currentClients) => [
      newClient,
      ...currentClients,
    ]);

    // Clear the form and close the modal.
    resetClientForm();
    setIsAddClientOpen(false);
  };

  // Export the currently filtered client list as a CSV file.
  const handleExport = () => {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Type',
      'Agent',
      'Transactions',
      'Status',
      'Last Communication',
    ];

    const rows = filteredClients.map((client) => [
      client.name,
      client.email,
      client.phone,
      client.type,
      client.agent,
      client.transactions,
      client.status,
      client.lastComm,
    ]);

    const csvEscape = (value: unknown) => {
      const stringValue = String(value ?? '');

      // Wrap values containing commas, quotes, or line breaks.
      if (
        stringValue.includes(',') ||
        stringValue.includes('"') ||
        stringValue.includes('\n')
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    };

    const csvContent = [
      headers.map(csvEscape).join(','),
      ...rows.map((row) => row.map(csvEscape).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `luxora-agency-clients-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Client Management"
        subtitle="Manage buyers, owners, and monitor client satisfaction."
        actions={
          <div className="flex gap-3">
            <GhostButton
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Export
            </GhostButton>

            <GoldButton
              onClick={() => setIsAddClientOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Client
            </GoldButton>
          </div>
        }
      />

      {/* These analytics remain empty until the Agency backend supports client metrics. */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Active Buyers"
          value="—"
          trend="Data unavailable"
          trendColor="text-ink/50"
          icon={Users}
        />

        <KPICard
          title="Active Owners"
          value="—"
          trend="Data unavailable"
          trendColor="text-ink/50"
          icon={Home}
        />

        <KPICard
          title="VIP Clients"
          value="—"
          trend="Data unavailable"
          trendColor="text-ink/50"
          icon={Star}
        />

        <KPICard
          title="Returning Clients"
          value="—"
          trend="Data unavailable"
          trendColor="text-ink/50"
          icon={Activity}
        />

        <KPICard
          title="New Clients"
          value="—"
          trend="Data unavailable"
          trendColor="text-ink/50"
          icon={UserCircle}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Client Table */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search clients by name or email..."
            actions={
              <div className="flex gap-2">
                <select
                  className="bg-navy-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold-400"
                  value={clientType}
                  onChange={(event) =>
                    setClientType(
                      event.target.value as 'All' | 'Buyer' | 'Owner'
                    )
                  }
                >
                  <option value="All">All Types</option>
                  <option value="Buyer">Buyers</option>
                  <option value="Owner">Owners</option>
                </select>

                <GhostButton className="px-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </GhostButton>
              </div>
            }
          />

          <div className="flex-1 mt-6">
            <DataTable
              data={filteredClients}
              keyExtractor={(client) => String(client.id)}
              columns={[
                {
                  header: 'Client Profile',
                  render: (client) => (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-navy-900 flex items-center justify-center font-bold text-cream border border-white/10">
                        {String(client.name).charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div
                          className="font-semibold text-cream hover:text-gold-400 cursor-pointer transition-colors"
                          onClick={() => handleViewClient(client)}
                        >
                          {String(client.name)}
                        </div>

                        <div className="text-xs text-ink/60 mt-0.5">
                          {String(client.email)}
                        </div>
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Type',
                  render: (client) => (
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        client.type === 'Buyer'
                          ? 'bg-blue-400/10 text-blue-400'
                          : 'bg-emerald-400/10 text-emerald-400'
                      }`}
                    >
                      {String(client.type)}
                    </span>
                  ),
                },

                {
                  header: 'Agent',
                  render: (client) => (
                    <span className="text-sm text-ink/80">
                      {String(client.agent)}
                    </span>
                  ),
                },

                {
                  header: 'Transactions',
                  render: (client) => (
                    <span className="font-medium text-cream">
                      {String(client.transactions)}
                    </span>
                  ),
                },

                {
                  header: 'Status',
                  render: (client) => (
                    <EnterpriseStatusBadge
                      status={String(client.status)}
                    />
                  ),
                },

                {
                  header: <div className="text-right">Actions</div>,
                  className: 'text-right',
                  render: (client) => (
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-1.5 text-ink/60 hover:text-cream rounded hover:bg-white/5 transition-colors"
                        title="Contact"
                      >
                        <Phone className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleViewClient(client)}
                        className="p-1.5 text-ink/60 hover:text-gold-400 rounded hover:bg-gold-400/10 transition-colors"
                        title="View Profile"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {/* Sidebar: Intelligence */}
        <div className="space-y-6">
          {/* Growth & Retention */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">
              Growth & Retention
            </h3>

            <div className="space-y-4">
              {/* Retention metrics require backend client history. */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/80">
                    Client Retention Rate
                  </span>

                  <span className="font-bold text-ink/50">—</span>
                </div>

                <div className="text-xs text-ink/50">
                  No retention data available
                </div>
              </div>

              {/* Buyer and owner distribution requires backend client relationships. */}
              <div className="pt-4 border-t border-white/5">
                <div className="text-[10px] uppercase font-bold tracking-widest text-ink/60 mb-3">
                  Buyer vs Owner Distribution
                </div>

                <div className="rounded-lg border border-white/5 bg-navy-900/40 px-4 py-3 text-sm text-ink/50">
                  No buyer/owner distribution data available
                </div>
              </div>
            </div>
          </div>

          {/* Active Transactions */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">
              Active Transactions
            </h3>

            {/* Transaction workflows are not yet available from the Agency backend. */}
            <div className="rounded-lg border border-white/5 bg-navy-900/40 px-4 py-4 text-sm text-ink/50">
              No transaction data available
            </div>
          </div>

          {/* Satisfaction Overview */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-gold-400" />
              Client Satisfaction
            </h3>

            {/* Review data will be connected once the backend supports client reviews. */}
            <div className="text-4xl font-bold text-cream mb-2">
              —
            </div>

            <div className="text-sm text-ink/60">
              No client review data available
            </div>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={isAddClientOpen}
        onClose={() => {
          resetClientForm();
          setIsAddClientOpen(false);
        }}
        title="Add Client"
        size="lg"
        actionButton={
          <GoldButton
            type="submit"
            form="add-client-form"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </GoldButton>
        }
      >
        <form
          id="add-client-form"
          onSubmit={handleAddClient}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="client-name"
              className="block text-sm font-medium text-cream mb-2"
            >
              Full Name
            </label>

            <input
              id="client-name"
              type="text"
              value={clientForm.name}
              onChange={(event) =>
                setClientForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="Enter client's full name"
              required
              className="w-full bg-navy-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-cream placeholder:text-ink/40 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="client-email"
                className="block text-sm font-medium text-cream mb-2"
              >
                Email Address
              </label>

              <input
                id="client-email"
                type="email"
                value={clientForm.email}
                onChange={(event) =>
                  setClientForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="client@example.com"
                required
                className="w-full bg-navy-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-cream placeholder:text-ink/40 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label
                htmlFor="client-phone"
                className="block text-sm font-medium text-cream mb-2"
              >
                Phone Number
              </label>

              <input
                id="client-phone"
                type="tel"
                value={clientForm.phone}
                onChange={(event) =>
                  setClientForm((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                placeholder="080xxxxxxxx"
                required
                className="w-full bg-navy-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-cream placeholder:text-ink/40 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="client-type"
              className="block text-sm font-medium text-cream mb-2"
            >
              Client Type
            </label>

            <select
              id="client-type"
              value={clientForm.type}
              onChange={(event) =>
                setClientForm((current) => ({
                  ...current,
                  type: event.target.value as 'Buyer' | 'Owner',
                }))
              }
              className="w-full bg-navy-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-cream focus:outline-none focus:border-gold-400"
            >
              <option value="Buyer">Buyer</option>
              <option value="Owner">Owner</option>
            </select>
          </div>

          <div className="rounded-xl border border-white/5 bg-navy-900/40 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink/50 mb-2">
              Initial Assignment
            </div>

            <div className="text-sm text-ink/70">
              This client will start as{' '}
              <span className="text-cream font-medium">
                Unassigned
              </span>
              . Agent assignment can be connected to the Agency
              backend later.
            </div>
          </div>
        </form>
      </Modal>

      {/* Client detail drawer */}
      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          selectedClient
            ? `Client: ${selectedClient.name}`
            : 'Client Details'
        }
        footerActions={
          <div className="flex gap-3 w-full">
            <GhostButton className="flex-1">
              Message Client
            </GhostButton>

            <GoldButton className="flex-1">
              Reassign Agent
            </GoldButton>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-semibold text-cream mb-4">
              Client Information
            </h4>

            <div className="space-y-3 text-sm text-ink/80">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Email</span>

                <span className="font-medium text-cream">
                  {selectedClient?.email || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Phone</span>

                <span className="font-medium text-cream">
                  {selectedClient?.phone || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Type</span>

                <span className="font-medium text-cream">
                  {selectedClient?.type || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Assigned Agent</span>

                <span className="font-medium text-cream">
                  {selectedClient?.agent || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Total Transactions</span>

                <span className="font-medium text-cream">
                  {selectedClient?.transactions ?? '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Status</span>

                <span className="font-medium text-cream">
                  {selectedClient?.status || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Last Communication</span>

                <span className="font-medium text-cream">
                  {selectedClient?.lastComm || '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}