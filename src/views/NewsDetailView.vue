<template>
  <div class="news-detail-page article-news-page page-shell page-shell--article" v-if="news">
    <div class="news-detail-cover-hero" v-if="news.cover">
      <img
        :src="news.cover"
        :alt="news.title"
        :style="{
          objectFit: news.detailImageFit || 'contain',
          objectPosition: news.detailImagePosition || 'center center'
        }"
      />
      <div class="news-detail-cover-mask"></div>
    </div>

    <div class="container news-detail-container">
      <div class="news-detail-topbar page-topbar">
        <RouterLink class="page-back-link" to="/news">
          ← 返回新闻列表
        </RouterLink>
      </div>

      <div class="news-detail-layout">
        <!-- 左侧作者栏 -->
        <aside class="news-author-sidebar pixel-panel">
          <div class="news-author-card">
            <div class="news-author-avatar-wrap">
              <img
                class="news-author-avatar"
                :src="news.authorAvatar"
                :alt="news.author"
              />
            </div>

            <div class="news-author-meta">
              <p class="news-author-kicker">作者</p>
              <h3>{{ news.author }}</h3>
            </div>

            <div class="news-author-info-list">
              <div class="news-author-info-item">
                <span class="news-author-info-label">发布日期</span>
                <strong>{{ news.publishedAt }}</strong>
              </div>

              <div class="news-author-info-item">
                <span class="news-author-info-label">分类</span>
                <strong>{{ news.category }}</strong>
              </div>

              <div
                v-if="news.tags && news.tags.length"
                class="news-author-info-item news-author-tags-wrap"
              >
                <span class="news-author-info-label">标签</span>
                <div class="news-author-tags">
                  <span
                    v-for="tag in news.tags"
                    :key="tag"
                    class="news-author-tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- 右侧正文 -->
        <main class="news-article-main pixel-panel">
          <article class="news-article-content">
            <div class="news-article-head">
              <h1>{{ news.title }}</h1>

              <p class="news-article-summary">
                {{ news.summary }}
              </p>
            </div>

            <div class="news-article-body" v-html="news.html"></div>
          </article>
        </main>
      </div>
    </div>
  </div>

  <div class="news-detail-page article-news-page page-shell page-shell--article" v-else>
    <div class="container news-detail-container">
      <div class="news-detail-topbar page-topbar">
        <RouterLink class="page-back-link" to="/news">
          ← 返回新闻列表
        </RouterLink>
      </div>

      <div class="news-detail-empty pixel-panel">
        <h1>未找到新闻</h1>
        <p>这篇文章可能不存在，或者链接有误。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { fetchNewsBySlug } from '../lib/newsSource'

const route = useRoute()
const news = ref(null)

watchEffect(async () => {
  const slug = String(route.params.slug || '')
  if (!slug) {
    news.value = null
    return
  }

  news.value = await fetchNewsBySlug(slug)
})
</script>
