#!/bin/bash

# Vercel Environment Variables Setup Script
echo "Setting up Vercel environment variables..."

# Database URL
echo "Setting DATABASE_URL..."
vercel env add DATABASE_URL production <<< "postgresql://neondb_owner:npg_P3YcA0arFCKn@ep-crimson-brook-a771or9z-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# NextAuth Secret (generate a random one)
echo "Setting NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET"

# NextAuth URL
echo "Setting NEXTAUTH_URL..."
vercel env add NEXTAUTH_URL production <<< "https://meal4v-git-main-sinamrts-projects.vercel.app"

# Google OAuth (you'll need to add these manually)
echo "Please add these environment variables manually in Vercel dashboard:"
echo "- GOOGLE_CLIENT_ID"
echo "- GOOGLE_CLIENT_SECRET"
echo "- GITHUB_CLIENT_ID (optional)"
echo "- GITHUB_CLIENT_SECRET (optional)"

echo "Environment variables setup complete!" 