import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cloudflare responde a las imágenes IIIF del museo con un desafío anti-bots salvo que el
// Referer sea de artic.edu, así que en local se sirven a través de este proxy. En Vercel no hay
// proxy: el museo bloquea las peticiones que salen de servidores (ver README).
const proxy = {
  '/iiif': {
    target: 'https://www.artic.edu',
    changeOrigin: true,
    headers: { Referer: 'https://www.artic.edu/' },
  },
}

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
})
