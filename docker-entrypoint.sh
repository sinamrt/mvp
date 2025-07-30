#!/bin/sh

echo "🚀 Starting application initialization..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; do
  echo "Database not ready, waiting..."
  sleep 2
done
echo "✅ Database is ready!"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy

# Seed database (only if not already seeded)
echo "🌱 Checking if database needs seeding..."
if ! npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM users;" | grep -q "[1-9]"; then
  echo "🌱 Seeding database..."
  npx prisma db seed
else
  echo "✅ Database already seeded, skipping..."
fi

echo "🎉 Application initialization complete!"

# Start the application
echo "🚀 Starting Next.js application..."
exec "$@" 