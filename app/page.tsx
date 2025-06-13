import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="w-32 h-32 relative mb-6">
          <Image src="/logo.png" alt="StashIT Logo" fill priority className="object-contain" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-900 mb-4">StashIT</h1>

        <p className="text-xl md:text-2xl text-center text-gray-600 max-w-2xl mb-8">
          The complete inventory management solution for your business
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Inventory Tracking</h3>
              <p className="text-gray-600">Track your inventory in real-time with powerful analytics and reporting.</p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Device Management</h3>
              <p className="text-gray-600">Manage all your devices with check-in/check-out functionality.</p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Supplier Management</h3>
              <p className="text-gray-600">Keep track of all your suppliers and purchase orders in one place.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>© 2023 StashIT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
