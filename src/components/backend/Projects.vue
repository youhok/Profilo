<template>
  <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-muted-foreground text-sm">
          <span>HOME</span>
          <span class="opacity-50">›</span>
          <span class="font-medium text-foreground">Projects</span>
        </div>
      </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <form
        @submit.prevent="saveProject"
        class="bg-card text-card-foreground rounded-xl border border-sidebar-border p-4 space-y-4"
      >
        <div class="flex items-center justify-between">
          <div class="text-lg font-medium">
            {{ editId ? "Edit Project" : "Add Project" }}
          </div>
          <button
            v-if="editId"
            type="button"
            @click="cancelEdit"
            class="text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel edit
          </button>
        </div>

        <div class="space-y-1">
          <label class="text-sm text-muted-foreground">Title</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full rounded-md border border-sidebar-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. E‑Commerce Platform"
            required
          />
        </div>
        <div class="space-y-1">
          <label class="text-sm text-muted-foreground">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full rounded-md border border-sidebar-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Short description"
            required
          />
        </div>
        <div class="space-y-1">
          <label class="text-sm text-muted-foreground">Project Image</label>
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            class="block w-full text-sm"
          />
          <div class="text-xs text-muted-foreground mt-1" v-if="uploading">
            Uploading image…
          </div>
          <div v-if="form.image" class="mt-2">
            <img
              :src="form.image"
              alt="preview"
              class="h-24 rounded-md object-cover border border-sidebar-border"
            />
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-sm text-muted-foreground"
            >Technologies (comma separated)</label
          >
          <input
            v-model="form.technologiesRaw"
            type="text"
            class="w-full rounded-md border border-sidebar-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Vue.js, Firebase, Tailwind CSS"
            required
          />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-sm text-muted-foreground">Live URL</label>
            <input
              v-model="form.liveUrl"
              type="url"
            class="w-full rounded-md border border-sidebar-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://demo.example.com"
            />
          </div>
          <div class="space-y-1">
            <label class="text-sm text-muted-foreground">Source URL</label>
            <input
              v-model="form.githubUrl"
              type="url"
            class="w-full rounded-md border border-sidebar-border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://github.com/..."
            />
          </div>
        </div>
        <label class="inline-flex items-center gap-2 text-sm text-foreground">
          <input
            v-model="form.featured"
            type="checkbox"
            class="rounded border-sidebar-border"
          />
          Featured
        </label>

        <div class="flex items-center gap-3">
          <button
            type="submit"
            :disabled="saving"
            class="inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            <span v-if="saving">Saving…</span>
            <span v-else>{{ editId ? "Update" : "Save" }}</span>
          </button>
          <div v-if="error" class="text-sm text-rose-600">{{ error }}</div>
          <div v-if="success" class="text-sm text-emerald-600">Saved!</div>
        </div>
      </form>

          <div
        class="md:col-span-2 bg-card text-card-foreground rounded-xl border border-sidebar-border p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="text-lg font-medium">
            Existing Projects
          </div>
          <button
            @click="fetchProjects"
            class="text-sm px-3 py-1 rounded-md border border-sidebar-border hover:bg-accent"
          >
            Refresh
          </button>
        </div>

        <div
          v-if="projects.length === 0"
          class="border border-dashed border-sidebar-border rounded-lg p-8 text-center text-muted-foreground"
        >
          No projects yet. Add one on the left.
        </div>

        <div v-else class="grid md:grid-cols-2 gap-4">
          <div
            v-for="p in projects"
            :key="p.id"
            class="overflow-hidden bg-card text-card-foreground border border-sidebar-border rounded-lg shadow-sm"
          >
            <div class="relative overflow-hidden">
              <img
                :src="p.image"
                :alt="p.title"
                class="w-full h-40 object-cover"
              />
              <span
                v-if="p.featured"
                class="absolute top-2 right-2 px-2 py-1 text-xs rounded-md bg-primary text-primary-foreground"
                >Featured</span
              >
            </div>
            <div class="p-4">
              <div class="flex items-start justify-between">
                <h3 class="font-semibold">{{ p.title }}</h3>
                <div class="flex items-center gap-2">
                  <button
                    @click="startEdit(p)"
                    class="text-xs px-2 py-1 rounded border border-sidebar-border hover:bg-accent"
                  >
                    Edit
                  </button>
                  <button
                    @click="removeProject(p)"
                    class="text-xs px-2 py-1 rounded border border-rose-200 text-rose-500 hover:bg-rose-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p class="text-sm text-muted-foreground mt-1 line-clamp-3">
                {{ p.description }}
              </p>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="(t, i) in p.technologies"
                  :key="i"
                  class="text-xs px-2 py-0.5 rounded-md bg-secondary border border-sidebar-border"
                  >{{ t }}</span
                >
              </div>
              <div class="flex gap-2 mt-3">
                <a
                  v-if="p.liveUrl"
                  :href="p.liveUrl"
                  target="_blank"
                  class="px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground text-xs"
                  >Live Demo</a
                >
                <a
                  v-if="p.githubUrl"
                  :href="p.githubUrl"
                  target="_blank"
                  class="px-2.5 py-1.5 rounded-md border border-sidebar-border text-xs"
                  >Source</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { uploadProjectImage, deleteProjectImage } from "@/lib/cloudinary";

type Project = {
  id?: string;
  title: string;
  description: string;
  image: string;
  imagePublicId?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  createdAt?: any;
};

const form = ref({
  title: "",
  description: "",
  image: "",
  imagePublicId: "",
  technologiesRaw: "",
  liveUrl: "",
  githubUrl: "",
  featured: false,
});
const projects = ref<Project[]>([]);
const saving = ref(false);
const error = ref<string | null>(null);
const success = ref(false);
const editId = ref<string | null>(null);
const colRef = collection(db, "projects");
const uploading = ref(false);

async function fetchProjects() {
  try {
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    projects.value = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Project, "id">),
    }));
  } catch (e: any) {
    console.error("fetchProjects error", e);
    error.value = e?.message || "Failed to load projects";
  }
}

async function saveProject() {
  error.value = null;
  success.value = false;
  const technologies = form.value.technologiesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (
    !form.value.title.trim() ||
    !form.value.description.trim() ||
    !form.value.image.trim() ||
    technologies.length === 0
  ) {
    error.value =
      "Please fill Title, Description, Image and at least one technology.";
    return;
  }
  try {
    saving.value = true;
    if (editId.value) {
      const refDoc = doc(db, "projects", editId.value);
      await updateDoc(refDoc, {
        title: form.value.title.trim(),
        description: form.value.description.trim(),
        image: form.value.image.trim(),
        imagePublicId: form.value.imagePublicId || null,
        technologies,
        liveUrl: form.value.liveUrl.trim(),
        githubUrl: form.value.githubUrl.trim(),
        featured: !!form.value.featured,
      });
      success.value = true;
    } else {
      await addDoc(colRef, {
        title: form.value.title.trim(),
        description: form.value.description.trim(),
        image: form.value.image.trim(),
        imagePublicId: form.value.imagePublicId || null,
        technologies,
        liveUrl: form.value.liveUrl.trim(),
        githubUrl: form.value.githubUrl.trim(),
        featured: !!form.value.featured,
        createdAt: Timestamp.now(),
      });
      success.value = true;
    }
    form.value = {
      title: "",
      description: "",
      image: "",
      imagePublicId: "",
      technologiesRaw: "",
      liveUrl: "",
      githubUrl: "",
      featured: false,
    };
    editId.value = null;
    await fetchProjects();
  } catch (e: any) {
    console.error("saveProject error", e);
    error.value = e?.message || "Failed to save project";
  } finally {
    saving.value = false;
  }
}

function extractPublicIdFromUrl(url: string): string | "" {
  try {
    // Example: https://res.cloudinary.com/<cloud>/image/upload/v12345/projects/abc123/name.png
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return "";
    let path = url.substring(uploadIndex + "/upload/".length);
    // Strip version segment if present (e.g., v12345/)
    path = path.replace(/^v\d+\//, "");
    // Remove file extension
    const lastSlash = path.lastIndexOf("/");
    const lastDot = path.lastIndexOf(".");
    if (lastDot > lastSlash) path = path.substring(0, lastDot);
    return path;
  } catch {
    return "";
  }
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files && input.files[0] ? input.files[0] : null;
  if (!file) return;
  try {
    uploading.value = true;
    const stablePublicId =
      form.value.imagePublicId ||
      (editId.value ? `projects/project_${editId.value}` : undefined);
    const result = await uploadProjectImage(
      file,
      stablePublicId
        ? { publicId: stablePublicId, folder: "projects" }
        : { folder: "projects" }
    );
    form.value.image = result.url;
    form.value.imagePublicId =
      result.publicId || extractPublicIdFromUrl(result.url);
  } catch (e: any) {
    console.error("uploadImage error", e);
    error.value = e?.message || "Failed to upload image";
  } finally {
    uploading.value = false;
  }
}

function startEdit(p: Project) {
  editId.value = p.id || null;
  form.value.title = p.title;
  form.value.description = p.description;
  form.value.image = p.image;
  form.value.imagePublicId = p.imagePublicId || extractPublicIdFromUrl(p.image);
  form.value.technologiesRaw = (p.technologies || []).join(", ");
  form.value.liveUrl = p.liveUrl || "";
  form.value.githubUrl = p.githubUrl || "";
  form.value.featured = !!p.featured;
  success.value = false;
  error.value = null;
}

function cancelEdit() {
  editId.value = null;
  form.value = {
    title: "",
    description: "",
    image: "",
    imagePublicId: "",
    technologiesRaw: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
  };
  success.value = false;
  error.value = null;
}

async function removeProject(p: Project) {
  if (!p.id) return;
  const confirmed = window.confirm(`Delete "${p.title}"?`);
  if (!confirmed) return;
  try {
    const publicId = p.imagePublicId || extractPublicIdFromUrl(p.image);
    if (publicId) {
      // Best-effort delete of Cloudinary asset via server endpoint if configured
      await deleteProjectImage(publicId);
    }
    await deleteDoc(doc(db, "projects", p.id));
    await fetchProjects();
  } catch (e: any) {
    console.error("removeProject error", e);
    error.value = e?.message || "Failed to delete project";
  }
}

onMounted(fetchProjects);
</script>

<style scoped>
</style>

