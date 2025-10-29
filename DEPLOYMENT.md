# Deployment Guide for Slidont

This guide will help you deploy Slidont to Cloudflare Pages or Vercel (frontend) and Convex (backend).

## Prerequisites

- A Cloudflare account (sign up at [cloudflare.com](https://cloudflare.com)) OR a Vercel account (sign up at [vercel.com](https://vercel.com))
- A Convex account (sign up at [convex.dev](https://convex.dev))
- Your project pushed to GitHub

## Step 1: Deploy Convex Backend

### Initial Setup

1. **Deploy your Convex functions:**
   ```bash
   cd packages/backend
   bun run dev
   ```
   
   This will:
   - Create a new Convex project (if you haven't already)
   - Deploy your Convex functions to the cloud
   - Give you a deployment URL

2. **Get your Convex URL:**
   - After running `bun run dev`, you'll see output like:
     ```
     Deployment URL: https://your-project.convex.cloud
     ```
   - Copy this URL - you'll need it for Cloudflare Pages or Vercel

### Production Deployment

For production, Convex deploys automatically when you push to your main branch. You can also manually deploy:

```bash
cd packages/backend
convex deploy --prod
```

## Step 2: Deploy Frontend to Cloudflare Pages or Vercel

Choose your preferred platform:

- [Cloudflare Pages](#cloudflare-pages) - Fast, global CDN with excellent performance
- [Vercel](#vercel) - Developer-friendly with great DX

---

### Cloudflare Pages

#### Option A: Deploy via Cloudflare Dashboard (Recommended)

1. **Go to [Cloudflare Dashboard](https://dash.cloudflare.com) and sign in**

2. **Import your GitHub repository:**
   - Navigate to **Workers & Pages** → **Create application**
   - Select **Pages** tab
   - Choose **Import an existing Git repository**
   - Select your GitHub repository
   - Click **Begin setup**

3. **Configure build settings:**
   - **Production branch:** `main`
   - **Framework preset:** (leave empty or select "None")
   - **Install command:** `bun install`
   - **Build command:** `cd apps/web && bun run build`
   - **Build output directory:** `apps/web/dist`
   - **Root directory:** (leave blank - deploy from repo root)
   - **Environment variables:** Add `VITE_CONVEX_URL` with your Convex deployment URL

4. **Set Environment Variables:**
   - Before deploying, add environment variables:
     - **Name:** `VITE_CONVEX_URL`
     - **Value:** Your Convex deployment URL (from Step 1)
   - Make sure to add it for Production, Preview, and Branch deployments

5. **Deploy:**
   - Click **Save and Deploy**
   - Wait for the build to complete
   - Your site will be live at `https://your-project.pages.dev`

#### Option B: Deploy via Wrangler CLI

1. **Install Wrangler CLI:**
   ```bash
   bun install -g wrangler
   ```

2. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

3. **Build and deploy:**
   ```bash
   cd apps/web
   bun run build
   wrangler pages deploy dist --project-name=slidont
   ```

#### Option C: Manual Upload

1. **Build locally:**
   ```bash
   cd apps/web
   bun run build
   ```

2. **Upload via Dashboard:**
   - Go to Cloudflare Dashboard → **Workers & Pages** → Your project
   - Click **Upload assets**
   - Upload the contents of `apps/web/dist` folder

---

### Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com) and sign in**

2. **Import your GitHub repository:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect the settings

3. **Configure build settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** (leave blank - deploy from root)
   - **Build Command:** `cd apps/web && bun run build`
   - **Output Directory:** `apps/web/dist`
   - **Install Command:** `bun install`

4. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add the following:
     - **Name:** `VITE_CONVEX_URL`
     - **Value:** Your Convex deployment URL (from Step 1)
   - Make sure to add it for Production, Preview, and Development

5. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   bun install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   When prompted:
   - Link to existing project or create new
   - For the Convex URL, enter your deployment URL from Step 1

4. **For production:**
   ```bash
   vercel --prod
   ```

## Step 3: Verify Deployment

1. **Check your deployment:**
   - Visit your Cloudflare Pages URL (`*.pages.dev`) or Vercel URL (`*.vercel.app`)
   - Verify the health check shows "Connected" (green status)

2. **Test features:**
   - Enter your name
   - Join a QA session
   - Verify real-time features work

## Updating Your Deployment

### Updating Frontend (Cloudflare Pages or Vercel)
- Push changes to your GitHub main branch
- Cloudflare Pages or Vercel will automatically deploy

### Updating Backend (Convex)
- Push changes to your GitHub main branch
- Convex will automatically deploy

OR manually:
```bash
cd packages/backend
convex deploy --prod
```

## Troubleshooting

### Frontend shows "Error" connection status
- Check that `VITE_CONVEX_URL` is set correctly in Cloudflare Pages or Vercel
- Verify your Convex deployment is running
- Check build logs for errors

### Build fails on Cloudflare Pages
- Make sure you're using Bun (Cloudflare Pages supports Bun)
- Check that all dependencies are in `package.json`
- Review build logs in Cloudflare dashboard
- Ensure workspace dependencies are properly resolved
- Try running `bun install` locally to verify

### Build fails on Vercel
- Make sure you're using Node.js 18+ or Bun
- Check that all dependencies are in `package.json`
- Review build logs in Vercel dashboard

### Convex functions not working
- Run `convex logs` to see function logs
- Check Convex dashboard for errors
- Verify schema changes are deployed

## Project Structure

```
slidont/
├── apps/
│   └── web/              # Frontend (deployed to Cloudflare Pages or Vercel)
│       ├── src/
│       ├── dist/         # Build output (served by hosting platform)
│       └── package.json
├── packages/
│   └── backend/          # Backend (deployed to Convex)
│       └── convex/       # Convex functions
├── vercel.json           # Vercel configuration (if using Vercel)
└── package.json          # Root package.json
```

## Environment Variables

### Required for Frontend (Cloudflare Pages or Vercel)
- `VITE_CONVEX_URL` - Your Convex deployment URL

### Set automatically by Convex
- Convex handles backend environment variables automatically

## Platform Comparison

| Feature | Cloudflare Pages | Vercel |
|---------|------------------|--------|
| Global CDN | ✅ Built-in | ✅ Built-in |
| Build speed | ⚡ Fast | ⚡ Fast |
| Monorepo support | ✅ Yes | ✅ Yes |
| Bun support | ✅ Yes | ✅ Yes |
| Free tier | ✅ Generous | ✅ Generous |
| Pricing | 💰 Pay-as-you-go | 💰 Pay-as-you-go |

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Vercel Documentation](https://vercel.com/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

