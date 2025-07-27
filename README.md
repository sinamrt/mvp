# Diet Management System

A comprehensive diet management application built with Next.js, PostgreSQL, and Docker.

## Features

- 🔐 **Authentication**: Google, GitHub, and Email authentication
- 🍽️ **Diet Management**: Comprehensive diet preferences and restrictions
- 📊 **Nutrition Tracking**: Macro tracking and nutrition goals
- 🗺️ **Places Integration**: Google Maps integration for finding restaurants
- 👥 **Admin Dashboard**: User management and analytics
- 📱 **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Styling**: TailwindCSS
- **Testing**: Jest, Playwright
- **Containerization**: Docker, Docker Compose

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd diet-management-system
```

### 2. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env with your API keys
nano .env
```

### 3. Start with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app
```

### 4. Database Setup

```bash
# Generate Prisma client
docker-compose exec app npm run db:generate

# Run database migrations
docker-compose exec app npm run db:migrate

# Seed initial data
docker-compose exec app npm run db:seed
```

### 5. Access the Application

- **Main App**: http://localhost:3000
- **Database Admin**: http://localhost:8080 (Adminer)
- **Database**: localhost:5432

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

```bash
# Install Prisma CLI
npm install -g prisma

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed
```

### 3. Start Development Server

```bash
npm run dev
```

## Database Schema

The application uses 9 main tables:

1. **users** - User accounts and profiles
2. **diet_preferences** - Diet type and measurement preferences
3. **food_exclusions** - Allergies and food avoidances
4. **diet_exclusions** - Diet-specific food exclusions
5. **nutrition_goals** - Weight and nutrition goals
6. **macro_ranges** - Macro targets and ranges
7. **meal_preferences** - Meal patterns and favorite dishes
8. **nutrition_limits** - Nutrition constraints
9. **user_progress** - Progress tracking
10. **diet_forms** - Diet form submissions

## API Endpoints

- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create new user
- `GET /api/diet-forms` - Get user's diet forms
- `POST /api/diet-forms` - Submit diet form
- `GET /api/admin/users` - Admin user management
- `GET /api/places` - Search places (Google Maps)

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test with UI
npm run test:e2e:ui
```

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs -f

# Access database
docker-compose exec postgres psql -U diet_user -d diet_management
```

## Environment Variables

Required environment variables (see `env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth secret key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `GOOGLE_API_KEY` - Google Maps API key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License
