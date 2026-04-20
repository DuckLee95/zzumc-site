<template>
  <div class="dashboard-page">
    <CommandPanel title="阶段 E 已交付" subtitle="SYSTEM STATUS" tone="accent">
      <p>
        当前后台已覆盖内容管理、权限日志、服务器管理、成员中心与系统设置。后续可直接进入真实 API 联调。
      </p>
    </CommandPanel>

    <section class="stat-grid">
      <article v-for="item in stats" :key="item.label" class="stat-card">
        <p>{{ item.label }}</p>
        <strong>{{ item.value }}</strong>
      </article>
    </section>

    <section class="two-col-grid">
      <CommandPanel title="待处理事项" subtitle="TODO QUEUE">
        <ul class="todo-list">
          <li v-for="item in todos" :key="item">{{ item }}</li>
        </ul>
      </CommandPanel>

      <CommandPanel title="服务器概览" subtitle="NETWORK SNAPSHOT">
        <ul class="server-list">
          <li v-for="server in servers" :key="server.name">
            <span>{{ server.name }}</span>
            <span :class="server.online ? 'is-online' : 'is-offline'">
              {{ server.online ? `在线 ${server.players}` : '离线' }}
            </span>
          </li>
        </ul>
      </CommandPanel>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CommandPanel from '../components/ui/CommandPanel.vue'
import { fetchAdminUsers } from '../services/adminService'
import { fetchDocsList } from '../services/docsService'
import { fetchNewsList } from '../services/newsService'
import { fetchPlayersList } from '../services/playerService'
import { fetchResourcesList } from '../services/resourcesService'
import { fetchServersList } from '../services/serverService'

const stats = ref([
  { label: '已发布新闻', value: 0 },
  { label: '文档总数', value: 0 },
  { label: '资源条目', value: 0 },
  { label: '服务器节点', value: 0 },
  { label: '同步玩家数', value: 0 },
  { label: '管理员账号', value: 0 },
])

const todos = [
  '联调真实后端 API，替换本地 mock service',
  '补充统一错误处理与接口重试策略',
  '补充批量操作与审核流（可选）',
  '完成联调后的回归测试与权限压测',
]

const servers = ref([])

async function load() {
  const [news, docs, resources, serverList, players, admins] = await Promise.all([
    fetchNewsList(),
    fetchDocsList(),
    fetchResourcesList(),
    fetchServersList(),
    fetchPlayersList(),
    fetchAdminUsers(),
  ])

  stats.value = [
    { label: '已发布新闻', value: news.filter((item) => item.status === 'published').length },
    { label: '文档总数', value: docs.length },
    { label: '资源条目', value: resources.length },
    { label: '服务器节点', value: serverList.length },
    { label: '同步玩家数', value: players.length },
    { label: '管理员账号', value: admins.length },
  ]

  servers.value = serverList.slice(0, 3).map((item) => ({
    name: item.name,
    online: item.status === 'online',
    players: `${item.currentPlayers}/${item.maxPlayers}`,
  }))
}

onMounted(load)
</script>
