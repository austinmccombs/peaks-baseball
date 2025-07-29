# Peaks Baseball - Free Hosting Setup Guide

This guide will help you deploy your Peaks Baseball site for free using Vercel (frontend) and Railway (backend) with your custom domain from GoDaddy.

## Prerequisites

1. GitHub account
2. Vercel account (free)
3. Railway account (free tier)
4. Custom domain from GoDaddy

## Step 1: Prepare Your Repository

1. Push your code to GitHub if not already done:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Step 2: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app) and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect it's a Ruby app
5. Add a PostgreSQL database:
   - Go to your project
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will provide a `DATABASE_URL` environment variable

6. Set up environment variables:
   - Go to your project settings
   - Add environment variable: `PORT` = `3001`

7. Deploy your database:
   - Run the migrations on Railway's console or locally:
```bash
# If you have the database URL, run locally:
DATABASE_URL=your_railway_db_url ruby run_migrations.rb
```

8. Your backend will be available at: `https://your-app-name.up.railway.app`

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com) and sign up with GitHub
2. Click "New Project" → "Import Git Repository"
3. Select your repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Add environment variables:
   - Go to project settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-railway-app.up.railway.app`

6. Deploy! Your frontend will be available at: `https://your-project.vercel.app`

## Step 4: Configure Custom Domain

### On Vercel (Frontend):
1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain (e.g., `peaksbaseball.com`)
4. Vercel will provide DNS records to configure

### On GoDaddy:
1. Log into your GoDaddy account
2. Go to your domain's DNS settings
3. Add these records:
   - **Type**: A
   - **Name**: @
   - **Value**: 76.76.19.19 (Vercel's IP)
   - **TTL**: 600

   - **Type**: CNAME
   - **Name**: www
   - **Value**: your-project.vercel.app
   - **TTL**: 600

### Update Vercel Configuration:
1. Update `vercel.json` with your Railway backend URL:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-railway-app.up.railway.app/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Step 5: Test Your Deployment

1. Visit your custom domain
2. Test all functionality:
   - Player roster
   - Game schedules
   - Statistics
   - Highlights
   - Admin features

## Step 6: Set Up Automatic Deployments

### Vercel:
- Automatically deploys on every push to main branch
- Preview deployments for pull requests

### Railway:
- Automatically deploys on every push to main branch
- Can be configured in Railway dashboard

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your Railway backend has CORS headers (already configured in server.rb)

2. **Database Connection**: Ensure your Railway PostgreSQL database is properly connected

3. **API Endpoints Not Found**: Check that your Vercel rewrites are correctly pointing to your Railway backend

4. **Environment Variables**: Verify all environment variables are set correctly in both Vercel and Railway

### Useful Commands:

```bash
# Test your API locally
ruby server.rb

# Test your React app locally
cd client
npm start

# Build React app for production
cd client
npm run build
```

## Cost Breakdown

- **Vercel**: Free tier (unlimited static sites)
- **Railway**: Free tier ($5/month credit, sufficient for small apps)
- **GoDaddy Domain**: ~$12/year (one-time purchase)
- **Total**: ~$12/year for domain only

## Alternative Free Options

If Railway doesn't work for you, consider:

1. **Render.com** (free tier available)
2. **Heroku** (free tier with limitations)
3. **Netlify** (for frontend) + **Railway** (for backend)

## Security Considerations

1. Add authentication to admin routes
2. Implement rate limiting
3. Use HTTPS (automatic with Vercel/Railway)
4. Regular database backups

## Monitoring

- Vercel provides analytics and performance monitoring
- Railway provides logs and monitoring
- Consider adding error tracking (Sentry has a free tier)

Your Peaks Baseball site should now be live at your custom domain! 🎉 