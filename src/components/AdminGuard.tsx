'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('laqi_admin')
    if (!isAdmin) {
      router.push('/admin/x7k2')
    } else {
      setAuthorized(true)
    }
  }, [router])

  if (!authorized) {
    return (
      <div className="min-h-screen bg-laqi-dark flex items-center justify-center">
        <div className="text-laqi-neon text-2xl animate-pulse">...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-laqi-dark">
      <AdminSidebar />
      <main className="mr-64 p-8">
        {children}
      </main>
    </div>
  )
}
