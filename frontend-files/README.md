# Derra - World of Business Frontend

This repository contains the frontend code for the Derra - World of Business marketplace platform.

## Quick Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Deployment on Vercel

This frontend is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Use the following settings:
   - Framework Preset: Vite
   - Build Command: `npm run build` (already configured in vercel.json)
   - Output Directory: `dist` (already configured in vercel.json)
   - Install Command: `npm install` (already configured in vercel.json)

## Environment Variables

The following environment variables need to be set in your Vercel project:

- `VITE_API_URL`: URL of the backend API (default: https://the-derra-marketplace.vercel.app)

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