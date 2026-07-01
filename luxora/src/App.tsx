
import AppRoutes from './routes/AppRoutes'
import { SessionProvider } from './contexts/SessionContext'

export default function App() {
  return (
    <SessionProvider>
      <AppRoutes />
    </SessionProvider>
  )
}
