<template>
  <div class="module-page">
    <CommandPanel title="系统设置" subtitle="SYSTEM SETTINGS">
      <div class="module-toolbar">
        <p class="settings-hint">统一维护站点基础信息、首页展示策略和外部接口参数。</p>
        <button type="button" class="command-btn" :disabled="!canEdit" @click="resetAll">恢复默认</button>
      </div>
    </CommandPanel>

    <CommandPanel title="站点基础配置" subtitle="SITE PROFILE">
      <form class="editor-grid" @submit.prevent="saveSite">
        <label>
          <span>站点名称</span>
          <input v-model="site.siteName" class="module-input" :disabled="!canEdit" required />
        </label>
        <label>
          <span>站点副标题</span>
          <input v-model="site.siteSubtitle" class="module-input" :disabled="!canEdit" required />
        </label>
        <label>
          <span>联系邮箱</span>
          <input v-model="site.contactEmail" class="module-input" type="email" :disabled="!canEdit" required />
        </label>
        <label class="editor-checkbox editor-full">
          <input v-model="site.aboutAutoSync" type="checkbox" :disabled="!canEdit" />
          <span>允许关于页成员列表自动同步玩家数据</span>
        </label>
        <label class="editor-checkbox editor-full">
          <input v-model="site.maintenanceMode" type="checkbox" :disabled="!canEdit" />
          <span>开启维护模式（前台提示维护中）</span>
        </label>

        <div class="editor-actions editor-full">
          <button type="submit" class="command-btn command-btn--primary" :disabled="!canEdit">保存站点配置</button>
        </div>
      </form>
    </CommandPanel>

    <CommandPanel title="首页展示配置" subtitle="HOMEPAGE DISPLAY">
      <form class="editor-grid" @submit.prevent="saveHomepage">
        <label class="editor-full">
          <span>首页主标题</span>
          <input v-model="homepage.heroTitle" class="module-input" :disabled="!canEdit" required />
        </label>
        <label class="editor-full">
          <span>首页副标题</span>
          <input v-model="homepage.heroSubtitle" class="module-input" :disabled="!canEdit" required />
        </label>
        <label class="editor-full">
          <span>公告文案</span>
          <textarea v-model="homepage.announcementText" class="module-input module-textarea" :disabled="!canEdit"></textarea>
        </label>
        <label>
          <span>首页新闻条数</span>
          <input v-model="homepage.featuredNewsCount" type="number" min="1" class="module-input" :disabled="!canEdit" />
        </label>
        <label>
          <span>首页服务器条数</span>
          <input v-model="homepage.featuredServerCount" type="number" min="1" class="module-input" :disabled="!canEdit" />
        </label>

        <div class="editor-actions editor-full">
          <button type="submit" class="command-btn command-btn--primary" :disabled="!canEdit">保存首页配置</button>
        </div>
      </form>
    </CommandPanel>

    <CommandPanel title="接口与同步配置" subtitle="INTEGRATION">
      <form class="editor-grid" @submit.prevent="saveIntegration">
        <label class="editor-full">
          <span>皮肤站 API 基地址</span>
          <input v-model="integration.skinSiteApiBase" class="module-input" :disabled="!canEdit" />
        </label>
        <label class="editor-full">
          <span>服务器状态 API 基地址</span>
          <input v-model="integration.serverStatusApiBase" class="module-input" :disabled="!canEdit" />
        </label>
        <label>
          <span>玩家同步 Cron</span>
          <input v-model="integration.playerSyncCron" class="module-input" :disabled="!canEdit" />
        </label>
        <label>
          <span>请求超时（毫秒）</span>
          <input v-model="integration.requestTimeoutMs" type="number" min="1000" class="module-input" :disabled="!canEdit" />
        </label>

        <div class="editor-actions editor-full">
          <button type="submit" class="command-btn command-btn--primary" :disabled="!canEdit">保存接口配置</button>
        </div>
      </form>
    </CommandPanel>
  </div>
</template>

<script setup>
import { onMounted, reactive, computed } from 'vue'
import CommandPanel from '../../components/ui/CommandPanel.vue'
import {
  fetchSystemSettings,
  resetSettingsToDefault,
  saveHomepageSettings,
  saveIntegrationSettings,
  saveSiteSettings,
} from '../../services/settingsService'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const canEdit = computed(() => auth.hasPermission('settings:update') || auth.hasPermission('settings:*') || auth.hasPermission('*'))

const site = reactive({
  id: 1,
  siteName: '',
  siteSubtitle: '',
  contactEmail: '',
  maintenanceMode: false,
  aboutAutoSync: true,
})

const homepage = reactive({
  id: 1,
  heroTitle: '',
  heroSubtitle: '',
  announcementText: '',
  featuredNewsCount: 3,
  featuredServerCount: 2,
})

const integration = reactive({
  id: 1,
  skinSiteApiBase: '',
  serverStatusApiBase: '',
  playerSyncCron: '',
  requestTimeoutMs: 5000,
})

async function load() {
  const data = await fetchSystemSettings()
  Object.assign(site, data.site)
  Object.assign(homepage, data.homepage)
  Object.assign(integration, data.integration)
}

async function saveSite() {
  if (!canEdit.value) return
  await saveSiteSettings(site, auth.state.user?.name || '系统')
  window.alert('站点配置已保存')
}

async function saveHomepage() {
  if (!canEdit.value) return
  await saveHomepageSettings(homepage, auth.state.user?.name || '系统')
  window.alert('首页配置已保存')
}

async function saveIntegration() {
  if (!canEdit.value) return
  await saveIntegrationSettings(integration, auth.state.user?.name || '系统')
  window.alert('接口配置已保存')
}

async function resetAll() {
  if (!canEdit.value) return
  const ok = window.confirm('确认恢复系统设置默认值吗？')
  if (!ok) return

  const data = await resetSettingsToDefault(auth.state.user?.name || '系统')
  Object.assign(site, data.site)
  Object.assign(homepage, data.homepage)
  Object.assign(integration, data.integration)
  window.alert('已恢复默认设置')
}

onMounted(load)
</script>
