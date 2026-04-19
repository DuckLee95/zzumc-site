<template>
  <div class="module-page">
    <CommandPanel title="服务器管理" subtitle="SERVER MANAGEMENT">
      <div class="module-toolbar">
        <input v-model="keyword" class="module-input" type="text" placeholder="按名称、地址或版本搜索" />
        <div class="module-toolbar-actions">
          <button type="button" class="command-btn" @click="syncAll">全量同步</button>
          <RouterLink class="command-btn command-btn--primary" to="/servers/create">新建服务器</RouterLink>
        </div>
      </div>

      <div class="module-table-wrap">
        <table class="module-table">
          <thead>
            <tr>
              <th>名称</th>
              <th>地址</th>
              <th>版本</th>
              <th>状态</th>
              <th>在线</th>
              <th>采集方式</th>
              <th>权重</th>
              <th class="action-col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredList" :key="item.id">
              <td>
                <strong>{{ item.name }}</strong>
                <span v-if="item.featured" class="inline-chip">推荐</span>
              </td>
              <td>{{ item.host }}:{{ item.port }}</td>
              <td>{{ item.version }}</td>
              <td>
                <span class="status-chip" :class="item.status === 'online' ? 'is-online' : 'is-offline'">
                  {{ item.status === 'online' ? '在线' : '离线' }}
                </span>
              </td>
              <td>{{ item.currentPlayers }}/{{ item.maxPlayers }}</td>
              <td>{{ syncModeText(item.syncMode) }}</td>
              <td>{{ item.weight }}</td>
              <td class="action-col">
                <div class="table-actions">
                  <button type="button" class="text-link" @click="syncOne(item.id)">同步</button>
                  <RouterLink class="text-link" :to="`/servers/${item.id}/edit`">编辑</RouterLink>
                  <button type="button" class="text-link text-link--danger" @click="remove(item.id)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CommandPanel>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import CommandPanel from '../../components/ui/CommandPanel.vue'
import { deleteServer, fetchServersList, syncAllServers, syncServerStatus } from '../../services/serverService'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const keyword = ref('')
const list = ref([])

const filteredList = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  if (!query) return list.value

  return list.value.filter((item) => {
    return [item.name, item.host, item.version].join(' ').toLowerCase().includes(query)
  })
})

function syncModeText(mode) {
  if (mode === 'status-api') return '状态接口'
  if (mode === 'plugin') return '插件上报'
  return '手动维护'
}

async function load() {
  list.value = await fetchServersList()
}

async function syncOne(id) {
  await syncServerStatus(id, auth.state.user?.name || '系统')
  await load()
}

async function syncAll() {
  await syncAllServers(auth.state.user?.name || '系统')
  await load()
}

async function remove(id) {
  const item = list.value.find((row) => Number(row.id) === Number(id))
  const ok = window.confirm(`确认删除服务器「${item?.name || id}」吗？`)
  if (!ok) return

  await deleteServer(id, auth.state.user?.name || '系统')
  await load()
}

onMounted(load)
</script>
