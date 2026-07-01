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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.PROPERTIES} element={<PropertiesPage />} />
      <Route path={ROUTES.PROPERTY_DETAILS} element={<PropertyDetailsPage />} />
      <Route path={ROUTES.SEARCH} element={<SearchPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.BUYER_DASHBOARD} element={<BuyerDashboardPage />} />
      <Route path={ROUTES.OWNER_DASHBOARD} element={<OwnerDashboardPage />} />
      <Route path={ROUTES.AGENT_DASHBOARD} element={<AgentDashboardPage />} />
      <Route path={ROUTES.AGENCY_DASHBOARD} element={<AgencyDashboardPage />} />
      <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
      <Route path={ROUTES.SUPER_ADMIN_DASHBOARD} element={<SuperAdminDashboardPage />} />
      <Route path={ROUTES.MANAGEMENT_DASHBOARD} element={<ManagementDashboardPage />} />
      <Route path={ROUTES.PROCUREMENT_DASHBOARD} element={<ProcurementDashboardPage />} />
      <Route path={ROUTES.FINANCE_DASHBOARD} element={<FinanceDashboardPage />} />
      <Route path={ROUTES.INTELLIGENCE_DASHBOARD} element={<IntelligenceDashboardPage />} />
      <Route path={ROUTES.PROPERTY_MANAGEMENT_DASHBOARD} element={<PropertyManagementDashboardPage />} />
      <Route path={ROUTES.HOME_SERVICES_DASHBOARD} element={<HomeServicesDashboardPage />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      <Route path={ROUTES.FAQ} element={<FAQPage />} />
      <Route path={ROUTES.PRIVACY} element={<PrivacyPolicyPage />} />
      <Route path={ROUTES.TERMS} element={<TermsOfServicePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
