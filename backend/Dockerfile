# Backend - Simple single stage
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

COPY prisma ./prisma/
COPY src ./src

RUN mkdir -p uploads/products uploads/cars

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["sh", "-c", "npm run migrate && node src/index.js"]

# Copy prisma schema and source code
COPY prisma ./prisma/
COPY src ./src

# Create uploads directory
RUN mkdir -p uploads/products uploads/cars

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Run migrations and start server
CMD ["sh", "-c", "npm run migrate && node src/index.js"]
