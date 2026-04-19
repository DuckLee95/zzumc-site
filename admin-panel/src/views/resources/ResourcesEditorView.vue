<template>
  <div class="module-page">
    <CommandPanel :title="isEdit ? '编辑资源' : '新建资源'" subtitle="RESOURCE EDITOR">
      <form class="editor-grid" @submit.prevent="submit">
        <label>
          <span>资源名称</span>
          <input v-model="form.title" class="module-input" placeholder="请输入资源名称" required />
        </label>
        <label>
          <span>类型</span>
          <select v-model="form.type" class="module-input">
            <option value="modpack">整合包</option>
            <option value="resource-pack">资源包</option>
            <option value="patch">补丁</option>
            <option value="doc">文档</option>
          </select>
        </label>
        <label>
          <span>来源平台</span>
          <input v-model="form.provider" class="module-input" placeholder="例如：校内云盘" required />
        </label>
        <label>
          <span>排序</span>
          <input v-model="form.order" type="number" class="module-input" :disabled="!isEdit && form.insertFirst" required />
        </label>
        <label v-if="!isEdit" class="editor-checkbox">
          <input v-model="form.insertFirst" type="checkbox" />
          <span>插入为列表首项（自动设置为第 1 项）</span>
        </label>
        <label>
          <span>链接地址</span>
          <input v-model="form.url" class="module-input" placeholder="请输入可访问的下载链接" required />
        </label>
        <label>
          <span>状态</span>
          <select v-model="form.status" class="module-input">
            <option value="enabled">启用</option>
            <option value="disabled">停用</option>
          </select>
        </label>
        <label class="editor-full">
          <span>简介</span>
          <textarea
            v-model="form.summary"
            class="module-input module-textarea"
            placeholder="请输入资源简介"
          ></textarea>
        </label>

        <div class="editor-actions editor-full">
          <button type="submit" class="command-btn command-btn--primary">保存</button>
          <RouterLink to="/resources" class="command-btn">返回列表</RouterLink>
        </div>
      </form>
    </CommandPanel>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommandPanel from '../../components/ui/CommandPanel.vue'
import { fetchResourceById, saveResource } from '../../services/resourcesService'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => Boolean(route.params.id))

const form = reactive({
  id: null,
  title: '',
  type: 'modpack',
  provider: '校内云盘',
  status: 'enabled',
  order: 1,
  url: '',
  summary: '',
  insertFirst: false,
})

async function load() {
  if (!isEdit.value) return
  const data = await fetchResourceById(route.params.id)
  if (!data) return
  Object.assign(form, data)
}

async function submit() {
  if (!isEdit.value && form.insertFirst) {
    form.order = 1
  }
  await saveResource(form)
  router.replace('/resources')
}

onMounted(load)
</script>
