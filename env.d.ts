/// <reference types="vite/client" />

import type { DefineComponent } from 'vue'

declare module 'vue' {
  interface GlobalComponents {
    // Registered globally at runtime by vite-ssg. Renders its default slot only
    // on the client (after onMounted); during SSR / pre-hydration it renders the
    // optional #placeholder slot instead. Use it to keep runtime-only output
    // (current date, localStorage-derived values, …) out of the prerendered HTML.
    ClientOnly: DefineComponent
  }
}
