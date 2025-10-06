<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/firebase'

type Project = {
  id?: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
}

const projects = ref<Project[]>([])

async function fetchProjects() {
  const snap = await getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc')))
  projects.value = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Project,'id'>) }))
}

onMounted(fetchProjects)
</script>

<template>
  <section id="projects" class="py-20 px-6 bg-secondary/30">
    <div class="container max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold mb-6">Featured Projects</h2>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
          A selection of projects that showcase my skills in development and design.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <div 
          v-for="(project, index) in projects" 
          :key="project.id || index" 
          :class="['overflow-hidden bg-gradient-card border border-border rounded-lg hover:shadow-xl transition-all duration-300 group', project.featured ? 'md:col-span-2 lg:col-span-1' : '']"
        >
          <div class="relative overflow-hidden">
            <img 
              :src="project.image" 
              :alt="project.title"
              class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div class="p-6">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-xl font-semibold">{{ project.title }}</h3>
              <span v-if="project.featured" class="px-2 py-1 text-xs rounded-md bg-gradient-accent text-primary-foreground">Featured</span>
            </div>

            <p class="text-muted-foreground mb-4 leading-relaxed">
              {{ project.description }}
            </p>

            <div class="flex flex-wrap gap-2 mb-6">
              <span v-for="(tech, techIndex) in project.technologies" :key="techIndex" class="text-xs px-2.5 py-1 rounded-md bg-secondary border border-border">
                {{ tech }}
              </span>
            </div>

            <div class="flex gap-3">
              <a :href="project.liveUrl" class="px-3 py-2 rounded-md bg-gradient-accent text-primary-foreground hover:shadow-glow/20 text-sm">Live Demo</a>
              <a :href="project.githubUrl" class="px-3 py-2 rounded-md border border-border text-sm">Source</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
