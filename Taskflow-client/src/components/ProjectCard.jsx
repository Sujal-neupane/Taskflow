import { Link } from 'react-router-dom'

const ICONS = ['◈', '◉', '◆', '◇', '◎', '●', '▲', '★']

export default function ProjectCard({ project, onDelete }) {
  const taskCount = project.tasks?.[0]?.count ?? 0
  const icon = ICONS[parseInt(project.id.slice(-1), 16) % ICONS.length]

  return (
    <div className="card group relative flex flex-col gap-4 hover:border-amber/40 transition-all duration-300 hover:-translate-y-1 animate-fade-up">
      {/* Color strip */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-70"
           style={{ background: project.color }} />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-display"
               style={{ background: project.color + '22', color: project.color }}>
            {icon}
          </div>
          <div>
            <h3 className="font-display font-700 text-slate-bright leading-tight">{project.name}</h3>
            <p className="text-xs text-slate-soft mt-0.5 font-mono">{new Date(project.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <button onClick={() => onDelete(project.id)}
          className="opacity-0 group-hover:opacity-100 text-slate-soft hover:text-red-task transition-all text-sm p-1">✕</button>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-slate-soft line-clamp-2 leading-relaxed">{project.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
        <span className="badge bg-border/60 text-slate-soft">{taskCount} tasks</span>
        <Link to={`/project/${project.id}`}
          className="text-xs font-display font-600 text-amber hover:text-amber-light transition-colors">
          Open →
        </Link>
      </div>
    </div>
  )
}