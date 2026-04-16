<template>
  <div class="news-page news-page-mc">
    <div class="container news-page-container">
      <div class="news-topbar">
        <RouterLink class="news-back-link" to="/">
          ← 返回主页面
        </RouterLink>
      </div>

      <section class="news-feature-block" v-if="hasFeatured">
        <div class="news-feature-layout">
          <RouterLink
            v-if="featured.main"
            :to="`/news/${featured.main.slug}`"
            class="news-visual-card featured-main"
          >
            <img
              v-if="featured.main.cover"
              :src="featured.main.cover"
              :alt="featured.main.title"
              class="news-card-image"
              :style="imageStyle(featured.main)"
            />
            <div class="news-card-overlay">
              <div class="news-card-meta">
                <span class="news-card-category">{{ featured.main.category }}</span>
                <span class="news-card-date">{{ featured.main.publishedAt }}</span>
              </div>
              <h3>{{ featured.main.title }}</h3>
              <p class="news-card-summary">{{ featured.main.summary }}</p>
            </div>
          </RouterLink>

          <div class="featured-side-column">
            <RouterLink
              v-if="featured['side-top']"
              :to="`/news/${featured['side-top'].slug}`"
              class="news-visual-card featured-side-top"
            >
              <img
                v-if="featured['side-top'].cover"
                :src="featured['side-top'].cover"
                :alt="featured['side-top'].title"
                class="news-card-image"
                :style="imageStyle(featured['side-top'])"
              />
              <div class="news-card-overlay">
                <div class="news-card-meta">
                  <span class="news-card-category">{{ featured['side-top'].category }}</span>
                  <span class="news-card-date">{{ featured['side-top'].publishedAt }}</span>
                </div>
                <h3>{{ featured['side-top'].title }}</h3>
                <p class="news-card-summary">{{ featured['side-top'].summary }}</p>
              </div>
            </RouterLink>

            <div class="featured-bottom-grid">
              <RouterLink
                v-if="featured['side-bottom-left']"
                :to="`/news/${featured['side-bottom-left'].slug}`"
                class="news-visual-card featured-small"
              >
                <img
                  v-if="featured['side-bottom-left'].cover"
                  :src="featured['side-bottom-left'].cover"
                  :alt="featured['side-bottom-left'].title"
                  class="news-card-image"
                  :style="imageStyle(featured['side-bottom-left'])"
                />
                <div class="news-card-overlay">
                  <div class="news-card-meta">
                    <span class="news-card-category">{{ featured['side-bottom-left'].category }}</span>
                  </div>
                  <h3>{{ featured['side-bottom-left'].title }}</h3>
                  <p class="news-card-summary">{{ featured['side-bottom-left'].summary }}</p>
                </div>
              </RouterLink>

              <RouterLink
                v-if="featured['side-bottom-right']"
                :to="`/news/${featured['side-bottom-right'].slug}`"
                class="news-visual-card featured-small"
              >
                <img
                  v-if="featured['side-bottom-right'].cover"
                  :src="featured['side-bottom-right'].cover"
                  :alt="featured['side-bottom-right'].title"
                  class="news-card-image"
                  :style="imageStyle(featured['side-bottom-right'])"
                />
                <div class="news-card-overlay">
                  <div class="news-card-meta">
                    <span class="news-card-category">{{ featured['side-bottom-right'].category }}</span>
                  </div>
                  <h3>{{ featured['side-bottom-right'].title }}</h3>
                  <p class="news-card-summary">{{ featured['side-bottom-right'].summary }}</p>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      <section class="news-feed-block">
        <div class="news-feed-head">
          <div>
            <h2>全部新闻</h2>
            <p>按时间排序，支持标签筛选。</p>
          </div>
        </div>

        <div class="news-filter-row">
          <label class="news-filter-label" for="news-tag-select">标签筛选</label>
          <select
            id="news-tag-select"
            v-model="selectedTag"
            class="news-filter-select"
          >
            <option v-for="tag in tags" :key="tag" :value="tag">
              {{ tag }}
            </option>
          </select>
        </div>

        <div class="news-feed-grid">
          <RouterLink
            v-for="item in filteredNews"
            :key="item.slug"
            :to="`/news/${item.slug}`"
            class="news-visual-card news-feed-card"
          >
            <img
              v-if="item.cover"
              :src="item.cover"
              :alt="item.title"
              class="news-card-image"
              :style="imageStyle(item)"
            />
            <div class="news-card-overlay">
              <div class="news-card-meta">
                <span class="news-card-category">{{ item.category }}</span>
                <span class="news-card-date">{{ item.publishedAt }}</span>
              </div>
              <h3>{{ item.title }}</h3>
              <p class="news-card-summary">{{ item.summary }}</p>
            </div>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  fetchNewsPageLayout,
  fetchNewsTags,
} from '../lib/newsSource'

const allNews = ref([])
const featured = ref({
  main: null,
  'side-top': null,
  'side-bottom-left': null,
  'side-bottom-right': null,
})
const tags = ref(['全部'])
const selectedTag = ref('全部')

const hasFeatured = computed(() =>
  Object.values(featured.value).some(Boolean)
)

const filteredNews = computed(() => {
  return allNews.value.filter((item) => {
    return selectedTag.value === '全部' || item.tags.includes(selectedTag.value)
  })
})

function imageStyle(item) {
  return {
    objectFit: item.imageFit || 'cover',
    objectPosition: item.imagePosition || 'center center',
  }
}

onMounted(async () => {
  const [{ featured: featuredLayout, all }, allTags] = await Promise.all([
    fetchNewsPageLayout(),
    fetchNewsTags(),
  ])

  featured.value = featuredLayout
  allNews.value = all
  tags.value = allTags
})
</script>