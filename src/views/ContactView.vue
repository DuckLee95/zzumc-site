<template>
  <div class="about-page about-page-upgraded page-shell">
    <div class="container contact-page-container">
      <div class="contact-topbar page-topbar">
        <RouterLink class="page-back-link" to="/">
          ← 返回主页面
        </RouterLink>
      </div>

      <section class="about-cover-panel mc-pixel-panel">
        <div class="about-cover-visual">
          <img :src="aboutHeroImage" alt="郑爱玩MC 社团大合照展示位" />
          <div class="about-cover-overlay"></div>

          <div class="about-cover-copy">
            <p class="about-cover-kicker">COMMUNITY ALBUM</p>
            <h1>关于郑爱玩MC</h1>
          </div>
        </div>
      </section>

      <section class="about-hero page-hero">
        <p class="section-kicker">ABOUT US</p>
        <h2 class="about-hero-title">一个围绕联机、生存、建筑与活动展开的高校 MC 社团</h2>
        <p class="about-hero-desc page-hero-desc">
          郑爱玩MC 是一个以郑州大学学生为核心，围绕 Minecraft 联机、生存、建筑、活动与社区交流展开的校园社团。
        </p>

        <div class="about-hero-highlights">
          <div v-for="item in aboutHighlights" :key="item.label" class="about-highlight-card">
            <span class="about-highlight-label">{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </section>

      <div class="about-main-layout">
        <main class="about-main-column">
          <section class="about-section about-intro-section">
            <div class="about-section-head">
              <p class="about-section-kicker">INTRODUCTION</p>
              <h2>社团简介</h2>
            </div>
            <div class="about-rich-text">
              <p>
                我们的目标不是只做一个简单的游戏群，而是慢慢建设成一个更完整的 Minecraft 社区：
                有自己的服务器、有自己的资源中心、有自己的活动体系，也有适合新成员快速上手的网站门户。
              </p>
              <p>
                在这里，你可以找到服务器相关说明、客户端下载方式、帮助文档、最新公告、活动信息，以及与其他成员交流和协作的入口。
                无论你是喜欢生存、建筑、红石、整合包，还是只是想找一个轻松联机的社区，都欢迎加入我们。
              </p>
            </div>
          </section>

          <section class="about-section about-contact-section">
            <div class="about-section-head">
              <p class="about-section-kicker">CONTACT</p>
              <h2>主要联系方式</h2>
            </div>

            <div class="about-contact-grid">
              <div v-for="item in contactItems" :key="item.label" class="about-contact-card">
                <span class="about-contact-label">{{ item.label }}</span>

                <template v-if="item.link">
                  <a class="about-contact-value link" :href="item.link" target="_blank" rel="noreferrer">
                    {{ item.value }}
                  </a>
                </template>

                <template v-else>
                  <strong class="about-contact-value">{{ item.value }}</strong>
                </template>

                <p class="about-contact-desc">{{ item.desc }}</p>
              </div>
            </div>
          </section>

          <section class="about-section about-join-section">
            <div class="about-section-head">
              <p class="about-section-kicker">JOIN US</p>
              <h2>加入流程</h2>
            </div>

            <div class="about-steps-list">
              <div v-for="(step, index) in joinSteps" :key="step.title" class="about-step-card">
                <div class="about-step-index">
                  {{ String(index + 1).padStart(2, '0') }}
                </div>

                <div class="about-step-content">
                  <h3>{{ step.title }}</h3>
                  <p>{{ step.desc }}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="about-section about-members-section">
            <div class="about-section-head">
              <p class="about-section-kicker">MEMBERS</p>
              <h2>MC社成员列表</h2>
              <p class="about-section-subdesc">
                这里适合展示核心成员、活跃成员或管理组成员。后期你只要往数组里继续加数据就行。
              </p>
            </div>

            <div class="people-grid">
              <div v-for="member in members" :key="member.id" class="person-card member-card">
                <div class="person-avatar-wrap">
                  <img class="person-avatar" :src="member.avatar" :alt="member.id" @error="handleAvatarError" />
                </div>

                <div class="person-meta">
                  <strong class="person-name member-name">{{ member.id }}</strong>
                  <span class="person-role">{{ member.role }}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="about-section about-thanks-section">
            <div class="about-section-head">
              <p class="about-section-kicker">SPECIAL THANKS</p>
              <h2>特别感谢</h2>
              <p class="about-section-subdesc">
                用于展示赞助名单、长期支持者或对社团建设有重要帮助的成员。
              </p>
            </div>

            <div class="people-grid">
              <div v-for="sponsor in sponsors" :key="sponsor.id" class="person-card sponsor-card">
                <div class="person-avatar-wrap">
                  <img class="person-avatar" :src="sponsor.avatar" :alt="sponsor.id" @error="handleAvatarError" />
                </div>

                <div class="person-meta">
                  <strong class="person-name sponsor-name">{{ sponsor.id }}</strong>
                  <span class="person-role">{{ sponsor.note }}</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <aside class="about-sidebar page-sidebar-stack">
          <div class="about-side-panel">
            <h3>快速入口</h3>
            <div class="about-quick-links">
              <RouterLink to="/docs">帮助文档</RouterLink>
              <RouterLink to="/downloads">资源下载</RouterLink>
              <RouterLink to="/news">最新消息</RouterLink>
              <RouterLink to="/server-info">服务器信息</RouterLink>
            </div>
          </div>

          <div class="about-side-panel">
            <h3>加入建议</h3>
            <ul class="about-note-list page-note-list">
              <li>第一次加入前，建议先阅读帮助文档。</li>
              <li>客户端下载前先确认版本与安装方式。</li>
              <li>活动时间、更新和公告请以新闻页与 QQ 频道为准。</li>
            </ul>
          </div>

          <div class="about-side-panel">
            <h3>维护方式</h3>
            <p class="about-side-text">
              成员列表和特别感谢栏位现在都由页面内数组控制，后期也很方便迁移成后台管理或接口返回。
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
const aboutHeroImage = '/images/showcase-1.jpg'
const fallbackAvatar = '/images/authors/default-author.png'

const aboutHighlights = [
  {
    label: '社团氛围',
    value: '轻松联机 + 持续建设',
    desc: '从第一次进服到后续长期游玩，都希望让成员有稳定的归属感和参与感。',
  },
  {
    label: '内容整合',
    value: '新闻 / 文档 / 下载 / 联系',
    desc: '把加入社团最常用的信息集中在站内，减少到处翻找入口的成本。',
  },
  {
    label: '记录方式',
    value: '活动截图 + 社团合照',
    desc: '除了文字介绍，也会逐步把活动照片、服务器截图和集体合影放进页面里。',
  },
]

function handleAvatarError(event) {
  if (event.target.dataset.fallbackApplied) return

  event.target.dataset.fallbackApplied = 'true'
  event.target.src = fallbackAvatar
}

const contactItems = [
  {
    label: 'QQ群',
    value: '加入QQ群',
    link: 'https://qm.qq.com/q/t0M14y23GU',
    desc: '用于日常通知、活动交流和成员沟通。',
  },
  {
    label: 'QQ频道',
    value: '进入QQ频道',
    link: 'https://pd.qq.com/s/9vp9i3opo',
    desc: '用于公告同步、活动讨论与内容展示。',
  },
  {
    label: '邮箱',
    value: 'ducklee@zzumc.com',
    link: '',
    desc: '适合长期联络、合作咨询与正式反馈。',
  },
  {
    label: '管理员',
    value: '郑爱玩MC 管理组',
    link: '',
    desc: '如有入群、入服、资源或活动问题，可联系管理员。',
  },
]

const joinSteps = [
  {
    title: '先了解社团与服务器',
    desc: '先浏览首页、新闻页和帮助文档，了解当前社团主要内容、服务器方向和网站入口。',
  },
  {
    title: '加入交流群或频道',
    desc: '优先加入QQ群或 QQ 频道，方便及时获取版本更新、活动公告和管理说明。',
  },
  {
    title: '注册皮肤站账号',
    desc: '游戏服务器进入需要使用皮肤站验证登录，皮肤站也方便于玩家上传自己喜爱的皮肤。',
  },
  {
    title: '下载客户端与资源',
    desc: '根据帮助文档与资源下载页说明，下载对应整合包、客户端或其他必要资源。',
  },
  {
    title: '配置启动器登录皮肤站并阅读规则',
    desc: '安装客户端后，根据教程配置启动器登录皮肤站，阅读基础规则、服务器说明和常见问题，避免第一次进入时出错。',
  },
  {
    title: '正式加入并参与活动',
    desc: '准备完成后即可进入服务器，参与日常联机、生存建设、社团活动和社区交流。',
  },
]

const members = [
  {
    id: 'ZhengAiWan_A',
    role: '核心成员',
    avatar: '/images/members/member-1.png',
  },
  {
    id: 'BlockBuilder_B',
    role: '建筑组',
    avatar: '/images/members/member-2.png',
  },
  {
    id: 'Redstone_C',
    role: '技术组',
    avatar: '/images/members/member-3.png',
  },
  {
    id: 'Explorer_D',
    role: '活动组',
    avatar: '/images/members/member-4.png',
  },
  {
    id: 'Survival_E',
    role: '活跃成员',
    avatar: '/images/members/member-5.png',
  },
  {
    id: 'PixelFox_F',
    role: '社区成员',
    avatar: '/images/members/member-6.png',
  },
]

const sponsors = [
  {
    id: 'GoldenSponsor_A',
    note: '长期支持',
    avatar: '/images/sponsors/sponsor-1.png',
  },
  {
    id: 'DiamondSupport_B',
    note: '活动赞助',
    avatar: '/images/sponsors/sponsor-2.png',
  },
  {
    id: 'NetherStar_C',
    note: '服务器支持',
    avatar: '/images/sponsors/sponsor-3.png',
  },
  {
    id: 'BeaconFriend_D',
    note: '资源支持',
    avatar: '/images/sponsors/sponsor-4.png',
  },
]
</script>
