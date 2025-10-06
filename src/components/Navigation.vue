<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'

const activeSection = ref('hero')
const isScrolled = ref(false)
const isDark = ref(document.documentElement.classList.contains('dark'))

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Show the action label (next theme), not the current one
const themeLabel = computed(() => isDark.value ? 'Light' : 'Dark')

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
]

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  } else if (sectionId === 'hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function handleScroll() {
  const scrollPosition = window.scrollY
  isScrolled.value = scrollPosition > 50

  const sections = navItems.map(item => ({
    id: item.id,
    element: document.getElementById(item.id),
    offsetTop: document.getElementById(item.id)?.offsetTop || 0
  }))

  const currentSection = sections.reduce((prev, current) => {
    return (scrollPosition >= current.offsetTop - 100) ? current : prev
  })

  activeSection.value = currentSection.id
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // Ensure clicking Home returns to top/hero when already on the page
  const home = navItems.find(n => n.id === 'hero')
  if (home) {
    activeSection.value = 'hero'
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav :class="['fixed top-0 left-0 right-0 z-50 transition-all duration-300', isScrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border' : 'bg-transparent']">
    <div class="container max-w-6xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="text-2xl font-bold flex items-center gap-2">
          <img src="/src/assets/white on black.png" alt="Youhok logo" class="h-7 w-7 rounded" />
          <span class="bg-gradient-accent bg-clip-text text-transparent">Youhok</span>
        </div>

        <div class="hidden md:flex items-center space-x-8">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="() => scrollToSection(item.id)"
            class="text-sm font-medium transition-colors duration-200 hover:text-primary"
            :class="activeSection === item.id ? 'text-primary' : 'text-muted-foreground'"
          >
            {{ item.label }}
          </button>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="px-3 py-2 rounded-md border border-border text-sm hover:bg-secondary/50"
            @click="toggleTheme"
            :aria-pressed="isDark"
            :title="`Switch to ${isDark ? 'light' : 'dark'} mode`"
          >
            {{ themeLabel }}
          </button>
          <button 
            class="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:brightness-90"
            @click="() => scrollToSection('contact')"
          >
            Hire Me
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
</style>

