import MarkdownIt from 'markdown-it'

const rawDocs = import.meta.glob('../content/docs/**/*.md', {
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

function groupIdFromName(name) {
  return slugify(name)
}

function parseFrontmatter(raw) {
  let text = String(raw || '')

  // 兼容 UTF-8 BOM
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1)
  }

  // 统一换行符，兼容 Windows CRLF
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // 去掉开头多余空白行
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

    if (key === 'groupOrder' || key === 'order') {
      const num = Number(value)
      data[key] = Number.isNaN(num) ? 999 : num
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

const localDocs = Object.entries(rawDocs)
  .map(([filePath, raw]) => {
    const { data, content } = parseFrontmatter(raw)

    return {
      slug: data.slug || fileNameToSlug(filePath),
      title: data.title || fileNameToSlug(filePath),
      description: data.description || '',
      group: data.group || '未分类',
      groupOrder: Number(data.groupOrder ?? 999),
      order: Number(data.order ?? 999),
      updatedAt: data.updatedAt || '',
      sourcePath: filePath,
      markdown: content,
    }
  })
  .sort((a, b) => {
    if (a.groupOrder !== b.groupOrder) return a.groupOrder - b.groupOrder
    if (a.group !== b.group) return a.group.localeCompare(b.group, 'zh-CN')
    if (a.order !== b.order) return a.order - b.order
    return a.title.localeCompare(b.title, 'zh-CN')
  })

function buildNavigationFromDocs(docs) {
  const groupMap = new Map()

  for (const doc of docs) {
    const groupId = groupIdFromName(doc.group)

    if (!groupMap.has(groupId)) {
      groupMap.set(groupId, {
        id: groupId,
        title: doc.group,
        groupOrder: doc.groupOrder,
        docs: [],
      })
    }

    groupMap.get(groupId).docs.push({
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
      order: doc.order,
      updatedAt: doc.updatedAt,
    })
  }

  return [...groupMap.values()]
    .sort((a, b) => a.groupOrder - b.groupOrder)
    .map((group) => ({
      ...group,
      docs: group.docs.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order
        return a.title.localeCompare(b.title, 'zh-CN')
      }),
    }))
}

export async function fetchDocsNavigation() {
  return buildNavigationFromDocs(localDocs)
}

export async function fetchFirstDocSlug() {
  const nav = await fetchDocsNavigation()
  return nav?.[0]?.docs?.[0]?.slug || null
}

export async function fetchDocBySlug(slug) {
  const doc = localDocs.find((item) => item.slug === slug)
  if (!doc) return null

  const env = {
    headings: [],
    headingIdMap: new Map(),
  }

  const html = md.render(doc.markdown || '', env)

  return {
    ...doc,
    html,
    headings: (env.headings || []).filter((item) => item.level <= 3),
  }
}