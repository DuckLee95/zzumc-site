# ZZUMC 管理后台 Phase D 后端交接说明（服务器管理 + 成员中心）

## 1. 阶段目标

Phase D 将后台中原占位模块升级为可用页面：

- 服务器管理：服务器列表、新建/编辑、单台同步、全量同步、删除。
- 成员中心：玩家列表、关于页展示开关、管理员候选开关、分组维护、皮肤站同步记录。

当前实现仍为 mock 流程，前后端契约已稳定，后续可直接替换 service 层实现。

## 2. 前端已实现页面

- 服务器列表：`/servers`
- 新建服务器：`/servers/create`
- 编辑服务器：`/servers/:id/edit`
- 成员中心：`/players`

## 3. mock 数据实体

新增实体如下：

- `servers`
- `players`
- `playerSyncLogs`

并在 `database.js` 中加入 schema 合并逻辑：旧 localStorage 数据会自动补齐新实体，不需要手动清空。

## 4. 接口建议（后端实现参考）

### 4.1 服务器管理

1. `GET /admin/servers`
- 返回服务器列表，按 `weight` 升序。

2. `GET /admin/servers/:id`
- 返回服务器详情。

3. `POST /admin/servers`
- 创建服务器。
- 请求体字段建议：
  - `name`, `host`, `port`, `version`
  - `maxPlayers`, `currentPlayers`
  - `status` (`online|offline`)
  - `syncMode` (`status-api|plugin|manual`)
  - `weight`, `featured`, `motd`

4. `PUT /admin/servers/:id`
- 更新服务器，支持权重调整。

5. `DELETE /admin/servers/:id`
- 删除服务器后建议自动重排 `weight`。

6. `POST /admin/servers/:id/sync`
- 同步单台服务器状态。

7. `POST /admin/servers/sync-all`
- 同步全部服务器状态。

### 4.2 成员中心

1. `GET /admin/players`
- 返回玩家列表。

2. `PATCH /admin/players/:id`
- 更新玩家属性，建议支持：
  - `group`
  - `canShowOnAbout`
  - `isAdminCandidate`
  - `status`

3. `POST /admin/players/sync`
- 从皮肤站拉取玩家并同步。
- 响应建议包含：`createdCount`、`updatedCount`、`total`。

4. `GET /admin/players/sync-logs`
- 返回同步历史。

## 5. 权限建议

- `servers:read|create|update|delete|sync`
- `players:read|update|sync`

当前前端路由使用：

- 服务器列表：`servers:read`
- 服务器编辑：`servers:create|servers:update`
- 成员中心：`players:read`
- 成员修改按钮建议由 `players:update` 控制

## 6. 审计日志建议

服务端落地时建议将以下动作写入操作日志：

- servers: `create`, `update`, `delete`, `sync`, `sync-all`
- players: `update`, `sync`

字段建议：

- `actor`
- `module`
- `action`
- `target`
- `result`
- `createdAt`

## 7. 联调注意事项

- 服务器同步建议异步化，避免长时间阻塞请求。
- 玩家同步建议增量策略（按更新时间或游标）。
- 若权限由 JWT 声明下发，建议包含模块级通配（如 `servers:*`）。
