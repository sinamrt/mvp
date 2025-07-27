# Vercel Environment Variables Checklist

## Required Environment Variables for P0-001-01

### Database Connection
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `POSTGRES_URL` - Alternative database URL (if using Vercel Postgres)

### NextAuth Configuration
- [ ] `NEXTAUTH_SECRET` - Secret key for NextAuth
- [ ] `NEXTAUTH_URL` - Your Vercel app URL (e.g., https://your-app.vercel.app)

### OAuth Providers
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- [ ] `GITHUB_CLIENT_ID` - GitHub OAuth client ID (optional)
- [ ] `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret (optional)

### Email Provider (if using email auth)
- [ ] `EMAIL_SERVER` - SMTP server configuration
- [ ] `EMAIL_FROM` - From email address

## How to Set Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable with the correct value
5. Redeploy your application

## Common Issues:
- Missing `NEXTAUTH_SECRET`
- Invalid `DATABASE_URL`
- Missing OAuth credentials
- Incorrect `NEXTAUTH_URL` 