<template>
  <div class="module-page">
    <CommandPanel :title="isEdit ? '编辑文档' : '新建文档'" subtitle="DOCS EDITOR">
      <form class="editor-grid" @submit.prevent="submit">
        <label>
          <span>标题</span>
          <input v-model="form.title" class="module-input" placeholder="请输入文档标题，例如：加入服务器" required />
        </label>
        <label>
          <span>分组</span>
          <input v-model="form.group" class="module-input" placeholder="请输入文档分组，例如：新手指南" required />
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
          <span>Slug</span>
          <input v-model="form.slug" class="module-input" placeholder="请输入唯一标识字符串，例如：join-server" required />
        </label>
        <label>
          <span>作者</span>
          <input v-model="form.author" class="module-input" placeholder="请输入作者名称" required />
        </label>
        <label>
          <span>状态</span>
          <select v-model="form.status" class="module-input">
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
          </select>
        </label>
        <label class="editor-full">
          <span>简介</span>
          <textarea
            v-model="form.description"
            class="module-input module-textarea"
            placeholder="请输入文档简介"
          ></textarea>
        </label>
        <label class="editor-full">
          <span>正文（Markdown）</span>
          <textarea
            v-model="form.content"
            class="module-input module-textarea module-textarea--large"
            placeholder="请输入 Markdown 正文内容"
          ></textarea>
        </label>

        <div class="editor-actions editor-full">
          <button type="submit" class="command-btn command-btn--primary">保存</button>
          <RouterLink to="/docs" class="command-btn">返回列表</RouterLink>
        </div>
      </form>
    </CommandPanel>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommandPanel from '../../components/ui/CommandPanel.vue'
import { fetchDocById, saveDoc } from '../../services/docsService'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => Boolean(route.params.id))

const form = reactive({
  id: null,
  title: '',
  group: '',
  order: 1,
  slug: '',
  author: '',
  status: 'draft',
  description: '',
  content: '',
  insertFirst: false,
})

async function load() {
  if (!isEdit.value) return
  const data = await fetchDocById(route.params.id)
  if (!data) return
  Object.assign(form, data)
}

async function submit() {
  if (!isEdit.value && form.insertFirst) {
    form.order = 1
  }
  await saveDoc(form)
  router.replace('/docs')
}

onMounted(load)
</script>
