/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  // Deshabilitar generación estática para rutas API
  experimental: {
    // No pre-renderizar rutas API durante el build
  },
  // Configurar rutas dinámicas
  output: 'standalone',
}

module.exports = nextConfig
