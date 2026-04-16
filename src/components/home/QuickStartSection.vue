<template>
  <section id="quickstart" class="section section-light section-layered">
    <div class="container">
      <div class="section-heading center dark-text">
        <p class="section-kicker">QUICK START</p>
        <h2>新手必看</h2>
        <p>
          第一次来这里？先看这几个文档入口。
        </p>
      </div>

      <div class="quick-grid">
        <article class="quick-card pixel-card-light">
          <span class="quick-tag">01</span>
          <h3>如何加入服务器</h3>
          <p>查看游戏版本、加入方式、基础要求和社团入口说明。</p>
          <RouterLink :to="{ path: '/docs', hash: '#join-server' }">查看说明</RouterLink>
        </article>

        <article class="quick-card pixel-card-light">
          <span class="quick-tag">02</span>
          <h3>客户端安装教程</h3>
          <p>从 Java 到整合包导入，帮助新玩家完成首次启动。</p>
          <RouterLink :to="{ path: '/docs', hash: '#install-client' }">查看教程</RouterLink>
        </article>

        <article class="quick-card pixel-card-light">
          <span class="quick-tag">03</span>
          <h3>常见问题处理</h3>
          <p>解决闪退、版本不匹配、无法连接和资源包报错等问题。</p>
          <RouterLink :to="{ path: '/docs', hash: '#faq' }">查看 FAQ</RouterLink>
        </article>

        <article class="quick-card pixel-card-light">
          <span class="quick-tag">04</span>
          <h3>社区规则与联系</h3>
          <p>了解行为规范、基本守则以及社团联系方式。</p>
          <RouterLink :to="{ path: '/docs', hash: '#rules-contact' }">立即查看</RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>