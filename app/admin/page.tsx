import AdminDashboard from './admin-dashboard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Content Editor',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminDashboard />
}
