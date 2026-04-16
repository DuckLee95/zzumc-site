export const newsList = [
  {
    id: 1,
    slug: 'spring-event-2026',
    tag: '活动预告',
    tagClass: 'green',
    date: '2026-04-15',
    title: '春季联机活动即将开启',
    desc: '社团春季活动正在筹备，后面会发布报名方式、活动规则与奖励说明。',
    cover: '/images/showcase-2.jpg',
    content: [
      {
        type: 'paragraph',
        text: '为了丰富社团成员的联机体验，郑爱玩MC将在近期开启春季联机活动。本次活动将围绕团队协作、轻度竞赛和世界探索展开，适合新成员和老成员共同参与。',
      },
      {
        type: 'paragraph',
        text: '目前活动还处于准备阶段，后续会陆续公布报名时间、活动规则、具体奖励以及注意事项。建议大家关注新闻页面的持续更新。',
      },
      {
        type: 'list',
        title: '本次活动计划包含：',
        items: [
          '联机建筑协作环节',
          '轻量挑战或竞速玩法',
          '成员互动与合影留念',
          '活动奖励与纪念内容',
        ],
      },
      {
        type: 'paragraph',
        text: '活动正式开启前，我们还会同步更新帮助文档和资源页面，确保每位成员都能顺利参与。',
      },
    ],
  },
  {
    id: 2,
    slug: 'download-center-online',
    tag: '版本更新',
    tagClass: 'stone',
    date: '2026-04-13',
    title: '资源中心已上线',
    desc: '资源下载页面现已开放，后续会继续补充整合包、资源包和说明文件。',
    cover: '/images/showcase-1.jpg',
    content: [
      {
        type: 'paragraph',
        text: '网站资源中心已经正式上线，目前已具备基础下载功能，可以用于承载整合包、资源包、补丁和说明文档。',
      },
      {
        type: 'list',
        title: '当前资源中心支持的内容包括：',
        items: [
          '客户端整合包',
          '资源包与视觉文件',
          '安装说明文档',
          '后续版本补丁与更新文件',
        ],
      },
      {
        type: 'paragraph',
        text: '后续我们会继续完善下载说明、文件版本标注和更新日志，让新成员更容易找到自己需要的内容。',
      },
    ],
  },
  {
    id: 3,
    slug: 'docs-center-improving',
    tag: '社团动态',
    tagClass: 'gold',
    date: '2026-04-10',
    title: '帮助文档持续完善中',
    desc: '加入说明、安装教程、FAQ 和社区规则等内容都在持续更新。',
    cover: '/images/showcase-3.jpg',
    content: [
      {
        type: 'paragraph',
        text: '帮助文档页面已经进入持续完善阶段。目前的重点是快速开始、安装教程、常见问题和规则说明四大模块。',
      },
      {
        type: 'list',
        title: '优先补充的内容有：',
        items: [
          '如何加入服务器',
          '客户端安装教程',
          '常见问题处理',
          '社区规则与联系方式',
        ],
      },
      {
        type: 'paragraph',
        text: '后续还会逐步增加特色玩法说明、资源文件解释和更多适合新成员阅读的引导内容。',
      },
    ],
  },
  {
    id: 4,
    slug: 'homepage-phase-one-online',
    tag: '公告通知',
    tagClass: 'green',
    date: '2026-04-08',
    title: '网站首页第一阶段上线',
    desc: '目前已完成主页、新闻页、文档页和资源下载页的初始结构搭建。',
    cover: '/images/hero-bg.jpg',
    content: [
      {
        type: 'paragraph',
        text: '郑爱玩MC网站第一阶段已完成基础上线，当前已经具备主页展示、新闻中心、帮助文档和资源下载等核心结构。',
      },
      {
        type: 'paragraph',
        text: '这只是第一阶段，后面还会继续完善内容、图片、交互细节和视觉风格。',
      },
    ],
  },
  {
    id: 5,
    slug: 'showcase-carousel-updated',
    tag: '版本更新',
    tagClass: 'stone',
    date: '2026-04-05',
    title: '风采展示轮播区样式优化',
    desc: '风采展示区已调整为更大的轮播图，并增强了视觉层次与交互效果。',
    cover: '/images/showcase-1.jpg',
    content: [
      {
        type: 'paragraph',
        text: '为了提升首页的视觉表现，风采展示区已经升级为更大的轮播模块，并强化了图像展示的沉浸感。',
      },
      {
        type: 'paragraph',
        text: '后面还会继续优化图片内容、轮播逻辑和展示文案，让它更像一个真正的社团门户首页。',
      },
    ],
  },
]

export function getNewsBySlug(slug) {
  return newsList.find((item) => item.slug === slug)
}