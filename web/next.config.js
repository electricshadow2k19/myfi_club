/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
  // For GitHub Pages, set basePath if deploying to a subdirectory
  // basePath: '/myfi_club',
}

module.exports = nextConfig

