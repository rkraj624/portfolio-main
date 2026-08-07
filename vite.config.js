import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import saveApiPlugin from './server/savePlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), saveApiPlugin()],
})
