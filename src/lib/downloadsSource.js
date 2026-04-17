import { downloadsCatalog } from '../data/downloads'

export const ALL_DOWNLOAD_CATEGORY = 'all'

function text(value) {
  return String(value || '').trim()
}

function resolveAction(action = {}) {
  const route = text(action.route)
  const href = text(action.href || action.apiPath)

  if (route) {
    return {
      text: text(action.text) || '查看详情',
      pendingText: text(action.pendingText) || '链接待接入',
      kind: 'route',
      target: route,
      ready: true,
      newTab: false,
      fileId: text(action.fileId),
    }
  }

  if (href) {
    return {
      text: text(action.text) || '立即下载',
      pendingText: text(action.pendingText) || '链接待接入',
      kind: 'link',
      target: href,
      ready: true,
      newTab: action.newTab !== false,
      fileId: text(action.fileId),
    }
  }

  return {
    text: text(action.text) || '立即下载',
    pendingText: text(action.pendingText) || '链接待接入',
    kind: 'pending',
    target: '',
    ready: false,
    newTab: false,
    fileId: text(action.fileId),
  }
}

function normalizeResource(resource, categoryMap) {
  const category = categoryMap.get(resource.category) || {
    id: text(resource.category) || 'uncategorized',
    label: text(resource.categoryLabel) || '未分类',
    chipClass: 'stone',
  }

  const keywords = Array.isArray(resource.keywords)
    ? resource.keywords.map((item) => text(item)).filter(Boolean)
    : []

  return {
    ...resource,
    categoryLabel: text(resource.categoryLabel) || category.label,
    categoryClass: text(resource.categoryClass) || category.chipClass,
    primaryAction: resolveAction(resource.primaryAction),
    secondaryAction: resource.secondaryAction ? resolveAction(resource.secondaryAction) : null,
    searchText: [
      resource.title,
      resource.summary,
      resource.version,
      resource.target,
      category.label,
      ...keywords,
    ]
      .map((item) => text(item).toLowerCase())
      .filter(Boolean)
      .join(' '),
  }
}

function buildCategoryOptions(items, categories) {
  const countMap = new Map()

  for (const item of items) {
    countMap.set(item.category, (countMap.get(item.category) || 0) + 1)
  }

  const categoryMap = new Map(categories.map((category) => [category.id, category]))

  const configured = categories
    .filter((category) => countMap.has(category.id))
    .map((category) => ({
      id: category.id,
      label: category.label,
      chipClass: category.chipClass,
      count: countMap.get(category.id) || 0,
    }))

  const dynamic = [...countMap.keys()]
    .filter((categoryId) => !categoryMap.has(categoryId))
    .map((categoryId) => {
      const item = items.find((resource) => resource.category === categoryId)

      return {
        id: categoryId,
        label: item?.categoryLabel || categoryId,
        chipClass: item?.categoryClass || 'stone',
        count: countMap.get(categoryId) || 0,
      }
    })

  return [
    {
      id: ALL_DOWNLOAD_CATEGORY,
      label: '全部',
      chipClass: 'stone',
      count: items.length,
    },
    ...configured,
    ...dynamic,
  ]
}

export async function fetchDownloadsPageData() {
  const categories = Array.isArray(downloadsCatalog.categories) ? downloadsCatalog.categories : []
  const categoryMap = new Map(categories.map((category) => [category.id, category]))

  const items = Array.isArray(downloadsCatalog.resources)
    ? downloadsCatalog.resources.map((resource) => normalizeResource(resource, categoryMap))
    : []

  const featuredItem =
    items.find((item) => item.id === downloadsCatalog.featuredResourceId) ||
    items.find((item) => item.featured) ||
    items[0] ||
    null

  return {
    hero: downloadsCatalog.hero || null,
    listDescription: text(downloadsCatalog.listDescription),
    featuredLabel: text(downloadsCatalog.featuredLabel) || '推荐下载',
    featuredHighlights: Array.isArray(downloadsCatalog.featuredHighlights)
      ? downloadsCatalog.featuredHighlights
      : [],
    notes: Array.isArray(downloadsCatalog.notes) ? downloadsCatalog.notes : [],
    searchPlaceholder:
      text(downloadsCatalog.searchPlaceholder) || '搜索资源名称、版本、适用版本或关键词...',
    categoryOptions: buildCategoryOptions(items, categories),
    featuredItem,
    items,
  }
}
