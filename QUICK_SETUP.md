# 🚀 Quick GitHub + Netlify Setup

## Step 1: Create GitHub Repository

1. Go to **https://github.com**
2. Click **"New repository"** (green button)
3. Repository name: **`rahil_development`**
4. Set to **Public**
5. ✅ Add README file
6. Click **"Create repository"**

## Step 2: Push Your Code

```bash
# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/rahil_development.git

# Push to GitHub
git push -u origin main
```

## Step 3: Setup Netlify Auto-Deploy

1. Go to **https://netlify.com**
2. **"New site from Git"** → **"GitHub"**
3. Select **`rahil_development`** repository
4. **Build settings:**
   - Build command: `cd mock-interview && npm run build`
   - Publish directory: `mock-interview/dist`
   - Base directory: `/`

## Step 4: Add Netlify Secrets (for GitHub Actions)

1. **Netlify Dashboard** → **Site settings** → **Site information**
2. Copy **Site ID**
3. **User settings** → **Applications** → **Personal access tokens**
4. **Generate new token** → Copy it
5. **GitHub repo** → **Settings** → **Secrets and variables** → **Actions**
6. Add secrets:
   - `NETLIFY_AUTH_TOKEN`: Your personal access token
   - `NETLIFY_SITE_ID`: Your site ID

## ✅ Done! 

Now every push to `main` branch will:
1. **Auto-build** your app
2. **Auto-deploy** to Netlify
3. **Live URL** at: `https://YOUR_SITE_NAME.netlify.app`

## Test It:

```bash
# Make a change
echo "# Test auto-deploy" >> README.md

# Push to trigger deployment
git add .
git commit -m "Test auto-deployment"
git push origin main
```

**🎉 Your app will be live in 2-3 minutes!**
