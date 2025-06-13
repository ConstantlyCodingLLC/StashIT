export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Inventory Summary</h2>
            <p className="text-gray-600">Total Items: 247</p>
            <p className="text-gray-600">Low Stock Items: 12</p>
            <p className="text-gray-600">Out of Stock: 3</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
            <p className="text-gray-600">New items added: 15</p>
            <p className="text-gray-600">Items deployed: 8</p>
            <p className="text-gray-600">Purchase orders: 2</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <div className="space-y-2">
              <a href="/inventory" className="block text-blue-600 hover:text-blue-800">
                View Inventory
              </a>
              <a href="/inventory/add" className="block text-blue-600 hover:text-blue-800">
                Add Item
              </a>
              <a href="/reports" className="block text-blue-600 hover:text-blue-800">
                Generate Report
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <a href="/" className="text-blue-600 hover:text-blue-800">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
