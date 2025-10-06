import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // works the same

import "./index.css";
// App/logo assets for favicon
// @ts-ignore - Vite handles asset imports
import logoPng from "./assets/white on black.png";

// Ensure theme is applied before app mounts to avoid FOUC
const storedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const shouldUseDark = storedTheme ? storedTheme === 'dark' : systemPrefersDark;
document.documentElement.classList.toggle('dark', shouldUseDark);

const app = createApp(App);
app.use(router);

// Avoid landing page flash on protected routes by waiting for router readiness
router.isReady().then(() => {
  // Ensure favicon shows the custom logo in the tab (works in dev/prod)
  const ensureFavicon = () => {
    const existing = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    const link = existing || document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = logoPng as unknown as string;
    if (!existing) document.head.appendChild(link);
  };
  ensureFavicon();
  app.mount("#app");
});
