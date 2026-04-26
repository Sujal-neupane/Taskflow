import axios from 'axios'
import supabase from './supabase'

const api = axios.create({ baseURL: '/api' })

// Attach the Supabase JWT to every request
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// Projects
export const getProjects       = ()              => api.get('/projects')
export const createProject     = (body)          => api.post('/projects', body)
export const deleteProject     = (id)            => api.delete(`/projects/${id}`)
export const updateProject     = (id, body)      => api.patch(`/projects/${id}`, body)

// Tasks
export const getTasks          = (projectId)     => api.get(`/projects/${projectId}/tasks`)
export const createTask        = (projectId, body) => api.post(`/projects/${projectId}/tasks`, body)
export const updateTask        = (id, body)      => api.patch(`/tasks/${id}`, body)
export const deleteTask        = (id)            => api.delete(`/tasks/${id}`)

export default api