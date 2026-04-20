<template>
  <div class="module-page">
    <CommandPanel title="新闻管理" subtitle="NEWS MANAGEMENT">
      <div class="module-toolbar">
        <input v-model="keyword" class="module-input" type="text" placeholder="按标题或作者搜索" />
        <RouterLink class="command-btn command-btn--primary" to="/news/create">新建新闻</RouterLink>
      </div>

      <div class="module-table-wrap">
        <table class="module-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>分类</th>
              <th>作者</th>
              <th>状态</th>
              <th>更新时间</th>
              <th class="action-col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredNews" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.author }}</td>
              <td>
                <span class="status-chip" :class="item.status === 'published' ? 'is-online' : 'is-offline'">
                  {{ item.status === 'published' ? '已发布' : '草稿' }}
                </span>
              </td>
              <td>{{ item.updatedAt }}</td>
              <td class="action-col">
                <div class="table-actions">
                  <RouterLink class="text-link" :to="`/news/${item.id}/edit`">编辑</RouterLink>
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
import { deleteNews, fetchNewsList } from '../../services/newsService'

const list = ref([])
const keyword = ref('')

const filteredNews = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  if (!query) return list.value
  return list.value.filter((item) => {
    return String(item.title).toLowerCase().includes(query) || String(item.author).toLowerCase().includes(query)
  })
})

async function load() {
  list.value = await fetchNewsList()
}

async function remove(id) {
  await deleteNews(id)
  await load()
}

onMounted(load)
</script>
