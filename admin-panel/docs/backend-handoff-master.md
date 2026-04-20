# ZZUMC 管理后台后端总交接文档（A-E 汇总版）

## 1. 文档目的

本文件为后端项目组的一次性交接清单，汇总后台 A-E 阶段全部接口需求与落地工作。

适用范围：
- 管理后台接口开发
- 权限与审计体系落地
- 对外系统联动（皮肤站、服务器状态）
- 联调与上线准备

前端现状：后台页面已完整可运行，当前仅使用 mock 数据层，等待后端真实接口接入。

## 2. 联调目标与优先级

### P0（第一批，必须先完成）
1. 鉴权与会话：登录、刷新令牌、登出、获取当前用户信息。
2. RBAC 权限：角色、权限点、用户权限下发。
3. 内容管理：新闻、文档、资源全量 CRUD。
4. 服务器与成员：服务器管理、玩家列表与同步。
5. 日志：操作日志、登录日志查询。
6. 系统设置：站点、首页、接口配置读写。

### P1（第二批，建议紧随其后）
1. 排序动作接口（文档/资源 move）。
2. 批量操作（批量删除、批量上下架）。
3. 导出能力（日志 CSV）。
4. 配置变更版本控制（乐观锁/版本号）。

### P2（可选增强）
1. 审核流（草稿-审核-发布）。
2. 细粒度数据权限（按分组/模块隔离）。
3. 消息通知（Webhook/邮件/站内通知）。

## 3. 统一约定（建议后端先统一）

### 3.1 接口前缀与版本
- 建议：/api/v1/admin/*

### 3.2 统一响应
- 成功：code=0，message=ok，data=...
- 失败：code 非 0，message 可读，details 可选

### 3.3 分页约定
- Query：page, pageSize
- Response：list, total, page, pageSize

### 3.4 时间与排序
- 时间字段统一使用字符串格式：yyyy-MM-dd HH:mm（或 ISO8601，需前后端统一）
- 列表默认按 updatedAt 或 createdAt 倒序（按模块定义）

### 3.5 权限表达
- 支持 module:action 与 module:* 通配
- 支持超级权限 *

## 4. 鉴权与账号体系（新增补充）

说明：此部分是联调必须项，前端当前仍为演示账号登录。

### 4.1 接口建议
1. POST /api/v1/admin/auth/login
2. POST /api/v1/admin/auth/refresh
3. POST /api/v1/admin/auth/logout
4. GET /api/v1/admin/auth/me

### 4.2 返回建议
- user：id, name, email, role, permissions
- token：accessToken, refreshToken, expiresIn

### 4.3 安全建议
- accessToken 短时效，refreshToken 可撤销
- 登录失败次数限制与风控
- 密码强度与哈希存储（Argon2/Bcrypt）

## 5. 内容管理接口（Phase B）

### 5.1 新闻
1. GET /api/v1/admin/news
2. GET /api/v1/admin/news/:id
3. POST /api/v1/admin/news
4. PUT /api/v1/admin/news/:id
5. DELETE /api/v1/admin/news/:id

关键字段：
- title, category, tags, author, status, featured, pinned, slug, summary, content, updatedAt

权限建议：
- news:read, news:create, news:update, news:delete, news:publish

### 5.2 文档
1. GET /api/v1/admin/docs
2. GET /api/v1/admin/docs/:id
3. POST /api/v1/admin/docs
4. PUT /api/v1/admin/docs/:id
5. DELETE /api/v1/admin/docs/:id
6. POST /api/v1/admin/docs/:id/move（建议）

关键字段：
- title, group, order, slug, author, status, description, content, updatedAt

权限建议：
- docs:read, docs:create, docs:update, docs:delete, docs:publish

### 5.3 资源
1. GET /api/v1/admin/resources
2. GET /api/v1/admin/resources/:id
3. POST /api/v1/admin/resources
4. PUT /api/v1/admin/resources/:id
5. DELETE /api/v1/admin/resources/:id
6. POST /api/v1/admin/resources/:id/move（建议）

关键字段：
- title, type, provider, status, order, url, summary, updatedAt

权限建议：
- resources:read, resources:create, resources:update, resources:delete

## 6. 权限中心与日志接口（Phase C）

### 6.1 角色与管理员
1. GET /api/v1/admin/roles
2. GET /api/v1/admin/admin-users
3. PATCH /api/v1/admin/admin-users/:id/role
4. PATCH /api/v1/admin/admin-users/:id/status

关键约束：
- 当前登录账号不可修改自己的角色与启用状态（前端已限制，后端需强制校验）

权限建议：
- permissions:read, permissions:update-role, permissions:update-status

### 6.2 审计日志
1. GET /api/v1/admin/logs/operations
2. GET /api/v1/admin/logs/logins

权限建议：
- logs:read

## 7. 服务器与成员接口（Phase D）

### 7.1 服务器管理
1. GET /api/v1/admin/servers
2. GET /api/v1/admin/servers/:id
3. POST /api/v1/admin/servers
4. PUT /api/v1/admin/servers/:id
5. DELETE /api/v1/admin/servers/:id
6. POST /api/v1/admin/servers/:id/sync
7. POST /api/v1/admin/servers/sync-all

关键字段：
- name, host, port, version, maxPlayers, currentPlayers, status, syncMode, weight, featured, motd, updatedAt

权限建议：
- servers:read, servers:create, servers:update, servers:delete, servers:sync

### 7.2 成员中心
1. GET /api/v1/admin/players
2. PATCH /api/v1/admin/players/:id
3. POST /api/v1/admin/players/sync
4. GET /api/v1/admin/players/sync-logs

关键字段：
- username, nickname, group, canShowOnAbout, isAdminCandidate, status, lastSeenAt, updatedAt

权限建议：
- players:read, players:update, players:sync

## 8. 系统设置接口（Phase E）

### 8.1 读取设置
1. GET /api/v1/admin/settings

### 8.2 保存设置
1. PUT /api/v1/admin/settings/site
2. PUT /api/v1/admin/settings/homepage
3. PUT /api/v1/admin/settings/integration
4. POST /api/v1/admin/settings/reset（可选）

关键字段：
- site：siteName, siteSubtitle, contactEmail, maintenanceMode, aboutAutoSync
- homepage：heroTitle, heroSubtitle, announcementText, featuredNewsCount, featuredServerCount
- integration：skinSiteApiBase, serverStatusApiBase, playerSyncCron, requestTimeoutMs

权限建议：
- settings:read, settings:update

## 9. 后端必须补充的非接口工作（重点）

以下为你未显式提出，但实际交付必须完成的后端工作：

### 9.1 数据库与迁移
1. 建立正式表结构与索引（news/docs/resources/servers/players/admin_users/roles/logs/settings）。
2. 为 slug、email、roleCode、order、weight 等关键字段建立唯一或组合索引。
3. 提供迁移脚本（dev/staging/prod 可重复执行）。
4. 准备初始化种子数据（超级管理员、默认角色、基础设置）。

### 9.2 鉴权与权限体系
1. JWT + refresh token 机制。
2. 权限中间件与路由守卫。
3. 会话失效策略（主动踢出、密码修改后失效）。
4. 防止越权：后端必须二次校验，不信任前端按钮禁用状态。

### 9.3 审计与可追溯
1. 所有管理写操作记录到 operationLogs。
2. 记录登录成功/失败到 loginLogs。
3. 保留 actor、module、action、target、result、createdAt。
4. 建议补充 requestId 便于日志串联排障。

### 9.4 同步任务与调度
1. 玩家同步任务（可手动触发 + 定时任务）。
2. 服务器状态同步任务（单次/批量）。
3. 定时任务失败重试与告警策略。
4. 同步日志与统计（createdCount, updatedCount, failedCount）。

### 9.5 配置中心能力
1. 设置读写需支持并发保护（version 或 updatedAt 乐观锁）。
2. maintenanceMode 改动后应可快速生效（主站可读取）。
3. integration 配置应提供格式校验（URL、Cron、超时范围）。

### 9.6 稳定性与安全
1. 参数校验与统一错误码。
2. 限流与防暴力破解（登录接口）。
3. CORS、CSRF、敏感头处理。
4. 输入清洗（尤其 Markdown 内容存储与输出策略）。
5. 文件与链接白名单策略（资源外链校验）。

### 9.7 可观测性与运维
1. 结构化日志（JSON）与日志分级。
2. 健康检查接口：/health, /ready。
3. 核心指标监控：请求耗时、错误率、任务失败率。
4. 灰度/回滚方案与数据库备份策略。

### 9.8 测试与质量门禁
1. 单元测试：权限校验、排序逻辑、同步任务。
2. 集成测试：鉴权流程、核心 CRUD、日志写入。
3. 合约测试：与前端字段契约一致。
4. 上线前回归清单与冒烟脚本。

## 10. 推荐联调顺序

1. 鉴权与权限下发（auth/me）。
2. 新闻、文档、资源基础 CRUD。
3. 权限中心与日志查询。
4. 服务器与成员同步接口。
5. 系统设置接口。
6. 排序接口与性能优化。

## 11. 前端对接点（后端可直接查看）

需要替换的 service 文件：
- src/services/newsService.js
- src/services/docsService.js
- src/services/resourcesService.js
- src/services/adminService.js
- src/services/logService.js
- src/services/serverService.js
- src/services/playerService.js
- src/services/settingsService.js

鉴权入口：
- src/stores/auth.js

## 12. 交付验收标准（建议）

满足以下条件即可判定后端可正式交付联调：
1. P0 接口全部可用且通过权限校验。
2. 关键写操作均可在操作日志中追溯。
3. 设置修改可持久化并在刷新后保持。
4. 服务器与玩家同步接口可返回真实可解释结果。
5. 联调环境连续稳定运行 48 小时，无阻断级故障。

## 13. 参考文档

- docs/backend-handoff-phase-b.md
- docs/backend-handoff-phase-c.md
- docs/backend-handoff-phase-d.md
- docs/backend-handoff-phase-e.md
