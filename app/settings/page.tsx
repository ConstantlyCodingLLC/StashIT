"use client"

import type React from "react"

import { useState } from "react"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "StashIT Demo Company",
    email: "info@stashit.com",
    phone: "555-123-4567",
    address: "123 Main Street, Anytown, USA",
  })

  const [inventorySettings, setInventorySettings] = useState({
    lowStockThreshold: 10,
    enableLowStockAlerts: true,
    enableAutoReorder: false,
    defaultCategory: "Office Supplies",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: true,
  })

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving general settings:", generalSettings)
    // In a real app, this would save to the backend
  }

  const handleInventorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving inventory settings:", inventorySettings)
    // In a real app, this would save to the backend
  }

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving notification settings:", notificationSettings)
    // In a real app, this would save to the backend
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
            <p className="mt-1 text-sm text-gray-500">Basic information about your company.</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleGeneralSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company-name"
                    id="company-name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={generalSettings.companyName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={generalSettings.email}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Inventory Settings */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Inventory Settings</h2>
            <p className="mt-1 text-sm text-gray-500">Configure how inventory is managed.</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleInventorySubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="low-stock-threshold" className="block text-sm font-medium text-gray-700">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    name="low-stock-threshold"
                    id="low-stock-threshold"
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={inventorySettings.lowStockThreshold}
                    onChange={(e) =>
                      setInventorySettings({ ...inventorySettings, lowStockThreshold: Number.parseInt(e.target.value) })
                    }
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="default-category" className="block text-sm font-medium text-gray-700">
                    Default Category
                  </label>
                  <select
                    id="default-category"
                    name="default-category"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={inventorySettings.defaultCategory}
                    onChange={(e) => setInventorySettings({ ...inventorySettings, defaultCategory: e.target.value })}
                  >
                    <option>Electronics</option>
                    <option>Furniture</option>
                    <option>Office Supplies</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enable-low-stock-alerts"
                        name="enable-low-stock-alerts"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={inventorySettings.enableLowStockAlerts}
                        onChange={(e) =>
                          setInventorySettings({ ...inventorySettings, enableLowStockAlerts: e.target.checked })
                        }
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enable-low-stock-alerts" className="font-medium text-gray-700">
                        Enable Low Stock Alerts
                      </label>
                      <p className="text-gray-500">Get notified when items are running low.</p>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enable-auto-reorder"
                        name="enable-auto-reorder"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={inventorySettings.enableAutoReorder}
                        onChange={(e) =>
                          setInventorySettings({ ...inventorySettings, enableAutoReorder: e.target.checked })
                        }
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enable-auto-reorder" className="font-medium text-gray-700">
                        Enable Auto Reorder
                      </label>
                      <p className="text-gray-500">Automatically create purchase orders for low stock items.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
            <p className="mt-1 text-sm text-gray-500">Configure how you receive notifications and reports.</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleNotificationSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email-notifications"
                          name="email-notifications"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) =>
                            setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })
                          }
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email-notifications" className="font-medium text-gray-700">
                          Email Notifications
                        </label>
                        <p className="text-gray-500">Receive notifications via email.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="push-notifications"
                          name="push-notifications"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) =>
                            setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })
                          }
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="push-notifications" className="font-medium text-gray-700">
                          Push Notifications
                        </label>
                        <p className="text-gray-500">Receive notifications in your browser.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">Reports</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="daily-reports"
                          name="daily-reports"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          checked={notificationSettings.dailyReports}
                          onChange={(e) =>
                            setNotificationSettings({ ...notificationSettings, dailyReports: e.target.checked })
                          }
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="daily-reports" className="font-medium text-gray-700">
                          Daily Reports
                        </label>
                        <p className="text-gray-500">Receive daily summary reports.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="weekly-reports"
                          name="weekly-reports"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          checked={notificationSettings.weeklyReports}
                          onChange={(e) =>
                            setNotificationSettings({ ...notificationSettings, weeklyReports: e.target.checked })
                          }
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="weekly-reports" className="font-medium text-gray-700">
                          Weekly Reports
                        </label>
                        <p className="text-gray-500">Receive weekly summary reports.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="monthly-reports"
                          name="monthly-reports"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          checked={notificationSettings.monthlyReports}
                          onChange={(e) =>
                            setNotificationSettings({ ...notificationSettings, monthlyReports: e.target.checked })
                          }
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="monthly-reports" className="font-medium text-gray-700">
                          Monthly Reports
                        </label>
                        <p className="text-gray-500">Receive monthly summary reports.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
