# Peaks Baseball - Render Deployment Guide

This guide will help you deploy your Peaks Baseball site on Render with your custom domain from GoDaddy.

## **Why Render is Better:**
- ✅ **More reliable** than Railway
- ✅ **Free PostgreSQL database** included
- ✅ **Automatic HTTPS** and custom domains
- ✅ **Better documentation** and support
- ✅ **Simpler deployment** process

## **Step 1: Deploy Backend to Render**

### **1.1 Create Render Account**
1. Go to [Render.com](https://render.com)
2. Sign up with your GitHub account
3. Click **"New +"** → **"Blueprint"**

### **1.2 Connect Your Repository**
1. Select your `peaks-baseball` GitHub repository
2. Render will detect the `render.yaml` configuration
3. Click **"Connect"**

### **1.3 Configure Services**
Render will automatically create:
- **Web Service** (your API)
- **PostgreSQL Database** (your data)

### **1.4 Environment Variables**
Render will automatically set:
- `DATABASE_URL` (from the PostgreSQL service)
- `RACK_ENV=production`
- `PORT=10000`

## **Step 2: Deploy Frontend to Vercel**

### **2.1 Deploy to Vercel**
1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### **2.2 Set Environment Variables**
In Vercel project settings, add:
- `REACT_APP_API_URL` = your Render backend URL (e.g., `https://peaks-baseball-api.onrender.com`)

## **Step 3: Configure Custom Domain**

### **3.1 On Vercel (Frontend)**
1. Go to your Vercel project settings
2. Click **"Domains"**
3. Add your custom domain (e.g., `peaksbaseball.com`)
4. Vercel will provide DNS records

### **3.2 On GoDaddy**
1. Log into your GoDaddy account
2. Go to your domain's DNS settings
3. Add these records:
   - **Type**: A
   - **Name**: @
   - **Value**: 76.76.19.19 (Vercel's IP)
   - **TTL**: 600

   - **Type**: CNAME
   - **Name**: www
   - **Value**: your-vercel-project.vercel.app
   - **TTL**: 600

### **3.3 Update Vercel Configuration**
Update `vercel.json` with your Render backend URL:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://peaks-baseball-api.onrender.com/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## **Step 4: Run Database Migrations**

### **4.1 Using Render Shell**
1. Go to your Render dashboard
2. Click on your web service
3. Go to **"Shell"** tab
4. Run: `ruby run_migrations.rb`

### **4.2 Or Using Local Connection**
1. Get your `DATABASE_URL` from Render
2. Run locally: `DATABASE_URL=your_render_db_url ruby run_migrations.rb`

## **Step 5: Test Your Deployment**

1. **Test Backend**: Visit your Render API URL
2. **Test Frontend**: Visit your custom domain
3. **Test All Features**:
   - Player roster
   - Game schedules
   - Statistics
   - Highlights
   - Admin features

## **Cost Breakdown**

- **Render**: Free tier (750 hours/month)
- **Vercel**: Free tier (unlimited sites)
- **GoDaddy Domain**: ~$12/year
- **Total**: ~$12/year for domain only

## **Benefits of Render**

### **Backend (API):**
- ✅ **Free PostgreSQL database**
- ✅ **Automatic HTTPS**
- ✅ **Custom domain support**
- ✅ **Automatic deployments**
- ✅ **Better reliability**

### **Frontend (React):**
- ✅ **Vercel's excellent performance**
- ✅ **Global CDN**
- ✅ **Automatic deployments**
- ✅ **Custom domain support**

## **Troubleshooting**

### **Common Issues:**

1. **Database Connection**: Make sure `DATABASE_URL` is set in Render
2. **CORS Errors**: Backend has CORS headers configured
3. **API Endpoints**: Check that Vercel rewrites point to correct Render URL
4. **Domain Issues**: DNS propagation can take up to 48 hours

### **Useful Commands:**

```bash
# Test API locally
ruby server.rb

# Test React app locally
cd client && npm start

# Build for production
cd client && npm run build
```

## **Next Steps After Deployment**

1. **Add your data** to the PostgreSQL database
2. **Test all functionality**
3. **Set up monitoring** (optional)
4. **Configure backups** (optional)

Your Peaks Baseball site will be live at your custom domain! 🎉

## **Architecture:**

```
┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Render        │
│   (Frontend)    │    │   (Backend)     │
│                 │    │                 │
│   React App     │◄──►│   Sinatra API   │
│   (client/)     │    │   (server.rb)   │
│                 │    │   + PostgreSQL  │
└─────────────────┘    └─────────────────┘
```

This setup is much more reliable and easier to manage than Railway! 