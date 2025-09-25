#!/bin/bash

echo "🚀 PWA Share Point - Serverless Proxy Setup"
echo "==========================================="

# Check if user has Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Ask user which platform they want to use
echo ""
echo "Choose your deployment platform:"
echo "1) Vercel (Recommended)"
echo "2) Netlify"
echo "3) Railway"
echo "4) Skip deployment setup"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "Setting up Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        echo "✅ Vercel CLI ready"
        echo "📋 Next steps:"
        echo "   1. Run: vercel login"
        echo "   2. Run: vercel"
        echo "   3. Set environment variable GOOGLE_SCRIPT_URL in Vercel dashboard"
        echo "   4. Update src/config/environment.ts with your Vercel app URL"
        ;;
    2)
        echo "Setting up Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        echo "✅ Netlify CLI ready"
        echo "📋 Next steps:"
        echo "   1. Run: netlify login"
        echo "   2. Run: netlify deploy --prod"
        echo "   3. Set environment variable GOOGLE_SCRIPT_URL in Netlify dashboard"
        echo "   4. Update src/config/environment.ts with your Netlify app URL"
        ;;
    3)
        echo "Setting up Railway..."
        echo "📋 Next steps:"
        echo "   1. Go to railway.app and connect your GitHub repo"
        echo "   2. Set environment variable GOOGLE_SCRIPT_URL"
        echo "   3. Update src/config/environment.ts with your Railway app URL"
        ;;
    4)
        echo "Skipping deployment setup"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📝 Don't forget to:"
echo "   • Update your Google Apps Script with the CORS fix"
echo "   • Set the GOOGLE_SCRIPT_URL environment variable"
echo "   • Update src/config/environment.ts with your serverless function URL"
echo "   • Test your form after deployment"

echo ""
echo "🎉 Setup complete! Check SERVERLESS_DEPLOYMENT.md for detailed instructions."