<template>
  <section id="news" class="section section-dark homepage-news-section">
    <div class="container home-wide-container">
      <div class="section-heading center">
        <p class="section-kicker">NEWS</p>
        <h2>最新消息</h2>

        <RouterLink class="centered-view-all-news" to="/news">
          查看全部新闻
        </RouterLink>
      </div>

      <div class="home-news-layout">
        <RouterLink
          v-for="item in homeNews"
          :key="item.slug"
          :to="`/news/${item.slug}`"
          class="home-news-card media-card"
        >
          <img
            v-if="item.cover"
            :src="item.cover"
            :alt="item.title"
            class="media-card__image"
            :style="{
              objectFit: item.imageFit || 'cover',
              objectPosition: item.imagePosition || 'center center'
            }"
          />

          <div class="media-card__overlay">
            <div class="media-card__meta">
              <span class="media-card__badge">{{ item.category }}</span>
            </div>

            <h3 class="media-card__title">{{ item.title }}</h3>

            <p class="media-card__summary">
              {{ item.summary }}
            </p>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { fetchHomeNews } from '../../lib/newsSource'

const homeNews = ref([])

onMounted(async () => {
  homeNews.value = await fetchHomeNews()
})
</script>
