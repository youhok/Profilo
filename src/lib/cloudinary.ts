export type CloudinaryConfig = {
  cloudName: string
  uploadPreset: string
}

export function getCloudinaryConfig(): CloudinaryConfig {
  const cloudName = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME as string
  const uploadPreset = (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET as string
  return { cloudName, uploadPreset }
}

export async function uploadUserAvatar(uid: string, file: File): Promise<string> {
  const { cloudName, uploadPreset } = getCloudinaryConfig()
  if (!cloudName || !uploadPreset) throw new Error('Cloudinary not configured')

  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', uploadPreset)
  form.append('folder', `user/${uid}`)
  form.append('public_id', 'avatar')
  // If your preset allows, this will overwrite existing avatar and avoid orphans
  form.append('overwrite', 'true')

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form })
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return data.secure_url as string
}


// Generic helper to upload any project image to Cloudinary
// Returns both the secure URL and publicId of the uploaded image
export async function uploadProjectImage(
  file: File,
  opts?: { publicId?: string; folder?: string }
): Promise<{ url: string; publicId: string }> {
  const { cloudName, uploadPreset } = getCloudinaryConfig()
  if (!cloudName || !uploadPreset) throw new Error('Cloudinary not configured')

  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', uploadPreset)
  form.append('folder', opts?.folder || 'projects')
  if (opts?.publicId) form.append('public_id', opts.publicId)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form })
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return { url: data.secure_url as string, publicId: data.public_id as string }
}

// Optional deletion helper: requires a secure server endpoint since Cloudinary deletions
// must be signed. If VITE_CLOUDINARY_DELETE_ENDPOINT is set, we call it with publicId.
export async function deleteProjectImage(publicId: string): Promise<void> {
  const endpoint = (import.meta as any).env?.VITE_CLOUDINARY_DELETE_ENDPOINT as string | undefined
  if (!endpoint) return
  try {
    await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ publicId }) })
  } catch {
    // ignore client-side delete failures
  }
}


