<template>
  <div class="module-page">
    <CommandPanel title="资源管理" subtitle="RESOURCE MANAGEMENT">
      <div class="module-toolbar">
        <input v-model="keyword" class="module-input" type="text" placeholder="按名称或来源搜索" />
        <RouterLink class="command-btn command-btn--primary" to="/resources/create">新建资源</RouterLink>
      </div>

      <div class="module-table-wrap">
        <table class="module-table">
          <thead>
            <tr>
              <th>资源名称</th>
              <th>类型</th>
              <th>来源</th>
              <th>状态</th>
              <th class="order-col">排序</th>
              <th class="action-col">操作</th>
              <th class="seq-col">序号</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredResources" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.provider }}</td>
              <td>
                <span class="status-chip" :class="item.status === 'enabled' ? 'is-online' : 'is-offline'">
                  {{ item.status === 'enabled' ? '启用' : '停用' }}
                </span>
              </td>
              <td>
                <div class="order-cell">
                  <div class="order-actions">
                    <button
                      type="button"
                      class="order-btn"
                      title="与上方交换"
                      :disabled="item.order === 1"
                      @click="move(item, 'up')"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      class="order-btn"
                      title="与下方交换"
                      :disabled="item.order === list.length"
                      @click="move(item, 'down')"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      class="order-btn"
                      title="移动到首项"
                      :disabled="item.order === 1"
                      @click="move(item, 'top')"
                    >
                      ⏫
                    </button>
                    <button
                      type="button"
                      class="order-btn"
                      title="移动到尾项"
                      :disabled="item.order === list.length"
                      @click="move(item, 'bottom')"
                    >
                      ⏬
                    </button>
                  </div>
                </div>
              </td>
              <td class="action-col">
                <div class="table-actions">
                  <RouterLink class="text-link" :to="`/resources/${item.id}/edit`">编辑</RouterLink>
                  <button type="button" class="text-link text-link--danger" @click="remove(item.id)">删除</button>
                </div>
              </td>
              <td class="seq-col">{{ item.order }}</td>
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
import { deleteResource, fetchResourcesList, moveResourceOrder } from '../../services/resourcesService'

const list = ref([])
const keyword = ref('')
const pendingMoveCount = ref(0)
let moveQueue = Promise.resolve()

const filteredResources = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  if (!query) return list.value
  return list.value.filter((item) => {
    return String(item.title).toLowerCase().includes(query) || String(item.provider).toLowerCase().includes(query)
  })
})

async function load() {
  list.value = await fetchResourcesList()
}

async function remove(id) {
  await deleteResource(id)
  await load()
}

async function move(item, action) {
  if (action === 'top') {
    const ok = window.confirm(`确认将「${item.title}」移动到首项吗？`)
    if (!ok) return
  }

  if (action === 'bottom') {
    const ok = window.confirm(`确认将「${item.title}」移动到尾项吗？`)
    if (!ok) return
  }

  applyMoveInMemory(item.id, action)
  enqueueMove(item.id, action)
}

function applyMoveInMemory(id, action) {
  const next = [...list.value]
  const index = next.findIndex((row) => Number(row.id) === Number(id))
  if (index === -1) return

  if (action === 'up' && index > 0) {
    const temp = next[index - 1]
    next[index - 1] = next[index]
    next[index] = temp
  }

  if (action === 'down' && index < next.length - 1) {
    const temp = next[index + 1]
    next[index + 1] = next[index]
    next[index] = temp
  }

  if (action === 'top' && index > 0) {
    const [current] = next.splice(index, 1)
    next.unshift(current)
  }

  if (action === 'bottom' && index < next.length - 1) {
    const [current] = next.splice(index, 1)
    next.push(current)
  }

  list.value = next.map((row, idx) => ({
    ...row,
    order: idx + 1,
  }))
}

function enqueueMove(id, action) {
  pendingMoveCount.value += 1

  moveQueue = moveQueue
    .then(() => moveResourceOrder(id, action))
    .catch(async (error) => {
      console.error('资源排序同步失败', error)
      await load()
    })
    .finally(async () => {
      pendingMoveCount.value = Math.max(0, pendingMoveCount.value - 1)
      if (pendingMoveCount.value === 0) {
        await load()
      }
    })
}

onMounted(load)
</script>
