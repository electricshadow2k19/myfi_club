# Deploy MYFI Web App to GitHub Pages

## 🚀 Quick Setup Guide

### Method 1: Using GitHub Actions (Recommended - Automatic)

The GitHub Actions workflow is already set up! Just follow these steps:

#### Step 1: Enable GitHub Pages
1. Go to your repository: https://github.com/electricshadow2k19/myfi_club
2. Click **Settings** (top right)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - **Deploy from a branch** → **GitHub Actions**
5. Click **Save**

#### Step 2: Trigger Deployment
The workflow will automatically run when you push to `main` branch. To trigger it now:

1. Go to **Actions** tab in your repository
2. You should see "Deploy Web App to GitHub Pages" workflow
3. If it hasn't run yet, click **Run workflow** → **Run workflow**

#### Step 3: Wait for Deployment
- The workflow will build your Next.js app
- It will deploy to GitHub Pages
- Takes about 2-3 minutes

#### Step 4: Access Your Site
After deployment completes, your site will be available at:
- **GitHub Pages URL:** `https://electricshadow2k19.github.io/myfi_club/`

#### Step 5: Add Custom Domain (www.myfi.club)
1. In **Settings** → **Pages**, scroll to **Custom domain**
2. Enter: `www.myfi.club`
3. Click **Save**
4. Go to your domain registrar and add DNS record:
   ```
   Type: CNAME
   Name: www
   Value: electricshadow2k19.github.io
   ```
5. Wait 24-48 hours for DNS propagation

---

### Method 2: Using gh-pages Branch (Manual)

If you prefer using a `gh-pages` branch:

#### Step 1: Build the Web App Locally
```bash
cd Codebase/web
npm install
npm run build
```

#### Step 2: Create gh-pages Branch
```bash
cd Codebase
git checkout --orphan gh-pages
git rm -rf .
git add web/out/
git mv web/out/* .
git commit -m "Deploy web app to GitHub Pages"
git push origin gh-pages
```

#### Step 3: Configure GitHub Pages
1. Go to **Settings** → **Pages**
2. Under **Source**, select:
   - **Deploy from a branch**
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
3. Click **Save**

---

## ✅ Verify Deployment

1. Check GitHub Actions: https://github.com/electricshadow2k19/myfi_club/actions
2. Check Pages settings: https://github.com/electricshadow2k19/myfi_club/settings/pages
3. Visit your site: https://electricshadow2k19.github.io/myfi_club/

## 🔧 Troubleshooting

### Workflow Not Running?
- Make sure GitHub Actions is enabled in repository settings
- Check if workflow file is in `.github/workflows/` folder
- Try pushing a small change to trigger it

### Build Failing?
- Check Actions tab for error messages
- Make sure `web/package.json` exists
- Verify Node.js version in workflow (currently 18)

### Site Not Loading?
- Wait a few minutes after deployment
- Clear browser cache
- Check if Pages is enabled in Settings

---

**Recommended: Use Method 1 (GitHub Actions) - it's automatic and easier!**

