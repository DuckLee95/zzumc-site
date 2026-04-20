# zzumc-site

郑爱玩 MC 社区官网，基于 `Vue 3 + Vite`。

这个仓库已经整理出一套可复用的 CSS 分层结构。后续新增页面、组件或样式时，优先遵循这份 README，可以避免样式重复、命名混乱和页面之间互相污染。

## 1. 快速开始

安装依赖：

```sh
npm install
```

本地开发：

```sh
npm run dev
```

生产构建：

```sh
npm run build
```

代码检查：

```sh
npm run lint
```

## 2. 项目结构

与样式相关的核心目录：

```text
src/
  assets/
    main.css                     # 全站样式入口，负责按顺序导入各层 CSS
    styles/
      settings/
        variables.css            # 设计令牌：颜色、阴影、间距、页面尺寸、像素风变量
      base/
        base.css                 # 全局 reset / 基础标签行为 / 根级默认样式
      layout/
        container.css            # 各类容器宽度规则
        section.css              # 首页 section 基础布局
        page-shell.css           # 内容页通用骨架：页背景、topbar、hero、sidebar
      components/
        pixel.css                # 像素风通用组件：panel / mini-panel / btn / tag / badge
        buttons.css              # 通用按钮和 CTA
        media-card.css           # 图片媒体卡通用结构
        announcement.css         # 首页公告条
        navbar.css               # 首页导航
        hero.css                 # 首页 Hero
        server-status.css        # 首页服务器信息模块
        news-home.css            # 首页新闻模块
        showcase.css            # 首页展示区
        quickstart.css           # 首页快速开始
        footer.css               # 页脚
      pages/
        docs.css                 # 文档页专属样式 
        news.css                 # 新闻列表页专属样式
        news-detail.css          # 新闻详情页专属样式
        downloads.css            # 下载页专属样式
        contact.css              # 联系/关于页专属样式
        server-info.css          # 服务器详情页专属样式
      overrides/
        home-unified.css         # 首页统一化覆盖层
        hero-clean.css           # Hero 视觉覆盖层
  components/
    home/                        # 首页模块组件
  views/                         # 路由页面
```

## 3. CSS 分层约定

当前样式体系是按“从底到上”的顺序组织的：

1. `settings`
   放设计变量，不写具体业务样式。

2. `base`
   放标签级默认样式和 reset，例如 `html`、`body`、`img`、`button`。

3. `layout`
   放页面布局骨架，不处理具体业务模块。

4. `components`
   放可跨页面复用的组件样式，或者某个首页模块自身的样式。

5. `pages`
   只放页面独有的布局和细节。

6. `overrides`
   只在确实需要“最后覆盖”的情况下使用，避免成为日常开发入口。

## 4. 全站样式入口

全站样式统一从 `src/assets/main.css` 进入。导入顺序已经固定：

```css
settings -> base -> layout -> components -> pages -> overrides
```

这意味着：

- 变量应该尽量在 `settings` 里定义。
- 通用能力优先写到 `layout` 或 `components`。
- 页面样式只补当前页面缺的部分。
- `pages/*.css` 不应该反向定义或覆盖通用类库。

如果新增一个新的公共样式文件，记得把它注册到 `src/assets/main.css`。

## 5. 当前 CSS 库怎么用

### 5.1 变量层：`settings/variables.css`

这里维护的是全站设计令牌，后续扩展优先加变量，而不是把颜色和尺寸写死到业务文件里。

目前重点变量分为几类：

- 颜色和文字：`--bg-main`、`--text-main`、`--green-soft`、`--gold`
- 容器和首页节奏：`--home-max-width`、`--home-section-gap`
- 内容页骨架：`--page-surface`、`--page-hero-padding`、`--page-sidebar-width`
- 像素风组件：`--pixel-border`、`--pixel-panel-surface`、`--pixel-panel-shadow`

适用原则：

- 全站都可能重复使用的值，放变量。
- 只在单页出现一次的特殊值，可以先留在页面 CSS。
- 如果一个页面里同一值出现两次以上，就值得考虑提到变量层。

### 5.2 布局层：`layout/page-shell.css`

这是内容页统一骨架，适合 `news / downloads / contact / server-info / news-detail` 这种路由页面。

常用类：

- `.page-shell`
  页面外层背景和上下留白。
- `.page-shell--article`
  文章型页面，顶部留白不同。
- `.page-topbar`
  页面顶部返回区容器。
- `.page-back-link`
  内容页统一返回链接。
- `.page-hero`
  简单页头区。
- `.page-hero-block`
  带面板感的页头区。
- `.page-hero-desc`
  页头说明文字。
- `.page-sidebar-stack`
  右侧栏的纵向堆叠。
- `.page-side-panel`
  侧栏单个面板的统一内边距。
- `.page-link-stack`
  侧栏快捷链接列表。
- `.page-tag-list`
  侧栏标签集合。
- `.page-note-list`
  侧栏说明列表。

标准用法：

```vue
<template>
  <div class="my-page page-shell">
    <div class="container my-page-container">
      <div class="page-topbar">
        <RouterLink class="page-back-link" to="/">返回首页</RouterLink>
      </div>

      <section class="page-hero">
        <p class="section-kicker">PAGE</p>
        <h1>页面标题</h1>
        <p class="page-hero-desc">页面说明文案。</p>
      </section>
    </div>
  </div>
</template>
```

如果是卡片式页头：

```vue
<div class="pixel-panel page-hero-block">
  <p class="section-kicker">PAGE</p>
  <h1>页面标题</h1>
  <p class="page-hero-desc">说明内容</p>
</div>
```

### 5.3 像素风组件层：`components/pixel.css`

这是站内最核心的可复用组件库之一。所有像素风面板、标签、按钮，优先复用这里，而不是在页面文件里重新写一套。

常用类：

- `.pixel-panel`
  通用大面板。
- `.pixel-mini-panel`
  小尺寸信息面板。
- `.mc-pixel-panel`
  首页服务器模块专用的大面板语义类，视觉与 `.pixel-panel` 共用底层风格。
- `.mc-pixel-inline-link`
  像素风行内返回链接。
- `.mc-pixel-tag`
  标签。
- `.mc-pixel-btn`
  像素风按钮。
- `.mc-pixel-badge`
  徽章型状态块。

标准用法：

```vue
<div class="pixel-panel">内容</div>
<div class="pixel-mini-panel">摘要信息</div>
<button class="mc-pixel-btn">查看详情</button>
<span class="mc-pixel-tag">活动服</span>
```

重要规则：

- 不要在 `pages/*.css` 里重新定义 `.pixel-panel`、`.mc-pixel-btn`、`.mc-pixel-tag` 这种共享类。
- 如果某个页面想做变体，优先给外层加业务类，再补局部差异。
- 只有当多个页面都需要该变体时，才把它抽回 `components/pixel.css`。

错误示例：

```css
/* 不推荐：页面文件直接覆盖共享类 */
.pixel-panel {
  border: 0;
}
```

正确示例：

```css
.news-detail-empty.pixel-panel {
  border: none;
  box-shadow: none;
}
```

### 5.4 媒体卡组件层：`components/media-card.css`

这个文件负责统一“有图、有遮罩、有标题、有摘要”的卡片结构，现在首页新闻和新闻列表已经在复用。

结构类：

- `.media-card`
- `.media-card__image`
- `.media-card__overlay`
- `.media-card__meta`
- `.media-card__badge`
- `.media-card__date`
- `.media-card__title`
- `.media-card__summary`

标准结构：

```vue
<RouterLink class="media-card">
  <img class="media-card__image" src="/demo.jpg" alt="demo" />

  <div class="media-card__overlay">
    <div class="media-card__meta">
      <span class="media-card__badge">NEWS</span>
      <span class="media-card__date">2026-04-17</span>
    </div>

    <h3 class="media-card__title">标题</h3>
    <p class="media-card__summary">摘要内容</p>
  </div>
</RouterLink>
```

这个组件支持通过 CSS 变量定制，而不需要复制整套样式：

```css
.home-news-card {
  --media-card-padding: 22px;
  --media-card-title-size: clamp(22px, 1.6vw, 34px);
  --media-card-summary-max: 160px;
}
```

适合场景：

- 首页新闻卡
- 新闻列表卡
- 后续如果有活动卡、专题卡，也优先复用这一套

### 5.5 按钮层：`components/buttons.css`

这里放的是通用按钮和 CTA，不属于像素风组件库，但可在首页和普通页面复用。

常用类：

- `.pixel-btn`
- `.pixel-btn-primary`
- `.pixel-btn-dark`
- `.pill`
- `.centered-view-all-news`
- `.hero-primary-cta`

适用原则：

- 普通业务按钮优先 `pixel-btn`
- 更“MC 像素块”式的交互优先 `mc-pixel-btn`
- 页面中间的次级小标签可用 `pill`

## 6. 页面样式应该放在哪里

### 放到 `pages/*.css` 的内容

- 当前页面独有的 grid / flex 布局
- 当前页面的专属模块结构
- 只服务当前页面的响应式适配
- 当前页面对共享类的局部补充

### 放到 `components/*.css` 的内容

- 两个及以上页面会复用的 UI 结构
- 稳定的通用样式模式
- 可抽象成“组件”的样式

### 放到 `layout/*.css` 的内容

- 容器宽度
- 页面骨架
- section 节奏
- 通用布局体系

## 7. 新增页面时怎么写

推荐流程：

1. 在 `src/views/` 新建页面组件。
2. 如果页面是常规内容页，优先套用 `page-shell`。
3. 如果页面需要新样式，在 `src/assets/styles/pages/` 新建同名 CSS。
4. 把该 CSS 导入到 `src/assets/main.css` 的 `pages` 区块。
5. 先复用现有共享类，再补页面私有类。

推荐骨架：

```vue
<template>
  <div class="activity-page page-shell">
    <div class="container activity-page-container">
      <div class="page-topbar">
        <RouterLink class="page-back-link" to="/">返回首页</RouterLink>
      </div>

      <div class="pixel-panel page-hero-block">
        <p class="section-kicker">ACTIVITY</p>
        <h1>活动中心</h1>
        <p class="page-hero-desc">页面说明。</p>
      </div>

      <div class="activity-main-layout">
        <main class="activity-main-column">...</main>
        <aside class="page-sidebar-stack">...</aside>
      </div>
    </div>
  </div>
</template>
```

对应页面 CSS：

```css
.activity-main-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--page-sidebar-width);
  gap: 24px;
}

@media (max-width: 1180px) {
  .activity-main-layout {
    grid-template-columns: 1fr;
  }
}
```

## 8. 新增可复用组件时怎么写

如果你发现某段样式满足下面至少两条，就应该抽成组件层：

- 已经在两个页面出现
- 名字已经开始泛化，比如“卡片、标签、面板、媒体项”
- 视觉结构稳定
- 后续还会继续出现

推荐流程：

1. 在 `src/assets/styles/components/` 新建文件。
2. 给组件定义稳定结构类。
3. 需要变体时优先通过 CSS 变量暴露能力。
4. 在 `src/assets/main.css` 注册导入。
5. 再回到页面文件，删除重复样式。

## 9. 命名规范

建议遵循下面这套约定：

- 页面专属类：`page-name-*`
  例：`news-feed-grid`、`downloads-featured-grid`
- 组件结构类：`component-name__part`
  例：`media-card__title`
- 组件修饰类：`component-name--variant` 或业务附加类
- 通用库类：短而稳定
  例：`pixel-panel`、`page-shell`

不要这样写：

- `.card`
- `.title`
- `.left`
- `.item`

这类名字太泛，会快速失控。

## 10. 响应式约定

当前项目主要使用两档断点：

- `1180px` 左右：桌面双栏转单栏
- `760px` 左右：移动端紧凑布局

建议：

- 响应式规则尽量和主样式写在同一个文件里
- 优先调整布局和留白，少做结构性大改
- 公共组件的移动端行为写在组件文件里，不放到页面里兜底

## 11. 开发时必须遵守的规则

1. 先找能不能复用现有类，不要先写新样式。
2. 共享类不要在页面文件里整体重写。
3. 新变体优先用 CSS 变量扩展，而不是复制一份类。
4. 页面文件只关心“这个页面特有的东西”。
5. 真正的最后覆盖才放 `overrides/`。
6. 新增样式文件后，别忘了在 `src/assets/main.css` 注册。

## 12. 推荐阅读顺序

第一次接手这个项目，建议按下面顺序看：

1. `src/assets/main.css`
2. `src/assets/styles/settings/variables.css`
3. `src/assets/styles/layout/page-shell.css`
4. `src/assets/styles/components/pixel.css`
5. `src/assets/styles/components/media-card.css`
6. 任意一个页面样式，例如 `src/assets/styles/pages/server-info.css`

这样可以先理解底层能力，再看页面是怎么组合出来的。

## 13. 当前这套样式工程的核心思路

一句话概括：

> 先用变量统一设计语言，再用 layout 搭骨架，用 components 提供复用能力，最后由 pages 只补页面差异。

如果后续继续按这个思路维护，这个站点即使页面继续增多，也不会很快变成“每页一套样式、谁都不敢动”的状态。
