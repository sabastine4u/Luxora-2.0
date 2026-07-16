# Luxora 2.0 Mock Credentials

For development and testing purposes, the following mock accounts have been provisioned in the system. Use these credentials to access the respective dashboards and enterprise centers.

**Password for all accounts:** `password123`

| Role | Name | Email | Department | Dashboard Route |
| :--- | :--- | :--- | :--- | :--- |
| **Buyer** | Eleanor Vance | `buyer@luxora.com` | - | `/buyer-dashboard` |
| **Owner** | Arthur Pendelton | `owner@luxora.com` | - | `/owner-dashboard` |
| **Agent** | Sarah Jenkins | `agent@luxora.com` | - | `/agent-dashboard` |
| **Agency** | Marcus Sterling | `agency@luxora.com` | - | `/agency-dashboard` |
| **Admin** | Isabella Rossi | `admin@luxora.com` | - | `/admin-dashboard` |
| **Super Admin** | Julian Vance | `superadmin@luxora.com` | - | `/super-admin-dashboard` |
| **Manager** | Olivia Chen | `manager@luxora.com` | Management | `/management-dashboard` |
| **Procurement** | David Kim | `procurement@luxora.com` | Procurement | `/procurement-dashboard` |
| **Finance** | Sophia Williams | `finance@luxora.com` | Finance | `/finance-dashboard` |
| **Analyst** | James Rodriguez | `analyst@luxora.com` | Property Intelligence | `/intelligence-dashboard` |
| **Property Manager** | Emily Davis | `propertymanager@luxora.com` | Property Management | `/property-management-dashboard` |
| **Service Admin** | Michael Brown | `serviceadmin@luxora.com` | Home Services | `/home-services-dashboard` |

> [!NOTE]
> All authentication states are managed completely via `SessionContext.tsx`. The current session is persisted to `localStorage` under `luxora_user`.
