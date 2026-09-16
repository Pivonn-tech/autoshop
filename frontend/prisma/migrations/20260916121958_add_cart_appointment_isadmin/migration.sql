-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "CarListing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "bodyType" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "engineSize" TEXT,
    "condition" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KSH',
    "negotiable" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "images" JSONB NOT NULL,
    "primaryImage" TEXT,
    "location" JSONB NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "preferredDate" TIMESTAMP(3) NOT NULL,
    "preferredTime" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CarListing_status_createdAt_idx" ON "CarListing"("status", "createdAt");

-- CreateIndex
CREATE INDEX "CarListing_make_model_idx" ON "CarListing"("make", "model");

-- CreateIndex
CREATE INDEX "CarListing_price_idx" ON "CarListing"("price");

-- CreateIndex
CREATE INDEX "CarListing_location_idx" ON "CarListing"("location");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_sessionKey_key" ON "Cart"("sessionKey");

-- CreateIndex
CREATE INDEX "Cart_userId_idx" ON "Cart"("userId");

-- CreateIndex
CREATE INDEX "Cart_sessionKey_idx" ON "Cart"("sessionKey");

-- CreateIndex
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_key" ON "CartItem"("cartId", "productId");

-- CreateIndex
CREATE INDEX "Appointment_userId_idx" ON "Appointment"("userId");

-- CreateIndex
CREATE INDEX "Appointment_preferredDate_idx" ON "Appointment"("preferredDate");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- AddForeignKey
ALTER TABLE "CarListing" ADD CONSTRAINT "CarListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
