# Peaks Baseball - Render Deployment Guide

This guide will help you deploy your Peaks Baseball site entirely on Render with your custom domain from GoDaddy.

## **Why Render for Everything:**
- ✅ **Single platform** - easier to manage
- ✅ **Free static hosting** for React app
- ✅ **Free PostgreSQL database** included
- ✅ **Automatic HTTPS** and custom domains
- ✅ **Better reliability** than Railway
- ✅ **Simpler deployment** process

## **Step 1: Deploy Both Services to Render**

### **1.1 Create Render Account**
1. Go to [Render.com](https://render.com)
2. Sign up with your GitHub account
3. Click **"New +"** → **"Blueprint"**

### **1.2 Connect Your Repository**
1. Select your `peaks-baseball` GitHub repository
2. Render will detect the `render.yaml` configuration
3. Click **"Connect"**

### **1.3 Services Created Automatically**
Render will create:
- **Backend API** (`peaks-baseball-api`) - your Sinatra server
- **Frontend App** (`peaks-baseball-frontend`) - your React app
- **PostgreSQL Database** (add manually)

### **1.4 Add PostgreSQL Database**
1. In Render dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Name it `peaks-baseball-db`
4. Choose **Free** plan
5. Click **"Create Database"**

### **1.5 Connect Database to API**
1. Go to your `peaks-baseball-api` service settings
2. Add environment variable: `DATABASE_URL`
3. Copy the database URL from your PostgreSQL service

## **Step 2: Configure Custom Domain**

### **2.1 On Render Frontend Service**
1. Go to your `peaks-baseball-frontend` service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your custom domain (e.g., `peaksbaseball.com`)
4. Render will provide DNS records

### **2.2 On GoDaddy**
1. Log into your GoDaddy account
2. Go to your domain's DNS settings
3. Add the DNS records provided by Render

## **Step 3: Run Database Migrations**

### **3.1 Using Render Shell**
1. Go to your `peaks-baseball-api` service
2. Click **"Shell"** tab
3. Run: `ruby run_migrations.rb`

### **3.2 Or Using Local Connection**
1. Get your `DATABASE_URL` from Render
2. Run locally: `DATABASE_URL=your_render_db_url ruby run_migrations.rb`

## **Step 4: Test Your Deployment**

1. **Test Backend**: Visit your Render API URL
2. **Test Frontend**: Visit your custom domain
3. **Test All Features**:
   - Player roster
   - Game schedules
   - Statistics
   - Highlights
   - Admin features

## **Cost Breakdown**

- **Render Backend**: Free tier (750 hours/month)
- **Render Frontend**: Free tier (static hosting)
- **Render PostgreSQL**: Free tier
- **GoDaddy Domain**: ~$12/year
- **Total**: ~$12/year for domain only

## **Benefits of All-Render Setup**

### **Backend (API):**
- ✅ **Free PostgreSQL database**
- ✅ **Automatic HTTPS**
- ✅ **Custom domain support**
- ✅ **Automatic deployments**

### **Frontend (React):**
- ✅ **Free static hosting**
- ✅ **Global CDN**
- ✅ **Automatic deployments**
- ✅ **Custom domain support**
- ✅ **Same platform as backend**

## **Architecture:**

```
┌─────────────────┐    ┌─────────────────┐
│   Render        │    │   Render        │
│   (Frontend)    │    │   (Backend)     │
│                 │    │                 │
│   React App     │◄──►│   Sinatra API   │
│   (Static)      │    │   (server.rb)   │
│                 │    │   + PostgreSQL  │
└─────────────────┘    └─────────────────┘
```

## **Troubleshooting**

### **Common Issues:**

1. **Database Connection**: Make sure `DATABASE_URL` is set in backend service
2. **CORS Errors**: Backend has CORS headers configured
3. **API Endpoints**: Frontend uses `REACT_APP_API_URL` environment variable
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

This all-Render setup is much simpler and more reliable than mixing platforms! 