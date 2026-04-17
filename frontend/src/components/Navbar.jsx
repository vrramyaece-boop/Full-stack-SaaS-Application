import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { user, logout, token } = useAuth()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-semibold text-slate-900">
            SaaS Project Manager
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-700 hover:text-slate-900">
              Home
            </Link>
            {!token && (
              <>
                <Link to="/login" className="text-slate-700 hover:text-slate-900">
                  Login
                </Link>
                <Link to="/register" className="text-slate-700 hover:text-slate-900">
                  Register
                </Link>
              </>
            )}
            {token && user && (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin/dashboard" className="text-slate-700 hover:text-slate-900">
                    Admin
                  </Link>
                ) : (
                  <Link to="/app/dashboard" className="text-slate-700 hover:text-slate-900">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="rounded-md border border-slate-200 px-3 py-1 text-slate-700 hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
