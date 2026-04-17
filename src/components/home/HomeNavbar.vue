<template>
  <header class="home-navbar">
    <div class="container navbar-container-wide navbar-inner">
      <RouterLink class="brand" to="/">
        <img class="brand-logo" src="/images/logo.png" alt="郑爱玩MC Logo" />
        <span class="brand-text">郑爱玩MC</span>
      </RouterLink>

      <nav class="nav-links">
        <RouterLink to="/">主页</RouterLink>
        <RouterLink to="/news">最新消息</RouterLink>
        <RouterLink to="/docs">帮助文档</RouterLink>
        <RouterLink to="/downloads">资源下载</RouterLink>
        <RouterLink to="/server-info">服务器信息</RouterLink>

        <a href="https://pd.qq.com/s/9vp9i3opo" target="_blank" rel="noreferrer" class="external-nav-link">
          <span>QQ频道</span>
          <span class="external-badge">↗</span>
        </a>

        <RouterLink to="/about">关于</RouterLink>
      </nav>

      <div class="navbar-actions">
        <a class="pixel-btn pixel-btn-primary nav-login" href="https://skin.twinklestars.top/auth/login" target="_blank"
          rel="noreferrer">
          皮肤站登录
        </a>

        <button class="mobile-menu-btn" type="button" :aria-expanded="mobileOpen ? 'true' : 'false'" aria-label="打开菜单"
          @click="mobileOpen = !mobileOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <transition name="mobile-menu-fade">
      <div v-if="mobileOpen" class="mobile-menu">
        <div class="container mobile-menu-inner">
          <RouterLink to="/" @click="closeMenu">主页面</RouterLink>
          <RouterLink to="/news" @click="closeMenu">最新消息</RouterLink>
          <RouterLink to="/docs" @click="closeMenu">帮助文档</RouterLink>
          <RouterLink to="/downloads" @click="closeMenu">资源下载</RouterLink>
          <RouterLink to="/server-info" @click="closeMenu">服务器信息</RouterLink>

          <a href="https://pd.qq.com/s/9vp9i3opo" target="_blank" rel="noreferrer" @click="closeMenu"
            class="external-nav-link">
            <span>QQ频道</span>
            <span class="external-badge">↗</span>
          </a>

          <RouterLink to="/about" @click="closeMenu">关于社团</RouterLink>

          <a href="https://skin.twinklestars.top/auth/login" target="_blank" rel="noreferrer" @click="closeMenu">
            皮肤站登录
          </a>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const mobileOpen = ref(false)

function closeMenu() {
  mobileOpen.value = false
}
</script>
