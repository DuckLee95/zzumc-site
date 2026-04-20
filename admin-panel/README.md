# ZZUMC Admin Panel (Phase A-E)

独立后台壳层，采用 `Vue 3 + Vite + Vue Router`。

## 启动方式

```sh
cd admin-panel
npm install
npm run dev
```

## 当前范围

- 登录页（本地模拟账号）
- 控制台首页（统计卡片、待办、状态）
- 后台通用壳层（侧边栏、顶部栏、路由守卫）
- 命令方块主题视觉（不影响前台）
- 阶段 B（新闻/文档/资源）列表与编辑页面
- Mock 数据服务层（本地持久化，可直接切换真实 API）
- 阶段 C（权限中心/操作日志）页面与 mock 流程
- 阶段 D（服务器管理/成员中心）页面与 mock 流程
- 阶段 E（系统设置）页面与 mock 流程

## 后端交接

- 交接文档：`docs/backend-handoff-phase-b.md`
- 交接文档：`docs/backend-handoff-phase-c.md`
- 交接文档：`docs/backend-handoff-phase-d.md`
- 交接文档：`docs/backend-handoff-phase-e.md`
- 后续接真实 API 时仅需替换：
	- `src/services/newsService.js`
	- `src/services/docsService.js`
	- `src/services/resourcesService.js`
	- `src/services/serverService.js`
	- `src/services/playerService.js`
	- `src/services/settingsService.js`

## 默认测试账号

- `super@zzumc.com` / `admin123`
- `content@zzumc.com` / `content123`
- `observer@zzumc.com` / `observer123`
