const STATUS_STYLES = {
  todo:        'bg-slate-soft/15 text-slate-soft',
  'in-progress':'bg-blue-task/15 text-blue-task',
  done:        'bg-green-task/15 text-green-task',
}
const STATUS_LABELS = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' }

const PRIORITY_STYLES = {
  low:    'bg-green-task/10 text-green-task',
  medium: 'bg-amber/10 text-amber',
  high:   'bg-red-task/10 text-red-task',
}

export default function TaskCard({ task, onStatusChange, onDelete }) {
  const next = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' }

  return (
    <div className="flex items-start gap-3 p-4 bg-surface rounded-xl border border-border
                    hover:border-border/80 transition-all duration-200 group animate-pop">
      {/* Status toggle circle */}
      <button
        onClick={() => onStatusChange(task.id, next[task.status])}
        title="Cycle status"
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all duration-200
          ${task.status === 'done'
            ? 'bg-green-task border-green-task'
            : task.status === 'in-progress'
              ? 'border-blue-task bg-blue-task/20'
              : 'border-border hover:border-amber'}`}
      >
        {task.status === 'done' && <span className="block text-center text-[10px] leading-4 text-base font-bold">✓</span>}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-body leading-snug ${task.status === 'done' ? 'line-through text-slate-soft' : 'text-slate-bright'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-slate-soft mt-1 line-clamp-1">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className={`badge ${STATUS_STYLES[task.status]}`}>{STATUS_LABELS[task.status]}</span>
          <span className={`badge ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
        </div>
      </div>

      {/* Delete */}
      <button onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-slate-soft hover:text-red-task text-xs p-1 transition-all flex-shrink-0">
        ✕
      </button>
    </div>
  )
}