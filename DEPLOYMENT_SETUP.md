# GitHub + Netlify Auto-Deployment Setup

## Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click "New repository" (green button)
3. Repository name: `rahil_development`
4. Description: `Mock Interview Application - Auto Deploy`
5. Set to **Public** (for free Netlify)
6. ✅ Add README file
7. ✅ Add .gitignore (Node template)
8. Click "Create repository"

## Step 2: Clone and Push Your Code

```bash
# In your project directory
cd "C:\Users\HP\Desktop\React Projects\Mock-Interview"

# Initialize git (if not already)
git init

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/rahil_development.git

# Add all files
git add .

# Commit
git commit -m "Initial commit - Mock Interview App"

# Push to main branch
git push -u origin main
```

## Step 3: Netlify Auto-Deployment Setup

### A. Connect GitHub to Netlify
1. Go to https://netlify.com
2. Sign up/Login with GitHub account
3. Click "New site from Git"
4. Choose "GitHub"
5. Select `rahil_development` repository

### B. Configure Build Settings
- **Build command:** `cd mock-interview && npm run build`
- **Publish directory:** `mock-interview/dist`
- **Base directory:** `/` (root)

### C. Environment Variables (if needed)
- Add any environment variables your app needs
- VITE_API_URL, etc.

## Step 4: Auto-Merge Setup (GitHub Actions)

Create `.github/workflows/auto-deploy.yml`:

```yaml
name: Auto Deploy to Netlify

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  auto-merge-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: mock-interview/package-lock.json
    
    - name: Install dependencies
      run: |
        cd mock-interview
        npm ci
    
    - name: Build project
      run: |
        cd mock-interview
        npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './mock-interview/dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Auto-deploy from commit ${{ github.sha }}"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Step 5: Get Netlify Tokens

1. Go to Netlify Dashboard
2. User Settings → Applications → Personal access tokens
3. Generate new token → Copy it
4. Go to GitHub repo → Settings → Secrets and variables → Actions
5. Add secrets:
   - `NETLIFY_AUTH_TOKEN`: Your personal access token
   - `NETLIFY_SITE_ID`: Your site ID (from Netlify site settings)

## Step 6: Test Auto-Deployment

```bash
# Make any change
echo "# Auto-deploy test" >> README.md

# Commit and push
git add .
git commit -m "Test auto-deployment"
git push origin main
```

## 🎯 Final Result

✅ **Push to GitHub** → **Auto-build** → **Auto-deploy to Netlify**

- **GitHub Repo:** https://github.com/YOUR_USERNAME/rahil_development
- **Netlify URL:** https://YOUR_SITE_NAME.netlify.app
- **Auto-deploy:** Every push to main branch

## Troubleshooting

### Common Issues:
1. **Build fails:** Check build command and directory paths
2. **Environment variables:** Add them in Netlify dashboard
3. **Port issues:** Update API URLs for production
4. **CORS errors:** Update backend CORS settings for Netlify domain

### Build Commands for Different Setups:
- **Vite:** `npm run build`
- **Create React App:** `npm run build`
- **Next.js:** `npm run build && npm run export`

### Production Environment Variables:
```env
VITE_API_URL=https://your-backend-url.com
VITE_SOCKET_URL=https://your-backend-url.com
```
