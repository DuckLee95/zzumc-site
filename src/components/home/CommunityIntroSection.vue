<template>
  <section class="section section-showcase community-intro-section">
    <div class="container home-wide-container">
      <article class="community-intro-card mc-pixel-panel">
        <div class="community-intro-copy">
          <p class="section-kicker">COMMUNITY STORY</p>
          <h2>不只是联机，更是一起搭出来的 MC 社团</h2>
          <p class="community-intro-lead">
            郑爱玩MC 不只是一个服务器，也是一群人一起开荒、生存、建筑、活动和拍照留念的线上社区。
            我们把服务器、文档、资源和社团故事都整合到这里，让新成员能快速找到入口，也让老成员能继续回来一起玩。
          </p>

          <div class="community-intro-points">
            <div v-for="item in introPoints" :key="item.label" class="community-intro-point">
              <span class="community-intro-point-label">{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
              <p>{{ item.desc }}</p>
            </div>
          </div>

          <RouterLink class="mc-pixel-btn community-intro-button" to="/about">
            进入关于页面
          </RouterLink>
        </div>

        <RouterLink class="community-intro-media" to="/about">
          <img :src="previewImage" alt="郑爱玩MC 社团活动与合照展示位" />
          <div class="community-intro-media-mask"></div>

          <div class="community-intro-media-copy">
            <span class="community-intro-media-kicker">IN-GAME SNAPSHOT</span>
            <strong>社团活动合照展示位</strong>
            <p>这里先用站内示意图占位，后面你可以直接替换成 MC 社的大合照。</p>
          </div>
        </RouterLink>
      </article>
    </div>
  </section>
</template>

<script setup>
const previewImage = '/images/showcase-2.jpg'

const introPoints = [
  {
    label: '玩法方向',
    value: '联机 / 生存 / 建筑',
    desc: '从日常开荒到大型建设，适合不同偏好的玩家一起协作。',
  },
  {
    label: '社团内容',
    value: '活动 / 迎新 / 合影',
    desc: '除了服务器本身，也会持续沉淀活动记录、截图和社区氛围。',
  },
  {
    label: '网站作用',
    value: '文档 / 下载 / 入口',
    desc: '把新成员需要的信息整合起来，减少进群后重复问答。',
  },
]
</script>
