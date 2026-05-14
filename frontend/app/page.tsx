export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white space-y-8">
          <h1 className="text-5xl font-bold">Welcome to AutoShop</h1>
          <p className="text-xl text-gray-300">
            Your Professional Online Automotive Store
          </p>
          <div className="space-y-4">
            <p className="text-lg text-gray-400">
              🔧 Automotive Parts | 🚗 Complete Vehicles | 🛠️ Professional
              Services
            </p>
            <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
              Browse Our Catalog (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
