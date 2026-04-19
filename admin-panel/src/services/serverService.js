import { getEntity, listEntity, removeEntity, replaceEntityList, upsertEntity } from '../mocks/database'

function nowText() {
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
}

function sortByWeight(list) {
  return [...list].sort((a, b) => {
    const diff = Number(a.weight || 0) - Number(b.weight || 0)
    if (diff !== 0) return diff
    return Number(a.id) - Number(b.id)
  })
}

function normalizeWeight(list) {
  return sortByWeight(list).map((item, index) => ({
    ...item,
    weight: index + 1,
  }))
}

async function appendOperationLog(payload) {
  await upsertEntity('operationLogs', {
    ...payload,
    createdAt: nowText(),
  })
}

export async function fetchServersList() {
  const list = await listEntity('servers')
  return sortByWeight(list)
}

export async function fetchServerById(id) {
  return getEntity('servers', id)
}

export async function saveServer(payload, actor = '系统') {
  const list = await fetchServersList()

  if (payload.id) {
    const current = list.find((item) => Number(item.id) === Number(payload.id))
    if (!current) return null

    const others = list.filter((item) => Number(item.id) !== Number(payload.id))
    const desiredWeight = Math.max(1, Math.min(Number(payload.weight || current.weight || 1), others.length + 1))

    const merged = {
      ...current,
      ...payload,
      id: current.id,
      weight: desiredWeight,
      port: Number(payload.port || current.port || 25565),
      maxPlayers: Number(payload.maxPlayers || current.maxPlayers || 100),
      currentPlayers: Math.max(0, Number(payload.currentPlayers || current.currentPlayers || 0)),
    }

    const ordered = sortByWeight(others)
    ordered.splice(desiredWeight - 1, 0, merged)
    const normalized = normalizeWeight(ordered)

    await replaceEntityList('servers', normalized)
    await appendOperationLog({
      actor,
      module: 'servers',
      action: 'update',
      target: merged.name,
      result: 'success',
    })

    return normalized.find((item) => Number(item.id) === Number(current.id)) || null
  }

  const nextId = list.length ? Math.max(...list.map((item) => Number(item.id))) + 1 : 1
  const desiredWeight = Math.max(1, Math.min(Number(payload.weight || list.length + 1), list.length + 1))

  const created = {
    ...payload,
    id: nextId,
    weight: desiredWeight,
    status: payload.status || 'offline',
    syncMode: payload.syncMode || 'status-api',
    featured: Boolean(payload.featured),
    port: Number(payload.port || 25565),
    maxPlayers: Number(payload.maxPlayers || 100),
    currentPlayers: Math.max(0, Number(payload.currentPlayers || 0)),
    updatedAt: nowText(),
  }

  const ordered = sortByWeight(list)
  ordered.splice(desiredWeight - 1, 0, created)
  const normalized = normalizeWeight(ordered)

  await replaceEntityList('servers', normalized)
  await appendOperationLog({
    actor,
    module: 'servers',
    action: 'create',
    target: created.name,
    result: 'success',
  })

  return normalized.find((item) => Number(item.id) === Number(created.id)) || null
}

export async function deleteServer(id, actor = '系统') {
  const target = await fetchServerById(id)
  await removeEntity('servers', id)

  const current = await fetchServersList()
  const normalized = normalizeWeight(current)
  await replaceEntityList('servers', normalized)

  await appendOperationLog({
    actor,
    module: 'servers',
    action: 'delete',
    target: target?.name || `id:${id}`,
    result: 'success',
  })

  return { ok: true }
}

export async function syncServerStatus(id, actor = '系统') {
  const list = await fetchServersList()
  const index = list.findIndex((item) => Number(item.id) === Number(id))
  if (index === -1) {
    return { ok: false, message: '服务器不存在' }
  }

  const server = list[index]
  const isOnline = server.status !== 'online'
  const currentPlayers = isOnline ? Math.min(server.maxPlayers, Math.max(0, Number(server.currentPlayers || 0) + 3)) : 0

  list[index] = {
    ...server,
    status: isOnline ? 'online' : 'offline',
    currentPlayers,
    updatedAt: nowText(),
  }

  const normalized = normalizeWeight(list)
  await replaceEntityList('servers', normalized)
  await appendOperationLog({
    actor,
    module: 'servers',
    action: 'sync',
    target: `${server.name}: ${isOnline ? 'online' : 'offline'}`,
    result: 'success',
  })

  return { ok: true, data: normalized[index] }
}

export async function syncAllServers(actor = '系统') {
  const list = await fetchServersList()
  const normalized = list.map((item, index) => {
    const online = index % 2 === 0
    return {
      ...item,
      status: online ? 'online' : 'offline',
      currentPlayers: online ? Math.min(item.maxPlayers, Number(item.currentPlayers || 0) + 2) : 0,
      updatedAt: nowText(),
    }
  })

  await replaceEntityList('servers', normalizeWeight(normalized))
  await appendOperationLog({
    actor,
    module: 'servers',
    action: 'sync-all',
    target: `共 ${list.length} 台服务器`,
    result: 'success',
  })

  return { ok: true }
}
