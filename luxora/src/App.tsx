
import AppRoutes from './routes/AppRoutes'
import { SessionProvider } from './contexts/SessionContext'
import { FavoriteProvider } from './contexts/FavoriteContext'
import { ScheduleViewingModal } from './components/property/ScheduleViewingModal'
import { ReportListingModal } from './components/property/ReportListingModal'
import { FloatingCompareBar } from './components/property/FloatingCompareBar'
import { ScrollToTopButton } from './components/ui/ScrollToTopButton'

export default function App() {
  return (
    <SessionProvider>
      <FavoriteProvider>
        <AppRoutes />
        <ScheduleViewingModal />
        <ReportListingModal />
        <FloatingCompareBar />
        <ScrollToTopButton />
      </FavoriteProvider>
    </SessionProvider>
  )
}
