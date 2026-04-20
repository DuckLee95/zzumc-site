<template>
  <div class="module-page">
    <CommandPanel title="管理操作日志" subtitle="OPERATION LOGS">
      <div class="module-toolbar">
        <input v-model="opKeyword" class="module-input" type="text" placeholder="按操作者、模块或目标搜索" />
      </div>

      <div class="module-table-wrap">
        <table class="module-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>操作者</th>
              <th>模块</th>
              <th>动作</th>
              <th>目标</th>
              <th>结果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredOperationLogs" :key="item.id">
              <td>{{ item.createdAt }}</td>
              <td>{{ item.actor }}</td>
              <td>{{ item.module }}</td>
              <td>{{ item.action }}</td>
              <td>{{ item.target }}</td>
              <td>
                <span class="status-chip" :class="item.result === 'success' ? 'is-online' : 'is-offline'">
                  {{ item.result === 'success' ? '成功' : '失败' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CommandPanel>

    <CommandPanel title="登录日志" subtitle="LOGIN LOGS">
      <div class="module-toolbar">
        <input v-model="loginKeyword" class="module-input" type="text" placeholder="按邮箱、IP 或状态搜索" />
      </div>

      <div class="module-table-wrap">
        <table class="module-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>账号</th>
              <th>状态</th>
              <th>IP</th>
              <th>设备</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredLoginLogs" :key="item.id">
              <td>{{ item.createdAt }}</td>
              <td>{{ item.email }}</td>
              <td>
                <span class="status-chip" :class="item.status === 'success' ? 'is-online' : 'is-offline'">
                  {{ item.status === 'success' ? '成功' : '失败' }}
                </span>
              </td>
              <td>{{ item.ip }}</td>
              <td>{{ item.userAgent }}</td>
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
import { fetchLoginLogs, fetchOperationLogs } from '../../services/logService'

const operationLogs = ref([])
const loginLogs = ref([])

const opKeyword = ref('')
const loginKeyword = ref('')

const filteredOperationLogs = computed(() => {
  const q = opKeyword.value.trim().toLowerCase()
  if (!q) return operationLogs.value

  return operationLogs.value.filter((item) => {
    return [item.actor, item.module, item.action, item.target]
      .join(' ')
      .toLowerCase()
      .includes(q)
  })
})

const filteredLoginLogs = computed(() => {
  const q = loginKeyword.value.trim().toLowerCase()
  if (!q) return loginLogs.value

  return loginLogs.value.filter((item) => {
    return [item.email, item.ip, item.status, item.userAgent]
      .join(' ')
      .toLowerCase()
      .includes(q)
  })
})

async function load() {
  const [operations, logins] = await Promise.all([
    fetchOperationLogs(),
    fetchLoginLogs(),
  ])
  operationLogs.value = operations
  loginLogs.value = logins
}

onMounted(load)
</script>
