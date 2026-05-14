# AutoShop - Professional Online Auto Store

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm run setup
   ```

2. **Configure Database**
   - Create a PostgreSQL database: `autoshop_db`
   - Update `backend/.env` with your database credentials
   - Run migrations: `npm run db:migrate` (in backend folder)

3. **Setup Payments (Stripe)**
   - Sign up at https://stripe.com
   - Get your API keys from the Stripe dashboard
   - Add to `backend/.env`:
     - `STRIPE_SECRET_KEY=sk_test_...`
     - `STRIPE_PUBLIC_KEY=pk_test_...`
   - Add to `frontend/.env.local`:
     - `NEXT_PUBLIC_STRIPE_KEY=pk_test_...`

4. **Add Your Product Images**
   - Copy your images from the `pics/` folder to `backend/uploads/products/`
   - Or use the admin panel (coming soon)

5. **Start Development Servers**
   ```bash
   npm start
   ```
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

---

## 📁 Project Structure

```
autoshop/
├── frontend/                 # Next.js storefront
│   ├── app/                  # Pages and layouts
│   ├── components/           # React components
│   ├── lib/                  # Utilities & hooks
│   └── public/               # Static files
│
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── db/               # Database setup & queries
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Business logic
│   │   └── middleware/       # Custom middleware
│   └── uploads/products/     # Product images
│
├── pics/                     # Your inventory photos
└── package.json              # Root package file
```

---

## 🛠️ Next Steps

### 1. Database Setup
- [ ] Create PostgreSQL database
- [ ] Configure .env files
- [ ] Run database migration

### 2. Import Products
- [ ] Create product list with your inventory
- [ ] Add categories (Parts, Vehicles, Services)
- [ ] Upload images from `pics/` folder

### 3. Payment Setup
- [ ] Get Stripe API keys
- [ ] Configure webhook endpoints
- [ ] Test payment flow

### 4. Frontend Customization
- [ ] Add your branding/logo
- [ ] Create product catalog pages
- [ ] Design shopping cart & checkout
- [ ] Customize home page

### 5. Admin Dashboard
- [ ] Build product management interface
- [ ] Order management system
- [ ] Inventory tracking
- [ ] Sales analytics

### 6. Deployment
- [ ] Deploy frontend to Vercel or similar
- [ ] Deploy backend to Heroku, Railway, or similar
- [ ] Setup production database
- [ ] Configure SSL/HTTPS
- [ ] Domain setup

---

## 🗂️ Adding Your Products

### Option 1: Manual Database Entry
```sql
INSERT INTO products (sku, name, description, category_id, product_type, price, stock_quantity, main_image)
VALUES ('SKU001', 'Product Name', 'Description', 1, 'part', 99.99, 10, '/images/product.jpg');
```

### Option 2: CSV Import (To be implemented)
- Prepare CSV with product data
- Use admin import tool

### Option 3: API Endpoint (To be implemented)
- POST /api/admin/products with product details

---

## 💳 Payment Processing

- Stripe integration ready
- Test mode keys provided in .env
- Switch to production keys when live

---

## 📱 Technology Stack

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- TypeScript
- Stripe.js

**Backend:**
- Express.js
- PostgreSQL
- Node.js
- TypeScript

**Services:**
- Stripe for payments
- PostgreSQL for database

---

## 🆘 Troubleshooting

**Database Connection Error?**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

**Port Already in Use?**
- Change PORT in .env (default 3001)
- Or kill process: `lsof -ti:3001 | xargs kill`

**Frontend not connecting to API?**
- Check NEXT_PUBLIC_API_URL in frontend/.env.local
- Verify backend is running on port 3001
- Check CORS configuration in backend

---

## 📞 Support Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express Docs](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Stripe Docs](https://stripe.com/docs)

---

**Ready to launch? Start with step 1 above! 🚀**
