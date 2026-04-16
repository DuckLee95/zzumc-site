<template>
  <section id="server-info-home" class="section section-dark decorated-section homepage-server-section">
    <div class="container home-wide-container">
      <div class="section-heading center server-heading-centered">
        <p class="section-kicker">SERVER STATUS</p>
        <h2>服务器信息</h2>
        <p>
          这里预留给多个 MC 服务器的在线状态、版本信息、玩家人数和节点说明，后续可以直接接入接口自动更新。
        </p>

        <RouterLink class="view-all-news centered-view-all-news" to="/server-info">
          查看更多
        </RouterLink>
      </div>

      <div class="server-status-grid">
        <article
          v-for="server in servers"
          :key="server.id"
          class="server-status-card pixel-panel"
        >
          <div class="server-status-top">
            <div class="server-title-wrap">
              <h3>{{ server.name }}</h3>
              <p class="server-node-type">{{ server.type }}</p>
            </div>

            <div class="server-status-badge" :class="server.statusClass">
              <span class="server-status-dot"></span>
              <span>{{ server.statusText }}</span>
            </div>
          </div>

          <p class="server-desc">{{ server.desc }}</p>

          <div class="server-info-list">
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

          <div class="server-footer">
            <span class="server-update-time">更新于：{{ server.lastUpdate }}</span>
          </div>
        </article>
      </div>
    </div>
  </section>
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