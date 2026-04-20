<template>
  <section class="command-panel" :class="panelClass">
    <header v-if="title || subtitle" class="command-panel__head">
      <p v-if="subtitle" class="command-panel__subtitle">{{ subtitle }}</p>
      <h3 v-if="title" class="command-panel__title">{{ title }}</h3>
    </header>

    <div class="command-panel__body">
      <slot />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'default',
  },
})

const panelClass = computed(() => `is-${props.tone}`)
</script>
