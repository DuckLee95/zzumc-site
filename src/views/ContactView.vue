<template>
  <div class="contact-page upgraded-contact-page">
    <div class="container contact-page-container">
      <div class="contact-topbar">
        <RouterLink class="contact-back-link" to="/">
          ← 返回主页面
        </RouterLink>
      </div>

      <div class="contact-hero pixel-panel">
        <p class="section-kicker">CONTACT CENTER</p>
        <h1>联系我们</h1>
        <p class="contact-hero-desc">
          这里可以放社团简介、联系渠道、加入方式和常见沟通入口。
          后面也可以继续扩展成招新页或成员服务页。
        </p>
      </div>

      <div class="contact-main-layout">
        <div class="contact-main-column">
          <section class="contact-section pixel-panel">
            <div class="contact-section-head">
              <p class="contact-section-kicker">COMMUNITY</p>
              <h2>社团简介</h2>
            </div>
            <p class="contact-section-desc">
              郑爱玩MC可以作为你们社团的统一线上门户，用来展示社团风采、
              发布通知、整理文档和承载资源下载。这里后面可以替换成你们的真实介绍。
            </p>
          </section>

          <section class="contact-section pixel-panel">
            <div class="contact-section-head">
              <p class="contact-section-kicker">CONTACT</p>
              <h2>主要联系方式</h2>
            </div>

            <div class="contact-cards-grid">
              <article
                v-for="item in contacts"
                :key="item.id"
                class="contact-card"
              >
                <h3>{{ item.title }}</h3>
                <p>{{ item.desc }}</p>
                <div class="contact-card-value">{{ item.value }}</div>
              </article>
            </div>
          </section>

          <section class="contact-section pixel-panel">
            <div class="contact-section-head">
              <p class="contact-section-kicker">JOIN US</p>
              <h2>加入流程</h2>
            </div>

            <ol class="contact-steps-list">
              <li>先阅读帮助文档中的“如何加入服务器”。</li>
              <li>确认客户端版本、Java 环境和整合包要求。</li>
              <li>加入社团交流群或联系管理员。</li>
              <li>完成审核或白名单流程后正式进入。</li>
            </ol>

            <div class="contact-section-actions">
              <RouterLink class="pixel-btn pixel-btn-primary" to="/docs#join-server">
                查看加入文档
              </RouterLink>
              <RouterLink class="pixel-btn pixel-btn-dark" to="/downloads">
                前往资源下载
              </RouterLink>
            </div>
          </section>
        </div>

        <aside class="contact-sidebar">
          <div class="contact-side-panel pixel-panel">
            <h3>快速入口</h3>
            <div class="contact-quick-links">
              <RouterLink to="/docs">帮助文档</RouterLink>
              <RouterLink to="/news">最新消息</RouterLink>
              <RouterLink to="/downloads">资源下载</RouterLink>
            </div>
          </div>

          <div class="contact-side-panel pixel-panel">
            <h3>联系提示</h3>
            <ul class="contact-note-list">
              <li>首次咨询建议先说明你的问题类型。</li>
              <li>如是安装问题，建议附上报错截图。</li>
              <li>如是进服问题，建议说明游戏版本。</li>
              <li>涉及下载问题可同时提供文件名称。</li>
            </ul>
          </div>

          <div class="contact-side-panel pixel-panel">
            <h3>常见入口</h3>
            <div class="contact-side-tags">
              <a href="#">QQ群</a>
              <a href="#">邮箱</a>
              <a href="#">管理员</a>
              <a href="#">招新入口</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
const contacts = [
  {
    id: 1,
    title: 'QQ 群',
    desc: '适合日常沟通、通知和新成员加入。',
    value: '待填写',
  },
  {
    id: 2,
    title: '邮箱',
    desc: '适合提交文件、反馈问题和正式联系。',
    value: '待填写',
  },
  {
    id: 3,
    title: '管理员',
    desc: '适合处理入群、审核、活动和特殊问题。',
    value: '待填写',
  },
]
</script>