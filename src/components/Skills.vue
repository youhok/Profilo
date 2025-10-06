<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/firebase'

type SkillCategory = { title: string; icon: string; skills: string[] }

const skillCategories = ref<SkillCategory[]>([])

async function loadCategories() {
  const colRef = collection(db, 'skillCategories')
  const q = query(colRef, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  skillCategories.value = snap.docs.map(d => d.data() as SkillCategory)
}

onMounted(loadCategories)
</script>

<template>
  <section id="skills" class="py-20 px-6">
    <div class="container max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold mb-6">Skills & Expertise</h2>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
          A comprehensive toolkit for building modern web applications and digital experiences.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(category, index) in skillCategories" 
          :key="index" 
          class="p-6 bg-gradient-card border border-border rounded-lg hover:shadow-lg hover:shadow-glow/10 transition-all duration-300 group"
        >
          <div class="text-center mb-4">
            <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
              {{ category.icon }}
            </div>
            <h3 class="text-lg font-semibold mb-4">{{ category.title }}</h3>
          </div>
          <div class="flex flex-wrap gap-2 justify-center">
            <span 
              v-for="(skill, skillIndex) in category.skills" 
              :key="skillIndex" 
              class="text-xs px-2.5 py-1 rounded-md bg-secondary text-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>