import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import supabase from '../lib/supabase.js'

const router = Router()
router.use(authenticate)

// PATCH /api/tasks/:id — update status or priority
router.patch('/:id', async (req, res) => {
  const allowed = ['status', 'priority', 'title', 'description']
  const updates = {}
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key]
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  if (!data)  return res.status(404).json({ error: 'Task not found' })
  res.json(data)
})

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Task deleted' })
})

export default router