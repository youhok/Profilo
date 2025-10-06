<template>
  <div class="min-h-screen bg-sidebar text-sidebar-foreground">
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar :open="sidebarOpen" @close="toggleSidebar" />

      <!-- Main area -->
      <div class="flex-1 flex flex-col min-w-0 bg-background" :style="contentOffsetStyle">
        <!-- Navbar -->
        <Navbar
          v-model="searchQuery"
          @toggle-sidebar="toggleSidebar"
          @logout="logout"
        />

        <!-- Content -->
        <main class="p-4 md:p-6">
          <RouterView />
        </main>
      </div>
    </div>

    <!-- Backdrop for mobile when sidebar open -->
    <transition name="fade">
      <div v-if="sidebarOpen && !isDesktop" class="fixed inset-0 z-30 md:hidden bg-black/40" @click="toggleSidebar"></div>
    </transition>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'
// @ts-ignore - Vue SFC default export is handled by Vue compiler
import Sidebar from '../components/Sidebar.vue'
// @ts-ignore - Vue SFC default export is handled by Vue compiler
import Navbar from '../components/Navbar.vue'

const route = useRoute()
const searchQuery = ref('')
const sidebarOpen = ref(false)
const isDesktop = ref(false)

function handleResize() {
  isDesktop.value = window.innerWidth >= 1024
  sidebarOpen.value = isDesktop.value
}
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))

function isActive(path: string) {
  return route.path === path
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

async function logout() {
  await signOut(auth)
  window.location.href = '/'
}

const contentOffsetStyle = computed(() => {
  if (isDesktop.value && sidebarOpen.value) {
    return { marginLeft: '16rem' }
  }
  return { marginLeft: '0px' }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>


