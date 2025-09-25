# Vercel Serverless Deployment Guide

This guide shows you how to deploy your serverless proxy to Vercel to bypass CORS issues between your GitHub Pages site and Google Sheets.

## Vercel Deployment

### Setup:
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Choose your project settings
   - Set environment variable: `GOOGLE_SCRIPT_URL` = your Google Apps Script URL

4. **Update your config:**
   ```typescript
   // In src/config/environment.ts
   const productionConfig: EnvironmentConfig = {
     FORM_SUBMISSION_URL: 'https://your-project-name.vercel.app/api/submit-form',
     // ... other config
   };
   ```

### Vercel Dashboard Setup:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. **IMPORTANT**: Go to Project Settings → General → Node.js Version → Change from "22.x" to "18.x"
4. Add environment variable: `GOOGLE_SCRIPT_URL`
5. Deploy

---



## Testing Your Proxy

### Local Testing:
```bash
vercel dev
```

### Production Testing:
```bash
curl -X POST https://your-proxy-url/api/submit-form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

## Environment Variables Needed:
- `GOOGLE_SCRIPT_URL`: Your Google Apps Script web app URL

## Why Vercel?

- ✅ **Free tier** with generous limits (100GB bandwidth, 100 functions)
- ✅ **Serverless functions** with automatic scaling
- ✅ **Easy TypeScript support** out of the box
- ✅ **Great performance** with global CDN
- ✅ **Built-in analytics** and monitoring
- ✅ **Simple deployment** directly from GitHub
- ✅ **Environment variables** management
- ✅ **Custom domains** support

## Next Steps:
1. **Disable Authentication Protection** in Vercel dashboard
2. Test your form from GitHub Pages
3. Monitor function performance in Vercel dashboard