# Deployment Guide

## 1. Run Locally
Since we fixed the version issue, you can now run the app locally:
```bash
npm run dev
```
Open the link shown (usually `http://localhost:5173`).

## 2. Deploy to GitHub Pages (Free Hosting)

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `truth-or-dare`).
3. Make it **Public**.
4. Click **Create repository**.

### Step 2: Push Your Code
Run these commands in your terminal (replace `YOUR_USERNAME` and `REPO_NAME`):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

### Step 3: Configure for GitHub Pages
1. Open `vite.config.js` and add the `base` property with your repo name:
   ```js
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   // https://vitejs.dev/config/
   export default defineConfig({
     plugins: [react()],
     base: '/REPO_NAME/', // <--- Add this line! Replace REPO_NAME with your actual repo name
   })
   ```
2. Commit and push this change:
   ```bash
   git add vite.config.js
   git commit -m "Configure base path"
   git push
   ```

### Step 4: Deploy
You can deploy manually using the `gh-pages` package:

1. Install the deployer:
   ```bash
   npm install gh-pages --save-dev
   ```

2. Add these scripts to `package.json`:
   ```json
   "scripts": {
     // ... existing scripts
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Run the deploy command:
   ```bash
   npm run deploy
   ```

4. Your app will be live at `https://YOUR_USERNAME.github.io/REPO_NAME/`!
