import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { getProjects, createProject, deleteProject } from '../lib/api'
import ProjectCard from '../components/ProjectCard'
import Modal from '../components/Modal'

const COLORS = ['#e8a020','#5588ff','#34c77b','#e85555','#a855f7','#06b6d4','#f97316','#ec4899']

function StatBox({ label, value, sub }) {
  return (
    <div className="card flex flex-col gap-1">
      <span className="text-3xl font-display font-800 text-slate-bright">{value}</span>
      <span className="text-sm font-display font-600 text-slate-soft">{label}</span>
      {sub && <span className="text-xs text-slate-soft/50 font-mono">{sub}</span>}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', color: COLORS[0] })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getProjects()
      setProjects(data)
    } catch { /* silently fail on first load */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true); setError('')
    try {
      const { data } = await createProject(form)
      setProjects(prev => [data, ...prev])
      setShowModal(false)
      setForm({ name: '', description: '', color: COLORS[0] })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project')
    } finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project and all its tasks?')) return
    setProjects(prev => prev.filter(p => p.id !== id))
    try { await deleteProject(id) }
    catch { load() }   // restore on error
  }

  const filtered   = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  const totalTasks = projects.reduce((a, p) => a + (p.tasks?.[0]?.count ?? 0), 0)
  const firstName  = user?.email?.split('@')[0] ?? 'there'

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs text-slate-soft font-mono uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
          </p>
          <h1 className="font-display font-800 text-3xl text-slate-bright">
            Good {getGreeting()}, <span className="text-amber">{firstName}</span> 👋
          </h1>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary self-start sm:self-auto">
          + New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatBox label="Total Projects" value={projects.length} />
        <StatBox label="Total Tasks"    value={totalTasks} />
        <StatBox label="Active"
          value={projects.filter(p => (p.tasks?.[0]?.count ?? 0) > 0).length}
          sub="with tasks" />
        <StatBox label="This Week"
          value={projects.filter(p => {
            const d = new Date(p.created_at)
            const now = new Date()
            return (now - d) < 7 * 24 * 60 * 60 * 1000
          }).length}
          sub="new projects" />
      </div>

      {/* Search + grid */}
      {projects.length > 0 && (
        <div className="mb-6">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            className="input max-w-xs text-sm py-2.5"
            placeholder="Search projects…"
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-border border-t-amber rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="card text-center py-20 animate-fade-up">
          <div className="text-5xl mb-4">🗂️</div>
          <h3 className="font-display font-700 text-lg text-slate-bright mb-2">No projects yet</h3>
          <p className="text-sm text-slate-soft mb-6">Create your first project to start tracking tasks.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary mx-auto">
            + Create Project
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-soft py-16">No projects match "<span className="text-amber">{search}</span>"</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <div key={p.id} style={{ animationDelay: `${i * 60}ms` }}>
              <ProjectCard project={p} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {showModal && (
        <Modal title="New Project" onClose={() => { setShowModal(false); setError('') }}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-display font-600 text-slate-soft mb-1.5 uppercase tracking-wider">Name *</label>
              <input autoFocus value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input" placeholder="My awesome project" required />
            </div>
            <div>
              <label className="block text-xs font-display font-600 text-slate-soft mb-1.5 uppercase tracking-wider">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="input resize-none" rows={3} placeholder="What's this project about?" />
            </div>
            <div>
              <label className="block text-xs font-display font-600 text-slate-soft mb-2 uppercase tracking-wider">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={`w-8 h-8 rounded-lg transition-all duration-150 ${form.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-card scale-110' : 'hover:scale-105'}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
            {error && <p className="text-xs text-red-task bg-red-task/10 border border-red-task/20 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-50">
                {saving ? 'Creating…' : 'Create Project'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}