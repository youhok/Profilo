<template>
  <header class="h-16 bg-card border-b border-sidebar-border flex items-center justify-between px-4 md:px-6 text-card-foreground">
    <button class="px-3 py-2 rounded-md border border-sidebar-border" @click="$emit('toggle-sidebar')"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
       stroke-width="2" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg></button>
    <!-- <div class="flex items-center gap-3">
      <div class="relative">
        <input v-model="search" placeholder="Search" class="h-9 w-64 rounded-full border border-sidebar-border bg-slate-50 px-4 text-sm focus:outline-none" />
        <span class="absolute inset-y-0 right-3 flex items-center text-slate-400 text-xs">⌘K</span>
      </div>
    </div> -->
    <div class="flex items-center gap-4">
      <div class="hidden md:flex items-center gap-4 text-slate-500">
        <span class="relative inline-block"></span>
        <img v-if="userPhotoURL" :src="userPhotoURL" alt="avatar" class="h-8 w-8 rounded-full object-cover border border-sidebar-border" />
        <div v-else class="h-8 w-8 rounded-full bg-slate-200"></div>
        <span class="hidden lg:block text-sm font-medium">{{ userDisplayName || 'User' }}</span>
      </div>
      <button @click="$emit('logout')" class="h-9 px-3 rounded-md bg-primary text-primary-foreground hover:opacity-90">Logout</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void; (e: 'toggle-sidebar'): void; (e: 'logout'): void }>()
const search = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

const userDisplayName = ref<string>('')
const userPhotoURL = ref<string>('')

let unsubscribe: (() => void) | null = null
onMounted(() => {
  unsubscribe = onAuthStateChanged(auth, (user) => {
    userDisplayName.value = user?.displayName || ''
    userPhotoURL.value = user?.photoURL || ''
  })
})
onBeforeUnmount(() => { if (unsubscribe) unsubscribe() })
</script>

<style scoped>
</style>


