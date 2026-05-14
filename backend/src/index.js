import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}))
app.use(express.json())

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../../frontend/public')))

// Serve product images
app.use('/images', express.static(path.join(__dirname, '../uploads/products')))

// Get product images from folder
function getProductsFromImages() {
  const imagesDir = path.join(__dirname, '../uploads/products')
  try {
    const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
    
    return files.map((file, index) => ({
      id: index + 1,
      name: `Premium Auto Product ${index + 1}`,
      category: ['Parts', 'Accessories', 'Service'][index % 3],
      price: 49.99 + (index * 15.50),
      image: `/images/${file}`,
      originalFile: file,
      stock: Math.floor(Math.random() * 50) + 5,
      icon: ['🔧', '⚙️', '🛠️', '💨', '🔩', '⚡', '✨', '🔍', '🚗', '🛞'][index % 10]
    }))
  } catch (error) {
    console.error('Error reading products:', error)
    return []
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AutoShop Backend is running' })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' })
})

// Products endpoint - NOW SERVES YOUR ACTUAL IMAGES!
app.get('/api/products', (req, res) => {
  const products = getProductsFromImages()
  if (products.length === 0) {
    // Fallback to sample products if no images found
    res.json([
      { 
        id: 1, 
        name: 'Premium Oil Filter', 
        price: 24.99, 
        image: '/sample.jpg', 
        category: 'Parts',
        stock: 45,
        icon: '🔩'
      },
      { 
        id: 2, 
        name: 'Brake Pad Set', 
        price: 89.99, 
        image: '/sample.jpg', 
        category: 'Parts',
        stock: 28,
        icon: '⚙️'
      },
    ])
  } else {
    res.json(products)
  }
})

// Get specific product
app.get('/api/products/:id', (req, res) => {
  const products = getProductsFromImages()
  const product = products.find(p => p.id === parseInt(req.params.id))
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' })
  }
  
  res.json(product)
})

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/index.html'))
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 AutoShop running on http://localhost:${PORT}`)
  console.log(`🌐 Store: http://localhost:${PORT}`)
  console.log(`📊 API: http://localhost:${PORT}/api/products`)
  console.log(`✅ Backend ready to serve your auto shop!`)
  
  // Show product count
  const productCount = getProductsFromImages().length
  console.log(`📦 Found ${productCount} product images in uploads/products/`)
})
