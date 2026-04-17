<template>
  <div class="downloads-page upgraded-downloads-page page-shell">
    <div class="container downloads-page-container">
      <div class="downloads-topbar page-topbar">
        <RouterLink class="page-back-link" to="/">
          ← 返回主页面
        </RouterLink>
      </div>

      <div class="downloads-hero pixel-panel page-hero-block">
        <p class="section-kicker">DOWNLOAD CENTER</p>
        <h1>资源下载</h1>
        <p class="downloads-hero-desc page-hero-desc">
          这里集中提供客户端整合包、资源包、补丁文件和安装说明文档。
          后面你也可以继续扩展成真正的版本中心和下载仓库。
        </p>

        <div class="downloads-hero-tags">
          <span class="downloads-hero-tag">整合包</span>
          <span class="downloads-hero-tag">资源包</span>
          <span class="downloads-hero-tag">补丁文件</span>
          <span class="downloads-hero-tag">说明文档</span>
        </div>
      </div>

      <div class="downloads-featured pixel-panel">
        <div class="downloads-featured-label">推荐下载</div>

        <div class="downloads-featured-grid">
          <div class="downloads-featured-content">
            <p class="downloads-meta-line">
              <span class="downloads-meta-chip green">推荐</span>
              <span class="downloads-meta-date">v1.0</span>
            </p>

            <h2>客户端整合包</h2>
            <p class="downloads-featured-desc">
              适合第一次加入的成员使用。整合包会统一包含推荐模组、
              基础配置和必要文件，方便快速完成环境搭建。
            </p>

            <div class="downloads-featured-meta">
              <div class="downloads-meta-box">
                <span class="meta-key">适用版本</span>
                <strong>1.20.1 Forge</strong>
              </div>
              <div class="downloads-meta-box">
                <span class="meta-key">文件大小</span>
                <strong>待填写</strong>
              </div>
              <div class="downloads-meta-box">
                <span class="meta-key">更新时间</span>
                <strong>2026-04-16</strong>
              </div>
            </div>

            <div class="downloads-featured-actions">
              <a class="pixel-btn pixel-btn-primary" href="#">立即下载</a>
              <RouterLink class="pixel-btn pixel-btn-dark" to="/docs/install-client">
                查看安装教程
              </RouterLink>
            </div>
          </div>

          <div class="downloads-featured-side">
            <div class="downloads-highlight-card">
              <p class="downloads-highlight-kicker">安装提示</p>
              <h3>先看文档再下载</h3>
              <p>第一次安装建议先阅读帮助文档，避免版本和 Java 环境不匹配。</p>
            </div>

            <div class="downloads-highlight-card">
              <p class="downloads-highlight-kicker">版本说明</p>
              <h3>统一使用推荐版本</h3>
              <p>下载前请确认你使用的是对应版本客户端与资源文件。</p>
            </div>
          </div>
        </div>
      </div>

      <div class="downloads-main-layout">
        <div class="downloads-list-column">
          <div class="downloads-list-head">
            <h2>资源列表</h2>
            <p>下面这些卡片后面都可以接成真实直链。</p>
          </div>

          <div class="downloads-grid">
            <article
              v-for="item in downloadItems"
              :key="item.id"
              class="downloads-item-card pixel-panel"
            >
              <div class="downloads-item-top">
                <div class="downloads-item-meta">
                  <span class="downloads-meta-chip" :class="item.tagClass">
                    {{ item.tag }}
                  </span>
                  <span class="downloads-meta-date">{{ item.version }}</span>
                </div>
              </div>

              <h3>{{ item.title }}</h3>
              <p class="downloads-item-desc">{{ item.desc }}</p>

              <div class="downloads-item-extra">
                <span>适用：{{ item.target }}</span>
                <span>大小：{{ item.size }}</span>
              </div>

              <div class="downloads-item-footer">
                <a
                  class="downloads-action-button"
                  :href="item.link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {{ item.actionText }}
                </a>
              </div>
            </article>
          </div>
        </div>

        <aside class="downloads-sidebar page-sidebar-stack">
          <div class="downloads-side-panel page-side-panel pixel-panel">
            <h3>下载分类</h3>
            <div class="downloads-side-tags page-tag-list">
              <a href="#">全部</a>
              <a href="#">整合包</a>
              <a href="#">资源包</a>
              <a href="#">补丁</a>
              <a href="#">文档</a>
            </div>
          </div>

          <div class="downloads-side-panel page-side-panel pixel-panel">
            <h3>下载须知</h3>
            <ul class="downloads-note-list page-note-list">
              <li>下载前先确认游戏版本。</li>
              <li>整合包建议配合帮助文档使用。</li>
              <li>补丁文件请按说明覆盖或导入。</li>
              <li>如有报错，优先查看 FAQ。</li>
            </ul>
          </div>

          <div class="downloads-side-panel page-side-panel pixel-panel">
            <h3>快速入口</h3>
            <div class="downloads-quick-links page-link-stack">
              <RouterLink to="/docs">帮助文档</RouterLink>
              <RouterLink to="/news">最新消息</RouterLink>
              <RouterLink to="/contact">联系我们</RouterLink>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
const downloadItems = [
  {
    id: 1,
    tag: '整合包',
    tagClass: 'green',
    version: 'v1.0',
    title: '客户端整合包',
    desc: '适合第一次加入的成员，包含推荐模组、基础配置和必要文件。',
    target: '1.20.1 Forge',
    size: '待填写',
    link: '#',
    actionText: '立即下载',
  },
  {
    id: 2,
    tag: '资源包',
    tagClass: 'stone',
    version: 'v1.0',
    title: '服务器资源包',
    desc: '包含贴图、部分 UI 资源与社团服务器专用视觉内容。',
    target: '1.20.1',
    size: '待填写',
    link: '#',
    actionText: '下载资源包',
  },
  {
    id: 3,
    tag: '补丁',
    tagClass: 'gold',
    version: 'Patch 01',
    title: '兼容性补丁',
    desc: '用于修复部分环境下的模组冲突或资源加载问题。',
    target: '指定版本',
    size: '待填写',
    link: '#',
    actionText: '下载补丁',
  },
  {
    id: 4,
    tag: '文档',
    tagClass: 'green',
    version: 'PDF',
    title: '安装说明文档',
    desc: '适合第一次安装整合包的新成员，内含安装流程与注意事项。',
    target: '通用',
    size: '待填写',
    link: '#',
    actionText: '查看文档',
  },
]
</script>
