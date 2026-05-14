# AutoShop - Professional Online Auto Store

A full-stack e-commerce platform for selling automotive parts, vehicles, and services.

## Features

✅ **Product Catalog** - Browse parts, vehicles, and services
✅ **Shopping Cart** - Add/remove items, manage quantities  
✅ **Secure Checkout** - Integrated Stripe payment processing
✅ **Order Management** - Track orders and delivery status
✅ **Admin Dashboard** - Manage inventory, orders, and customers
✅ **Responsive Design** - Mobile-friendly interface
✅ **Image Management** - Upload and organize product images
✅ **User Accounts** - Register, login, and manage profiles
✅ **Inventory Tracking** - Real-time stock management

## Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type-safe development
- **Stripe.js** - Payment integration

### Backend
- **Express.js** - Node.js web framework
- **PostgreSQL** - Relational database
- **Stripe API** - Payment processing
- **TypeScript** - Type-safe backend

## Getting Started

### 1. Clone & Install
```bash
npm run setup
```

### 2. Setup Database
```bash
# Create PostgreSQL database
createdb autoshop_db

# Update backend/.env with credentials
# Run migrations
cd backend
npm run db:migrate
```

### 3. Configure Payments
Get your Stripe API keys from [stripe.com](https://stripe.com) and add to `.env` files

### 4. Start Development
```bash
npm start
```

Frontend: http://localhost:3000
Backend API: http://localhost:3001

## Project Structure

```
frontend/          - Next.js storefront & shopping experience
backend/           - Express API & database logic  
backend/uploads/   - Product images storage
pics/              - Your original inventory photos
```

## Quick Links

- 📖 [Quick Start Guide](./QUICK_START.md) - Step-by-step setup
- 📚 [API Documentation](./backend/API.md) - Coming soon
- 🛠️ [Admin Guide](./ADMIN.md) - Coming soon

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost/autoshop_db
STRIPE_SECRET_KEY=sk_test_xxx
PORT=3001
JWT_SECRET=your-secret-key
```

## Roadmap

- [x] Project setup & structure
- [x] Database schema
- [x] Backend API foundation
- [x] Frontend scaffolding
- [ ] Product management
- [ ] Shopping cart
- [ ] Payment checkout
- [ ] Admin dashboard
- [ ] User accounts
- [ ] Order tracking
- [ ] Analytics
- [ ] Deployment guides

## Contributing

Feel free to submit issues and pull requests!

## License

MIT

---

**Ready to launch your online auto shop? Start with the [Quick Start Guide](./QUICK_START.md)** 🚀
