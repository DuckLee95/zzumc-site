<template>
  <div class="server-info-page upgraded-server-info-page page-shell">
    <div class="container server-info-page-container">
      <div class="server-info-topbar page-topbar">
        <RouterLink class="server-info-back-link mc-pixel-inline-link" to="/">
          ← 返回主页面
        </RouterLink>
      </div>

      <div class="server-info-hero pixel-panel page-hero-block">
        <p class="section-kicker">SERVER CENTER</p>
        <h1>服务器信息</h1>
        <p class="server-info-hero-desc page-hero-desc">
          这里是完整的服务器状态页。你可以在这里查看各节点当前状态、版本、在线人数，并展开查看当前在线玩家。
        </p>
      </div>

      <div class="server-info-main-grid">
        <article v-for="server in servers" :key="server.id" class="server-detail-card pixel-panel">
          <div class="server-detail-cover-wrap">
            <img class="server-detail-cover" :src="server.cover" :alt="server.name" />
            <div class="server-detail-cover-overlay"></div>

            <div class="server-detail-cover-top">
              <span class="server-detail-type-badge">{{ server.type }}</span>
            </div>

            <div class="server-detail-cover-bottom">
              <div class="server-status-badge mc-pixel-badge" :class="server.statusClass">
                <span class="server-status-dot"></span>
                <span>{{ server.statusText }}</span>
              </div>
            </div>
          </div>

          <div class="server-detail-content">
            <div class="server-detail-top">
              <div>
                <h2>{{ server.name }}</h2>
                <p class="server-detail-type">{{ server.subtitle }}</p>
              </div>

              <div class="server-player-count-box pixel-mini-panel">
                <span class="server-player-count-label">在线人数</span>
                <strong>
                  {{ server.loading ? '加载中' : `${server.online}/${server.max}` }}
                </strong>
              </div>
            </div>

            <p class="server-detail-desc">{{ server.desc }}</p>

            <div class="server-detail-grid">
              <button type="button" class="server-info-item server-info-item-copy pixel-mini-panel"
                :title="`点击复制 ${getServerAddress(server)}`" @click="copyAddress(server)">
                <span class="server-info-label">地址</span>
                <!-- <strong>{{ getServerAddress(server) }}</strong> -->
                <strong>play.zzumc.com</strong>
                <span class="server-info-copy-tip" :class="{ 'is-copied': copiedServerId === server.id }">
                  {{ copiedServerId === server.id ? '已复制' : '点击复制' }}
                </span>
              </button>

              <div class="server-info-item pixel-mini-panel">
                <span class="server-info-label">版本</span>
                <strong>{{ server.loading ? '检测中' : server.version }}</strong>
              </div>

              <div class="server-info-item pixel-mini-panel">
                <span class="server-info-label">服务器说明</span>
                <strong class="server-info-motd">
                  {{ server.loading ? '等待状态同步' : server.motd }}
                </strong>
              </div>
            </div>

            <div class="server-tags">
              <span v-for="tag in server.tags" :key="tag" class="server-tag mc-pixel-tag">
                {{ tag }}
              </span>
            </div>

            <div class="server-detail-actions">
              <button type="button" class="mc-pixel-btn" @click="togglePlayers(server.id)">
                {{ expandedPlayers[server.id] ? '收起在线玩家' : '查看在线玩家' }}
              </button>
            </div>

            <transition name="players-expand">
              <div v-if="expandedPlayers[server.id]" class="server-players-panel pixel-mini-panel">
                <div class="server-players-panel-head">
                  <span class="server-players-panel-title">在线玩家</span>
                  <span class="server-players-panel-count">
                    {{ server.loading ? '加载中' : `${server.players.length} 人` }}
                  </span>
                </div>

                <div v-if="server.loading" class="server-players-empty">
                  正在获取玩家列表...
                </div>

                <div v-else-if="server.players.length" class="server-players-grid">
                  <div v-for="player in server.players" :key="player.key" class="server-player-card">
                    <div class="server-player-head-wrap">
                      <img class="server-player-head" :src="getPlayerAvatar(player)" :alt="player.name" />
                    </div>
                    <span class="server-player-name">{{ player.name }}</span>
                  </div>
                </div>

                <div v-else class="server-players-empty">
                  当前没有读取到在线玩家列表。若服务器状态接口未返回 sample 玩家数据，这里会为空。
                </div>
              </div>
            </transition>

            <div class="server-detail-bottom">
              <span class="server-update-time">
                {{ server.lastUpdate ? `更新于：${server.lastUpdate}` : '等待首次刷新' }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { fetchMinecraftServerStatus } from '../lib/serverStatus'

const servers = ref([
  {
    id: 1,
    name: '主生存服',
    subtitle: 'Survival Node',
    type: 'SURVIVAL',
    host: 'play.zzumc.com',
    port: '25565',
    cover: '/images/servers/network-main.jpg',
    desc: '主社团生存服务器，适合日常联机、生存发展与建筑协作。',
    tags: ['主服', '生存', '长期开放'],
    version: '自动检测',
    online: 0,
    max: 0,
    motd: '等待状态同步',
    statusText: '检测中',
    statusClass: 'is-loading',
    lastUpdate: '',
    loading: true,
    players: [],
  },
  {
    id: 2,
    name: '活动服',
    subtitle: 'Event Node',
    type: 'EVENT',
    host: 'play.zzumc.com',
    port: '25565',
    cover: '/images/servers/event-cover.jpg',
    desc: '用于临时活动、比赛、节日企划和多人联机场景。',
    tags: ['活动', '限时', '联机'],
    version: '自动检测',
    online: 0,
    max: 0,
    motd: '等待状态同步',
    statusText: '检测中',
    statusClass: 'is-loading',
    lastUpdate: '',
    loading: true,
    players: [],
  },
  {
    id: 3,
    name: '测试服',
    subtitle: 'Test Node',
    type: 'TEST',
    host: 'play.zzumc.com',
    port: '25565',
    cover: '/images/servers/test-cover.jpg',
    desc: '用于新内容测试、模组验证和更新前检查。',
    tags: ['测试', '开发', '维护'],
    version: '自动检测',
    online: 0,
    max: 0,
    motd: '等待状态同步',
    statusText: '检测中',
    statusClass: 'is-loading',
    lastUpdate: '',
    loading: true,
    players: [],
  },
])

const expandedPlayers = ref({})
const copiedServerId = ref(null)
let refreshTimer = null
let copyTimer = null

function formatTime(date = new Date()) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
}

function getServerQuery(server) {
  return server.port && server.port !== '25565'
    ? `${server.host}:${server.port}`
    : server.host
}

function getServerAddress(server) {
  return getServerQuery(server)
}

function normalizePlayer(player, index) {
  if (typeof player === 'string') {
    return {
      key: `${player}-${index}`,
      name: player,
      uuid: '',
    }
  }

  const name =
    player?.name ||
    player?.username ||
    player?.profile?.name ||
    `玩家${index + 1}`

  const uuid =
    player?.id ||
    player?.uuid ||
    player?.profile?.id ||
    ''

  return {
    key: `${uuid || name}-${index}`,
    name,
    uuid,
  }
}

function extractPlayers(status) {
  const rawPlayers =
    status?.players?.sample ||
    status?.playerList ||
    status?.samplePlayers ||
    status?.playersSample ||
    []

  if (!Array.isArray(rawPlayers)) return []

  return rawPlayers.map(normalizePlayer).filter(player => player.name)
}

function getOnlineCount(status) {
  return Number(
    status?.playersOnline ??
    status?.players?.online ??
    0,
  )
}

function getMaxCount(status) {
  return Number(
    status?.playersMax ??
    status?.players?.max ??
    0,
  )
}

function getVersionText(status) {
  return (
    status?.version ||
    status?.versionName ||
    status?.version?.name ||
    '未知版本'
  )
}

function getMotdText(status) {
  return (
    status?.motd ||
    status?.description ||
    status?.statusText ||
    '暂无服务器说明'
  )
}

function getPlayerAvatar(player) {
  const token = player.uuid || player.name
  return `https://mc-heads.net/avatar/${encodeURIComponent(token)}/72`
}

function togglePlayers(serverId) {
  expandedPlayers.value = {
    ...expandedPlayers.value,
    [serverId]: !expandedPlayers.value[serverId],
  }
}

async function copyAddress(server) {
  try {
    await navigator.clipboard.writeText(getServerAddress(server))
    copiedServerId.value = server.id

    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = window.setTimeout(() => {
      copiedServerId.value = null
    }, 1600)
  } catch (error) {
    console.error('复制地址失败', error)
  }
}

async function refreshSingleServer(index) {
  const currentServer = servers.value[index]

  try {
    const status = await fetchMinecraftServerStatus(getServerQuery(currentServer))
    const players = extractPlayers(status)
    const online = getOnlineCount(status)

    servers.value[index] = {
      ...currentServer,
      version: getVersionText(status),
      online,
      max: getMaxCount(status),
      motd: getMotdText(status),
      statusText: status?.online ? '在线' : '离线',
      statusClass: status?.online ? 'is-online' : 'is-offline',
      lastUpdate: formatTime(),
      loading: false,
      players,
    }
  } catch (error) {
    console.error(`获取 ${currentServer.name} 状态失败`, error)

    servers.value[index] = {
      ...currentServer,
      version: currentServer.version || '检测失败',
      online: 0,
      max: 0,
      motd: '状态获取失败',
      statusText: '离线',
      statusClass: 'is-offline',
      lastUpdate: formatTime(),
      loading: false,
      players: [],
    }
  }
}

async function refreshAllServers() {
  await Promise.all(servers.value.map((_, index) => refreshSingleServer(index)))
}

onMounted(async () => {
  await refreshAllServers()

  refreshTimer = window.setInterval(() => {
    refreshAllServers()
  }, 120000)
})

onBeforeUnmount(() => {
  if (refreshTimer) clearInterval(refreshTimer)
  if (copyTimer) clearTimeout(copyTimer)
})
</script>
