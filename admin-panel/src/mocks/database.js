const KEY = 'zzumc-admin-mock-db'

const seed = {
  news: [
    {
      id: 1,
      title: '春季活动预热公告',
      category: '活动预告',
      tags: ['活动', '联机'],
      author: '运营组',
      status: 'published',
      featured: true,
      pinned: true,
      publishedAt: '2026-04-18 21:00',
      updatedAt: '2026-04-18 21:00',
      slug: 'spring-event-2026',
      summary: '春季活动报名将在下周开放。',
      content: '## 活动说明\n\n这里是活动正文（mock）。',
    },
    {
      id: 2,
      title: '网站后台阶段 A 完成',
      category: '开发日志',
      tags: ['网站', '后台'],
      author: '开发组',
      status: 'draft',
      featured: false,
      pinned: false,
      publishedAt: '',
      updatedAt: '2026-04-19 10:30',
      slug: 'admin-phase-a',
      summary: '后台壳层与命令方块主题已完成。',
      content: '## 进展\n\n已完成登录、路由守卫、主题。',
    },
  ],
  docs: [
    {
      id: 1,
      title: '如何加入服务器',
      group: '新手指南',
      order: 1,
      status: 'published',
      author: '文档组',
      updatedAt: '2026-04-17 18:00',
      slug: 'join-server',
      description: '新成员快速入服流程。',
      content: '# 入服指南\n\n1. 安装客户端\n2. 添加服务器地址',
    },
    {
      id: 2,
      title: '常见问题排查',
      group: 'FAQ',
      order: 2,
      status: 'draft',
      author: '文档组',
      updatedAt: '2026-04-19 09:20',
      slug: 'common-problems',
      description: '联机常见问题与修复策略。',
      content: '# FAQ\n\n这里是问题列表。',
    },
  ],
  resources: [
    {
      id: 1,
      title: '客户端整合包 v1.0',
      type: 'modpack',
      summary: '推荐新成员使用的整合包。',
      url: 'https://pan.example.com/client-pack',
      provider: '校内云盘',
      status: 'enabled',
      order: 1,
      updatedAt: '2026-04-16 20:00',
    },
    {
      id: 2,
      title: '安装说明文档',
      type: 'doc',
      summary: '安装步骤与环境要求。',
      url: 'https://pan.example.com/install-doc',
      provider: '校内云盘',
      status: 'enabled',
      order: 2,
      updatedAt: '2026-04-16 20:30',
    },
  ],
  roles: [
    {
      id: 1,
      code: 'super_admin',
      name: '超级管理员',
      permissions: ['*'],
      description: '拥有后台全部权限。',
    },
    {
      id: 2,
      code: 'content_admin',
      name: '内容管理员',
      permissions: ['dashboard:read', 'news:*', 'docs:*', 'resources:*', 'servers:*', 'players:*', 'settings:read', 'logs:read'],
      description: '管理新闻、文档、资源和服务器配置。',
    },
    {
      id: 3,
      code: 'observer',
      name: '只读观察者',
      permissions: ['dashboard:read', 'logs:read', 'players:read'],
      description: '仅可查看控制台、成员和日志。',
    },
  ],
  adminUsers: [
    {
      id: 1,
      name: '超级管理员',
      email: 'super@zzumc.com',
      roleCode: 'super_admin',
      status: 'enabled',
      lastLoginAt: '2026-04-19 12:05',
      createdAt: '2026-04-10 09:00',
    },
    {
      id: 2,
      name: '内容管理员',
      email: 'content@zzumc.com',
      roleCode: 'content_admin',
      status: 'enabled',
      lastLoginAt: '2026-04-19 11:48',
      createdAt: '2026-04-12 14:20',
    },
    {
      id: 3,
      name: '巡检同学',
      email: 'observer@zzumc.com',
      roleCode: 'observer',
      status: 'disabled',
      lastLoginAt: '2026-04-18 20:10',
      createdAt: '2026-04-13 16:35',
    },
  ],
  operationLogs: [
    {
      id: 1,
      actor: '超级管理员',
      module: 'news',
      action: 'publish',
      target: '春季活动预热公告',
      result: 'success',
      createdAt: '2026-04-19 10:20',
    },
    {
      id: 2,
      actor: '内容管理员',
      module: 'docs',
      action: 'update',
      target: '如何加入服务器',
      result: 'success',
      createdAt: '2026-04-19 10:42',
    },
  ],
  loginLogs: [
    {
      id: 1,
      email: 'super@zzumc.com',
      status: 'success',
      ip: '127.0.0.1',
      createdAt: '2026-04-19 12:05',
      userAgent: 'Chrome',
    },
    {
      id: 2,
      email: 'content@zzumc.com',
      status: 'success',
      ip: '127.0.0.1',
      createdAt: '2026-04-19 11:48',
      userAgent: 'Chrome',
    },
  ],
  servers: [
    {
      id: 1,
      name: '主生存服',
      host: 'mc-main.zzumc.com',
      port: 25565,
      version: '1.20.1',
      maxPlayers: 150,
      currentPlayers: 36,
      status: 'online',
      syncMode: 'status-api',
      weight: 1,
      featured: true,
      motd: 'ZZUMC 主生存世界',
      updatedAt: '2026-04-19 13:20',
    },
    {
      id: 2,
      name: '活动服',
      host: 'mc-event.zzumc.com',
      port: 25566,
      version: '1.20.1',
      maxPlayers: 80,
      currentPlayers: 12,
      status: 'online',
      syncMode: 'plugin',
      weight: 2,
      featured: false,
      motd: '每周活动与小游戏',
      updatedAt: '2026-04-19 13:10',
    },
    {
      id: 3,
      name: '测试服',
      host: 'mc-test.zzumc.com',
      port: 25567,
      version: '1.20.1',
      maxPlayers: 20,
      currentPlayers: 0,
      status: 'offline',
      syncMode: 'manual',
      weight: 3,
      featured: false,
      motd: '版本验证与插件测试',
      updatedAt: '2026-04-19 12:40',
    },
  ],
  players: [
    {
      id: 1,
      uuid: 'e8b2b0f7-8b6a-4fd5-9b2b-93b70ab1f0aa',
      username: 'Vigorous',
      nickname: '活力同学',
      skinSiteId: 'skin_1001',
      group: '核心成员',
      canShowOnAbout: true,
      isAdminCandidate: true,
      status: 'active',
      lastSeenAt: '2026-04-19 12:12',
      updatedAt: '2026-04-19 12:12',
    },
    {
      id: 2,
      uuid: 'b9a19ffd-aa7f-4d64-9e78-70a4f8cb4151',
      username: 'ArcLight',
      nickname: '弧光',
      skinSiteId: 'skin_1002',
      group: '建筑组',
      canShowOnAbout: true,
      isAdminCandidate: false,
      status: 'active',
      lastSeenAt: '2026-04-18 21:30',
      updatedAt: '2026-04-18 21:30',
    },
    {
      id: 3,
      uuid: '3f62f4c2-cb20-4f45-8f91-266f8f1ebff7',
      username: 'TinyFox',
      nickname: '小狐',
      skinSiteId: 'skin_1003',
      group: '活动组',
      canShowOnAbout: false,
      isAdminCandidate: false,
      status: 'inactive',
      lastSeenAt: '2026-04-10 10:18',
      updatedAt: '2026-04-10 10:18',
    },
  ],
  playerSyncLogs: [
    {
      id: 1,
      source: 'skin-site',
      status: 'success',
      total: 136,
      created: 2,
      updated: 18,
      message: '同步成功，新增 2 人，更新 18 人。',
      createdAt: '2026-04-19 11:20',
    },
    {
      id: 2,
      source: 'skin-site',
      status: 'success',
      total: 134,
      created: 1,
      updated: 9,
      message: '同步成功，新增 1 人，更新 9 人。',
      createdAt: '2026-04-18 11:20',
    },
  ],
  siteSettings: [
    {
      id: 1,
      siteName: '郑州大学Minecraft社团',
      siteSubtitle: 'ZZUMC 官方站点',
      contactEmail: 'admin@zzumc.com',
      maintenanceMode: false,
      aboutAutoSync: true,
      updatedAt: '2026-04-19 14:10',
    },
  ],
  homepageSettings: [
    {
      id: 1,
      heroTitle: '一起构建我们的像素世界',
      heroSubtitle: '欢迎来到 ZZUMC 社团站点',
      announcementText: '每周五晚 20:00 社区活动准时开始',
      featuredNewsCount: 3,
      featuredServerCount: 2,
      updatedAt: '2026-04-19 14:10',
    },
  ],
  integrationSettings: [
    {
      id: 1,
      skinSiteApiBase: 'https://skin.example.com/api',
      serverStatusApiBase: 'https://status.example.com/mc',
      playerSyncCron: '0 */6 * * *',
      requestTimeoutMs: 5000,
      updatedAt: '2026-04-19 14:10',
    },
  ],
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function nowText() {
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
}

function loadDb() {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed))
    return clone(seed)
  }

  try {
    const parsed = JSON.parse(raw)
    const merged = {
      ...seed,
      ...parsed,
    }

    for (const key of Object.keys(seed)) {
      if (!Array.isArray(merged[key])) {
        merged[key] = clone(seed[key])
      }
    }

    localStorage.setItem(KEY, JSON.stringify(merged))
    return merged
  } catch {
    localStorage.setItem(KEY, JSON.stringify(seed))
    return clone(seed)
  }
}

function saveDb(db) {
  localStorage.setItem(KEY, JSON.stringify(db))
}

function delay(ms = 180) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function listEntity(entity) {
  await delay()
  const db = loadDb()
  return clone(db[entity] || [])
}

export async function getEntity(entity, id) {
  await delay()
  const db = loadDb()
  return clone((db[entity] || []).find((item) => item.id === Number(id)) || null)
}

export async function upsertEntity(entity, payload) {
  await delay()
  const db = loadDb()
  const list = Array.isArray(db[entity]) ? db[entity] : []

  if (payload.id) {
    const index = list.findIndex((item) => item.id === Number(payload.id))
    if (index >= 0) {
      list[index] = {
        ...list[index],
        ...payload,
        updatedAt: nowText(),
      }
      db[entity] = list
      saveDb(db)
      return clone(list[index])
    }
  }

  const nextId = list.length ? Math.max(...list.map((item) => Number(item.id))) + 1 : 1

  const created = {
    ...payload,
    id: nextId,
    updatedAt: nowText(),
  }

  list.push(created)
  db[entity] = list
  saveDb(db)
  return clone(created)
}

export async function removeEntity(entity, id) {
  await delay()
  const db = loadDb()
  const list = Array.isArray(db[entity]) ? db[entity] : []
  db[entity] = list.filter((item) => item.id !== Number(id))
  saveDb(db)
  return { ok: true }
}

export async function replaceEntityList(entity, list) {
  await delay()
  const db = loadDb()
  db[entity] = clone(Array.isArray(list) ? list : [])
  saveDb(db)
  return clone(db[entity])
}
