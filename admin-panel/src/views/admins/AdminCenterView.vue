<template>
  <div class="module-page">
    <CommandPanel title="管理员列表" subtitle="ADMIN USERS">
      <div class="module-toolbar">
        <input v-model="keyword" class="module-input" type="text" placeholder="按姓名或邮箱搜索" />
      </div>

      <div class="module-table-wrap">
        <table class="module-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>状态</th>
              <th>最近登录</th>
              <th class="action-col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredUsers" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td>
                <select
                  class="module-input role-select"
                  :value="item.roleCode"
                  :disabled="isCurrentUser(item)"
                  :title="isCurrentUser(item) ? '当前登录账号不可修改角色' : ''"
                  @change="onRoleChange(item, $event.target.value)"
                >
                  <option v-for="role in roles" :key="role.code" :value="role.code">
                    {{ role.name }}
                  </option>
                </select>
              </td>
              <td>
                <span class="status-chip" :class="item.status === 'enabled' ? 'is-online' : 'is-offline'">
                  {{ item.status === 'enabled' ? '启用' : '禁用' }}
                </span>
              </td>
              <td>{{ item.lastLoginAt || '-' }}</td>
              <td class="action-col">
                <div class="table-actions">
                  <button
                    type="button"
                    class="text-link"
                    :disabled="isCurrentUser(item)"
                    :title="isCurrentUser(item) ? '当前登录账号不可禁用' : ''"
                    @click="toggleStatus(item)"
                  >
                    {{ item.status === 'enabled' ? '禁用' : '启用' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CommandPanel>

    <CommandPanel title="角色权限矩阵" subtitle="ROLE MATRIX">
      <div class="role-grid">
        <article v-for="role in roles" :key="role.code" class="role-card">
          <h3>{{ role.name }}</h3>
          <p class="role-desc">{{ role.description }}</p>
          <div class="role-permissions">
            <span v-for="permission in role.permissions" :key="permission" class="permission-chip">
              {{ permission }}
            </span>
          </div>
        </article>
      </div>
    </CommandPanel>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import CommandPanel from '../../components/ui/CommandPanel.vue'
import {
  fetchAdminUsers,
  fetchRoles,
  toggleAdminStatus,
  updateAdminRole,
} from '../../services/adminService'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const users = ref([])
const roles = ref([])
const keyword = ref('')

const filteredUsers = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter((item) => {
    return String(item.name).toLowerCase().includes(q) || String(item.email).toLowerCase().includes(q)
  })
})

async function load() {
  const [roleList, userList] = await Promise.all([fetchRoles(), fetchAdminUsers()])
  roles.value = roleList
  users.value = userList
}

async function onRoleChange(user, roleCode) {
  if (isCurrentUser(user)) {
    window.alert('当前登录账号不可修改角色')
    await load()
    return
  }

  if (roleCode === user.roleCode) return

  const result = await updateAdminRole(
    user.id,
    roleCode,
    auth.state.user?.name || '系统',
    auth.state.user?.id,
  )
  if (!result.ok) {
    window.alert(result.message || '更新角色失败')
    await load()
    return
  }

  await load()
}

async function toggleStatus(user) {
  if (isCurrentUser(user)) {
    window.alert('当前登录账号不可禁用')
    return
  }

  const actionText = user.status === 'enabled' ? '禁用' : '启用'
  const ok = window.confirm(`确认${actionText}管理员「${user.name}」吗？`)
  if (!ok) return

  const result = await toggleAdminStatus(user.id, auth.state.user?.name || '系统', auth.state.user?.id)
  if (!result.ok) {
    window.alert(result.message || `${actionText}失败`)
    await load()
    return
  }

  await load()
}

function isCurrentUser(user) {
  return Number(user?.id) === Number(auth.state.user?.id)
}

onMounted(load)
</script>
