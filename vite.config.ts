import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5069,
  },
  plugins: [svelte()],
  resolve: {
    alias: {
      // This might or might not be required by some internal @open-rpc/client-js dependency: 
      events: "events",
    },
  },
});
