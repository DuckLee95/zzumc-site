import { getEntity, listEntity, removeEntity, replaceEntityList } from '../mocks/database'

function nowText() {
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
}

function sortByOrder(list) {
  return [...list].sort((a, b) => {
    const orderDiff = Number(a.order || 0) - Number(b.order || 0)
    if (orderDiff !== 0) return orderDiff
    return Number(a.id) - Number(b.id)
  })
}

function withSequentialOrder(list, changedIds = new Set()) {
  return sortByOrder(list).map((item, index) => ({
    ...item,
    order: index + 1,
    updatedAt: changedIds.has(Number(item.id)) ? nowText() : item.updatedAt,
  }))
}

async function persistDocs(list, changedIds = new Set()) {
  const normalized = withSequentialOrder(list, changedIds)
  await replaceEntityList('docs', normalized)
  return normalized
}

function getNextId(list) {
  return list.length ? Math.max(...list.map((item) => Number(item.id))) + 1 : 1
}

export async function fetchDocsList() {
  const items = await listEntity('docs')
  return items.sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
}

export async function fetchDocById(id) {
  return getEntity('docs', id)
}

export async function saveDoc(payload) {
  const list = await fetchDocsList()
  const isEdit = Boolean(payload.id)
  const changedIds = new Set()

  if (isEdit) {
    const current = list.find((item) => Number(item.id) === Number(payload.id))
    if (!current) return null

    const others = list.filter((item) => Number(item.id) !== Number(payload.id))
    const desiredOrder = Math.max(
      1,
      Math.min(Number(payload.order || current.order || 1), others.length + 1),
    )

    const merged = {
      ...current,
      ...payload,
      id: current.id,
      order: desiredOrder,
    }

    delete merged.insertFirst

    const orderedOthers = sortByOrder(others)
    orderedOthers.splice(desiredOrder - 1, 0, merged)

    changedIds.add(Number(current.id))
    return (await persistDocs(orderedOthers, changedIds)).find(
      (item) => Number(item.id) === Number(current.id),
    )
  }

  const nextId = getNextId(list)
  const insertFirst = Boolean(payload.insertFirst)
  const ordered = sortByOrder(list)
  const desiredOrder = insertFirst
    ? 1
    : Math.max(1, Math.min(Number(payload.order || ordered.length + 1), ordered.length + 1))

  const created = {
    ...payload,
    id: nextId,
    order: desiredOrder,
    updatedAt: nowText(),
  }

  delete created.insertFirst

  ordered.splice(desiredOrder - 1, 0, created)
  changedIds.add(Number(created.id))

  return (await persistDocs(ordered, changedIds)).find(
    (item) => Number(item.id) === Number(created.id),
  )
}

export async function deleteDoc(id) {
  await removeEntity('docs', id)
  const current = await fetchDocsList()
  await persistDocs(current)
  return { ok: true }
}

export async function moveDocOrder(id, action) {
  const list = sortByOrder(await fetchDocsList())
  const index = list.findIndex((item) => Number(item.id) === Number(id))
  if (index === -1) return null

  if (action === 'up' && index > 0) {
    const temp = list[index - 1]
    list[index - 1] = list[index]
    list[index] = temp
  }

  if (action === 'down' && index < list.length - 1) {
    const temp = list[index + 1]
    list[index + 1] = list[index]
    list[index] = temp
  }

  if (action === 'top' && index > 0) {
    const [item] = list.splice(index, 1)
    list.unshift(item)
  }

  if (action === 'bottom' && index < list.length - 1) {
    const [item] = list.splice(index, 1)
    list.push(item)
  }

  const resequenced = list.map((item, idx) => ({
    ...item,
    order: idx + 1,
  }))

  const changedIds = new Set(resequenced.map((item) => Number(item.id)))
  const normalized = await persistDocs(resequenced, changedIds)
  return normalized.find((item) => Number(item.id) === Number(id)) || null
}
