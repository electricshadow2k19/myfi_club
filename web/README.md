# MYFI Web Application

Web application for MYFI - India's Personal Finance Super App

## 🚀 Quick Start

### Local Development

```bash
cd web
npm install
npm run dev
```

Visit http://localhost:3000

### Build for Production

```bash
npm run build
```

The static files will be in the `out` folder, ready for deployment.

## 📦 Deployment Options

### Option 1: GitHub Pages (Free)

1. **Enable GitHub Pages in your repository:**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (or use GitHub Actions)

2. **Using GitHub Actions (Recommended):**
   - The workflow file `.github/workflows/deploy.yml` is already set up
   - Just push to `main` branch and it will auto-deploy
   - Your site will be at: `https://electricshadow2k19.github.io/myfi_club/`

3. **Manual Deployment:**
   ```bash
   npm run build
   # Copy the 'out' folder contents to gh-pages branch
   ```

### Option 2: Deploy to Your Domain (www.myfi.club)

1. **Using Vercel (Recommended - Free):**
   ```bash
   npm install -g vercel
   cd web
   vercel
   ```
   - Follow the prompts
   - Add your domain `www.myfi.club` in Vercel dashboard
   - Update DNS records as instructed

2. **Using Netlify (Free):**
   - Connect your GitHub repository
   - Build command: `cd web && npm run build`
   - Publish directory: `web/out`
   - Add custom domain: `www.myfi.club`

3. **Using Traditional Hosting:**
   - Build the app: `npm run build`
   - Upload the `out` folder contents to your web server
   - Configure your domain to point to the server

## 🔧 Configuration

### For GitHub Pages (Subdirectory)

If deploying to a subdirectory, update `next.config.js`:

```js
basePath: '/myfi_club',
```

### For Custom Domain

Update `next.config.js` to remove basePath or set it to `/`.

## 📱 Features

- ✅ Responsive design
- ✅ Landing page
- ✅ Login/Register pages
- ✅ Static export ready
- ✅ SEO optimized

## 🌐 Current Status

- **GitHub Pages URL:** https://electricshadow2k19.github.io/myfi_club/ (after deployment)
- **Custom Domain:** www.myfi.club (needs DNS configuration)

## 🔗 Next Steps

1. **Deploy to GitHub Pages:**
   - Push code to main branch
   - GitHub Actions will auto-deploy
   - Enable Pages in repository settings

2. **Connect Custom Domain:**
   - Get hosting (Vercel/Netlify recommended)
   - Add domain in hosting dashboard
   - Update DNS records at your domain registrar

3. **Connect Backend API:**
   - Update API URLs in the app
   - Add API integration code
   - Test all features
