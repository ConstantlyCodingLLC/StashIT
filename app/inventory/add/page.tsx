import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeftIcon, ScanBarcodeIcon } from "lucide-react"

export default function AddItemPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center h-14 px-4">
          <Link href="/inventory">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Add New Item</h1>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Item Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input id="item-name" placeholder="Enter item name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <div className="flex gap-2">
                <Input id="sku" placeholder="Enter SKU" className="flex-1" />
                <Button variant="outline" size="icon">
                  <ScanBarcodeIcon className="w-5 h-5" />
                  <span className="sr-only">Scan Barcode</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office Supplies</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="packaging">Packaging</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Initial Quantity</Label>
                <Input id="quantity" type="number" defaultValue="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min-quantity">Minimum Quantity</Label>
                <Input id="min-quantity" type="number" defaultValue="10" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost Price</Label>
                <Input id="cost" type="number" placeholder="0.00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="selling">Selling Price</Label>
                <Input id="selling" type="number" placeholder="0.00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Input id="location" placeholder="e.g., Shelf A3, Warehouse B" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter item description" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Default Supplier</Label>
              <Select>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acme">Acme Supplies</SelectItem>
                  <SelectItem value="techworld">TechWorld</SelectItem>
                  <SelectItem value="boxco">BoxCo Packaging</SelectItem>
                  <SelectItem value="officeplus">Office Plus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">Save Item</Button>
        </div>
      </main>
    </div>
  )
}
