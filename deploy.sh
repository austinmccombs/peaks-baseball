#!/bin/bash

echo "🚀 Peaks Baseball Deployment Script"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if all files are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    echo "   git push"
    exit 1
fi

echo "✅ Repository is ready for deployment"
echo ""
echo "📋 Next Steps:"
echo "1. Push your code to GitHub:"
echo "   git push origin main"
echo ""
echo "2. Deploy backend to Railway:"
echo "   - Go to https://railway.app"
echo "   - Sign up with GitHub"
echo "   - Create new project from your repo"
echo "   - Add PostgreSQL database"
echo "   - Set PORT=3001 environment variable"
echo ""
echo "3. Deploy frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Sign up with GitHub"
echo "   - Import your repository"
echo "   - Set root directory to 'client'"
echo "   - Add REACT_APP_API_URL environment variable"
echo ""
echo "4. Configure your custom domain:"
echo "   - Follow the instructions in DEPLOYMENT.md"
echo ""
echo "🎯 Your site will be live at your custom domain!" 