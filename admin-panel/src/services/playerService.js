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

function sortPlayers(list) {
  return [...list].sort((a, b) => String(a.username).localeCompare(String(b.username)))
}

async function appendOperationLog(payload) {
  await upsertEntity('operationLogs', {
    ...payload,
    createdAt: nowText(),
  })
}

export async function fetchPlayersList() {
  const list = await listEntity('players')
  return sortPlayers(list)
}

export async function fetchPlayerSyncLogs() {
  const list = await listEntity('playerSyncLogs')
  return list.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
}

export async function updatePlayerInfo(id, patch, actor = '系统') {
  const list = await fetchPlayersList()
  const index = list.findIndex((item) => Number(item.id) === Number(id))
  if (index === -1) {
    return { ok: false, message: '玩家不存在' }
  }

  const updated = {
    ...list[index],
    ...patch,
    updatedAt: nowText(),
  }

  list[index] = updated
  await replaceEntityList('players', sortPlayers(list))
  await appendOperationLog({
    actor,
    module: 'players',
    action: 'update',
    target: `${updated.username}`,
    result: 'success',
  })

  return { ok: true, data: updated }
}

export async function syncPlayersFromSkinSite(actor = '系统') {
  const list = await fetchPlayersList()
  const now = nowText()
  const nextId = list.length ? Math.max(...list.map((item) => Number(item.id))) + 1 : 1

  const createdPlayer = {
    id: nextId,
    uuid: `mock-${nextId}-skin-site`,
    username: `NewPlayer${nextId}`,
    nickname: `新成员${nextId}`,
    skinSiteId: `skin_${1000 + nextId}`,
    group: '未分组',
    canShowOnAbout: false,
    isAdminCandidate: false,
    status: 'active',
    lastSeenAt: now,
    updatedAt: now,
  }

  const updatedPlayers = list.map((item, idx) => {
    if (idx > 1) return item
    return {
      ...item,
      lastSeenAt: now,
      updatedAt: now,
    }
  })

  updatedPlayers.push(createdPlayer)
  await replaceEntityList('players', sortPlayers(updatedPlayers))

  await upsertEntity('playerSyncLogs', {
    source: 'skin-site',
    status: 'success',
    total: updatedPlayers.length,
    created: 1,
    updated: Math.min(2, list.length),
    message: '同步完成（mock），新增 1 人并刷新最近活跃时间。',
    createdAt: now,
  })

  await appendOperationLog({
    actor,
    module: 'players',
    action: 'sync',
    target: '皮肤站玩家同步',
    result: 'success',
  })

  return {
    ok: true,
    message: '同步完成（mock）',
  }
}
