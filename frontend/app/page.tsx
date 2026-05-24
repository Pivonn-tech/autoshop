"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      });
  }, []);

  const formatKES = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white space-y-8 mb-12">
          <h1 className="text-5xl font-bold">AutoShop Kenya</h1>
          <p className="text-xl text-gray-300">
            Premium Automotive Vehicles & Parts
          </p>
          <p className="text-lg text-gray-400">
            🚚 Cargo Trucks | 🏍️ Three-Wheelers | 🛠️ Professional Services
          </p>
        </div>

        {loading ? (
          <div className="text-center text-white text-xl">
            Loading products...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-slate-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                <div className="bg-gray-400 h-48 flex items-center justify-center">
                  <span className="text-gray-600 text-lg">
                    Product Image {product.id}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-300 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-green-400">
                      {formatKES(product.price)}
                    </span>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
