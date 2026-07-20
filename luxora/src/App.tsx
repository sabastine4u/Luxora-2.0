
import AppRoutes from './routes/AppRoutes'
import { SessionProvider } from './contexts/SessionContext'
import { FavoriteProvider } from './contexts/FavoriteContext'
import { ToastProvider } from './contexts/ToastContext'
import { ScheduleViewingModal } from './components/property/ScheduleViewingModal'
import { ReportListingModal } from './components/property/ReportListingModal'
import { FloatingCompareBar } from './components/property/FloatingCompareBar'
import { ScrollToTopButton } from './components/ui/ScrollToTopButton'
import { ScrollToTop } from './components/common/ScrollToTop'

export default function App() {
  return (
    <ToastProvider>
      <SessionProvider>
        <FavoriteProvider>
          <AppRoutes />
          <ScrollToTop />
          <ScheduleViewingModal />
          <ReportListingModal />
          <FloatingCompareBar />
          <ScrollToTopButton />
        </FavoriteProvider>
      </SessionProvider>
    </ToastProvider>
  )
}
