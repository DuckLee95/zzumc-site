<template>
  <div class="downloads-page upgraded-downloads-page page-shell">
    <div class="container downloads-page-container">
      <div class="downloads-topbar page-topbar">
        <RouterLink class="page-back-link" to="/"> ← 返回首页 </RouterLink>
      </div>

      <template v-if="pageData">
        <div class="downloads-hero pixel-panel page-hero-block">
          <p class="section-kicker">{{ pageData.hero.kicker }}</p>
          <h1>{{ pageData.hero.title }}</h1>
          <p class="downloads-hero-desc page-hero-desc">
            {{ pageData.hero.description }}
          </p>

          <div class="downloads-hero-tags">
            <span v-for="tag in pageData.hero.tags" :key="tag" class="downloads-hero-tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <section v-if="featuredItem" class="downloads-featured pixel-panel">
          <div class="downloads-featured-label">{{ pageData.featuredLabel }}</div>

          <div class="downloads-featured-grid">
            <div class="downloads-featured-content">
              <p class="downloads-meta-line">
                <span class="downloads-meta-chip green">推荐</span>
                <span class="downloads-meta-chip" :class="featuredItem.categoryClass">
                  {{ featuredItem.categoryLabel }}
                </span>
                <span class="downloads-meta-date">{{ featuredItem.version }}</span>
              </p>

              <h2>{{ featuredItem.title }}</h2>
              <p class="downloads-featured-desc">{{ featuredItem.summary }}</p>

              <div class="downloads-featured-meta">
                <div class="downloads-meta-box">
                  <span class="meta-key">适用版本</span>
                  <strong>{{ featuredItem.target }}</strong>
                </div>
                <div class="downloads-meta-box">
                  <span class="meta-key">文件大小</span>
                  <strong>{{ featuredItem.size }}</strong>
                </div>
                <div class="downloads-meta-box">
                  <span class="meta-key">更新时间</span>
                  <strong>{{ featuredItem.updatedAt }}</strong>
                </div>
              </div>

              <div class="downloads-featured-actions">
                <RouterLink
                  v-if="featuredItem.primaryAction.kind === 'route'"
                  class="pixel-btn pixel-btn-primary"
                  :to="featuredItem.primaryAction.target"
                >
                  {{ featuredItem.primaryAction.text }}
                </RouterLink>

                <a
                  v-else-if="featuredItem.primaryAction.kind === 'link'"
                  class="pixel-btn pixel-btn-primary"
                  :href="featuredItem.primaryAction.target"
                  :target="featuredItem.primaryAction.newTab ? '_blank' : undefined"
                  :rel="featuredItem.primaryAction.newTab ? 'noreferrer' : undefined"
                >
                  {{ featuredItem.primaryAction.text }}
                </a>

                <span v-else class="pixel-btn pixel-btn-primary is-disabled">
                  {{ featuredItem.primaryAction.pendingText }}
                </span>

                <RouterLink
                  v-if="featuredItem.secondaryAction?.kind === 'route'"
                  class="pixel-btn pixel-btn-dark"
                  :to="featuredItem.secondaryAction.target"
                >
                  {{ featuredItem.secondaryAction.text }}
                </RouterLink>

                <a
                  v-else-if="featuredItem.secondaryAction?.kind === 'link'"
                  class="pixel-btn pixel-btn-dark"
                  :href="featuredItem.secondaryAction.target"
                  :target="featuredItem.secondaryAction.newTab ? '_blank' : undefined"
                  :rel="featuredItem.secondaryAction.newTab ? 'noreferrer' : undefined"
                >
                  {{ featuredItem.secondaryAction.text }}
                </a>
              </div>
            </div>

            <div v-if="pageData.featuredHighlights.length" class="downloads-featured-side">
              <div
                v-for="highlight in pageData.featuredHighlights"
                :key="highlight.id"
                class="downloads-highlight-card"
              >
                <p class="downloads-highlight-kicker">{{ highlight.kicker }}</p>
                <h3>{{ highlight.title }}</h3>
                <p>{{ highlight.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <div class="downloads-main-layout">
          <div class="downloads-list-column">
            <div class="downloads-list-head">
              <div>
                <h2>资源列表</h2>
                <p>{{ pageData.listDescription }}</p>
              </div>
              <p class="downloads-list-summary">{{ listSummary }}</p>
            </div>

            <div class="downloads-list-toolbar">
              <label class="downloads-search-wrap" for="downloads-search">
                <span class="downloads-search-label">资源搜索</span>
                <input
                  id="downloads-search"
                  v-model="keyword"
                  class="downloads-search-input"
                  type="text"
                  :placeholder="pageData.searchPlaceholder"
                />
              </label>

              <div class="downloads-filter-block">
                <p class="downloads-filter-title">下载分类</p>
                <div class="downloads-filter-list">
                  <button
                    v-for="category in categoryOptions"
                    :key="category.id"
                    type="button"
                    class="downloads-filter-button"
                    :class="{ active: selectedCategory === category.id }"
                    @click="selectCategory(category.id)"
                  >
                    <span>{{ category.label }}</span>
                    <span class="downloads-filter-count">{{ category.count }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="filteredItems.length" class="downloads-grid">
              <article
                v-for="item in filteredItems"
                :key="item.id"
                class="downloads-item-card pixel-panel"
              >
                <div class="downloads-item-top">
                  <div class="downloads-item-meta">
                    <span class="downloads-meta-chip" :class="item.categoryClass">
                      {{ item.categoryLabel }}
                    </span>
                    <span class="downloads-meta-date">{{ item.version }}</span>
                  </div>

                  <span v-if="item.featured" class="downloads-item-flag"> 推荐 </span>
                </div>

                <h3>{{ item.title }}</h3>
                <p class="downloads-item-desc">{{ item.summary }}</p>

                <div class="downloads-item-details">
                  <div class="downloads-item-detail">
                    <span>适用版本</span>
                    <strong>{{ item.target }}</strong>
                  </div>
                  <div class="downloads-item-detail">
                    <span>文件大小</span>
                    <strong>{{ item.size }}</strong>
                  </div>
                  <div class="downloads-item-detail">
                    <span>更新时间</span>
                    <strong>{{ item.updatedAt }}</strong>
                  </div>
                </div>

                <div class="downloads-item-footer">
                  <RouterLink
                    v-if="item.primaryAction.kind === 'route'"
                    class="downloads-action-button"
                    :to="item.primaryAction.target"
                  >
                    {{ item.primaryAction.text }}
                  </RouterLink>

                  <a
                    v-else-if="item.primaryAction.kind === 'link'"
                    class="downloads-action-button"
                    :href="item.primaryAction.target"
                    :target="item.primaryAction.newTab ? '_blank' : undefined"
                    :rel="item.primaryAction.newTab ? 'noreferrer' : undefined"
                  >
                    {{ item.primaryAction.text }}
                  </a>

                  <span v-else class="downloads-action-button is-disabled">
                    {{ item.primaryAction.pendingText }}
                  </span>

                  <RouterLink
                    v-if="item.secondaryAction?.kind === 'route'"
                    class="downloads-secondary-link"
                    :to="item.secondaryAction.target"
                  >
                    {{ item.secondaryAction.text }}
                  </RouterLink>

                  <a
                    v-else-if="item.secondaryAction?.kind === 'link'"
                    class="downloads-secondary-link"
                    :href="item.secondaryAction.target"
                    :target="item.secondaryAction.newTab ? '_blank' : undefined"
                    :rel="item.secondaryAction.newTab ? 'noreferrer' : undefined"
                  >
                    {{ item.secondaryAction.text }}
                  </a>
                </div>
              </article>
            </div>

            <div v-else class="downloads-empty-state pixel-panel">
              <h3>没有找到匹配资源</h3>
              <p>换个关键词，或者切换下载分类后再试。</p>
              <button type="button" class="downloads-reset-button" @click="resetFilters">
                清空筛选
              </button>
            </div>
          </div>

          <aside class="downloads-sidebar page-sidebar-stack">
            <div class="downloads-side-panel page-side-panel pixel-panel">
              <h3>下载须知</h3>
              <ul class="downloads-note-list page-note-list">
                <li v-for="note in pageData.notes" :key="note">
                  {{ note }}
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ALL_DOWNLOAD_CATEGORY, fetchDownloadsPageData } from '../lib/downloadsSource'

const pageData = ref(null)
const keyword = ref('')
const selectedCategory = ref(ALL_DOWNLOAD_CATEGORY)

const categoryOptions = computed(() => pageData.value?.categoryOptions || [])
const featuredItem = computed(() => pageData.value?.featuredItem || null)
const items = computed(() => pageData.value?.items || [])

const filteredItems = computed(() => {
  const query = keyword.value.trim().toLowerCase()

  return items.value.filter((item) => {
    const matchesCategory =
      selectedCategory.value === ALL_DOWNLOAD_CATEGORY || item.category === selectedCategory.value
    const matchesQuery = !query || item.searchText.includes(query)

    return matchesCategory && matchesQuery
  })
})

const listSummary = computed(() => {
  const total = items.value.length

  if (!total) {
    return '暂无资源'
  }

  if (!keyword.value.trim() && selectedCategory.value === ALL_DOWNLOAD_CATEGORY) {
    return `共 ${total} 项资源`
  }

  return `当前显示 ${filteredItems.value.length} / ${total} 项资源`
})

function selectCategory(categoryId) {
  selectedCategory.value = categoryId
}

function resetFilters() {
  keyword.value = ''
  selectedCategory.value = ALL_DOWNLOAD_CATEGORY
}

onMounted(async () => {
  pageData.value = await fetchDownloadsPageData()
})
</script>
