<template>
  <section id="news" class="section section-dark decorated-section homepage-news-section">
    <div class="container home-wide-container">
      <div class="section-heading center news-heading-centered">
        <p class="section-kicker">NEWS</p>
        <h2>最新消息</h2>
        <p>
          这里可以放服务器更新、活动预告、社团动态和版本公告。
        </p>

        <RouterLink class="view-all-news centered-view-all-news" to="/news">
          查看全部新闻
        </RouterLink>
      </div>

      <div class="news-grid homepage-news-grid">
        <article
          v-for="item in homeNews"
          :key="item.id"
          class="news-card pixel-panel homepage-news-card"
          :class="{
            'news-card-green': item.tagClass === 'green',
            'news-card-stone': item.tagClass === 'stone',
            'news-card-gold': item.tagClass === 'gold',
          }"
        >
          <div class="news-card-top">
            <span class="news-tag">{{ item.tag }}</span>
            <span class="news-date">{{ item.date }}</span>
          </div>

          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>

          <RouterLink :to="`/news/${item.slug}`">查看详情</RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { newsList } from '../../data/news'

const homeNews = newsList.slice(0, 3)
</script>