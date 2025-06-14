"use client"

import { useState } from "react"
import Link from "next/link"

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  // Mock inventory data
  const inventoryItems = [
    {
      id: "1",
      name: "Laptop Dell XPS 13",
      category: "Electronics",
      sku: "ELEC-001",
      quantity: 15,
      price: 1299.99,
      status: "In Stock",
    },
    {
      id: "2",
      name: "Office Chair",
      category: "Furniture",
      sku: "FURN-001",
      quantity: 5,
      price: 199.99,
      status: "Low Stock",
    },
    {
      id: "3",
      name: "Wireless Mouse",
      category: "Electronics",
      sku: "ELEC-002",
      quantity: 30,
      price: 24.99,
      status: "In Stock",
    },
    {
      id: "4",
      name: "Desk Lamp",
      category: "Office Supplies",
      sku: "OFF-001",
      quantity: 12,
      price: 34.99,
      status: "In Stock",
    },
    {
      id: "5",
      name: "Printer Paper",
      category: "Office Supplies",
      sku: "OFF-002",
      quantity: 3,
      price: 9.99,
      status: "Low Stock",
    },
  ]

  // Filter and search functionality
  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "low-stock") return matchesSearch && item.status === "Low Stock"
    if (filter === "in-stock") return matchesSearch && item.status === "In Stock"

    return matchesSearch
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
        <Link href="/inventory/add">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">Add Item</button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name or SKU"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === "Low Stock" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/inventory/${item.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                      View
                    </Link>
                    <Link href={`/inventory/${item.id}/edit`} className="text-blue-600 hover:text-blue-900">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
