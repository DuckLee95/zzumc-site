<template>
  <div class="server-info-page upgraded-server-info-page">
    <div class="container server-info-page-container">
      <div class="server-info-topbar">
        <RouterLink class="server-info-back-link" to="/">
          ← 返回主页面
        </RouterLink>
      </div>

      <div class="server-info-hero pixel-panel">
        <p class="section-kicker">SERVER CENTER</p>
        <h1>服务器信息</h1>
        <p class="server-info-hero-desc">
          这里是完整的服务器状态页。后续你可以把多个服务器的在线状态、版本、延迟、玩家人数和节点信息都接进来。
        </p>
      </div>

      <div class="server-info-main-grid">
        <article
          v-for="server in servers"
          :key="server.id"
          class="server-detail-card pixel-panel"
        >
          <div class="server-detail-top">
            <div>
              <h2>{{ server.name }}</h2>
              <p class="server-detail-type">{{ server.type }}</p>
            </div>

            <div class="server-status-badge" :class="server.statusClass">
              <span class="server-status-dot"></span>
              <span>{{ server.statusText }}</span>
            </div>
          </div>

          <p class="server-detail-desc">{{ server.desc }}</p>

          <div class="server-detail-grid">
            <div class="server-info-item">
              <span class="server-info-label">地址</span>
              <strong>{{ server.host }}</strong>
            </div>

            <div class="server-info-item">
              <span class="server-info-label">端口</span>
              <strong>{{ server.port }}</strong>
            </div>

            <div class="server-info-item">
              <span class="server-info-label">版本</span>
              <strong>{{ server.version }}</strong>
            </div>

            <div class="server-info-item">
              <span class="server-info-label">在线人数</span>
              <strong>{{ server.online }}/{{ server.max }}</strong>
            </div>
          </div>

          <div class="server-tags">
            <span v-for="tag in server.tags" :key="tag" class="server-tag">
              {{ tag }}
            </span>
          </div>

          <div class="server-detail-bottom">
            <span class="server-update-time">更新于：{{ server.lastUpdate }}</span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
const servers = [
  {
    id: 1,
    name: '主生存服',
    type: 'Survival',
    host: 'play.zzumc.example',
    port: '25565',
    version: '1.20.1 Forge',
    online: 18,
    max: 60,
    statusText: '在线',
    statusClass: 'is-online',
    desc: '主社团生存服务器，适合日常联机、生存发展与建筑协作。',
    tags: ['主服', '生存', '长期开放'],
    lastUpdate: '2026-04-16 01:20',
  },
  {
    id: 2,
    name: '活动服',
    type: 'Event',
    host: 'event.zzumc.example',
    port: '25566',
    version: '1.20.1',
    online: 6,
    max: 40,
    statusText: '在线',
    statusClass: 'is-online',
    desc: '用于临时活动、比赛、节日企划和多人联机场景。',
    tags: ['活动', '限时', '联机'],
    lastUpdate: '2026-04-16 01:20',
  },
  {
    id: 3,
    name: '测试服',
    type: 'Test',
    host: 'test.zzumc.example',
    port: '25567',
    version: '1.20.1 Forge',
    online: 0,
    max: 20,
    statusText: '维护中',
    statusClass: 'is-maintain',
    desc: '用于新内容测试、模组验证和更新前检查。',
    tags: ['测试', '开发', '维护'],
    lastUpdate: '2026-04-16 01:20',
  },
]
</script>