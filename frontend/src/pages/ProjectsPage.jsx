import React, { useEffect, useState } from 'react'
import { createProject, deleteProject, getProjects } from '../api'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await getProjects()
        setProjects(response.data)
      } catch (err) {
        setError('Unable to load projects. Please refresh.')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  async function handleCreate(event) {
    event.preventDefault()
    setError('')

    try {
      const response = await createProject(name, description)
      setProjects((current) => [response.data, ...current])
      setName('')
      setDescription('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create project. Check your plan limit.')
    }
  }

  async function handleDelete(id) {
    setError('')
    try {
      await deleteProject(id)
      setProjects((current) => current.filter((project) => project.id !== id))
    } catch (err) {
      setError('Unable to delete project. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Projects</h1>
          <p className="mt-2 text-slate-600">Create and manage your projects from a single place.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-1">
            <h2 className="text-xl font-semibold text-slate-900">New project</h2>
            <form onSubmit={handleCreate} className="mt-6 space-y-4">
              {error && <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-900 focus:outline-none"
                />
              </div>
              <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-base font-semibold text-white hover:bg-slate-700">
                Create project
              </button>
            </form>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Your project list</h2>
              {loading ? (
                <p className="mt-4 text-slate-600">Loading projects…</p>
              ) : projects.length === 0 ? (
                <p className="mt-4 text-slate-600">No projects yet. Create one to get started.</p>
              ) : (
                <div className="mt-6 space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="rounded-3xl border border-slate-200 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                          <p className="mt-2 text-slate-600">{project.description || 'No description provided.'}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
