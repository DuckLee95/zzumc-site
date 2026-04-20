<template>
  <div class="module-page">
    <CommandPanel :title="isEdit ? '编辑服务器' : '新建服务器'" subtitle="SERVER EDITOR">
      <form class="editor-grid" @submit.prevent="submit">
        <label>
          <span>服务器名称</span>
          <input v-model="form.name" class="module-input" placeholder="例如：主生存服" required />
        </label>
        <label>
          <span>版本</span>
          <input v-model="form.version" class="module-input" placeholder="例如：1.20.1" required />
        </label>

        <label>
          <span>主机地址</span>
          <input v-model="form.host" class="module-input" placeholder="例如：mc-main.zzumc.com" required />
        </label>
        <label>
          <span>端口</span>
          <input v-model="form.port" type="number" class="module-input" min="1" max="65535" required />
        </label>

        <label>
          <span>最大人数</span>
          <input v-model="form.maxPlayers" type="number" class="module-input" min="1" required />
        </label>
        <label>
          <span>当前在线</span>
          <input v-model="form.currentPlayers" type="number" class="module-input" min="0" required />
        </label>

        <label>
          <span>采集方式</span>
          <select v-model="form.syncMode" class="module-input">
            <option value="status-api">状态接口</option>
            <option value="plugin">插件上报</option>
            <option value="manual">手动维护</option>
          </select>
        </label>
        <label>
          <span>权重</span>
          <input v-model="form.weight" type="number" class="module-input" min="1" required />
        </label>

        <label>
          <span>状态</span>
          <select v-model="form.status" class="module-input">
            <option value="online">在线</option>
            <option value="offline">离线</option>
          </select>
        </label>
        <label class="editor-checkbox">
          <input v-model="form.featured" type="checkbox" />
          <span>作为首页推荐服务器</span>
        </label>

        <label class="editor-full">
          <span>MOTD / 描述</span>
          <textarea v-model="form.motd" class="module-input module-textarea" placeholder="请输入服务器描述"></textarea>
        </label>

        <div class="editor-actions editor-full">
          <button type="submit" class="command-btn command-btn--primary">保存</button>
          <RouterLink to="/servers" class="command-btn">返回列表</RouterLink>
        </div>
      </form>
    </CommandPanel>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommandPanel from '../../components/ui/CommandPanel.vue'
import { fetchServerById, saveServer } from '../../services/serverService'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isEdit = computed(() => Boolean(route.params.id))

const form = reactive({
  id: null,
  name: '',
  host: '',
  port: 25565,
  version: '1.20.1',
  maxPlayers: 100,
  currentPlayers: 0,
  status: 'offline',
  syncMode: 'status-api',
  weight: 1,
  featured: false,
  motd: '',
})

async function load() {
  if (!isEdit.value) return

  const data = await fetchServerById(route.params.id)
  if (!data) return
  Object.assign(form, data)
}

async function submit() {
  await saveServer(form, auth.state.user?.name || '系统')
  router.replace('/servers')
}

onMounted(load)
</script>
