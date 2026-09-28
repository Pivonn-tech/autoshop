#!/bin/bash

# AutoShop Database Migration to Render
# This script backs up your local database and restores it to Render

set -e

echo "🚀 AutoShop Database Migration Tool"
echo "===================================="
echo ""

# Step 1: Backup local database
echo "📦 Step 1: Backing up local database..."
BACKUP_FILE="autoshop_backup_$(date +%Y%m%d_%H%M%S).sql"

if ! command -v pg_dump &> /dev/null; then
    echo "❌ Error: pg_dump not found. Please install PostgreSQL client tools:"
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu: sudo apt-get install postgresql-client"
    exit 1
fi

pg_dump postgresql://phil:phil@localhost:5432/autoshop_db > "$BACKUP_FILE"
echo "✅ Backup created: $BACKUP_FILE"
echo ""

# Step 2: Get Render database URL
echo "📋 Step 2: Enter your Render database details"
echo ""
echo "Get these from: Render Dashboard → PostgreSQL service → Info tab"
echo "Use the EXTERNAL DATABASE URL (starts with postgresql://)"
echo ""

read -p "Enter your Render database URL: " RENDER_DB_URL

if [[ -z "$RENDER_DB_URL" ]]; then
    echo "❌ Error: Database URL is required"
    exit 1
fi

# Step 3: Test connection to Render database
echo ""
echo "🔗 Step 3: Testing connection to Render database..."

if ! psql "$RENDER_DB_URL" -c "SELECT 1" > /dev/null 2>&1; then
    echo "❌ Error: Cannot connect to Render database"
    echo "   Check if the database URL is correct"
    echo "   Make sure your database is fully initialized (wait a few minutes)"
    exit 1
fi

echo "✅ Connection successful"
echo ""

# Step 4: Restore database
echo "🔄 Step 4: Restoring database to Render..."
echo "   This may take 1-2 minutes..."

psql "$RENDER_DB_URL" < "$BACKUP_FILE"

echo "✅ Database restored successfully"
echo ""

# Step 5: Verify migration
echo "✅ Step 5: Verifying migration..."

# Count records in Cart table
CART_COUNT=$(psql "$RENDER_DB_URL" -t -c "SELECT COUNT(*) FROM \"Cart\";")

echo "   Carts in Render database: $CART_COUNT"

if [ "$CART_COUNT" -gt 0 ]; then
    echo "✅ Migration successful! Data is in Render."
else
    echo "⚠️  No carts found. This may be OK if your local database was empty."
fi

echo ""
echo "===================================="
echo "🎉 Migration Complete!"
echo ""
echo "Your local database backup: $BACKUP_FILE"
echo "Render database URL: $RENDER_DB_URL"
echo ""
echo "Next steps:"
echo "1. Verify your backend is running on Render (check logs)"
echo "2. Test: curl https://autoshop-backend-xxxxx.onrender.com/health"
echo "3. Deploy frontend to Vercel"
echo ""
