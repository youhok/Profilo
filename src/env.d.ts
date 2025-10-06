/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  type Props = Record<string, unknown>
  type RawBindings = Record<string, unknown>
  type Data = unknown
  const component: DefineComponent<Props, RawBindings, Data>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_CLOUDINARY_CLOUD_NAME: string
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string
  readonly VITE_EMAILJS_SERVICE_ID: string
  readonly VITE_EMAILJS_TEMPLATE_ID: string
  readonly VITE_EMAILJS_PUBLIC_KEY: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

