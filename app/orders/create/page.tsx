"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"

export default function CreateOrderPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [items, setItems] = useState([])

  const [formData, setFormData] = useState({
    supplierId: "",
    orderDate: new Date().toISOString().split("T")[0],
    expectedDeliveryDate: "",
    status: "pending",
    notes: "",
    items: [{ itemId: "", quantity: 1, unitPrice: 0 }],
  })

  // Fetch suppliers and inventory items on component mount
  useState(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("/api/suppliers")
        const data = await response.json()
        if (data.success) {
          setSuppliers(data.suppliers)
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error)
      }
    }

    const fetchItems = async () => {
      try {
        const response = await fetch("/api/inventory")
        const data = await response.json()
        if (data.success) {
          setItems(data.items)
        }
      } catch (error) {
        console.error("Error fetching inventory items:", error)
      }
    }

    fetchSuppliers()
    fetchItems()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    updatedItems[index][field] = value
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }))
  }

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { itemId: "", quantity: 1, unitPrice: 0 }],
    }))
  }

  const removeItemRow = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = [...formData.items]
      updatedItems.splice(index, 1)
      setFormData((prev) => ({
        ...prev,
        items: updatedItems,
      }))
    }
  }

  const calculateTotal = () => {
    return formData.items
      .reduce((total, item) => {
        return total + item.quantity * item.unitPrice
      }, 0)
      .toFixed(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Purchase order created successfully",
        })
        router.push("/orders")
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create purchase order",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating purchase order:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create Purchase Order</h1>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>Create a new purchase order for inventory items</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="supplierId">Supplier</Label>
                <Select id="supplierId" name="supplierId" value={formData.supplierId} onChange={handleChange} required>
                  <option value="">Select a supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderDate">Order Date</Label>
                <Input
                  id="orderDate"
                  name="orderDate"
                  type="date"
                  value={formData.orderDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
                <Input
                  id="expectedDeliveryDate"
                  name="expectedDeliveryDate"
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select id="status" name="status" value={formData.status} onChange={handleChange}>
                  <option value="pending">Pending</option>
                  <option value="ordered">Ordered</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes or instructions"
              />
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Order Items</h3>

              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-5">
                    <Label htmlFor={`item-${index}`}>Item</Label>
                    <Select
                      id={`item-${index}`}
                      value={item.itemId}
                      onChange={(e) => handleItemChange(index, "itemId", e.target.value)}
                      required
                    >
                      <option value="">Select an item</option>
                      {items.map((inventoryItem) => (
                        <option key={inventoryItem.id} value={inventoryItem.id}>
                          {inventoryItem.name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div className="col-span-3">
                    <Label htmlFor={`price-${index}`}>Unit Price</Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, "unitPrice", Number.parseFloat(e.target.value))}
                      required
                    />
                  </div>

                  <div className="col-span-2 flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItemRow(index)}
                      disabled={formData.items.length <= 1}
                      className="w-full"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addItemRow} className="mt-2">
                Add Item
              </Button>
            </div>

            <div className="flex justify-end">
              <div className="text-xl font-bold">Total: ${calculateTotal()}</div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/orders")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Order"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
