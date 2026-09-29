#!/bin/bash

# Database Migration Script
# This script backs up your local database and prepares it for Render migration

set -e

echo "=================================================="
echo "AutoShop Database Backup & Migration"
echo "=================================================="

# Configuration
DB_USER="autoshop"
DB_PASSWORD="autoshop_password"
DB_NAME="autoshop_db"
DB_HOST="localhost"
DB_PORT="5432"
BACKUP_FILE="autoshop_backup.sql"

echo ""
echo "Step 1: Starting PostgreSQL database..."
cd /home/phil/projects/autoshop
docker-compose up -d postgres

echo "Waiting for database to be ready..."
for i in {1..30}; do
  if docker exec autoshop-postgres pg_isready -U "$DB_USER" > /dev/null 2>&1; then
    echo "✓ PostgreSQL is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "✗ PostgreSQL failed to start"
    exit 1
  fi
  echo "  Waiting... ($i/30)"
  sleep 1
done

echo ""
echo "Step 2: Creating database backup..."
echo "  Backing up: postgresql://$DB_USER:***@$DB_HOST:$DB_PORT/$DB_NAME"

PGPASSWORD="$DB_PASSWORD" pg_dump \
  -h "$DB_HOST" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  -v \
  > "$BACKUP_FILE"

if [ -f "$BACKUP_FILE" ]; then
  BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "✓ Backup created successfully!"
  echo "  File: $BACKUP_FILE"
  echo "  Size: $BACKUP_SIZE"
else
  echo "✗ Failed to create backup"
  exit 1
fi

echo ""
echo "Step 3: Backup verification"
TABLES=$(grep -c "^CREATE TABLE" "$BACKUP_FILE" || echo 0)
echo "  Tables in backup: $TABLES"
RECORDS=$(grep -c "^INSERT INTO" "$BACKUP_FILE" || echo 0)
echo "  Insert statements: $RECORDS"

echo ""
echo "=================================================="
echo "✓ Backup Complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Get your Render PostgreSQL External URL from:"
echo "   Render Dashboard → PostgreSQL → Info tab → External Database URL"
echo ""
echo "2. Run this command to restore to Render:"
echo "   psql <YOUR_RENDER_EXTERNAL_DB_URL> < $BACKUP_FILE"
echo ""
echo "3. Example (replace with your actual URL):"
echo "   psql postgresql://user:password@hostname:5432/database < $BACKUP_FILE"
echo ""
