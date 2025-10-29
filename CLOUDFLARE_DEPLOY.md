# Quick Start: Deploy to Cloudflare Pages

## Prerequisites
- Cloudflare account (free at https://cloudflare.com)
- Convex deployment URL

## Steps

### 1. Get Your Convex URL
If you haven't already, get your Convex deployment URL:
```bash
cd packages/backend
bun run dev
# Copy the URL that looks like: https://your-project.convex.cloud
```

### 2. Deploy to Cloudflare Pages

**Via Dashboard (Recommended):**

1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **Create application**
3. Select **Pages** tab → **Import an existing Git repository**
4. Select your GitHub repository
5. Configure:
   - **Install command:** `bun install`
   - **Build command:** `cd apps/web && bun run build`
   - **Build output directory:** `apps/web/dist`
   - **Root directory:** (leave blank)
6. Add environment variable:
   - Click **Configure variables**
   - Add `VITE_CONVEX_URL` = `https://your-project.convex.cloud`
7. Click **Save and Deploy**

**Via CLI:**

```bash
# Install Wrangler CLI
bun install -g wrangler

# Login
wrangler login

# Deploy
cd apps/web
bun run build
wrangler pages deploy dist --project-name=slidont
```

### 3. Verify Deployment
- Visit your site at `https://slidont.pages.dev`
- Test that the connection status shows "Connected"

## Troubleshooting

**Build fails:**
- Ensure `VITE_CONVEX_URL` is set correctly
- Check build logs in Cloudflare dashboard
- Try building locally: `cd apps/web && bun run build`

**Connection errors:**
- Verify Convex deployment is running
- Check environment variables in Cloudflare dashboard

## Continuous Deployment
Every push to `main` branch will automatically deploy!

