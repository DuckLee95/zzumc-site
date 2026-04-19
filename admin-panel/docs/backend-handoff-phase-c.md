# ZZUMC 管理后台 Phase C 后端交接文档

## 1. 文档目的

本文用于说明 Phase C（权限中心 + 审计日志）需要后端提供的接口能力。
当前前端已经通过 mock 数据实现管理员列表、角色矩阵、状态切换和日志检索。

## 2. 当前 Mock 覆盖范围

已在本地 mock 数据中补充以下实体：

- `roles`：角色与权限列表
- `adminUsers`：管理员账号
- `operationLogs`：管理操作日志
- `loginLogs`：登录日志

对应前端服务文件：

- `src/services/adminService.js`
- `src/services/logService.js`

## 3. 建议接口清单

### 3.1 角色与管理员

- `GET /admin/roles`
- `GET /admin/admin-users`
  - Query: `keyword`, `status`, `roleCode`, `page`, `pageSize`
- `PATCH /admin/admin-users/:id/role`
- `PATCH /admin/admin-users/:id/status`

角色变更请求体建议：

```json
{
  "roleCode": "content_admin"
}
```

状态切换请求体建议：

```json
{
  "status": "enabled"
}
```

### 3.2 审计日志

- `GET /admin/logs/operations`
  - Query: `keyword`, `module`, `actor`, `result`, `startAt`, `endAt`, `page`, `pageSize`
- `GET /admin/logs/logins`
  - Query: `keyword`, `status`, `startAt`, `endAt`, `page`, `pageSize`

## 4. 字段建议

### 4.1 角色

```json
{
  "id": 1,
  "code": "super_admin",
  "name": "超级管理员",
  "permissions": ["*"],
  "description": "拥有后台全部权限。"
}
```

### 4.2 管理员账号

```json
{
  "id": 1,
  "name": "超级管理员",
  "email": "super@zzumc.com",
  "roleCode": "super_admin",
  "status": "enabled",
  "lastLoginAt": "2026-04-19 12:05",
  "createdAt": "2026-04-10 09:00"
}
```

### 4.3 操作日志

```json
{
  "id": 1,
  "actor": "超级管理员",
  "module": "permissions",
  "action": "update-role",
  "target": "内容管理员: observer -> content_admin",
  "result": "success",
  "createdAt": "2026-04-19 12:20"
}
```

### 4.4 登录日志

```json
{
  "id": 1,
  "email": "super@zzumc.com",
  "status": "success",
  "ip": "127.0.0.1",
  "createdAt": "2026-04-19 12:05",
  "userAgent": "Chrome"
}
```

## 5. 权限点建议

建议在后端实施以下权限点：

- `permissions:read`
- `permissions:update-role`
- `permissions:update-status`
- `logs:read`

并由角色统一分配：

- `super_admin`：全部权限
- `content_admin`：不含权限中心管理，但可读日志
- `observer`：只读控制台和日志

## 6. 前端切换说明（Mock -> 真实 API）

联调时仅需替换以下服务层请求实现：

- `src/services/adminService.js`
- `src/services/logService.js`

页面层不需要重写，可直接对接。
