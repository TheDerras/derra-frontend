# Derra Frontend Deployment Guide

This guide walks you through deploying the Derra frontend as a standalone application that connects to your Vercel API.

## Setup Instructions

### 1. Create a New Repository for the Frontend

1. Create a new GitHub repository for your frontend
2. Initialize it and push your frontend code:

```bash
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Prepare the Frontend Files

1. Copy only the frontend-related files:
   - The entire `client` directory
   - The `shared` directory (for type definitions)
   - The frontend-specific configuration files

2. Rename the files we created:
   - Rename `frontend-vite.config.ts` to `vite.config.ts`
   - Rename `frontend-package.json` to `package.json`
   - Rename `frontend-vercel.json` to `vercel.json`

3. Update the API URL in `client/src/lib/queryClient.ts`:
   - Copy the content from `client/src/lib/queryClient.ts.example`
   - Update the `API_BASE_URL` to point to your Vercel API: `https://the-derra-marketplace.vercel.app`

### 3. Deploy to Vercel

1. Log in to [Vercel](https://vercel.com)
2. Create a new project and import your frontend GitHub repository
3. Configure the project:
   - **Framework Preset**: Select "Vite"
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click "Deploy"

## Testing Your Deployment

After deployment, you should:

1. Verify that the frontend can connect to the API
2. Test authentication flows
3. Make sure all features are working correctly

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Check that your API (on the original Vercel deployment) has appropriate CORS headers
2. Verify that the `API_BASE_URL` in `queryClient.ts` is correct
3. Make sure authentication cookies are being properly handled

### Authentication Issues

If authentication doesn't work:

1. Make sure your API endpoints are configured to accept credentials
2. Check that authentication cookies can be shared between your frontend and API domains

## Next Steps

After successful deployment:

1. Set up a custom domain
2. Configure continuous deployment
3. Add analytics and monitoring