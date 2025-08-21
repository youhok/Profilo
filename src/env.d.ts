/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  type Props = Record<string, unknown>
  type RawBindings = Record<string, unknown>
  type Data = unknown
  const component: DefineComponent<Props, RawBindings, Data>
  export default component
}

