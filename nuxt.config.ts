import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@quirks/nuxt"],
  vite: {
    plugins: [nodePolyfills()],
  },
});
