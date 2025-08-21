<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const activeSection = ref('hero')
const isScrolled = ref(false)

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
]

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  element?.scrollIntoView({ behavior: 'smooth' })
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
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav :class="['fixed top-0 left-0 right-0 z-50 transition-all duration-300', isScrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border' : 'bg-transparent']">
    <div class="container max-w-6xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="text-2xl font-bold">
          <span class="bg-gradient-accent bg-clip-text text-transparent">Youhok</span>
        </div>

        <div class="hidden md:flex items-center space-x-8">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="() => scrollToSection(item.id)"
            class="text-sm font-medium transition-colors duration-200 hover:text-accent"
            :class="activeSection === item.id ? 'text-accent' : 'text-muted-foreground'"
          >
            {{ item.label }}
          </button>
        </div>

        <button 
          class="px-4 py-2 rounded-md bg-gradient-accent text-primary-foreground hover:shadow-glow/20"
          @click="() => scrollToSection('contact')"
        >
          Hire Me
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
</style>

