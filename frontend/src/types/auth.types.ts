export interface User {
  id: string
  name: string
  email: string
  role: 'coach' | 'analyst' | 'admin'
  team: string
  avatar?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}