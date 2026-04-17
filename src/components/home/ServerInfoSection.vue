<template>
  <section id="server-info-home" class="section section-dark homepage-server-section">
    <div class="container home-wide-container">
      <div class="section-heading center">
        <h2>服务器信息</h2>
      </div>

      <article class="server-main-card" v-if="server">
        <RouterLink class="server-main-media-link" to="/server-info">
          <div class="server-main-media">
            <img class="server-main-image" :src="server.image" :alt="server.name" />
            <div class="server-main-media-overlay"></div>

            <div class="server-main-floating server-main-floating-top">
              <span class="server-live-badge" :class="server.status?.online ? 'is-online' : 'is-offline'">
                <span class="server-live-dot"></span>
                {{
                  server.loading
                    ? '加载中'
                    : server.status?.online
                      ? '当前在线'
                      : '当前离线'
                }}
              </span>
            </div>

            <div class="server-main-floating server-main-floating-bottom">
              <span class="server-mini-note">群组服主入口</span>
            </div>

            <div class="server-image-hover-panel">
              <span class="mc-pixel-btn">查看详情</span>
            </div>
          </div>
        </RouterLink>

        <div class="server-main-content">
          <div class="server-main-head">
            <div class="server-main-title-wrap">
              <p class="server-main-kicker">MC NETWORK</p>
              <h3>{{ server.name }}</h3>
              <p class="server-main-subtitle">{{ server.subtitle }}</p>
            </div>

            <div class="server-main-player-panel">
              <span class="server-main-player-label">在线人数</span>
              <strong class="server-main-player-count">
                {{
                  server.loading
                    ? '加载中'
                    : server.status?.online
                      ? `${server.status.playersOnline}/${server.status.playersMax}`
                      : '离线'
                }}
              </strong>
            </div>
          </div>

          <div class="server-intro-merged mc-pixel-panel">
            <span class="server-intro-label">服务器简介</span>
            <p>
              这里是郑爱玩MC群组服的统一入口，后续将整合
              <strong>生存服</strong>、<strong>小游戏</strong>、
              <strong>活动服</strong>、<strong>测试服</strong>
              等不同节点，方便玩家在一个入口中快速进入不同玩法和社区内容。
              对新成员来说，这里是加入服务器、了解玩法方向的起点；
              对老玩家来说，这里也是回流、查看动态和参与活动的主入口。
            </p>
          </div>

          <div class="server-copy-row">
            <button type="button" class="server-copy-card" @click="copyAddress" :title="`点击复制 ${server.address}`">
              <div class="server-copy-base" :class="{ 'is-hidden': copied }">
                <div class="server-copy-left">
                  <span class="server-copy-label">服务器 IP</span>
                  <strong class="server-copy-value">{{ server.address }}</strong>
                </div>
              </div>

              <div class="server-copy-overlay" :class="{ 'is-copied': copied }">
                <span class="server-copy-overlay-text">
                  {{ copied ? '已复制地址' : '复制地址' }}
                </span>
                <span class="server-copy-overlay-tag">
                  {{ copied ? 'OK' : 'ADDR' }}
                </span>
              </div>
            </button>
          </div>

          <div class="server-stats-grid">
            <div class="server-stat-card mc-pixel-panel">
              <span class="server-stat-label">运行状态</span>
              <strong :class="server.status?.online ? 'server-stat-online' : 'server-stat-offline'">
                {{
                  server.loading
                    ? '加载中'
                    : server.status?.online
                      ? '在线运行'
                      : '离线'
                }}
              </strong>
            </div>

            <div class="server-stat-card mc-pixel-panel">
              <span class="server-stat-label">版本信息</span>
              <strong>{{ server.status?.version || server.versionText }}</strong>
            </div>

            <div class="server-stat-card mc-pixel-panel">
              <span class="server-stat-label">服务器说明</span>
              <strong class="server-stat-motd">
                {{
                  server.error
                    ? server.error
                    : server.status?.motd || server.statusText
                }}
              </strong>
            </div>
          </div>

          <div class="server-feature-tags">
            <span v-for="tag in server.tags" :key="tag" class="server-feature-tag mc-pixel-tag">
              {{ tag }}
            </span>
          </div>

          <div class="server-main-footer">
            <span class="server-main-update-time">
              {{
                server.lastUpdated
                  ? `更新于：${server.lastUpdated}`
                  : '等待首次刷新'
              }}
            </span>

            <RouterLink class="mc-pixel-btn server-main-more-link" to="/server-info">
              查看更多
            </RouterLink>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { fetchMinecraftServerStatus } from '../../lib/serverStatus'

const server = ref({
  id: 1,
  name: '郑爱玩MC 群组服',
  subtitle: '郑州大学 Minecraft 社区主入口',
  address: 'play.zzumc.com',
  image: '/images/servers/network-main.jpg',
  tags: ['群组服', '主入口', '长期开放', '多人联机'],
  versionText: '自动检测',
  statusText: '等待状态同步',
  status: null,
  error: '',
  loading: true,
  lastUpdated: '',
})

const copied = ref(false)
let timer = null
let copyTimer = null

function formatTime(date = new Date()) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
}

async function refreshServerStatus() {
  try {
    const status = await fetchMinecraftServerStatus(server.value.address)

    server.value = {
      ...server.value,
      status,
      error: '',
      loading: false,
      lastUpdated: formatTime(),
    }
  } catch (err) {
    console.error(err)

    server.value = {
      ...server.value,
      status: null,
      error: '状态获取失败',
      loading: false,
      lastUpdated: formatTime(),
    }
  }
}

async function copyAddress() {
  try {
    await navigator.clipboard.writeText(server.value.address)
    copied.value = true

    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = window.setTimeout(() => {
      copied.value = false
    }, 1600)
  } catch (err) {
    console.error('复制失败', err)
  }
}

onMounted(async () => {
  await refreshServerStatus()

  timer = window.setInterval(() => {
    refreshServerStatus()
  }, 120000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  if (copyTimer) clearTimeout(copyTimer)
})
</script>