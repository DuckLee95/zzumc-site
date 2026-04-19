<template>
  <div class="module-page">
    <CommandPanel title="成员中心" subtitle="PLAYER CENTER">
      <div class="module-toolbar">
        <input v-model="keyword" class="module-input" type="text" placeholder="按游戏名、昵称或分组搜索" />
        <button type="button" class="command-btn command-btn--primary" @click="syncNow">从皮肤站同步</button>
      </div>

      <section class="stat-grid player-stat-grid">
        <article class="stat-card">
          <p>玩家总数</p>
          <strong>{{ stats.total }}</strong>
        </article>
        <article class="stat-card">
          <p>关于页展示</p>
          <strong>{{ stats.showOnAbout }}</strong>
        </article>
        <article class="stat-card">
          <p>管理员候选</p>
          <strong>{{ stats.adminCandidate }}</strong>
        </article>
        <article class="stat-card">
          <p>活跃成员</p>
          <strong>{{ stats.active }}</strong>
        </article>
      </section>

      <div class="module-table-wrap">
        <table class="module-table">
          <thead>
            <tr>
              <th>游戏名</th>
              <th>昵称</th>
              <th>分组</th>
              <th>状态</th>
              <th>关于页展示</th>
              <th>管理员候选</th>
              <th>最近活跃</th>
              <th class="action-col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredPlayers" :key="item.id">
              <td>{{ item.username }}</td>
              <td>{{ item.nickname || '-' }}</td>
              <td>
                <input
                  v-model="item.group"
                  class="module-input compact-input"
                  :disabled="!canUpdate"
                  @blur="savePatch(item, { group: item.group })"
                />
              </td>
              <td>
                <span class="status-chip" :class="item.status === 'active' ? 'is-online' : 'is-offline'">
                  {{ item.status === 'active' ? '活跃' : '非活跃' }}
                </span>
              </td>
              <td>{{ item.canShowOnAbout ? '显示' : '隐藏' }}</td>
              <td>{{ item.isAdminCandidate ? '是' : '否' }}</td>
              <td>{{ item.lastSeenAt || '-' }}</td>
              <td class="action-col">
                <div class="table-actions">
                  <button
                    type="button"
                    class="text-link"
                    :disabled="!canUpdate"
                    @click="toggleShow(item)"
                  >
                    {{ item.canShowOnAbout ? '隐藏' : '展示' }}
                  </button>
                  <button
                    type="button"
                    class="text-link"
                    :disabled="!canUpdate"
                    @click="toggleCandidate(item)"
                  >
                    {{ item.isAdminCandidate ? '取消候选' : '设为候选' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CommandPanel>

    <CommandPanel title="同步记录" subtitle="PLAYER SYNC LOGS">
      <div class="module-table-wrap">
        <table class="module-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>来源</th>
              <th>结果</th>
              <th>总量</th>
              <th>新增</th>
              <th>更新</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in syncLogs" :key="log.id">
              <td>{{ log.createdAt }}</td>
              <td>{{ log.source }}</td>
              <td>
                <span class="status-chip" :class="log.status === 'success' ? 'is-online' : 'is-offline'">
                  {{ log.status === 'success' ? '成功' : '失败' }}
                </span>
              </td>
              <td>{{ log.total }}</td>
              <td>{{ log.created }}</td>
              <td>{{ log.updated }}</td>
              <td>{{ log.message }}</td>
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
import {
  fetchPlayerSyncLogs,
  fetchPlayersList,
  syncPlayersFromSkinSite,
  updatePlayerInfo,
} from '../../services/playerService'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const players = ref([])
const syncLogs = ref([])
const keyword = ref('')

const canUpdate = computed(() => auth.hasPermission('players:update') || auth.hasPermission('players:*'))

const filteredPlayers = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return players.value

  return players.value.filter((item) => {
    return [item.username, item.nickname, item.group].join(' ').toLowerCase().includes(q)
  })
})

const stats = computed(() => {
  const list = players.value
  return {
    total: list.length,
    showOnAbout: list.filter((item) => item.canShowOnAbout).length,
    adminCandidate: list.filter((item) => item.isAdminCandidate).length,
    active: list.filter((item) => item.status === 'active').length,
  }
})

async function load() {
  const [playerList, logs] = await Promise.all([
    fetchPlayersList(),
    fetchPlayerSyncLogs(),
  ])
  players.value = playerList
  syncLogs.value = logs
}

async function savePatch(item, patch) {
  if (!canUpdate.value) return
  await updatePlayerInfo(item.id, patch, auth.state.user?.name || '系统')
  await load()
}

async function toggleShow(item) {
  await savePatch(item, { canShowOnAbout: !item.canShowOnAbout })
}

async function toggleCandidate(item) {
  await savePatch(item, { isAdminCandidate: !item.isAdminCandidate })
}

async function syncNow() {
  await syncPlayersFromSkinSite(auth.state.user?.name || '系统')
  await load()
}

onMounted(load)
</script>
