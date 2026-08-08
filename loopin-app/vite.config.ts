import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Provides an auto-generated self-signed TLS certificate so the dev server
    // serves over HTTPS. This is required for getUserMedia (camera) to work on
    // mobile browsers, which enforce the Secure Context requirement.
    // The certificate is generated on first run and cached in node_modules/.vite.
    basicSsl(),
  ],
  server: {
    // Bind to all network interfaces so the server is reachable from other
    // devices (phones, tablets) on the same LAN — equivalent to `--host`.
    host: true,
    // Keep Vite's default port; if taken it will increment automatically.
    port: 5173,
  },
})
