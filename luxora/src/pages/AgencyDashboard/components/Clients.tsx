import { useEffect, useMemo, useState } from 'react';
import {
  UserCircle,
  FileText,
  ArrowRight,
  Users,
  Home,
  Star,
  Phone,
  Activity,
  Loader2,
  Mail,
} from 'lucide-react';

import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import {
  GhostButton,
} from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';

import { propertyApi } from '../../../api/property.api';
import { bookingApi } from '../../../api/booking.api';
import { offerApi } from '../../../api/offer.api';

import type { AgencyClient } from '../../../types/agency';

interface ClientRecord extends AgencyClient {
  interactionCount: number;
  firstActivityAt: string;
  lastActivityAt: string;
  isActive: boolean;
}

interface AgencyInquiryRecord {
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  lastActivityAt?: string;
  agent?: {
    _id?: string;
    fullName?: string;
    email?: string;
  } | null;
  property?: {
    _id?: string;
    title?: string;
    city?: string;
    state?: string;
    status?: string;
  } | null;
}

interface AgencyPropertyRecord {
  _id?: string;
  title?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  owner?: {
    _id?: string;
    fullName?: string;
    email?: string;
  } | null;
  agent?: {
    _id?: string;
    fullName?: string;
    email?: string;
  } | null;
}

interface AgencyBookingRecord {
  _id?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  viewingDate?: string;
  buyer?: {
    _id?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  } | null;
  property?: {
    _id?: string;
    title?: string;
    agent?: {
      _id?: string;
      fullName?: string;
      email?: string;
    } | null;
  } | null;
}

interface AgencyOfferRecord {
  _id?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  buyer?: {
    _id?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  } | null;
  agent?: {
    _id?: string;
    fullName?: string;
    email?: string;
  } | null;
  property?: {
    _id?: string;
    title?: string;
    owner?: string | null;
    agent?: string | null;
  } | null;
}

interface AgencyCollectionResponse {
  inquiries?: AgencyInquiryRecord[];
  properties?: AgencyPropertyRecord[];
  bookings?: AgencyBookingRecord[];
  offers?: AgencyOfferRecord[];
  data?: {
    inquiries?: AgencyInquiryRecord[];
    properties?: AgencyPropertyRecord[];
    bookings?: AgencyBookingRecord[];
    offers?: AgencyOfferRecord[];
  };
}

const ACTIVE_INQUIRY_STATUSES = [
  'New',
  'Contacted',
  'Viewing Scheduled',
  'Negotiating',
];

const ACTIVE_OFFER_STATUSES = [
  'Submitted',
  'Under Review',
  'Counter Offer Received',
];

const FINAL_BOOKING_STATUSES = [
  'Completed',
  'Cancelled',
  'Rejected',
];

const FINAL_PROPERTY_STATUSES = [
  'Archived',
];

const ACCEPTED_OFFER_STATUS = 'Accepted';

const normalizeEmail = (
  email?: string | null,
) =>
  String(email || '')
    .trim()
    .toLowerCase();

const safeDate = (
  value?: string | Date | null,
) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
};

const latestDate = (
  ...values: Array<string | Date | null | undefined>
) => {
  const dates = values
    .map(safeDate)
    .filter(
      (date): date is Date =>
        date !== null,
    );

  if (dates.length === 0) {
    return null;
  }

  return dates.reduce(
    (latest, current) =>
      current.getTime() >
      latest.getTime()
        ? current
        : latest,
  );
};

const earliestDate = (
  ...values: Array<string | Date | null | undefined>
) => {
  const dates = values
    .map(safeDate)
    .filter(
      (date): date is Date =>
        date !== null,
    );

  if (dates.length === 0) {
    return null;
  }

  return dates.reduce(
    (earliest, current) =>
      current.getTime() <
      earliest.getTime()
        ? current
        : earliest,
  );
};

const formatActivityDate = (
  value: string,
) => {
  const date = safeDate(value);

  if (!date) {
    return 'No activity recorded';
  }

  return date.toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  );
};

const unwrapCollection = <T,>(
  response: unknown,
  key: keyof AgencyCollectionResponse,
): T[] => {
  const payload =
    response as AgencyCollectionResponse;

  const directCollection =
    payload?.[key];

  if (Array.isArray(directCollection)) {
    return directCollection as T[];
  }

  if (
    payload?.data &&
    Array.isArray(
      payload.data[
        key as keyof AgencyCollectionResponse['data']
      ],
    )
  ) {
    return payload.data[
      key as keyof AgencyCollectionResponse['data']
    ] as T[];
  }

  return [];
};

export default function Clients() {
  const [searchQuery, setSearchQuery] =
    useState('');

  const [
    clientType,
    setClientType,
  ] = useState<
    'All' | 'Buyer' | 'Owner'
  >('All');

  const [
    clients,
    setClients,
  ] = useState<ClientRecord[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    loadError,
    setLoadError,
  ] = useState<string | null>(null);

  const [
    selectedClient,
    setSelectedClient,
  ] = useState<ClientRecord | null>(
    null,
  );

  const [
    isDrawerOpen,
    setIsDrawerOpen,
  ] = useState(false);

  /*
   * Build the Agency Client list from the real
   * Inquiry, Property, Booking, and Offer records.
   */
  useEffect(() => {
    let isActive = true;

    const loadClients = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        /*
         * Do not make the entire page fail because one
         * supporting data source is unavailable.
         */
        const results =
          await Promise.allSettled([
            propertyApi.getAgencyProperties(),
            propertyApi.getAgencyInquiries(),
            bookingApi.getAgencyBookings(),
            offerApi.getAgencyOffers(),
          ]);

        if (!isActive) {
          return;
        }

        const [
          propertyResult,
          inquiryResult,
          bookingResult,
          offerResult,
        ] = results;

        const agencyProperties =
          propertyResult.status === 'fulfilled'
            ? unwrapCollection<AgencyPropertyRecord>(
                propertyResult.value,
                'properties',
              )
            : [];

        const agencyInquiries =
          inquiryResult.status === 'fulfilled'
            ? unwrapCollection<AgencyInquiryRecord>(
                inquiryResult.value,
                'inquiries',
              )
            : [];

        const agencyBookings =
          bookingResult.status === 'fulfilled'
            ? unwrapCollection<AgencyBookingRecord>(
                bookingResult.value,
                'bookings',
              )
            : [];

        const agencyOffers =
          offerResult.status === 'fulfilled'
            ? unwrapCollection<AgencyOfferRecord>(
                offerResult.value,
                'offers',
              )
            : [];

        const successfulSources =
          results.filter(
            (result) =>
              result.status ===
              'fulfilled',
          ).length;

        if (
          successfulSources === 0
        ) {
          throw new Error(
            'Agency client data could not be loaded.',
          );
        }

        /*
         * Use a Map so the same Buyer or Owner
         * appearing across multiple real records
         * becomes one Client.
         */
        const clientMap =
          new Map<
            string,
            {
              id: string;
              name: string;
              email: string;
              phone: string;
              type: 'Buyer' | 'Owner';
              agent: string;
              interactionCount: number;
              transactionCount: number;
              firstActivityAt: string | null;
              lastActivityAt: string | null;
              isActive: boolean;
            }
          >();

        const upsertClient = ({
          key,
          id,
          name,
          email,
          phone,
          type,
          agent,
          activityDate,
          isActiveRelationship,
          transactionIncrement = 0,
        }: {
          key: string;
          id: string;
          name: string;
          email: string;
          phone: string;
          type: 'Buyer' | 'Owner';
          agent?: string;
          activityDate?: string | null;
          isActiveRelationship?: boolean;
          transactionIncrement?: number;
        }) => {
          const existing =
            clientMap.get(key);

          if (!existing) {
            clientMap.set(key, {
              id,
              name:
                name ||
                'Unnamed Client',
              email:
                email ||
                'No email available',
              phone:
                phone ||
                'No phone available',
              type,
              agent:
                agent ||
                'Unassigned',
              interactionCount: 1,
              transactionCount:
                transactionIncrement,
              firstActivityAt:
                activityDate || null,
              lastActivityAt:
                activityDate || null,
              isActive:
                Boolean(
                  isActiveRelationship,
                ),
            });

            return;
          }

          const incomingActivity =
            safeDate(
              activityDate,
            );

          const existingLatest =
            safeDate(
              existing.lastActivityAt,
            );

          const existingEarliest =
            safeDate(
              existing.firstActivityAt,
            );

          existing.interactionCount += 1;

          existing.transactionCount +=
            transactionIncrement;

          existing.isActive =
            existing.isActive ||
            Boolean(
              isActiveRelationship,
            );

          if (
            incomingActivity &&
            (!existingLatest ||
              incomingActivity.getTime() >
                existingLatest.getTime())
          ) {
            existing.lastActivityAt =
              incomingActivity.toISOString();

            if (name) {
              existing.name = name;
            }

            if (phone) {
              existing.phone = phone;
            }

            if (agent) {
              existing.agent =
                agent;
            }
          }

          if (
            incomingActivity &&
            (!existingEarliest ||
              incomingActivity.getTime() <
                existingEarliest.getTime())
          ) {
            existing.firstActivityAt =
              incomingActivity.toISOString();
          }

          if (
            existing.agent ===
              'Unassigned' &&
            agent
          ) {
            existing.agent = agent;
          }
        };

        /*
         * 1. Buyers from real Agency inquiries.
         */
        for (const inquiry of agencyInquiries) {
          const email =
            normalizeEmail(
              inquiry.email,
            );

          if (!email) {
            continue;
          }

          const inquiryActivity =
            inquiry.lastActivityAt ||
            inquiry.updatedAt ||
            inquiry.createdAt ||
            null;

          upsertClient({
            key: `buyer:${email}`,
            id:
              inquiry.inquirer?._id ||
              email,
            name:
              inquiry.fullName ||
              email,
            email,
            phone:
              inquiry.phone || '',
            type: 'Buyer',
            agent:
              inquiry.agent?.fullName ||
              'Unassigned',
            activityDate:
              inquiryActivity,
            isActiveRelationship:
              ACTIVE_INQUIRY_STATUSES.includes(
                inquiry.status ||
                  'New',
              ),
          });
        }

        /*
         * 2. Buyers from real Agency viewing bookings.
         *
         * This also captures Buyers who scheduled a
         * viewing but do not yet have an Inquiry record.
         */
        for (const booking of agencyBookings) {
          const email =
            normalizeEmail(
              booking.buyer?.email,
            );

          if (!email) {
            continue;
          }

          const bookingActivity =
            booking.updatedAt ||
            booking.viewingDate ||
            booking.createdAt ||
            null;

          upsertClient({
            key: `buyer:${email}`,
            id:
              booking.buyer?._id ||
              email,
            name:
              booking.buyer?.fullName ||
              email,
            email,
            phone:
              booking.buyer?.phone ||
              '',
            type: 'Buyer',
            agent:
              booking.property?.agent
                ?.fullName ||
              'Unassigned',
            activityDate:
              bookingActivity,
            isActiveRelationship:
              !FINAL_BOOKING_STATUSES.includes(
                booking.status ||
                  '',
              ),
          });
        }

        /*
         * 3. Buyers from real Agency Offers.
         */
        for (const offer of agencyOffers) {
          const email =
            normalizeEmail(
              offer.buyer?.email,
            );

          if (!email) {
            continue;
          }

          const offerActivity =
            offer.updatedAt ||
            offer.createdAt ||
            null;

          upsertClient({
            key: `buyer:${email}`,
            id:
              offer.buyer?._id ||
              email,
            name:
              offer.buyer?.fullName ||
              email,
            email,
            phone:
              offer.buyer?.phone ||
              '',
            type: 'Buyer',
            agent:
              offer.agent?.fullName ||
              'Unassigned',
            activityDate:
              offerActivity,
            isActiveRelationship:
              ACTIVE_OFFER_STATUSES.includes(
                offer.status ||
                  '',
              ),
            transactionIncrement:
              offer.status ===
              ACCEPTED_OFFER_STATUS
                ? 1
                : 0,
          });
        }

        /*
         * 4. Owners from real Agency Properties.
         */
        for (const agencyProperty of agencyProperties) {
          const owner =
            agencyProperty.owner;

          const ownerEmail =
            normalizeEmail(
              owner?.email,
            );

          const ownerId =
            owner?._id ||
            ownerEmail;

          if (!ownerId) {
            continue;
          }

          const ownerActivity =
            agencyProperty.updatedAt ||
            agencyProperty.createdAt ||
            null;

          upsertClient({
            key: `owner:${ownerId}`,
            id: ownerId,
            name:
              owner?.fullName ||
              ownerEmail ||
              'Unnamed Owner',
            email:
              ownerEmail ||
              'No email available',
            phone: '',
            type: 'Owner',
            agent:
              agencyProperty.agent
                ?.fullName ||
              'Unassigned',
            activityDate:
              ownerActivity,
            isActiveRelationship:
              !FINAL_PROPERTY_STATUSES.includes(
                agencyProperty.status ||
                  '',
              ),
          });
        }

        /*
         * 5. Add accepted Owner-side transactions
         * to the matching Owner records.
         *
         * The Offer's Property contains the real Owner
         * reference, allowing the relationship to be
         * matched without creating a Client model.
         */
        for (const offer of agencyOffers) {
          if (
            offer.status !==
            ACCEPTED_OFFER_STATUS
          ) {
            continue;
          }

          const ownerId =
            offer.property?.owner;

          if (!ownerId) {
            continue;
          }

          const ownerClient =
            clientMap.get(
              `owner:${String(ownerId)}`,
            );

          if (!ownerClient) {
            continue;
          }

          /*
           * The accepted Offer was already counted
           * for Buyers above. Here we count it for
           * the Property Owner as well.
           */
          ownerClient.transactionCount += 1;

          const offerActivity =
            offer.updatedAt ||
            offer.createdAt ||
            null;

          const incomingActivity =
            safeDate(
              offerActivity,
            );

          const existingLatest =
            safeDate(
              ownerClient.lastActivityAt,
            );

          if (
            incomingActivity &&
            (!existingLatest ||
              incomingActivity.getTime() >
                existingLatest.getTime())
          ) {
            ownerClient.lastActivityAt =
              incomingActivity.toISOString();
          }
        }

        /*
         * Convert the aggregated records into the
         * existing AgencyClient structure used by
         * the table and drawer.
         */
        const mappedClients: ClientRecord[] =
          Array.from(
            clientMap.values(),
          ).map((client) => ({
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            type: client.type,
            status: client.isActive
              ? 'Active'
              : 'Past',
            transactions:
              client.transactionCount,
            agent: client.agent,
            lastComm:
              formatActivityDate(
                client.lastActivityAt ||
                  '',
              ),
            interactionCount:
              client.interactionCount,
            firstActivityAt:
              client.firstActivityAt ||
              '',
            lastActivityAt:
              client.lastActivityAt ||
              '',
            isActive:
              client.isActive,
          }));

        /*
         * Newest active activity first.
         */
        mappedClients.sort(
          (a, b) => {
            const aDate =
              safeDate(
                a.lastActivityAt,
              )?.getTime() || 0;

            const bDate =
              safeDate(
                b.lastActivityAt,
              )?.getTime() || 0;

            return bDate - aDate;
          },
        );

        setClients(
          mappedClients,
        );

        /*
         * Report partial source failures without
         * discarding the successfully loaded data.
         */
        if (
          successfulSources <
          results.length
        ) {
          setLoadError(
            'Some Agency client activity sources could not be loaded. Available client records are shown from the sources that responded.',
          );
        }
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error(
          'Failed to load Agency Clients:',
          error,
        );

        setClients([]);

        setLoadError(
          error instanceof Error
            ? error.message
            : 'Agency clients could not be loaded.',
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadClients();

    return () => {
      isActive = false;
    };
  }, []);

  /*
   * Apply the existing search and client-type filters.
   */
  const filteredClients = useMemo(
    () => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      return clients.filter(
        (client) => {
          const matchesSearch =
            !query ||
            client.name
              .toLowerCase()
              .includes(query) ||
            client.email
              .toLowerCase()
              .includes(query) ||
            client.phone
              .toLowerCase()
              .includes(query);

          const matchesType =
            clientType === 'All' ||
            client.type ===
              clientType;

          return (
            matchesSearch &&
            matchesType
          );
        },
      );
    },
    [
      clients,
      searchQuery,
      clientType,
    ],
  );

  /*
   * Calculate real client metrics from the aggregated records.
   */
  const clientStats = useMemo(() => {
    const now =
      new Date().getTime();

    const thirtyDaysAgo =
      now -
      30 *
        24 *
        60 *
        60 *
        1000;

    const activeBuyers =
      clients.filter(
        (client) =>
          client.type === 'Buyer' &&
          client.isActive,
      ).length;

    const activeOwners =
      clients.filter(
        (client) =>
          client.type === 'Owner' &&
          client.isActive,
      ).length;

    /*
     * "Returning" is derived from multiple real
     * interactions represented by the aggregated
     * inquiry/booking/offer/property records.
     */
    const returningClients =
      clients.filter(
        (client) =>
          client.interactionCount > 1,
      ).length;

    /*
     * "New" means the first known real activity
     * occurred during the last 30 days.
     */
    const newClients =
      clients.filter((client) => {
        const firstActivity =
          safeDate(
            client.firstActivityAt,
          );

        return (
          firstActivity !== null &&
          firstActivity.getTime() >=
            thirtyDaysAgo
        );
      }).length;

    const transactionCount =
      clients.reduce(
        (total, client) =>
          total +
          client.transactions,
        0,
      );

    return {
      activeBuyers,
      activeOwners,
      returningClients,
      newClients,
      transactionCount,
    };
  }, [clients]);

  // Open the client detail drawer.
  const handleViewClient = (
    client: ClientRecord,
  ) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

  /*
   * Export the currently filtered real client
   * list as CSV.
   */
  const handleExport = () => {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Type',
      'Agent',
      'Transactions',
      'Status',
      'Last Activity',
    ];

    const rows =
      filteredClients.map(
        (client) => [
          client.name,
          client.email,
          client.phone,
          client.type,
          client.agent,
          client.transactions,
          client.status,
          client.lastComm,
        ],
      );

    const csvEscape = (
      value: unknown,
    ) => {
      const stringValue =
        String(value ?? '');

      if (
        stringValue.includes(',') ||
        stringValue.includes('"') ||
        stringValue.includes('\n')
      ) {
        return `"${stringValue.replace(
          /"/g,
          '""',
        )}"`;
      }

      return stringValue;
    };

    const csvContent = [
      headers
        .map(csvEscape)
        .join(','),
      ...rows.map((row) =>
        row
          .map(csvEscape)
          .join(','),
      ),
    ].join('\n');

    const blob = new Blob(
      [csvContent],
      {
        type: 'text/csv;charset=utf-8;',
      },
    );

    const url =
      URL.createObjectURL(
        blob,
      );

    const link =
      document.createElement(
        'a',
      );

    link.href = url;

    link.download = `luxora-agency-clients-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  /*
   * Initial loading state.
   *
   * Do not show an empty client state before the
   * real Agency data has returned.
   */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          name="Client Management"
          subtitle="Building the Agency client view from real Buyer and Owner activity."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-white/10 bg-navy-800/50"
            />
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-6 h-10 w-full animate-pulse rounded bg-white/5" />

          <div className="space-y-4">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded bg-white/5"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Client Management"
        subtitle="Manage buyers and owners using real Agency inquiries, properties, viewings, and offers."
        actions={
          <GhostButton
            onClick={
              handleExport
            }
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export
          </GhostButton>
        }
      />

      {loadError && (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-200">
          {loadError}
        </div>
      )}

      {/* Real Client KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Active Buyers"
          value={String(
            clientStats.activeBuyers,
          )}
          trend="Open buyer relationships"
          trendColor="text-emerald-400"
          icon={Users}
        />

        <KPICard
          title="Active Owners"
          value={String(
            clientStats.activeOwners,
          )}
          trend="Owners with active listings"
          trendColor="text-emerald-400"
          icon={Home}
        />

        <KPICard
          title="VIP Clients"
          value="—"
          trend="Not tracked by current backend"
          trendColor="text-ink/50"
          icon={Star}
        />

        <KPICard
          title="Returning Clients"
          value={String(
            clientStats.returningClients,
          )}
          trend="Multiple real activity records"
          trendColor="text-blue-400"
          icon={Activity}
        />

        <KPICard
          title="New Clients"
          value={String(
            clientStats.newClients,
          )}
          trend="First activity in last 30 days"
          trendColor="text-gold-400"
          icon={UserCircle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Client Table */}
        <div className="flex min-h-[500px] h-[calc(100vh-280px)] flex-col rounded-2xl border border-white/10 bg-navy-800/50 p-6 lg:col-span-3">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={
              setSearchQuery
            }
            searchPlaceholder="Search clients by name, email, or phone..."
            actions={
              <select
                className="rounded-lg border border-white/10 bg-navy-900 px-3 py-2 text-sm text-cream focus:border-gold-400 focus:outline-none"
                value={clientType}
                onChange={(event) =>
                  setClientType(
                    event.target.value as
                      | 'All'
                      | 'Buyer'
                      | 'Owner',
                  )
                }
              >
                <option value="All">
                  All Types
                </option>

                <option value="Buyer">
                  Buyers
                </option>

                <option value="Owner">
                  Owners
                </option>
              </select>
            }
          />

          <div className="mt-6 flex-1">
            {filteredClients.length ===
            0 ? (
              <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-white/5 bg-navy-900/30 p-8 text-center">
                <div>
                  <Users className="mx-auto mb-4 h-10 w-10 text-gold-400/50" />

                  <h3 className="font-heading text-lg font-semibold text-cream">
                    No client records found
                  </h3>

                  <p className="mt-2 text-sm text-ink/50">
                    {clients.length === 0
                      ? 'Agency clients will appear here as real inquiries, viewing requests, offers, and managed property relationships are created.'
                      : 'Try changing the search or client type filter.'}
                  </p>
                </div>
              </div>
            ) : (
              <DataTable
                data={
                  filteredClients
                }
                keyExtractor={(
                  client,
                ) =>
                  String(
                    client.id,
                  )
                }
                columns={[
                  {
                    header:
                      'Client Profile',
                    render: (
                      client,
                    ) => (
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-navy-900 font-bold text-cream">
                          {client.name
                            .charAt(
                              0,
                            )
                            .toUpperCase()}
                        </div>

                        <div>
                          <button
                            type="button"
                            className="font-semibold text-cream transition-colors hover:text-gold-400"
                            onClick={() =>
                              handleViewClient(
                                client,
                              )
                            }
                          >
                            {
                              client.name
                            }
                          </button>

                          <div className="mt-0.5 text-xs text-ink/60">
                            {
                              client.email
                            }
                          </div>
                        </div>
                      </div>
                    ),
                  },

                  {
                    header: 'Type',
                    render: (
                      client,
                    ) => (
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          client.type ===
                          'Buyer'
                            ? 'bg-blue-400/10 text-blue-400'
                            : 'bg-emerald-400/10 text-emerald-400'
                        }`}
                      >
                        {
                          client.type
                        }
                      </span>
                    ),
                  },

                  {
                    header: 'Agent',
                    render: (
                      client,
                    ) => (
                      <span className="text-sm text-ink/80">
                        {
                          client.agent
                        }
                      </span>
                    ),
                  },

                  {
                    header:
                      'Transactions',
                    render: (
                      client,
                    ) => (
                      <span className="font-medium text-cream">
                        {
                          client.transactions
                        }
                      </span>
                    ),
                  },

                  {
                    header: 'Status',
                    render: (
                      client,
                    ) => (
                      <EnterpriseStatusBadge
                        status={String(
                          client.status,
                        )}
                      />
                    ),
                  },

                  {
                    header: (
                      <div className="text-right">
                        Actions
                      </div>
                    ),
                    className:
                      'text-right',
                    render: (
                      client,
                    ) => (
                      <div className="flex justify-end gap-2">
                        {client.phone &&
                        client.phone !==
                          'No phone available' ? (
                          <a
                            href={`tel:${client.phone}`}
                            className="rounded p-1.5 text-ink/60 transition-colors hover:bg-white/5 hover:text-cream"
                            title="Call client"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        ) : null}

                        {client.email &&
                        client.email !==
                          'No email available' ? (
                          <a
                            href={`mailto:${client.email}`}
                            className="rounded p-1.5 text-ink/60 transition-colors hover:bg-white/5 hover:text-cream"
                            title="Email client"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        ) : null}

                        <button
                          type="button"
                          onClick={() =>
                            handleViewClient(
                              client,
                            )
                          }
                          className="rounded p-1.5 text-ink/60 transition-colors hover:bg-gold-400/10 hover:text-gold-400"
                          title="View Profile"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    ),
                  },
                ]}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Growth & Retention */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="mb-4 font-heading text-lg font-semibold text-cream">
              Growth & Retention
            </h3>

            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-ink/80">
                    Returning Clients
                  </span>

                  <span className="font-bold text-cream">
                    {
                      clientStats.returningClients
                    }
                  </span>
                </div>

                <div className="text-xs text-ink/50">
                  Clients with multiple real activity records
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-ink/60">
                  Buyer vs Owner Distribution
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-blue-400/10 bg-blue-400/5 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-blue-300/60">
                      Buyers
                    </div>

                    <div className="mt-1 text-xl font-bold text-cream">
                      {
                        clients.filter(
                          (client) =>
                            client.type ===
                            'Buyer',
                        ).length
                      }
                    </div>
                  </div>

                  <div className="rounded-lg border border-emerald-400/10 bg-emerald-400/5 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-300/60">
                      Owners
                    </div>

                    <div className="mt-1 text-xl font-bold text-cream">
                      {
                        clients.filter(
                          (client) =>
                            client.type ===
                            'Owner',
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Transactions */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="mb-4 font-heading text-lg font-semibold text-cream">
              Active Transactions
            </h3>

            <div className="rounded-xl border border-gold-400/10 bg-gold-400/5 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-gold-400/70">
                Accepted Offers
              </div>

              <div className="mt-1 text-3xl font-bold text-cream">
                {
                  clientStats.transactionCount
                }
              </div>

              <div className="mt-1 text-xs text-ink/50">
                Based on real Agency offers
              </div>
            </div>
          </div>

          {/* Satisfaction Overview */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-cream">
              <Star className="h-5 w-5 text-gold-400" />
              Client Satisfaction
            </h3>

            <div className="mb-2 text-4xl font-bold text-cream">
              —
            </div>

            <div className="text-sm text-ink/60">
              Client review and rating data is not
              currently stored by the Agency backend.
            </div>
          </div>
        </div>
      </div>

      {/* Client detail drawer */}
      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() =>
          setIsDrawerOpen(false)
        }
        title={
          selectedClient
            ? `Client: ${selectedClient.name}`
            : 'Client Details'
        }
        footerActions={
          <div className="flex w-full gap-3">
            {selectedClient?.phone &&
            selectedClient.phone !==
              'No phone available' ? (
              <GhostButton
                className="flex-1"
                onClick={() => {
                  window.location.href = `tel:${selectedClient.phone}`;
                }}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Client
              </GhostButton>
            ) : null}

            {selectedClient?.email &&
            selectedClient.email !==
              'No email available' ? (
              <GhostButton
                className="flex-1"
                onClick={() => {
                  window.location.href = `mailto:${selectedClient.email}`;
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Client
              </GhostButton>
            ) : null}
          </div>
        }
      >
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
            <h4 className="mb-4 text-sm font-semibold text-cream">
              Client Information
            </h4>

            <div className="space-y-3 text-sm text-ink/80">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Name</span>

                <span className="font-medium text-cream">
                  {
                    selectedClient?.name ||
                    '—'
                  }
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Email</span>

                <span className="font-medium text-cream">
                  {
                    selectedClient?.email ||
                    '—'
                  }
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Phone</span>

                <span className="font-medium text-cream">
                  {
                    selectedClient?.phone ||
                    '—'
                  }
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Type</span>

                <span className="font-medium text-cream">
                  {
                    selectedClient?.type ||
                    '—'
                  }
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Assigned Agent</span>

                <span className="font-medium text-cream">
                  {
                    selectedClient?.agent ||
                    '—'
                  }
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Accepted Transactions</span>

                <span className="font-medium text-cream">
                  {
                    selectedClient?.transactions ??
                    '—'
                  }
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Relationship Status</span>

                <span className="font-medium text-cream">
                  {
                    selectedClient?.status ||
                    '—'
                  }
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Activity Records</span>

                <span className="font-medium text-cream">
                  {
                    selectedClient?.interactionCount ??
                    '—'
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span>Last Activity</span>

                <span className="font-medium text-cream">
                  {
                    selectedClient?.lastComm ||
                    '—'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
            <h4 className="mb-3 text-sm font-semibold text-cream">
              Data Source
            </h4>

            <p className="text-sm leading-relaxed text-ink/60">
              This Agency client record is derived from
              real inquiries, viewing requests, offers,
              and managed property relationships. The
              current backend does not maintain a separate
              Agency Client entity.
            </p>
          </div>
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}