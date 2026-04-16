<template>
  <div class="news-page upgraded-news-page">
    <div class="container news-page-container">
      <div class="news-topbar">
        <RouterLink class="news-back-link" to="/">
          ← 返回主页面
        </RouterLink>
      </div>

      <div class="news-hero pixel-panel">
        <div class="news-hero-main">
          <p class="section-kicker">NEWS CENTER</p>
          <h1>最新消息</h1>
          <p class="news-hero-desc">
            这里是郑爱玩MC的新闻中心。你可以在这里查看活动预告、版本更新、
            社团动态和重要通知。
          </p>

          <div class="news-hero-tags">
            <span class="news-hero-tag">活动预告</span>
            <span class="news-hero-tag">版本更新</span>
            <span class="news-hero-tag">社团动态</span>
            <span class="news-hero-tag">公告通知</span>
          </div>
        </div>
      </div>

      <div v-if="featuredNews" class="news-featured pixel-panel">
        <div class="news-featured-label">置顶公告</div>

        <div class="news-featured-grid">
          <div class="news-featured-content">
            <p class="news-meta-line">
              <span class="news-meta-chip" :class="featuredNews.tagClass">
                {{ featuredNews.tag }}
              </span>
              <span class="news-meta-date">{{ featuredNews.date }}</span>
            </p>

            <h2>{{ featuredNews.title }}</h2>
            <p class="news-featured-desc">
              {{ featuredNews.desc }}
            </p>

            <div class="news-featured-actions">
              <RouterLink
                class="pixel-btn pixel-btn-primary"
                :to="`/news/${featuredNews.slug}`"
              >
                查看详情
              </RouterLink>

              <RouterLink class="pixel-btn pixel-btn-dark" to="/docs">
                查看相关文档
              </RouterLink>
            </div>
          </div>

          <div class="news-featured-side">
            <div
              v-for="item in sideHighlights"
              :key="item.slug"
              class="news-highlight-card"
            >
              <p class="news-highlight-kicker">{{ item.tag }}</p>
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>

              <div class="news-highlight-actions">
                <RouterLink
                  class="news-highlight-link-button"
                  :to="`/news/${item.slug}`"
                >
                  查看详情
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="news-main-layout">
        <div class="news-list-column">
          <div class="news-list-head">
            <h2>新闻列表</h2>
            <p>点击“查看详情”即可进入单篇新闻正文页。</p>
          </div>

          <div class="news-list">
            <article
              v-for="item in newsList"
              :key="item.id"
              class="news-item-card pixel-panel"
            >
              <div class="news-item-top">
                <div class="news-item-meta">
                  <span class="news-meta-chip" :class="item.tagClass">
                    {{ item.tag }}
                  </span>
                  <span class="news-meta-date">{{ item.date }}</span>
                </div>
              </div>

              <h3>{{ item.title }}</h3>
              <p class="news-item-desc">{{ item.desc }}</p>

              <div class="news-item-footer">
                <RouterLink
                  class="news-readmore-button"
                  :to="`/news/${item.slug}`"
                >
                  查看详情
                </RouterLink>
              </div>
            </article>
          </div>
        </div>

        <aside class="news-sidebar">
          <div class="news-side-panel pixel-panel">
            <h3>消息分类</h3>
            <div class="news-side-tags">
              <a href="#">全部</a>
              <a href="#">活动预告</a>
              <a href="#">版本更新</a>
              <a href="#">公告通知</a>
              <a href="#">社团动态</a>
            </div>
          </div>

          <div class="news-side-panel pixel-panel">
            <h3>归档</h3>
            <ul class="news-archive-list">
              <li><a href="#">2026 年 4 月</a></li>
              <li><a href="#">2026 年 3 月</a></li>
              <li><a href="#">2026 年 2 月</a></li>
            </ul>
          </div>

          <div class="news-side-panel pixel-panel">
            <h3>快速入口</h3>
            <div class="news-quick-links">
              <RouterLink to="/docs">帮助文档</RouterLink>
              <RouterLink to="/downloads">资源下载</RouterLink>
              <RouterLink to="/contact">联系我们</RouterLink>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { newsList } from '../data/news'

const featuredNews = newsList[0]
const sideHighlights = newsList.slice(1, 3)
</script>