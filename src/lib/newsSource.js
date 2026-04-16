import MarkdownIt from 'markdown-it'

const rawNews = import.meta.glob('../content/news/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[\s/]+/g, '-')
    .replace(/[^\w-\u4e00-\u9fa5-]/g, '')
}

function fileNameToSlug(filePath) {
  return filePath.split('/').pop().replace(/\.md$/, '')
}

function parseFrontmatter(raw) {
  let text = String(raw || '')

  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1)
  }

  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  text = text.replace(/^\s*\n/, '')

  if (!text.startsWith('---\n')) {
    return {
      data: {},
      content: text.trim(),
    }
  }

  const endIndex = text.indexOf('\n---\n', 4)
  if (endIndex === -1) {
    return {
      data: {},
      content: text.trim(),
    }
  }

  const frontmatterText = text.slice(4, endIndex).trim()
  const content = text.slice(endIndex + 5).trim()
  const data = {}

  for (const line of frontmatterText.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const idx = trimmed.indexOf(':')
    if (idx === -1) continue

    const key = trimmed.slice(0, idx).trim()
    let value = trimmed.slice(idx + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (
      [
        'importance',
        'homeOrder',
        'newsOrder',
      ].includes(key)
    ) {
      const num = Number(value)
      data[key] = Number.isNaN(num) ? 0 : num
    } else if (
      [
        'featured',
        'homeFeatured',
        'homeVisible',
        'newsVisible',
      ].includes(key)
    ) {
      data[key] = value === 'true'
    } else {
      data[key] = value
    }
  }

  return { data, content }
}

function createMarkdownRenderer() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })

  const defaultHeadingOpen =
    md.renderer.rules.heading_open ||
    ((tokens, idx, options, env, self) =>
      self.renderToken(tokens, idx, options))

  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const next = tokens[idx + 1]

    if (next && next.type === 'inline') {
      const title = next.content || ''
      const baseId = slugify(title) || `heading-${idx}`

      const usedMap = env.headingIdMap || new Map()
      env.headingIdMap = usedMap

      const count = usedMap.get(baseId) || 0
      usedMap.set(baseId, count + 1)

      const finalId = count === 0 ? baseId : `${baseId}-${count + 1}`
      token.attrSet('id', finalId)

      env.headings = env.headings || []
      env.headings.push({
        id: finalId,
        text: title,
        level: Number(token.tag.replace('h', '')),
      })
    }

    return defaultHeadingOpen(tokens, idx, options, env, self)
  }

  return md
}

const md = createMarkdownRenderer()

const localNews = Object.entries(rawNews)
  .map(([filePath, raw]) => {
    const { data, content } = parseFrontmatter(raw)

    const tags = String(data.tags || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    return {
      slug: data.slug || fileNameToSlug(filePath),
      title: data.title || fileNameToSlug(filePath),
      category: data.category || '未分类',
      tags,
      summary: data.summary || '',
      author: data.author || '未知作者',
      authorAvatar: data.authorAvatar || '/images/authors/default-author.png',
      publishedAt: data.publishedAt || '',
      cover: data.cover || '',

      homeVisible: Boolean(data.homeVisible),
      homeOrder: Number(data.homeOrder || 0),

      newsVisible: data.newsVisible === false ? false : true,
      newsOrder: Number(data.newsOrder || 0),

      featuredSlot: data.featuredSlot || '',
      imageFit: data.imageFit || 'cover',
      imagePosition: data.imagePosition || 'center center',
      detailImageFit: data.detailImageFit || 'contain',
      detailImagePosition: data.detailImagePosition || 'center center',

      importance: Number(data.importance || 0),
      markdown: content,
      sourcePath: filePath,
    }
  })
  .sort((a, b) => {
    const dateA = new Date(a.publishedAt || '1970-01-01').getTime()
    const dateB = new Date(b.publishedAt || '1970-01-01').getTime()
    return dateB - dateA
  })

export async function fetchNewsList() {
  return [...localNews].filter((item) => item.newsVisible)
}

export async function fetchNewsBySlug(slug) {
  const item = localNews.find((news) => news.slug === slug)
  if (!item) return null

  const env = {
    headings: [],
    headingIdMap: new Map(),
  }

  const html = md.render(item.markdown || '', env)

  return {
    ...item,
    html,
    headings: (env.headings || []).filter((item) => item.level <= 3),
  }
}

export async function fetchHomeNews() {
  return [...localNews]
    .filter((item) => item.homeVisible)
    .sort((a, b) => {
      if (a.homeOrder !== b.homeOrder) return a.homeOrder - b.homeOrder
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
}

export async function fetchNewsPageLayout() {
  const visibleNews = [...localNews]
    .filter((item) => item.newsVisible)
    .sort((a, b) => {
      if (a.newsOrder !== b.newsOrder) return a.newsOrder - b.newsOrder
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

  const slotMap = {
    main: null,
    'side-top': null,
    'side-bottom-left': null,
    'side-bottom-right': null,
  }

  for (const item of visibleNews) {
    if (item.featuredSlot && slotMap[item.featuredSlot] === null) {
      slotMap[item.featuredSlot] = item
    }
  }

  return {
    featured: slotMap,
    all: visibleNews,
  }
}

export async function fetchNewsTags() {
  const set = new Set()
  for (const item of localNews.filter((item) => item.newsVisible)) {
    for (const tag of item.tags) {
      set.add(tag)
    }
  }
  return ['全部', ...Array.from(set)]
}