# Railway Deployment Guide

## Fixed Issues

### 1. Docker Base Image
**Problem**: Using outdated `ruby:2.5-slim` based on Debian buster (end-of-life)
**Solution**: Updated to `ruby:3.2-slim` with current Debian version

### 2. Ruby Version Compatibility
**Problem**: Gemfile specified Ruby 2.5.0
**Solution**: Updated to Ruby 3.2.0 for compatibility

## Updated Files

### Dockerfile
```dockerfile
FROM ruby:3.2-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install Ruby gems
RUN bundle install

# Copy the rest of the application
COPY . .

# Install Node.js dependencies for the client
WORKDIR /app/client
RUN npm install

# Build the React app
RUN npm run build

# Switch back to app directory
WORKDIR /app

# Create a non-root user
RUN useradd -m appuser
USER appuser

# Expose port
EXPOSE 3001

# Start the application
CMD ["ruby", "server.rb"]
```

### Gemfile
```ruby
source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.2.0'
# ... rest of gems
```

## Deployment Steps

### 1. Commit Changes
```bash
git add .
git commit -m "Fix Docker deployment for Railway"
git push origin main
```

### 2. Railway Deployment
1. Connect your GitHub repository to Railway
2. Railway will automatically detect the Dockerfile
3. Set environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `PORT`: 3001 (or let Railway set it automatically)

### 3. Environment Variables
Make sure to set these in Railway:
- `DATABASE_URL`: PostgreSQL connection string
- `RAILS_ENV`: production
- `NODE_ENV`: production

## Expected Build Process

1. **Base Image**: Uses current Ruby 3.2 with Debian
2. **Dependencies**: Installs build tools, PostgreSQL dev, Node.js
3. **Ruby Gems**: Installs all required gems
4. **Node.js**: Installs client dependencies and builds React app
5. **Security**: Runs as non-root user
6. **Startup**: Runs `ruby server.rb`

## Troubleshooting

### If Build Still Fails
1. Check Railway logs for specific error messages
2. Verify all environment variables are set
3. Ensure database is accessible from Railway

### Common Issues
- **Database Connection**: Make sure `DATABASE_URL` is set correctly
- **Port Binding**: Railway will set `PORT` environment variable
- **Build Timeout**: Large builds might timeout; consider optimizing

## Verification

After deployment:
1. Check Railway logs for successful startup
2. Test API endpoints: `https://your-app.railway.app/`
3. Test React app functionality
4. Verify database connections

## Performance Notes

- The build includes both Ruby backend and React frontend
- Static assets are built during Docker build process
- Consider using Railway's caching for faster rebuilds 