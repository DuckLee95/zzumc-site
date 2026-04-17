import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NewsView from '../views/NewsView.vue'
import NewsDetailView from '../views/NewsDetailView.vue'
import DocsView from '../views/DocsView.vue'
import DownloadsView from '../views/DownloadsView.vue'
import ContactView from '../views/ContactView.vue'
import ServerInfoView from '../views/ServerInfoView.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      return {
        el: to.hash,
        top: 110,
        behavior: 'smooth',
      }
    }

    return {
      top: 0,
      behavior: 'smooth',
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/news',
      name: 'news',
      component: NewsView,
    },
    {
      path: '/news/:slug',
      name: 'news-detail',
      component: NewsDetailView,
    },
    {
      path: '/docs/:slug?',
      name: 'docs',
      component: DocsView,
    },
    {
      path: '/downloads',
      name: 'downloads',
      component: DownloadsView,
    },
    {
      path: '/server-info',
      name: 'server-info',
      component: ServerInfoView,
    },
    {
      path: '/about',
      alias: '/contact',
      name: 'about',
      component: ContactView,
    },
  ],
})

export default router
