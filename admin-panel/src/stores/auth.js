import { computed, reactive } from 'vue'

const STORAGE_KEY = 'zzumc-admin-auth'

const demoUsers = [
  {
    id: 1,
    name: '超级管理员',
    email: 'super@zzumc.com',
    password: 'admin123',
    role: 'super_admin',
    permissions: ['*'],
  },
  {
    id: 2,
    name: '内容管理员',
    email: 'content@zzumc.com',
    password: 'content123',
    role: 'content_admin',
    permissions: ['dashboard:read', 'news:*', 'docs:*', 'resources:*', 'servers:*', 'players:*', 'settings:read', 'logs:read'],
  },
  {
    id: 3,
    name: '巡检同学',
    email: 'observer@zzumc.com',
    password: 'observer123',
    role: 'observer',
    permissions: ['dashboard:read', 'players:read', 'logs:read'],
  },
]

const state = reactive({
  user: restoreUser(),
})

function restoreUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    const match = demoUsers.find((item) => item.email === parsed.email)
    if (!match) return parsed

    return {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
      permissions: match.permissions,
    }
  } catch {
    return null
  }
}

function persistUser(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function useAuthStore() {
  const isAuthenticated = computed(() => Boolean(state.user))

  function login(payload) {
    const email = String(payload.email || '').trim().toLowerCase()
    const password = String(payload.password || '').trim()

    const match = demoUsers.find(
      (item) => item.email === email && item.password === password,
    )

    if (!match) {
      return {
        ok: false,
        message: '账号或密码错误',
      }
    }

    const user = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
      permissions: match.permissions,
    }

    state.user = user
    persistUser(user)

    return { ok: true }
  }

  function logout() {
    state.user = null
    persistUser(null)
  }

  function hasPermission(permission) {
    if (!state.user) return false
    if (state.user.permissions.includes('*')) return true
    if (state.user.permissions.includes(permission)) return true

    const [module] = permission.split(':')
    return state.user.permissions.includes(`${module}:*`)
  }

  return {
    state,
    isAuthenticated,
    login,
    logout,
    hasPermission,
  }
}
