<template>
  <div class="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
    <div class="w-full max-w-sm border border-border rounded-lg p-6 bg-card shadow">
      <h1 class="text-2xl font-semibold mb-4 text-center">Register</h1>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1" for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full px-3 py-2 rounded-md border border-input bg-background"
            placeholder="Your name"
          />
        </div>

        <div>
          <label class="block text-sm mb-1" for="avatar">Profile image</label>
          <input
            id="avatar"
            ref="fileInputEl"
            @change="onFileChange"
            type="file"
            accept="image/*"
            class="w-full text-sm"
          />
          <div v-if="previewUrl" class="mt-2 flex items-center gap-3">
            <img :src="previewUrl" alt="preview" class="h-12 w-12 rounded-full object-cover border border-border" />
            <button type="button" @click="clearFile" class="px-2 py-1 text-xs rounded-md border border-input">Remove</button>
          </div>
        </div>
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
            minlength="6"
            class="w-full px-3 py-2 rounded-md border border-input bg-background"
            placeholder="At least 6 characters"
          />
        </div>

        <button
          type="submit"
          class="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90"
          :disabled="loading"
        >
          {{ loading ? 'Creating account…' : 'Create account' }}
        </button>

        <p class="text-sm text-center text-muted-foreground">
          Already have an account?
          <router-link to="/login" class="text-accent hover:underline">Login</router-link>
        </p>

        <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/firebase'
import { getCloudinaryConfig } from '@/lib/cloudinary'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const username = ref('')
const file = ref<File | null>(null)
const fileInputEl = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const chosen = target.files && target.files[0] ? target.files[0] : null
  file.value = chosen
  previewUrl.value = chosen ? URL.createObjectURL(chosen) : ''
}

function clearFile() {
  file.value = null
  previewUrl.value = ''
  if (fileInputEl.value) fileInputEl.value.value = ''
}

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value, password.value)

    let photoURL: string | undefined
    if (file.value) {
      const { cloudName, uploadPreset } = getCloudinaryConfig()
      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env')
      }

      const form = new FormData()
      form.append('file', file.value)
      form.append('upload_preset', uploadPreset)
      form.append('folder', 'user')
      form.append('public_id', cred.user.uid)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: form
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Cloudinary upload failed: ${text}`)
      }
      const data = await res.json()
      photoURL = data.secure_url as string
    }

    await updateProfile(cred.user, { displayName: username.value, photoURL })
    router.replace('/dashboard')
  } catch (err: any) {
    const code = err?.code || ''
    if (code === 'auth/configuration-not-found') {
      error.value = 'Email/Password sign-in is disabled in Firebase. Enable it in Firebase Console → Authentication → Sign-in method.'
    } else if (code === 'auth/email-already-in-use') {
      error.value = 'This email is already in use.'
    } else if (code === 'auth/invalid-email') {
      error.value = 'Invalid email address.'
    } else if (code === 'auth/weak-password') {
      error.value = 'Password should be at least 6 characters.'
    } else {
      error.value = err?.message || 'Failed to register'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>


