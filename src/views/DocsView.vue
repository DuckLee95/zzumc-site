<template>
  <div class="docs-page-book">
    <div class="docs-shell">
      <aside class="docs-left-sidebar">
        <div class="docs-left-inner">
          <RouterLink class="docs-back-home" to="/">
            ← 返回主页面
          </RouterLink>

          <div class="docs-brand-block">
            <p class="docs-brand-kicker">DOCUMENTATION</p>
            <h1>帮助文档</h1>
            <p>郑爱玩MC 文档中心</p>
          </div>

          <div class="docs-search-wrap">
            <input
              v-model="keyword"
              class="docs-search-input"
              type="text"
              placeholder="搜索文档..."
            />
          </div>

          <div
            v-for="group in filteredNavigation"
            :key="group.id"
            class="docs-nav-group"
          >
            <button
              type="button"
              class="docs-nav-group-toggle"
              @click="toggleGroup(group.id)"
            >
              <span>{{ group.title }}</span>
              <span class="docs-nav-arrow" :class="{ open: openGroups[group.id] }">
                ▾
              </span>
            </button>

            <div v-show="openGroups[group.id]" class="docs-nav-group-content">
              <RouterLink
                v-for="doc in group.docs"
                :key="doc.slug"
                :to="`/docs/${doc.slug}`"
                class="docs-nav-doc"
                :class="{ active: currentSlug === doc.slug }"
              >
                {{ doc.title }}
              </RouterLink>
            </div>
          </div>
        </div>
      </aside>

      <main class="docs-main">
        <div class="docs-main-inner" v-if="currentDoc">
          <div class="docs-top-intro">
            <p class="docs-top-kicker">MC COMMUNITY DOCS</p>
            <h2>{{ currentDoc.title }}</h2>
            <p>{{ currentDoc.description }}</p>
          </div>

          <article class="docs-book-article">
            <div class="docs-book-page">
              <div class="docs-book-page-inner">
                <div class="docs-doc-meta" v-if="currentDoc.updatedAt">
                  更新于：{{ currentDoc.updatedAt }}
                </div>

                <div
                  ref="articleRef"
                  class="docs-markdown-body"
                  v-html="currentDoc.html"
                ></div>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="docs-empty-state">
          <div class="docs-book-page">
            <div class="docs-book-page-inner">
              <h2>未找到文档</h2>
              <p>当前文档不存在，或者还没有发布。</p>
            </div>
          </div>
        </div>
      </main>

      <aside class="docs-right-sidebar">
        <div class="docs-right-inner">
          <p class="docs-right-title">本页导航</p>

          <a
            v-for="item in currentDoc?.headings || []"
            :key="item.id"
            :href="`#${item.id}`"
            class="docs-right-link"
            :class="{
              active: activeHeadingId === item.id,
              level3: item.level === 3
            }"
          >
            {{ item.text }}
          </a>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  fetchDocBySlug,
  fetchDocsNavigation,
  fetchFirstDocSlug,
} from '../lib/docsSource'

const route = useRoute()
const router = useRouter()

const navigation = ref([])
const currentDoc = ref(null)
const keyword = ref('')
const activeHeadingId = ref('')
const articleRef = ref(null)

const openGroups = reactive({})

const currentSlug = computed(() => String(route.params.slug || ''))

const filteredNavigation = computed(() => {
  if (!keyword.value.trim()) return navigation.value

  const q = keyword.value.trim().toLowerCase()

  return navigation.value
    .map((group) => ({
      ...group,
      docs: group.docs.filter(
        (doc) =>
          doc.title.toLowerCase().includes(q) ||
          (doc.description || '').toLowerCase().includes(q)
      ),
    }))
    .filter((group) => group.docs.length > 0)
})

function toggleGroup(groupId) {
  openGroups[groupId] = !openGroups[groupId]
}

async function loadNavigation() {
  const nav = await fetchDocsNavigation()
  navigation.value = nav

  for (const group of nav) {
    if (!(group.id in openGroups)) {
      openGroups[group.id] = true
    }
  }
}

async function loadCurrentDoc(slug) {
  currentDoc.value = await fetchDocBySlug(slug)

  await nextTick()
  updateActiveHeading()

  if (route.hash) {
    const el = document.querySelector(route.hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function updateActiveHeading() {
  if (!currentDoc.value?.headings?.length) return

  let current = currentDoc.value.headings[0]?.id || ''

  for (const heading of currentDoc.value.headings) {
    const el = document.getElementById(heading.id)
    if (!el) continue

    const rect = el.getBoundingClientRect()
    if (rect.top <= 140) {
      current = heading.id
    }
  }

  activeHeadingId.value = current
}

watch(
  () => route.params.slug,
  async (slug) => {
    if (!navigation.value.length) {
      await loadNavigation()
    }

    if (!slug) {
      const firstSlug = await fetchFirstDocSlug()
      if (firstSlug) {
        router.replace(`/docs/${firstSlug}`)
      }
      return
    }

    await loadCurrentDoc(String(slug))
  },
  { immediate: true }
)

watch(
  () => route.hash,
  async () => {
    await nextTick()
    if (route.hash) {
      const el = document.querySelector(route.hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }
)

onMounted(() => {
  window.addEventListener('scroll', updateActiveHeading, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveHeading)
})
</script>