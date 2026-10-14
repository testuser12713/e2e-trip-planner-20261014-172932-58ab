import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { TripLayout } from './components/TripLayout'
import { BudgetPage } from './pages/BudgetPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PackingListPage } from './pages/PackingListPage'
import { TripDetailPage } from './pages/TripDetailPage'
import { TripEditPage } from './pages/TripEditPage'
import { TripListPage } from './pages/TripListPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<TripListPage />} />
        <Route path="/trips/:id" element={<TripLayout />}>
          <Route index element={<TripDetailPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="packing" element={<PackingListPage />} />
        </Route>
        <Route path="/trips/:id/edit" element={<TripEditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
