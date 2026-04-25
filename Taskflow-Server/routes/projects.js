import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import supabase from '../lib/supabase.js'

const router = Router()
router.use(authenticate)

// GET /api/projects — all projects for the logged-in user
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, tasks(count)')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /api/projects — create a project
router.post('/', async (req, res) => {
  const { name, description, color } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'Project name is required' })

  const { data, error } = await supabase
    .from('projects')
    .insert({ name: name.trim(), description: description?.trim() || null, color: color || '#d4923a', user_id: req.user.id })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// PATCH /api/projects/:id — update project
router.patch('/:id', async (req, res) => {
  const { name, description, color } = req.body

  const { data, error } = await supabase
    .from('projects')
    .update({ name, description, color })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  if (!data)  return res.status(404).json({ error: 'Project not found' })
  res.json(data)
})

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Project deleted' })
})

// GET /api/projects/:id/tasks — tasks for a project
router.get('/:id/tasks', async (req, res) => {
  // Verify ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single()

  if (!project) return res.status(404).json({ error: 'Project not found' })

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', req.params.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /api/projects/:id/tasks — create task
router.post('/:id/tasks', async (req, res) => {
  const { title, description, priority } = req.body
  if (!title?.trim()) return res.status(400).json({ error: 'Task title is required' })

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single()

  if (!project) return res.status(404).json({ error: 'Project not found' })

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: title.trim(),
      description: description?.trim() || null,
      priority: priority || 'medium',
      status: 'todo',
      project_id: req.params.id,
      user_id: req.user.id,
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

export default router