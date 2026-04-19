<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <p class="admin-brand__kicker">COMMAND CENTER</p>
        <h1>ZZUMC 后台</h1>
      </div>

      <nav class="admin-nav">
        <RouterLink
          v-for="item in visibleNavItems"
          :key="item.to"
          :to="item.to"
          class="admin-nav__item"
          active-class="is-active"
        >
          <span class="admin-nav__icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="admin-sidebar__footer">
        <p>角色：{{ auth.state.user?.role || '-' }}</p>
        <p>账号：{{ auth.state.user?.email || '-' }}</p>
      </div>
    </aside>

    <div class="admin-main">
      <header class="admin-topbar">
        <div>
          <p class="admin-topbar__kicker">ZZUMC ADMIN</p>
          <h2>{{ currentTitle }}</h2>
        </div>

        <div class="admin-userbox">
          <span>{{ auth.state.user?.name }}</span>
          <button type="button" class="command-btn" @click="handleLogout">
            退出登录
          </button>
        </div>
      </header>

      <main class="admin-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const navItems = [
  { to: '/dashboard', label: '控制台', icon: '▣', permission: 'dashboard:read' },
  { to: '/news', label: '新闻管理', icon: '📰', permission: 'news:read' },
  { to: '/docs', label: '文档管理', icon: '▤', permission: 'docs:read' },
  { to: '/resources', label: '资源管理', icon: '⬒', permission: 'resources:read' },
  { to: '/servers', label: '服务器', icon: '⛏', permission: 'servers:read' },
  { to: '/players', label: '成员中心', icon: '◎', permission: 'players:read' },
  { to: '/admins', label: '权限中心', icon: '⌘', permission: 'permissions:read' },
  { to: '/settings', label: '系统设置', icon: '⚙', permission: 'settings:read' },
  { to: '/logs', label: '操作日志', icon: '▦', permission: 'logs:read' },
]

const visibleNavItems = computed(() => {
  return navItems.filter((item) => auth.hasPermission(item.permission))
})

const currentTitle = computed(() => String(route.meta.title || '控制台'))

function handleLogout() {
  auth.logout()
  router.replace('/login')
}
</script>
