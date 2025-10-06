<template>
  <div class="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
    <div class="w-full max-w-sm border border-border rounded-lg p-6 bg-card shadow">
      <h1 class="text-2xl font-semibold mb-4 text-center">Login</h1>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 rounded-md border border-input bg-background"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="block text-sm mb-1" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 rounded-md border border-input bg-background"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          class="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90"
          :disabled="loading"
        >
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>

        <p class="text-sm text-center text-muted-foreground">
          Don’t have an account?
          <router-link to="/register" class="text-accent hover:underline">Register</router-link>
        </p>

        <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
      </form>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.replace('/dashboard')
  } catch (err: any) {
    const code = err?.code || ''
    if (code === 'auth/configuration-not-found') {
      error.value = 'Email/Password sign-in is disabled in Firebase. Enable it in Firebase Console → Authentication → Sign-in method.'
    } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      error.value = 'Invalid email or password.'
    } else if (code === 'auth/user-not-found') {
      error.value = 'No account found with that email.'
    } else {
      error.value = err?.message || 'Failed to sign in'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>