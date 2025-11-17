/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
  basePath: '/myfi_club', // Required for GitHub Pages subdirectory deployment
  assetPrefix: '/myfi_club', // Required for assets in subdirectory
}

module.exports = nextConfig

