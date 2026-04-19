import { listEntity, upsertEntity } from '../mocks/database'

const defaultSiteSettings = {
  id: 1,
  siteName: '郑州大学Minecraft社团',
  siteSubtitle: 'ZZUMC 官方站点',
  contactEmail: 'admin@zzumc.com',
  maintenanceMode: false,
  aboutAutoSync: true,
}

const defaultHomepageSettings = {
  id: 1,
  heroTitle: '一起构建我们的像素世界',
  heroSubtitle: '欢迎来到 ZZUMC 社团站点',
  announcementText: '每周五晚 20:00 社区活动准时开始',
  featuredNewsCount: 3,
  featuredServerCount: 2,
}

const defaultIntegrationSettings = {
  id: 1,
  skinSiteApiBase: 'https://skin.example.com/api',
  serverStatusApiBase: 'https://status.example.com/mc',
  playerSyncCron: '0 */6 * * *',
  requestTimeoutMs: 5000,
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

async function readSingleton(entity, fallback) {
  const list = await listEntity(entity)
  if (Array.isArray(list) && list.length > 0) {
    return {
      ...fallback,
      ...list[0],
      id: 1,
    }
  }

  return upsertEntity(entity, fallback)
}

async function appendOperationLog(actor, action, target) {
  await upsertEntity('operationLogs', {
    actor,
    module: 'settings',
    action,
    target,
    result: 'success',
    createdAt: nowText(),
  })
}

export async function fetchSystemSettings() {
  const [site, homepage, integration] = await Promise.all([
    readSingleton('siteSettings', defaultSiteSettings),
    readSingleton('homepageSettings', defaultHomepageSettings),
    readSingleton('integrationSettings', defaultIntegrationSettings),
  ])

  return {
    site,
    homepage,
    integration,
  }
}

export async function saveSiteSettings(payload, actor = '系统') {
  const saved = await upsertEntity('siteSettings', {
    ...defaultSiteSettings,
    ...payload,
    id: 1,
  })

  await appendOperationLog(actor, 'update-site', '站点基础配置')
  return saved
}

export async function saveHomepageSettings(payload, actor = '系统') {
  const saved = await upsertEntity('homepageSettings', {
    ...defaultHomepageSettings,
    ...payload,
    id: 1,
    featuredNewsCount: Math.max(1, Number(payload.featuredNewsCount || defaultHomepageSettings.featuredNewsCount)),
    featuredServerCount: Math.max(1, Number(payload.featuredServerCount || defaultHomepageSettings.featuredServerCount)),
  })

  await appendOperationLog(actor, 'update-homepage', '首页展示配置')
  return saved
}

export async function saveIntegrationSettings(payload, actor = '系统') {
  const saved = await upsertEntity('integrationSettings', {
    ...defaultIntegrationSettings,
    ...payload,
    id: 1,
    requestTimeoutMs: Math.max(1000, Number(payload.requestTimeoutMs || defaultIntegrationSettings.requestTimeoutMs)),
  })

  await appendOperationLog(actor, 'update-integration', '接口与同步配置')
  return saved
}

export async function resetSettingsToDefault(actor = '系统') {
  const [site, homepage, integration] = await Promise.all([
    upsertEntity('siteSettings', defaultSiteSettings),
    upsertEntity('homepageSettings', defaultHomepageSettings),
    upsertEntity('integrationSettings', defaultIntegrationSettings),
  ])

  await appendOperationLog(actor, 'reset', '系统设置恢复默认值')

  return {
    site,
    homepage,
    integration,
  }
}
