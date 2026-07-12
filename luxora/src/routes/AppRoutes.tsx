import { Route, Routes } from 'react-router-dom'
import AdminDashboardPage from '../pages/AdminDashboard/AdminDashboardPage'
import SuperAdminDashboardPage from '../pages/SuperAdminDashboard/SuperAdminDashboardPage'
import ManagementDashboardPage from '../pages/ManagementDashboard/ManagementDashboardPage'
import ProcurementDashboardPage from '../pages/ProcurementDashboard/ProcurementDashboardPage'
import FinanceDashboardPage from '../pages/FinanceDashboard/FinanceDashboardPage'
import IntelligenceDashboardPage from '../pages/IntelligenceDashboard/IntelligenceDashboardPage'
import PropertyManagementDashboardPage from '../pages/PropertyManagementDashboard/PropertyManagementDashboardPage'
import HomeServicesDashboardPage from '../pages/HomeServicesDashboard/HomeServicesDashboardPage'
import HomePage from '../pages/Home/HomePage'
import CommunicationCenterPage from '../pages/CommunicationCenter/CommunicationCenterPage';
import { NotificationCenterPage } from '../pages/NotificationCenter/NotificationCenterPage'
import { WorkflowCenterPage } from '../pages/WorkflowCenter';
import { DocumentCenterPage } from '../pages/DocumentCenter';
import { CRMCenterPage } from '../pages/CRMCenter';
import { FinanceCenterPage } from '../pages/FinanceCenter';
import { ComplianceCenterPage } from '../pages/ComplianceCenter';
import { HRCenterPage } from '../pages/HRCenter';
import PropertiesPage from '../pages/Properties/PropertiesPage'
import PropertyDetailsPage from '../pages/PropertyDetails/PropertyDetailsPage'
import SearchPage from '../pages/Search/SearchPage'
import LoginPage from '../pages/Auth/LoginPage'
import RegisterPage from '../pages/Auth/RegisterPage'
import BuyerDashboardPage from '../pages/BuyerDashboard/BuyerDashboardPage'
import OwnerDashboardPage from '../pages/OwnerDashboard/OwnerDashboardPage'
import AgentDashboardPage from '../pages/AgentDashboard/AgentDashboardPage'
import AgencyDashboardPage from '../pages/AgencyDashboard/AgencyDashboardPage'
import AboutPage from '../pages/About/AboutPage'
import ContactPage from '../pages/Contact/ContactPage'
import FAQPage from '../pages/FAQ/FAQPage'
import PrivacyPolicyPage from '../pages/Legal/PrivacyPolicyPage'
import TermsOfServicePage from '../pages/Legal/TermsOfServicePage'
import NotFoundPage from '../pages/NotFound/NotFoundPage'
import { ROUTES } from '../constants/routes'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { ROLES } from '../constants/roles'
import { DEPARTMENTS } from '../constants/departments'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.PROPERTIES} element={<PropertiesPage />} />
      <Route path={ROUTES.PROPERTY_DETAILS} element={<PropertyDetailsPage />} />
      <Route path={ROUTES.SEARCH} element={<SearchPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      <Route path={ROUTES.FAQ} element={<FAQPage />} />
      <Route path={ROUTES.PRIVACY} element={<PrivacyPolicyPage />} />
      <Route path={ROUTES.TERMS} element={<TermsOfServicePage />} />

      {/* Protected Dashboard Routes */}
      <Route path={ROUTES.BUYER_DASHBOARD} element={<ProtectedRoute allowedRoles={[ROLES.BUYER]}><BuyerDashboardPage /></ProtectedRoute>} />
      <Route path={ROUTES.OWNER_DASHBOARD} element={<ProtectedRoute allowedRoles={[ROLES.OWNER]}><OwnerDashboardPage /></ProtectedRoute>} />
      <Route path={ROUTES.AGENT_DASHBOARD} element={<ProtectedRoute allowedRoles={[ROLES.AGENT]}><AgentDashboardPage /></ProtectedRoute>} />
      <Route path={ROUTES.AGENCY_DASHBOARD} element={<ProtectedRoute allowedRoles={[ROLES.AGENCY]}><AgencyDashboardPage /></ProtectedRoute>} />
      <Route path={ROUTES.ADMIN_DASHBOARD} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboardPage /></ProtectedRoute>} />
      <Route path={ROUTES.SUPER_ADMIN_DASHBOARD} element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}><SuperAdminDashboardPage /></ProtectedRoute>} />
      
      <Route path={ROUTES.MANAGEMENT_DASHBOARD} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} allowedDepartments={[DEPARTMENTS.MANAGEMENT]}><ManagementDashboardPage /></ProtectedRoute>} />
      <Route path={ROUTES.PROCUREMENT_DASHBOARD} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} allowedDepartments={[DEPARTMENTS.PROCUREMENT]}><ProcurementDashboardPage /></ProtectedRoute>} />
      <Route path={ROUTES.FINANCE_DASHBOARD} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} allowedDepartments={[DEPARTMENTS.FINANCE]}><FinanceDashboardPage /></ProtectedRoute>} />
      <Route path={ROUTES.INTELLIGENCE_DASHBOARD} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} allowedDepartments={[DEPARTMENTS.PROPERTY_INTELLIGENCE]}><IntelligenceDashboardPage /></ProtectedRoute>} />
      <Route path={ROUTES.PROPERTY_MANAGEMENT_DASHBOARD} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} allowedDepartments={[DEPARTMENTS.PROPERTY_MANAGEMENT]}><PropertyManagementDashboardPage /></ProtectedRoute>} />
      <Route path={ROUTES.HOME_SERVICES_DASHBOARD} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} allowedDepartments={[DEPARTMENTS.HOME_SERVICES]}><HomeServicesDashboardPage /></ProtectedRoute>} />
      
      <Route path={ROUTES.COMMUNICATION_CENTER} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.AGENT, ROLES.AGENCY, ROLES.FINANCE, ROLES.PROCUREMENT, ROLES.ANALYST, ROLES.PROPERTY_MANAGER, ROLES.SERVICE_ADMIN]}><CommunicationCenterPage /></ProtectedRoute>} />
      <Route path={ROUTES.NOTIFICATION_CENTER} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.AGENT, ROLES.AGENCY, ROLES.FINANCE, ROLES.PROCUREMENT, ROLES.ANALYST, ROLES.PROPERTY_MANAGER, ROLES.SERVICE_ADMIN]}><NotificationCenterPage /></ProtectedRoute>} />
      <Route path={ROUTES.WORKFLOW_CENTER} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER]}><WorkflowCenterPage /></ProtectedRoute>} />
      <Route path={ROUTES.DOCUMENT_CENTER} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.AGENT, ROLES.AGENCY, ROLES.FINANCE, ROLES.PROCUREMENT]}><DocumentCenterPage /></ProtectedRoute>} />
      <Route 
        path={ROUTES.CRM_CENTER} 
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.AGENT, ROLES.AGENCY]}>
            <CRMCenterPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.FINANCE_CENTER} 
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.FINANCE, ROLES.MANAGER]}>
            <FinanceCenterPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.COMPLIANCE_CENTER} 
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER]}>
            <ComplianceCenterPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.HR_CENTER} 
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER]}>
            <HRCenterPage />
          </ProtectedRoute>
        } 
      />
        
      {/* Module Routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
