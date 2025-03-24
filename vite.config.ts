import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Ensure Vite is accessible externally
    port: 5173, // The same port as your ngrok tunnel
    strictPort: true, // Ensures Vite runs only on the specified port
    allowedHosts: ['.ngrok-free.app'], // Allow all ngrok subdomains
  }
})
