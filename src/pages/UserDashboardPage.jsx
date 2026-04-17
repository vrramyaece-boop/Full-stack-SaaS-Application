import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import { getSubscription } from '../api'
import { Link } from 'react-router-dom'

export default function UserDashboardPage() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await getSubscription()
        setSubscription(response.data)
      } catch (err) {
        setSubscription(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Welcome, {user?.email}</h1>
          <p className="mt-3 text-slate-600">Role: {user?.role}</p>
          <p className="mt-1 text-slate-600">Status: {user?.is_active ? 'Active' : 'Inactive'}</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Subscription</h2>
            {loading ? (
              <p className="mt-4 text-slate-600">Loading subscription…</p>
            ) : (
              <div className="mt-4 space-y-3 text-slate-600">
                <p>Plan: {subscription?.plan || 'free'}</p>
                <p>Status: {subscription?.status || 'active'}</p>
                <p>
                  Renewal date: {subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            )}
            <div className="mt-6">
              <Link
                to="/app/projects"
                className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-white hover:bg-slate-700"
              >
                Manage projects
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Quick links</h2>
            <div className="mt-4 space-y-3 text-slate-600">
              <Link to="/app/subscription" className="block text-slate-700 hover:text-slate-900">
                Manage subscription
              </Link>
              <Link to="/app/projects" className="block text-slate-700 hover:text-slate-900">
                View your projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
