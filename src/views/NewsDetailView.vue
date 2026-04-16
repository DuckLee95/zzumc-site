<template>
  <div class="news-detail-page">
    <div class="container news-detail-container" v-if="news">
      <div class="news-detail-topbar">
        <RouterLink class="news-back-link" to="/news">
          ← 返回新闻列表
        </RouterLink>
      </div>

      <article class="news-detail-article pixel-panel">
        <div class="news-detail-meta">
          <span class="news-meta-chip" :class="news.tagClass">{{ news.tag }}</span>
          <span class="news-meta-date">{{ news.date }}</span>
        </div>

        <h1>{{ news.title }}</h1>
        <p class="news-detail-lead">{{ news.desc }}</p>

        <div class="news-detail-cover" v-if="news.cover">
          <img :src="news.cover" :alt="news.title" />
        </div>

        <div class="news-detail-content">
          <template v-for="(block, index) in news.content" :key="index">
            <p v-if="block.type === 'paragraph'" class="news-detail-paragraph">
              {{ block.text }}
            </p>

            <div v-else-if="block.type === 'list'" class="news-detail-list-block">
              <h3>{{ block.title }}</h3>
              <ul>
                <li v-for="(item, idx) in block.items" :key="idx">
                  {{ item }}
                </li>
              </ul>
            </div>
          </template>
        </div>
      </article>

      <div class="news-detail-bottom-nav">
        <RouterLink class="pixel-btn pixel-btn-dark" to="/news">
          返回新闻列表
        </RouterLink>
        <RouterLink class="pixel-btn pixel-btn-primary" to="/">
          返回主页面
        </RouterLink>
      </div>
    </div>

    <div class="container news-detail-container" v-else>
      <div class="news-detail-empty pixel-panel">
        <h1>未找到该新闻</h1>
        <p>这篇公告可能不存在，或者链接有误。</p>
        <RouterLink class="pixel-btn pixel-btn-primary" to="/news">
          返回新闻列表
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getNewsBySlug } from '../data/news'

const route = useRoute()

const news = computed(() => getNewsBySlug(route.params.slug))
</script>