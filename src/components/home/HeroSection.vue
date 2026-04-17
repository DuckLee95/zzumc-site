<template>
  <section class="hero-section hero-section-simple hero-section-polished hero-section-clean">
    <div class="hero-bg"></div>
    <div class="hero-mask"></div>
    <div class="hero-grid"></div>
    <div class="hero-noise"></div>
    <div class="hero-vignette"></div>

    <div class="container hero-simple-content">
      <div class="hero-center-block polished-center-block clean-center-block">
        <div class="hero-badge hero-badge-clean">ZHENG AI WAN MC COMMUNITY</div>

        <h1 class="hero-main-title polished-main-title clean-main-title">
          <span class="hero-main-title-top clean-title-top">欢迎来到</span>
          <span class="hero-main-title-bottom clean-title-bottom">郑爱玩MC</span>
        </h1>

        <div class="hero-primary-cta-wrap">
          <RouterLink class="hero-primary-cta" to="/docs/join-server">
            加入我们
          </RouterLink>
        </div>

        <div class="hero-mini-entry-grid polished-entry-grid">
          <RouterLink class="hero-mini-entry polished-mini-entry entry-join" to="/server-info">
            <span class="mini-entry-icon">▣</span>
            <span class="mini-entry-kicker">SERVER INFO</span>
            <strong>服务器信息</strong>
          </RouterLink>

          <RouterLink class="hero-mini-entry polished-mini-entry entry-download" to="/downloads">
            <span class="mini-entry-icon">⬒</span>
            <span class="mini-entry-kicker">DOWNLOADS</span>
            <strong>资源下载</strong>
          </RouterLink>

          <a class="hero-mini-entry polished-mini-entry entry-skin" href="https://pd.qq.com/s/9vp9i3opo" target="_blank"
            rel="noreferrer">
            <span class="mini-entry-icon">◫</span>
            <span class="mini-entry-kicker">QQ CHANNEL</span>
            <strong>QQ频道</strong>
          </a>

          <RouterLink class="hero-mini-entry polished-mini-entry entry-docs" to="/docs">
            <span class="mini-entry-icon">▤</span>
            <span class="mini-entry-kicker">DOCS</span>
            <strong>帮助文档</strong>
          </RouterLink>
        </div>

        <div class="hero-bottom-note">
          <span class="hero-bottom-note-line"></span>
          <span>MC 社团门户 · 文档 · 下载 · 社区入口</span>
          <span class="hero-bottom-note-line"></span>
        </div>
      </div>
    </div>

    <div class="hero-scroll-hint">
      <a href="#server-info-home" aria-label="向下滚动查看内容">
        <span class="scroll-text">向下探索</span>
        <span class="scroll-icon">
          <span></span>
        </span>
      </a>
    </div>

    <div class="hero-floating-blocks">
      <span class="floating-block grass"></span>
      <span class="floating-block stone"></span>
      <span class="floating-block wood"></span>
      <span class="floating-block gold"></span>
    </div>

    <div class="hero-floating-pixels">
      <span class="pixel-dot pd-1"></span>
      <span class="pixel-dot pd-2"></span>
      <span class="pixel-dot pd-3"></span>
      <span class="pixel-dot pd-4"></span>
      <span class="pixel-dot pd-5"></span>
      <span class="pixel-dot pd-6"></span>
    </div>
  </section>
</template>

<script setup>
</script>
