"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeftIcon, ScanBarcodeIcon } from "lucide-react"
import BarcodeScanner from "@/components/barcode-scanner"
import { DateInput } from "@/components/ui/date-input"

export default function AddDevicePage() {
  const [showScanner, setShowScanner] = useState(false)
  const [serialNumber, setSerialNumber] = useState("")

  const handleScan = (barcode: string) => {
    setSerialNumber(barcode)
    setShowScanner(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center h-14 px-4">
          <Link href="/devices">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Add New Device</h1>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Device Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="device-name">Device Name</Label>
              <Input id="device-name" placeholder="e.g., MacBook Pro 16" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="device-type">Device Type</Label>
              <Select>
                <SelectTrigger id="device-type">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="phone">Smartphone</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input id="manufacturer" placeholder="e.g., Apple, Dell, Samsung" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="e.g., MacBook Pro, XPS 13" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serial-number">Serial Number / IMEI</Label>
              <div className="flex gap-2">
                <Input
                  id="serial-number"
                  placeholder="Enter serial number"
                  className="flex-1"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
                <Button variant="outline" size="icon" onClick={() => setShowScanner(true)}>
                  <ScanBarcodeIcon className="w-5 h-5" />
                  <span className="sr-only">Scan Barcode</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU / Asset Tag</Label>
              <Input id="sku" placeholder="e.g., DEV-LAP-001" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase-date">Purchase Date</Label>
              <DateInput id="purchase-date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warranty-expiry">Warranty Expiry</Label>
              <DateInput id="warranty-expiry" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigned-to">Assigned To</Label>
              <Select>
                <SelectTrigger id="assigned-to">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="user1">Sarah Johnson</SelectItem>
                  <SelectItem value="user2">Michael Chen</SelectItem>
                  <SelectItem value="user3">Alex Rodriguez</SelectItem>
                  <SelectItem value="user4">Jamie Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue="available">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                  <SelectItem value="repair">In Repair</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Additional information about this device" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">Save Device</Button>
        </div>
      </main>

      {showScanner && <BarcodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
    </div>
  )
}
