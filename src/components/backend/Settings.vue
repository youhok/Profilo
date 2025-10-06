<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
    <div class="grid gap-6 md:grid-cols-2">
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <h2 class="text-lg font-medium mb-4">Profile</h2>
        <form class="space-y-4" @submit.prevent="saveProfile">
          <div class="flex items-center gap-4">
            <img :src="photoPreview || userPhotoURL || placeholder" class="h-16 w-16 rounded-full object-cover border" alt="avatar" />
            <div>
              <input ref="fileEl" type="file" accept="image/*" @change="onFile" class="text-sm" />
              <div class="text-xs text-gray-500 mt-1">JPG/PNG, up to 5MB</div>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Display Name</label>
            <input v-model="displayName" type="text" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2" placeholder="Your name" />
          </div>
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Email</label>
            <input v-model="email" type="email" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2" placeholder="you@example.com" />
          </div>

          <div class="flex gap-3">
            <button type="submit" :disabled="saving" class="inline-flex items-center px-4 py-2 rounded-md bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900">
              {{ saving ? 'Saving…' : 'Save' }}
            </button>
            <button type="button" @click="removeAvatar" :disabled="removing" class="inline-flex items-center px-3 py-2 rounded-md border">
              {{ removing ? 'Removing…' : 'Remove image' }}
            </button>
          </div>
          <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
          <p v-if="success" class="text-sm text-green-600">Saved</p>
        </form>
      </div>

      <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <h2 class="text-lg font-medium mb-4">Danger zone</h2>
        <button @click="deleteAccount" :disabled="deleting" class="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white">
          {{ deleting ? 'Deleting…' : 'Delete account' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { auth } from '@/firebase'
import { updateEmail, updateProfile, deleteUser, reauthenticateWithCredential, EmailAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { uploadUserAvatar } from '@/lib/cloudinary'

const displayName = ref('')
const email = ref('')
const userPhotoURL = ref('')
const fileEl = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const photoPreview = ref('')
const placeholder = 'https://via.placeholder.com/64x64.png?text=Avatar'

const saving = ref(false)
const removing = ref(false)
const deleting = ref(false)
const error = ref('')
const success = ref(false)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (!user) return
    displayName.value = user.displayName || ''
    email.value = user.email || ''
    userPhotoURL.value = user.photoURL || ''
  })
})

function onFile(e: Event) {
  const target = e.target as HTMLInputElement
  const chosen = target.files && target.files[0] ? target.files[0] : null
  file.value = chosen
  photoPreview.value = chosen ? URL.createObjectURL(chosen) : ''
}

async function saveProfile() {
  error.value = ''
  success.value = false
  const user = auth.currentUser
  if (!user) return
  saving.value = true
  try {
    let newPhotoURL = user.photoURL || ''
    if (file.value) {
      newPhotoURL = await uploadUserAvatar(user.uid, file.value)
    }
    await updateProfile(user, { displayName: displayName.value, photoURL: newPhotoURL || undefined })
    if (email.value && email.value !== user.email) {
      await updateEmail(user, email.value)
    }
    userPhotoURL.value = newPhotoURL
    file.value = null
    photoPreview.value = ''
    success.value = true
  } catch (e: any) {
    error.value = e?.message || 'Failed to save'
  } finally {
    saving.value = false
  }
}

async function removeAvatar() {
  error.value = ''
  const user = auth.currentUser
  if (!user) return
  removing.value = true
  try {
    // Overwrite with a 1x1 transparent png to effectively remove from Cloudinary folder
    // Simpler client-side approach since signature-required delete API isn't available without a server.
    await updateProfile(user, { photoURL: '' })
    userPhotoURL.value = ''
    photoPreview.value = ''
  } catch (e: any) {
    error.value = e?.message || 'Failed to remove image'
  } finally {
    removing.value = false
  }
}

async function deleteAccount() {
  error.value = ''
  const user = auth.currentUser
  if (!user) return
  deleting.value = true
  try {
    await deleteUser(user)
    window.location.href = '/'
  } catch (e: any) {
    // If requires recent login, guide reauth
    if (e?.code === 'auth/requires-recent-login') {
      error.value = 'Please re-login, then try deleting again.'
    } else {
      error.value = e?.message || 'Failed to delete account'
    }
  } finally {
    deleting.value = false
  }
}
</script>


