import { polyfillNode } from "esbuild-plugin-polyfill-node";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@quirks/nuxt"],
  vite: {
    plugins: [polyfillNode()],
  },
  runtimeConfig: {
    public: {
      projectId: undefined,
    },
  },
});
