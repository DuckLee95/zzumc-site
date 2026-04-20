import { listEntity, replaceEntityList, upsertEntity } from '../mocks/database'

function nowText() {
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
}

async function appendOperationLog(payload) {
  await upsertEntity('operationLogs', {
    ...payload,
    createdAt: nowText(),
  })
}

export async function fetchRoles() {
  return listEntity('roles')
}

export async function fetchAdminUsers() {
  const [users, roles] = await Promise.all([
    listEntity('adminUsers'),
    listEntity('roles'),
  ])

  const roleMap = new Map(roles.map((item) => [item.code, item]))

  return users.map((user) => ({
    ...user,
    roleName: roleMap.get(user.roleCode)?.name || user.roleCode,
  }))
}

export async function updateAdminRole(id, roleCode, actor = '系统', actorId) {
  const [users, roles] = await Promise.all([
    listEntity('adminUsers'),
    listEntity('roles'),
  ])

  const role = roles.find((item) => item.code === roleCode)
  if (!role) {
    return {
      ok: false,
      message: '角色不存在',
    }
  }

  const index = users.findIndex((item) => Number(item.id) === Number(id))
  if (index === -1) {
    return {
      ok: false,
      message: '管理员不存在',
    }
  }

  if (Number(actorId) === Number(id)) {
    return {
      ok: false,
      message: '当前登录账号不可修改角色',
    }
  }

  const prevRole = users[index].roleCode
  users[index] = {
    ...users[index],
    roleCode,
  }

  await replaceEntityList('adminUsers', users)
  await appendOperationLog({
    actor,
    module: 'permissions',
    action: 'update-role',
    target: `${users[index].name}: ${prevRole} -> ${roleCode}`,
    result: 'success',
  })

  return {
    ok: true,
    data: {
      ...users[index],
      roleName: role.name,
    },
  }
}

export async function toggleAdminStatus(id, actor = '系统', actorId) {
  const users = await listEntity('adminUsers')
  const index = users.findIndex((item) => Number(item.id) === Number(id))

  if (index === -1) {
    return {
      ok: false,
      message: '管理员不存在',
    }
  }

  if (Number(actorId) === Number(id)) {
    return {
      ok: false,
      message: '当前登录账号不可禁用',
    }
  }

  const nextStatus = users[index].status === 'enabled' ? 'disabled' : 'enabled'

  users[index] = {
    ...users[index],
    status: nextStatus,
  }

  await replaceEntityList('adminUsers', users)
  await appendOperationLog({
    actor,
    module: 'permissions',
    action: 'toggle-status',
    target: `${users[index].name}: ${nextStatus}`,
    result: 'success',
  })

  return {
    ok: true,
    data: users[index],
  }
}
