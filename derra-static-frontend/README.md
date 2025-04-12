# Derra - Static Frontend Redirect

This is a simple static HTML page that shows a preview of Derra - World of Business and then redirects users to the main application.

## Deployment on Vercel

1. Push this repository to GitHub
2. Create a new project in Vercel and connect it to this repository
3. Vercel will automatically detect and deploy this as a static site
4. No additional configuration is needed

## Why This Approach?

This static HTML approach:

1. Always works reliably on Vercel with no build errors
2. Provides a professional looking landing page
3. Automatically redirects users to your main application at https://the-derra-marketplace.vercel.app/
4. Can be customized to match your branding
5. Requires no API keys or environment variables

## Customization

You can modify index.html to:
- Change the redirect URL (currently set to https://the-derra-marketplace.vercel.app/)
- Change the wait time before redirect (currently 5 seconds)
- Update the content, colors, and images
- Add additional pages if desired