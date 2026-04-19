<template>
  <div class="placeholder-page">
    <CommandPanel :title="title" subtitle="MODULE PLACEHOLDER">
      <p>{{ description }}</p>
      <p>当前页面在阶段 A 只提供壳层入口，后续按计划分阶段交付业务能力。</p>
    </CommandPanel>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CommandPanel from '../components/ui/CommandPanel.vue'

const route = useRoute()

const title = computed(() => String(route.meta.title || '模块页面'))
const description = computed(() => String(route.meta.description || '该模块即将施工。'))
</script>
