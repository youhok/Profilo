<template>
  <div class="space-y-6">
    <!-- Breadcrumbs / heading -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-muted-foreground text-sm">
        <span>HOME</span>
        <span class="opacity-50">›</span>
        <span class="font-medium text-foreground">Dashboard</span>
      </div>
    </div>


    <!-- KPI cards (live counts) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-card text-card-foreground rounded-xl border border-sidebar-border p-4">
          <div class="text-xs text-muted-foreground">Projects</div>
        <div class="mt-1 flex items-center justify-between">
          <div class="text-2xl font-semibold">{{ displayCounts.projects }}</div>
          <div class="h-8 w-8 rounded-full bg-yellow-200 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs flex items-center justify-center">•</div>
        </div>
      </div>
      <div class="bg-card text-card-foreground rounded-xl border border-sidebar-border p-4">
        <div class="text-xs text-muted-foreground">Skills</div>
        <div class="mt-1 flex items-center justify-between">
          <div class="text-2xl font-semibold">{{ displayCounts.skills }}</div>
          <div class="h-8 w-8 rounded-full bg-emerald-200 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center">•</div>
        </div>
      </div>
      <div class="bg-card text-card-foreground rounded-xl border border-sidebar-border p-4">
        <div class="text-xs text-muted-foreground">Messages</div>
        <div class="mt-1 flex items-center justify-between">
          <div class="text-2xl font-semibold">{{ displayCounts.messages }}</div>
          <div class="h-8 w-8 rounded-full bg-sky-200 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs flex items-center justify-center">•</div>
        </div>
      </div>
    </div>

    <!-- Simple bar chart overview -->
    <div class="bg-card text-card-foreground rounded-xl border border-sidebar-border p-4">
      <div class="text-sm font-medium mb-4">Overview</div>
      <div class="grid grid-cols-3 gap-6 items-end h-40">
        <div class="flex flex-col items-center gap-2 h-full">
          <div class="h-full flex items-end">
            <div class="w-12 rounded-md bg-yellow-400 transition-all duration-700" :style="{ height: barHeight(displayCounts.projects) }"></div>
          </div>
          <div class="text-xs text-muted-foreground">Projects</div>
        </div>
        <div class="flex flex-col items-center gap-2 h-full">
          <div class="h-full flex items-end">
            <div class="w-12 rounded-md bg-emerald-500 transition-all duration-700" :style="{ height: barHeight(displayCounts.skills) }"></div>
          </div>
          <div class="text-xs text-muted-foreground">Skills</div>
        </div>
        <div class="flex flex-col items-center gap-2 h-full">
          <div class="h-full flex items-end">
            <div class="w-12 rounded-md bg-sky-500 transition-all duration-700" :style="{ height: barHeight(displayCounts.messages) }"></div>
          </div>
          <div class="text-xs text-muted-foreground">Messages</div>
        </div>
      </div>
    </div>

    
    
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { collection, getCountFromServer, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

const counts = reactive({ projects: 0, skills: 0, messages: 0 })
const displayCounts = reactive({ projects: 0, skills: 0, messages: 0 })

function animateCount(key: 'projects' | 'skills' | 'messages', target: number, durationMs = 1200) {
  const start = 0
  const startTime = performance.now()
  function step(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / durationMs, 1)
    const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
    displayCounts[key] = Math.round(start + (target - start) * eased)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function barHeight(value: number): string {
  const max = Math.max(1, counts.projects, counts.skills, counts.messages)
  const pct = Math.round((value / max) * 100)
  return `${Math.max(8, pct)}%` // ensure a visible minimum
}

async function safeCount(colName: string): Promise<number> {
  try {
    const snap = await getCountFromServer(collection(db, colName))
    return snap.data().count || 0
  } catch (e) {
    console.warn(`[dashboard] getCountFromServer failed for ${colName}; falling back`, e)
    try {
      const docs = await getDocs(collection(db, colName))
      return docs.size
    } catch (e2) {
      console.error(`[dashboard] getDocs fallback failed for ${colName}`, e2)
      return 0
    }
  }
}

async function loadCounts() {
  counts.projects = await safeCount('projects')
  counts.skills = await safeCount('skillCategories')
  counts.messages = await safeCount('messages')
  animateCount('projects', counts.projects)
  animateCount('skills', counts.skills)
  animateCount('messages', counts.messages)
}

onMounted(loadCounts)
</script>

<style scoped>
</style>


