"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftIcon, MinusIcon, PlusIcon, ScanBarcodeIcon } from "lucide-react"
import BarcodeScanner from "@/components/barcode-scanner"

export default function DeployPage() {
  const [showScanner, setShowScanner] = useState(false)
  const [skuInput, setSkuInput] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [items, setItems] = useState([
    { name: "HDMI Cables", sku: "ELE-CAB-002", quantity: 12 },
    { name: "Packing Tape", sku: "PKG-TAP-001", quantity: 3 },
  ])

  const handleScan = (barcode: string) => {
    setSkuInput(barcode)
    setShowScanner(false)
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const addItem = () => {
    if (!skuInput) return

    // In a real app, you would look up the item details from the database
    // For demo purposes, we'll use a mock item based on the SKU
    const itemMap: Record<string, string> = {
      "OFF-PAP-001": "Office Paper",
      "ELE-CAB-002": "HDMI Cables",
      "PKG-BOX-001": "Shipping Boxes (Small)",
      "PKG-TAP-001": "Packing Tape",
      "DEV-LAP-001": 'MacBook Pro 16"',
      "DEV-TAB-002": 'iPad Pro 12.9"',
    }

    const itemName = itemMap[skuInput] || "Unknown Item"

    setItems((prev) => [...prev, { name: itemName, sku: skuInput, quantity }])
    setSkuInput("")
    setQuantity(1)
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center h-14 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Deploy Inventory</h1>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scan or Select Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter SKU or item name"
                className="flex-1"
                value={skuInput}
                onChange={(e) => setSkuInput(e.target.value)}
              />
              <Button variant="outline" size="icon" onClick={() => setShowScanner(true)}>
                <ScanBarcodeIcon className="w-5 h-5" />
                <span className="sr-only">Scan Barcode</span>
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Select>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer Order</SelectItem>
                  <SelectItem value="internal">Internal Use</SelectItem>
                  <SelectItem value="transfer">Location Transfer</SelectItem>
                  <SelectItem value="damaged">Damaged/Defective</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Select>
                <SelectTrigger id="destination">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer1">Customer - ABC Corp</SelectItem>
                  <SelectItem value="customer2">Customer - XYZ Ltd</SelectItem>
                  <SelectItem value="department1">Department - Marketing</SelectItem>
                  <SelectItem value="department2">Department - Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center">
                <Button variant="outline" size="icon" className="rounded-r-none" onClick={decreaseQuantity}>
                  <MinusIcon className="w-4 h-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                  className="rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button variant="outline" size="icon" className="rounded-l-none" onClick={increaseQuantity}>
                  <PlusIcon className="w-4 h-4" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input id="notes" placeholder="Add any additional information" />
            </div>

            <Button className="w-full" onClick={addItem} disabled={!skuInput}>
              Add Item
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Items to Deploy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No items added yet</p>
            ) : (
              items.map((item, index) => (
                <div key={index} className="border rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      SKU: {item.sku} • Qty: {item.quantity}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Button className="w-full" disabled={items.length === 0}>
          Complete Deployment
        </Button>
      </main>

      {showScanner && <BarcodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
    </div>
  )
}
