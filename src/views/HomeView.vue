<template>
  <div class="site-shell">
    <AnnouncementBar />
    <HeroSection />
    <CommunityIntroSection />
    <ServerInfoSection />
    <NewsSection />
    <ShowcaseSection />
    <QuickStartSection />
    <SiteFooter />
  </div>
</template>

<script setup>
import AnnouncementBar from '../components/home/AnnouncementBar.vue'
import HeroSection from '../components/home/HeroSection.vue'
import CommunityIntroSection from '../components/home/CommunityIntroSection.vue'
import ServerInfoSection from '../components/home/ServerInfoSection.vue'
import NewsSection from '../components/home/NewsSection.vue'
import ShowcaseSection from '../components/home/ShowcaseSection.vue'
import QuickStartSection from '../components/home/QuickStartSection.vue'
import SiteFooter from '../components/home/SiteFooter.vue'
</script>
