# Derra - World of Business Frontend

This repository contains the frontend code for the Derra - World of Business marketplace platform.

## Quick Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Deployment on Vercel

This frontend is configured for deployment on Vercel with custom build settings:

1. Connect your GitHub repository to Vercel
2. **IMPORTANT**: During project creation, select "Other" (not Vite) as the framework
3. All settings are pre-configured in vercel.json:
   - Build Command: `node vercel-build.js`
   - Output Directory: `dist`
   - Install Command: `npm install --include=dev`

## Environment Variables

The following environment variables need to be set in your Vercel project:

- `VITE_API_URL`: URL of the backend API (default: https://the-derra-marketplace.vercel.app)

## Troubleshooting Vercel Deployment

If you encounter build issues:

1. Make sure you selected "Other" (not Vite) as the framework
2. Ensure all dependencies are included in package.json (dev dependencies are now included in the main dependencies section)
3. The vercel-build.js script uses Node.js to explicitly call the TypeScript compiler and Vite build tools

## Backend Integration

This frontend connects to a backend API that should be deployed separately. The API endpoints used include:

- `/api/categories` - Get all business categories
- `/api/businesses/featured` - Get featured businesses
- `/api/businesses/trending` - Get trending businesses
- `/api/businesses/recent` - Get recently added businesses
- `/api/auth/login` - User authentication
- `/api/businesses` - Create and manage business listings
- `/api/subscriptions` - Manage business subscription payments

## Technology Stack

- React + Vite
- TypeScript
- TanStack Query (React Query) for data fetching
- Tailwind CSS for styling
- Wouter for routing
- Shadcn/UI components