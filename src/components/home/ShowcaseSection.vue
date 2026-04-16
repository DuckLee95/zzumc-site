<template>
  <section id="showcase" class="section section-showcase showcase-section-wide">
    <div class="container container-wide">
      <div class="section-heading center">
        <p class="section-kicker">SHOWCASE</p>
        <h2>风采展示</h2>
      </div>

      <div
        class="showcase-carousel pixel-frame showcase-carousel-large"
        @mouseenter="stopAuto"
        @mouseleave="startAuto"
      >
        <div
          class="showcase-track"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <article
            v-for="(slide, index) in slides"
            :key="index"
            class="showcase-slide"
          >
            <img :src="slide.image" :alt="slide.title" />
            <div class="showcase-slide-overlay showcase-overlay-large">
              <p class="showcase-slide-kicker">{{ slide.kicker }}</p>
              <h3>{{ slide.title }}</h3>
              <p>{{ slide.desc }}</p>
            </div>
          </article>
        </div>

        <button class="carousel-arrow left" @click="prevSlide" aria-label="上一张">
          ‹
        </button>
        <button class="carousel-arrow right" @click="nextSlide" aria-label="下一张">
          ›
        </button>

        <div class="carousel-dots">
          <button
            v-for="(slide, index) in slides"
            :key="index"
            class="carousel-dot"
            :class="{ active: currentIndex === index }"
            @click="goToSlide(index)"
            :aria-label="`切换到第 ${index + 1} 张`"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const slides = [
  {
    image: '/images/showcase-1.jpg',
    kicker: '主城展示',
    title: '我们的主城与核心建筑',
    desc: '建议这里放最能代表你们社团气质和审美的一张大图。',
  },
  {
    image: '/images/showcase-2.jpg',
    kicker: '活动现场',
    title: '活动、联机与社团互动',
    desc: '适合展示社团活动、节日企划、多人联机或大型项目过程。',
  },
  {
    image: '/images/showcase-3.jpg',
    kicker: '建筑风采',
    title: '建筑作品与世界景观',
    desc: '可以放建筑夜景、特色地标和一些高质量的世界截图。',
  },
]

const currentIndex = ref(0)
let timer = null

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % slides.length
}

function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length
}

function goToSlide(index) {
  currentIndex.value = index
}

function startAuto() {
  stopAuto()
  timer = setInterval(() => {
    nextSlide()
  }, 4500)
}

function stopAuto() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  startAuto()
})

onBeforeUnmount(() => {
  stopAuto()
})
</script>