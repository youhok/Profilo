<script setup lang="ts">
// @ts-nocheck
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navigation from '@/components/Navigation.vue'
import Hero from '@/components/Hero.vue'
import About from '@/components/About.vue'
import Skills from '@/components/Skills.vue'
import Projects from '@/components/Projects.vue'
import Contact from '@/components/Contact.vue'

const route = useRoute()
const showLanding = computed(() => !route.meta?.isBackend)
</script>

<template>
  <Navigation v-if="showLanding" />
  <main v-if="showLanding" class="bg-background text-foreground">
    <Hero />
    <About />
    <Skills />
    <Projects />
    <Contact />
  </main>
  <footer v-if="showLanding" class="bg-secondary/50 py-8 px-6 border-t border-border">
    <div class="container max-w-6xl mx-auto text-center">
      <p class="text-muted-foreground">
        © 2025 Heng Youhok. Built with Vue, TypeScript & Tailwind CSS.
      </p>
    </div>
  </footer>

  <router-view v-else />
</template>

<style scoped>
</style>

