import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import NewsListView from '../views/news/NewsListView.vue'
import NewsEditorView from '../views/news/NewsEditorView.vue'
import DocsListView from '../views/docs/DocsListView.vue'
import DocsEditorView from '../views/docs/DocsEditorView.vue'
import ResourcesListView from '../views/resources/ResourcesListView.vue'
import ResourcesEditorView from '../views/resources/ResourcesEditorView.vue'
import AdminCenterView from '../views/admins/AdminCenterView.vue'
import LogsCenterView from '../views/audit-logs/LogsCenterView.vue'
import ServersListView from '../views/servers/ServersListView.vue'
import ServerEditorView from '../views/servers/ServerEditorView.vue'
import PlayersCenterView from '../views/players/PlayersCenterView.vue'
import SettingsCenterView from '../views/settings/SettingsCenterView.vue'
import AdminLayout from '../components/layout/AdminLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true, title: '登录' },
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: {
          title: '控制台',
          permission: 'dashboard:read',
        },
      },
      {
        path: '/news',
        name: 'news',
        component: NewsListView,
        meta: {
          title: '新闻管理',
          permission: 'news:read',
        },
      },
      {
        path: '/news/create',
        name: 'news-create',
        component: NewsEditorView,
        meta: {
          title: '新建新闻',
          permission: 'news:create',
        },
      },
      {
        path: '/news/:id/edit',
        name: 'news-edit',
        component: NewsEditorView,
        meta: {
          title: '编辑新闻',
          permission: 'news:update',
        },
      },
      {
        path: '/docs',
        name: 'docs',
        component: DocsListView,
        meta: {
          title: '文档管理',
          permission: 'docs:read',
        },
      },
      {
        path: '/docs/create',
        name: 'docs-create',
        component: DocsEditorView,
        meta: {
          title: '新建文档',
          permission: 'docs:create',
        },
      },
      {
        path: '/docs/:id/edit',
        name: 'docs-edit',
        component: DocsEditorView,
        meta: {
          title: '编辑文档',
          permission: 'docs:update',
        },
      },
      {
        path: '/resources',
        name: 'resources',
        component: ResourcesListView,
        meta: {
          title: '资源管理',
          permission: 'resources:read',
        },
      },
      {
        path: '/resources/create',
        name: 'resources-create',
        component: ResourcesEditorView,
        meta: {
          title: '新建资源',
          permission: 'resources:create',
        },
      },
      {
        path: '/resources/:id/edit',
        name: 'resources-edit',
        component: ResourcesEditorView,
        meta: {
          title: '编辑资源',
          permission: 'resources:update',
        },
      },
      {
        path: '/servers',
        name: 'servers',
        component: ServersListView,
        meta: {
          title: '服务器管理',
          permission: 'servers:read',
        },
      },
      {
        path: '/servers/create',
        name: 'servers-create',
        component: ServerEditorView,
        meta: {
          title: '新建服务器',
          permission: 'servers:create',
        },
      },
      {
        path: '/servers/:id/edit',
        name: 'servers-edit',
        component: ServerEditorView,
        meta: {
          title: '编辑服务器',
          permission: 'servers:update',
        },
      },
      {
        path: '/players',
        name: 'players',
        component: PlayersCenterView,
        meta: {
          title: '成员中心',
          permission: 'players:read',
        },
      },
      {
        path: '/admins',
        name: 'admins',
        component: AdminCenterView,
        meta: {
          title: '权限中心',
          permission: 'permissions:read',
        },
      },
      {
        path: '/settings',
        name: 'settings',
        component: SettingsCenterView,
        meta: {
          title: '系统设置',
          permission: 'settings:read',
        },
      },
      {
        path: '/logs',
        name: 'logs',
        component: LogsCenterView,
        meta: {
          title: '操作日志',
          permission: 'logs:read',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.guestOnly && auth.isAuthenticated.value) {
    return '/dashboard'
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    return '/login'
  }

  if (to.meta.permission && !auth.hasPermission(to.meta.permission)) {
    return '/dashboard'
  }

  return true
})

router.afterEach((to) => {
  const title = to.meta.title ? `${to.meta.title} | ZZUMC 管理后台` : 'ZZUMC 管理后台'
  document.title = title
})

export default router
