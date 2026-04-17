import React, { useEffect, useState } from 'react'
import { getUsers, getSubscriptions } from '../api'
import { Link } from 'react-router-dom'

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [usersResponse, subscriptionsResponse] = await Promise.all([getUsers(), getSubscriptions()])
        setUsers(usersResponse.data)
        setSubscriptions(subscriptionsResponse.data)
      } catch (err) {
        // ignore in dashboard summary
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Admin dashboard</h1>
          <p className="mt-2 text-slate-600">Monitor users, subscriptions and plan status across the platform.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Platform summary</h2>
            {loading ? (
              <p className="mt-4 text-slate-600">Loading statistics…</p>
            ) : (
              <div className="mt-6 space-y-4 text-slate-600">
                <p>Total users: {users.length}</p>
                <p>Total subscriptions: {subscriptions.length}</p>
                <p>Active plans: {subscriptions.filter((item) => item.status === 'active').length}</p>
              </div>
            )}
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Admin actions</h2>
            <div className="mt-6 space-y-3 text-slate-600">
              <Link to="/admin/users" className="block text-slate-700 hover:text-slate-900">
                View all users
              </Link>
              <Link to="/admin/subscriptions" className="block text-slate-700 hover:text-slate-900">
                View all subscriptions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
