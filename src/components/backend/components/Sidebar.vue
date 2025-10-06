<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground transition-transform duration-300 ease-in-out will-change-transform',
      open ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="h-16 flex items-center px-6 border-b border-sidebar-border">
      <RouterLink to="/dashboard" class="text-xl font-semibold flex items-center gap-2">
        <span class="inline-block h-3 w-3 rounded-full bg-emerald-500"></span>
        Youhok
      </RouterLink>
    </div>
    <nav class="flex-1 p-4 space-y-1 text-sm overflow-y-auto">
      <RouterLink
        to="/dashboard"
        class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        :class="{ 'bg-sidebar-accent text-sidebar-accent-foreground': isActive('/dashboard') && !$route.path.includes('/dashboard/projects') }"
        @click="$emit('close')"
      >
        <span class="inline-block h-2.5 w-2.5 rounded-full bg-slate-400"></span>
        Dashboard
      </RouterLink>
      <RouterLink
        to="/dashboard/projects"
        class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        :class="{ 'bg-sidebar-accent text-sidebar-accent-foreground': $route.path.startsWith('/dashboard/projects') }"
        @click="$emit('close')"
      >
        <span class="inline-block h-2.5 w-2.5 rounded-full bg-slate-400"></span>
        Projects
      </RouterLink>
      <RouterLink
        to="/dashboard/skills"
        class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        :class="{ 'bg-sidebar-accent text-sidebar-accent-foreground': $route.path.startsWith('/dashboard/skills') }"
        @click="$emit('close')"
      >
        <span class="inline-block h-2.5 w-2.5 rounded-full bg-slate-400"></span>
        Skills
      </RouterLink>
      <div class="pt-2 text-xs uppercase tracking-wider text-slate-400 px-3">Settings</div>
      <RouterLink
        to="/dashboard/settings"
        class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        :class="{ 'bg-sidebar-accent text-sidebar-accent-foreground': $route.path.startsWith('/dashboard/projects') }"
        @click="$emit('close')"
      >
        <span class="inline-block h-2.5 w-2.5 rounded-full bg-slate-400"></span>
        Settings
      </RouterLink>
     
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
defineProps<{ open: boolean }>()
defineEmits<{ (e: 'close'): void }>()
function isActive(path: string) {
  return route.path === path
}


</script>

<style scoped>
</style>


