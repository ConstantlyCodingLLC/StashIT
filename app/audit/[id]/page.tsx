import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftIcon, PrinterIcon } from "lucide-react"

export default function AuditDetailPage({ params }: { params: { id: string } }) {
  // This would normally fetch the audit log based on the ID
  const auditLog = {
    id: params.id,
    timestamp: "June 13, 2023 10:23 AM",
    user: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Admin",
    },
    action: "Received",
    item: {
      name: "Office Paper",
      sku: "OFF-PAP-001",
      category: "Office Supplies",
    },
    details: {
      quantity: 24,
      previousQuantity: 100,
      newQuantity: 124,
      cost: 3.99,
      totalCost: 95.76,
      supplier: "Acme Supplies",
      notes: "Regular monthly order",
      location: "Warehouse A",
    },
    ipAddress: "192.168.1.45",
    deviceInfo: "Chrome on Windows",
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center h-14 px-4">
          <Link href="/audit">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Audit Log Details</h1>
          <Button variant="ghost" size="icon" className="ml-auto">
            <PrinterIcon className="h-5 w-5" />
            <span className="sr-only">Print</span>
          </Button>
        </div>
      </header>

      <div className="container px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Event Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                <p>{auditLog.timestamp}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Action</p>
                <p>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                    {auditLog.action}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">User</p>
                <p>{auditLog.user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">User Role</p>
                <p>{auditLog.user.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Item</p>
                <p>{auditLog.item.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">SKU</p>
                <p>{auditLog.item.sku}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Previous Quantity</p>
                <p>{auditLog.details.previousQuantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Quantity</p>
                <p>{auditLog.details.newQuantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quantity Changed</p>
                <p>+{auditLog.details.quantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unit Cost</p>
                <p>${auditLog.details.cost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                <p>${auditLog.details.totalCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                <p>{auditLog.details.supplier}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p>{auditLog.details.location}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p>{auditLog.details.notes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                <p>{auditLog.ipAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Device</p>
                <p>{auditLog.deviceInfo}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
