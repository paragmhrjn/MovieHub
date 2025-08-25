import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import postcssNested from 'postcss-nested'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), postcssNested()],
})
