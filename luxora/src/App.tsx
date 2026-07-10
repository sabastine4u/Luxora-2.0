
import AppRoutes from './routes/AppRoutes'
import { SessionProvider } from './contexts/SessionContext'
import { ScheduleViewingModal } from './components/property/ScheduleViewingModal'
import { ReportListingModal } from './components/property/ReportListingModal'

export default function App() {
  return (
    <SessionProvider>
      <AppRoutes />
      <ScheduleViewingModal />
      <ReportListingModal />
    </SessionProvider>
  )
}
