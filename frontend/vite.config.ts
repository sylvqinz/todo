import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Configuration Vite avec les plugins React et Tailwind CSS
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
