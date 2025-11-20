/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
  // basePath removed for custom domain deployment
  // When using custom domain (www.myfi.club), no basePath is needed
}

module.exports = nextConfig

