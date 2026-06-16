import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        })

        const { accessToken } = response.data.data
        localStorage.setItem('accessToken', accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
}

export const propertyAPI = {
  getAll: (params?: object) => api.get('/properties', { params }),
  getById: (id: number) => api.get(`/properties/${id}`),
  create: (data: object) => api.post('/properties', data),
  update: (id: number, data: object) => api.put(`/properties/${id}`, data),
  delete: (id: number) => api.delete(`/properties/${id}`),
  getSimilar: (id: number) => api.get(`/properties/${id}/similar`)
}

export const leadAPI = {
  create: (data: { property_id: number; message: string }) =>
    api.post('/leads', data),
  getReceived: () => api.get('/leads/received'),
  getSent: () => api.get('/leads/sent'),
  updateStatus: (id: number, status: string) =>
    api.put(`/leads/${id}/status`, { status })
}

export default api