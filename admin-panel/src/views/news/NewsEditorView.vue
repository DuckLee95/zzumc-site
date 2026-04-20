<template>
  <div class="module-page">
    <CommandPanel :title="isEdit ? '编辑新闻' : '新建新闻'" subtitle="NEWS EDITOR">
      <form class="editor-grid" @submit.prevent="submit">
        <label>
          <span>标题</span>
          <input v-model="form.title" class="module-input" placeholder="请输入新闻标题，例如：春季活动预告" required />
        </label>
        <label>
          <span>分类</span>
          <input v-model="form.category" class="module-input" placeholder="请输入新闻分类，例如：活动预告" required />
        </label>
        <label>
          <span>作者</span>
          <input v-model="form.author" class="module-input" placeholder="请输入作者名称，例如：张三" required />
        </label>
        <label>
          <span>Slug</span>
          <input v-model="form.slug" class="module-input" placeholder="请输入唯一标识字符串，例如：spring-event-2026" required />
        </label>
        <label>
          <span>标签（逗号分隔）</span>
          <input v-model="tagText" class="module-input" placeholder="请输入标签，例如：活动, 联机" />
        </label>
        <label>
          <span>状态</span>
          <select v-model="form.status" class="module-input">
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
          </select>
        </label>
        <label class="editor-full">
          <span>摘要</span>
          <textarea
            v-model="form.summary"
            class="module-input module-textarea"
            placeholder="请输入新闻摘要"
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
          <RouterLink to="/news" class="command-btn">返回列表</RouterLink>
        </div>
      </form>
    </CommandPanel>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommandPanel from '../../components/ui/CommandPanel.vue'
import { fetchNewsById, saveNews } from '../../services/newsService'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => Boolean(route.params.id))
const tagText = ref('')

const form = reactive({
  id: null,
  title: '',
  category: '',
  author: '',
  slug: '',
  status: 'draft',
  summary: '',
  content: '',
  tags: [],
  pinned: false,
  featured: false,
  publishedAt: '',
})

async function load() {
  if (!isEdit.value) return
  const data = await fetchNewsById(route.params.id)
  if (!data) return
  Object.assign(form, data)
  tagText.value = Array.isArray(data.tags) ? data.tags.join(', ') : ''
}

async function submit() {
  form.tags = tagText.value
  await saveNews(form)
  router.replace('/news')
}

onMounted(load)
</script>
