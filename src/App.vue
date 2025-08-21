<script setup lang="ts">
// @ts-nocheck
import Navigation from '@/components/Navigation.vue'
import Hero from '@/components/Hero.vue'
import About from '@/components/About.vue'
import Skills from '@/components/Skills.vue'
import Projects from '@/components/Projects.vue'
import Contact from '@/components/Contact.vue'
</script>

<template>
  <Navigation />
  <main class="bg-background text-foreground">
    <Hero />
    <About />
    <Skills />
    <Projects />
    <Contact />
  </main>
  <footer class="bg-secondary/50 py-8 px-6 border-t border-border">
    <div class="container max-w-6xl mx-auto text-center">
      <p class="text-muted-foreground">
        © 2024 Alex. Built with Vue, TypeScript & Tailwind CSS.
      </p>
    </div>
  </footer>
  
</template>

<style scoped>
</style>

