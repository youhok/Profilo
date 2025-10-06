<script setup lang="ts">
// @ts-ignore - asset modules are typed via shims
import heroImage from '@/assets/hero-portrait.jpg'

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  element?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section id="hero" class="min-h-screen bg-gradient-hero flex items-center justify-center px-6">
    <div class="container max-w-6xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <div class="space-y-4">
            <h1 class="text-5xl lg:text-7xl font-bold tracking-tight">
              Hello, I'm <span class="bg-gradient-accent bg-clip-text text-transparent">Heng Youhok</span>
            </h1>
            <p class="text-xl lg:text-2xl text-muted-foreground">Creative Developer & UI/UX Designer</p>
            <p class="text-lg text-muted-foreground max-w-lg">
              I craft beautiful, functional digital experiences that bridge the gap between creativity and technology.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              class="px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:brightness-90 transition-all duration-300"
              @click="() => scrollToSection('projects')"
            >
              View My Work
            </button>
            <button 
              class="px-6 py-3 rounded-md border border-border hover:bg-accent transition-all duration-300"
              @click="() => scrollToSection('contact')"
            >
              Get In Touch
            </button>
          </div>
        </div>
        <div class="relative">
          <div class="relative group">
            <div class="absolute -inset-4 bg-gradient-accent opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-300 rounded-2xl" />
            <img 
              :src="heroImage" 
              alt="Professional portrait" 
              class="relative w-full max-w-sm mx-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>

