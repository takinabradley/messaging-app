import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environmentMatchGlobs: [
      ['src/client/tests', 'jsdom'],
      ['src/server/tests', 'node']
    ],
    globals: true,
    setupFiles: "./src/client/tests/setup.js"
  }
})
