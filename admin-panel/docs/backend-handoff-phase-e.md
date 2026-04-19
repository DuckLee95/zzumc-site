# ZZUMC 管理后台 Phase E 后端交接说明（系统设置）

## 1. 阶段目标

Phase E 完成后台“系统设置”模块，覆盖三类配置：

- 站点基础配置（名称、副标题、联系邮箱、维护模式、关于页自动同步开关）
- 首页展示配置（主标题、副标题、公告文案、推荐新闻条数、推荐服务器条数）
- 接口与同步配置（皮肤站 API、服务器状态 API、玩家同步 Cron、请求超时）

当前前端已通过 mock service 跑通，后端接入后只需替换 service 实现。

## 2. 前端页面与路由

- 页面：`/settings`
- 文件：`src/views/settings/SettingsCenterView.vue`
- 服务：`src/services/settingsService.js`

## 3. mock 实体

新增实体（单例配置）：

- `siteSettings`
- `homepageSettings`
- `integrationSettings`

说明：

- 通过 `database.js` schema merge 机制，历史 localStorage 数据会自动补齐这三个实体。
- 继续保持本地可演示与快速切换真实 API 的能力。

## 4. 后端接口建议

### 4.1 读取全部设置

`GET /admin/settings`

响应示例：

```json
{
  "site": {
    "siteName": "郑州大学Minecraft社团",
    "siteSubtitle": "ZZUMC 官方站点",
    "contactEmail": "admin@zzumc.com",
    "maintenanceMode": false,
    "aboutAutoSync": true
  },
  "homepage": {
    "heroTitle": "一起构建我们的像素世界",
    "heroSubtitle": "欢迎来到 ZZUMC 社团站点",
    "announcementText": "每周五晚 20:00 社区活动准时开始",
    "featuredNewsCount": 3,
    "featuredServerCount": 2
  },
  "integration": {
    "skinSiteApiBase": "https://skin.example.com/api",
    "serverStatusApiBase": "https://status.example.com/mc",
    "playerSyncCron": "0 */6 * * *",
    "requestTimeoutMs": 5000
  }
}
```

### 4.2 保存站点配置

`PUT /admin/settings/site`

### 4.3 保存首页配置

`PUT /admin/settings/homepage`

### 4.4 保存接口配置

`PUT /admin/settings/integration`

### 4.5 恢复默认配置（可选）

`POST /admin/settings/reset`

## 5. 权限建议

- `settings:read`：可查看系统设置
- `settings:update`：可修改系统设置

当前前端权限策略：

- 内容管理员：`settings:read`（只读）
- 超级管理员：`*`（可读写）

## 6. 审计日志建议

系统设置保存与重置动作建议写入操作日志：

- `module`: `settings`
- `action`: `update-site | update-homepage | update-integration | reset`
- `target`: `站点基础配置 | 首页展示配置 | 接口与同步配置 | 系统设置恢复默认值`

## 7. 联调注意事项

- 建议设置接口支持版本号或 `updatedAt`，避免并发覆盖。
- `requestTimeoutMs` 建议后端做最小/最大值校验。
- `playerSyncCron` 建议在后端校验表达式合法性并持久化为任务配置。
