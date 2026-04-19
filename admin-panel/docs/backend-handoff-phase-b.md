# ZZUMC 管理后台 Phase B 后端交接文档

## 1. 文档目的

本文用于说明 Phase B（三个模块：新闻、文档、资源）需要后端提供的接口能力。
当前前端已使用 mock 服务 + localStorage 完整跑通 CRUD 流程，可用于演示与联调前置验证。

## 2. 当前 Mock 策略

- 前端 mock 数据文件：`src/mocks/database.js`
- 服务适配层：
  - `src/services/newsService.js`
  - `src/services/docsService.js`
  - `src/services/resourcesService.js`
- 当前行为特性：
  - 模拟异步请求延迟
  - 浏览器本地持久化
  - 数据结构与后续真实 API 对齐，便于平滑切换

## 3. 需提供的 API 模块

### 3.1 新闻模块

建议接口：

- `GET /admin/news`
  - Query: `keyword`、`status`、`page`、`pageSize`
- `GET /admin/news/:id`
- `POST /admin/news`
- `PUT /admin/news/:id`
- `DELETE /admin/news/:id`

建议请求体：

```json
{
  "title": "春季活动预热公告",
  "category": "活动预告",
  "tags": ["活动", "联机"],
  "author": "运营组",
  "status": "draft",
  "featured": false,
  "pinned": false,
  "slug": "spring-event-2026",
  "summary": "简短摘要",
  "content": "## markdown body"
}
```

### 3.2 文档模块

建议接口：

- `GET /admin/docs`
  - Query: `keyword`、`group`、`status`、`page`、`pageSize`
- `GET /admin/docs/:id`
- `POST /admin/docs`
- `PUT /admin/docs/:id`
- `DELETE /admin/docs/:id`

建议请求体：

```json
{
  "title": "如何加入服务器",
  "group": "新手指南",
  "order": 1,
  "slug": "join-server",
  "author": "文档组",
  "status": "published",
  "description": "文档简介",
  "content": "# markdown body"
}
```

### 3.3 资源模块

建议接口：

- `GET /admin/resources`
  - Query: `keyword`、`type`、`status`、`page`、`pageSize`
- `GET /admin/resources/:id`
- `POST /admin/resources`
- `PUT /admin/resources/:id`
- `DELETE /admin/resources/:id`

建议请求体：

```json
{
  "title": "客户端整合包 v1.0",
  "type": "modpack",
  "provider": "校内云盘",
  "status": "enabled",
  "order": 1,
  "url": "https://pan.example.com/xxx",
  "summary": "资源说明"
}
```

## 4. 统一响应结构建议

成功响应：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

列表响应：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [],
    "total": 0,
    "page": 1,
    "pageSize": 20
  }
}
```

错误响应：

```json
{
  "code": 40001,
  "message": "validation failed",
  "details": {}
}
```

## 5. 认证与权限要求

- `/admin/*` 路由全部需要鉴权。
- RBAC 权限建议：
  - `news:read|create|update|delete|publish`
  - `docs:read|create|update|delete|publish`
  - `resources:read|create|update|delete`
- 建议采用 JWT + 刷新令牌。

## 6. 前端切换方案（Mock -> 真实 API）

联调后只需替换服务层文件，无需重写页面：

- `src/services/newsService.js`
- `src/services/docsService.js`
- `src/services/resourcesService.js`

这样可以保持页面与路由结构稳定，降低切换风险。

## 7. 后端组注意事项

- 返回字段命名尽量与本文件保持一致；若需调整，请同步字段映射表。
- 列表接口请返回 `updatedAt`，用于前端展示最新更新时间。
- 新闻与文档的 Markdown 正文请保留原始换行，不要压缩为单行。

## 8. 排序能力补充（文档与资源）

当前前端已实现文档和资源在列表中直接排序调整，后端建议支持以下规则：

- 创建时支持 `insertFirst`（布尔值）参数：
  - `true` 时新条目直接插入首项，排序设为 1；原有条目顺序整体后移。
- 创建或编辑时如果提交的 `order` 与现有条目冲突：
  - 将冲突项及其后的条目排序统一 +1，保证无重复排序号。
- 列表排序操作支持四种动作：
  - `up`：与上一条交换
  - `down`：与下一条交换
  - `top`：移动到首项
  - `bottom`：移动到尾项

建议接口（可选实现方式）：

- `POST /admin/docs/:id/move`
- `POST /admin/resources/:id/move`

建议请求体：

```json
{
  "action": "up"
}
```

其中 `action` 取值：`up | down | top | bottom`。
