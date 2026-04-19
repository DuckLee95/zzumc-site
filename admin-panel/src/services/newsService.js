import { getEntity, listEntity, removeEntity, upsertEntity } from '../mocks/database'

export async function fetchNewsList() {
  const items = await listEntity('news')
  return items.sort((a, b) => Number(b.id) - Number(a.id))
}

export async function fetchNewsById(id) {
  return getEntity('news', id)
}

export async function saveNews(payload) {
  return upsertEntity('news', {
    ...payload,
    tags: Array.isArray(payload.tags)
      ? payload.tags
      : String(payload.tags || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
  })
}

export async function deleteNews(id) {
  return removeEntity('news', id)
}
