<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-muted-foreground text-sm">
        <span>HOME</span>
        <span class="opacity-50">›</span>
        <span class="font-medium text-foreground">Skills</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <form @submit.prevent="saveCategory" class="bg-card text-card-foreground rounded-xl border border-sidebar-border p-4 space-y-4">
        <div class="flex items-center justify-between">
          <div class="text-lg font-medium">{{ editId ? 'Edit Skill Category' : 'Add Skill Category' }}</div>
          <button v-if="editId" type="button" @click="cancelEdit" class="text-sm text-muted-foreground hover:text-foreground">Cancel edit</button>
        </div>
        <div class="space-y-1">
          <label class="text-sm text-muted-foreground">Title</label>
          <input v-model="form.title" type="text" class="w-full rounded-md border border-sidebar-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Frontend Development" required />
        </div>
        <div class="space-y-1">
          <label class="text-sm text-muted-foreground">Icon (emoji)</label>
          <input v-model="form.icon" type="text" maxlength="4" class="w-full rounded-md border border-sidebar-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 💻" required />
        </div>
        <div class="space-y-1">
          <label class="text-sm text-muted-foreground">Skills (comma separated)</label>
          <input v-model="form.skillsRaw" type="text" class="w-full rounded-md border border-sidebar-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="JavaScript, TypeScript, Vue.js" required />
        </div>
        <div class="flex items-center gap-3">
          <button type="submit" :disabled="saving" class="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60">
            <span v-if="saving">Saving…</span>
            <span v-else>{{ editId ? 'Update' : 'Save' }}</span>
          </button>
          <div v-if="error" class="text-sm text-rose-600">{{ error }}</div>
          <div v-if="success" class="text-sm text-emerald-600">Saved!</div>
        </div>
      </form>

      <div class="md:col-span-2 bg-card text-card-foreground rounded-xl border border-sidebar-border p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="text-lg font-medium">Existing Categories</div>
          <button @click="fetchCategories" class="text-sm px-3 py-1 rounded-md border border-sidebar-border hover:bg-accent">Refresh</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div v-for="cat in categories" :key="cat.id" class="p-3 rounded-lg border border-sidebar-border bg-secondary">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="text-2xl">{{ cat.icon }}</div>
                <div class="font-semibold">{{ cat.title }}</div>
              </div>
            
            </div>
            <div class="flex flex-wrap gap-1 mt-2">
              <span v-for="(s, i) in cat.skills" :key="i" class="text-xs px-2 py-0.5 rounded-md bg-background border border-sidebar-border">{{ s }}</span>
            </div>
           
            <div class="flex items-center gap-2 mt-4  ">
                <button @click="startEdit(cat)" class="text-xs px-2 py-1 rounded border border-sidebar-border hover:bg-accent">Edit</button>
                <button @click="removeCategory(cat)" class="text-xs px-2 py-1 rounded border border-rose-200 text-rose-500 hover:bg-rose-500/10">Delete</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, addDoc, getDocs, query, orderBy, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase'

type SkillCategory = { id?: string; title: string; icon: string; skills: string[]; createdAt?: any }

const form = ref({ title: '', icon: '', skillsRaw: '' })
const categories = ref<SkillCategory[]>([])
const saving = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const editId = ref<string | null>(null)
const colRef = collection(db, 'skillCategories')

async function fetchCategories() {
  try {
    const q = query(colRef, orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    categories.value = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<SkillCategory,'id'>) }))
  } catch (e: any) {
    console.error('fetchCategories error', e)
    error.value = e?.message || 'Failed to load categories'
  }
}

async function saveCategory() {
  error.value = null
  success.value = false
  const skills = form.value.skillsRaw.split(',').map(s => s.trim()).filter(Boolean)
  if (!form.value.title.trim() || !form.value.icon.trim() || skills.length === 0) {
    error.value = 'Please fill Title, Icon and at least one skill.'
    return
  }
  try {
    saving.value = true
    if (editId.value) {
      const refDoc = doc(db, 'skillCategories', editId.value)
      await updateDoc(refDoc, { title: form.value.title.trim(), icon: form.value.icon.trim(), skills })
      success.value = true
    } else {
      await addDoc(colRef, { title: form.value.title.trim(), icon: form.value.icon.trim(), skills, createdAt: Timestamp.now() })
      success.value = true
    }
    form.value = { title: '', icon: '', skillsRaw: '' }
    editId.value = null
    await fetchCategories()
  } catch (e: any) {
    console.error('saveCategory error', e)
    error.value = e?.message || 'Failed to save category'
  } finally {
    saving.value = false
  }
}

function startEdit(cat: SkillCategory) {
  editId.value = cat.id || null
  form.value.title = cat.title
  form.value.icon = cat.icon
  form.value.skillsRaw = (cat.skills || []).join(', ')
  success.value = false
  error.value = null
}

function cancelEdit() {
  editId.value = null
  form.value = { title: '', icon: '', skillsRaw: '' }
  success.value = false
  error.value = null
}

async function removeCategory(cat: SkillCategory) {
  if (!cat.id) return
  const confirmed = window.confirm(`Delete "${cat.title}"?`)
  if (!confirmed) return
  try {
    await deleteDoc(doc(db, 'skillCategories', cat.id))
    await fetchCategories()
  } catch (e: any) {
    console.error('removeCategory error', e)
    error.value = e?.message || 'Failed to delete category'
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
</style>


