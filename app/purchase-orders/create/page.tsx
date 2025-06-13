import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeftIcon, MinusIcon, PlusIcon } from "lucide-react"
import { DateInput } from "@/components/ui/date-input"
import { formatDateForInput } from "@/lib/date-utils"

export default function CreatePurchaseOrderPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center h-14 px-4">
          <Link href="/purchase-orders">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Create Purchase Order</h1>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Purchase Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="po-number">PO Number</Label>
                <Input id="po-number" defaultValue="PO-2023-006" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <DateInput id="date" defaultValue={formatDateForInput(new Date())} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acme">Acme Supplies</SelectItem>
                  <SelectItem value="techworld">TechWorld</SelectItem>
                  <SelectItem value="boxco">BoxCo Packaging</SelectItem>
                  <SelectItem value="officeplus">Office Plus</SelectItem>
                  <SelectItem value="gtd">Global Tech Distributors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expected-delivery">Expected Delivery Date</Label>
                <DateInput id="expected-delivery" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-terms">Payment Terms</Label>
                <Select>
                  <SelectTrigger id="payment-terms">
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net15">Net 15</SelectItem>
                    <SelectItem value="net30">Net 30</SelectItem>
                    <SelectItem value="net45">Net 45</SelectItem>
                    <SelectItem value="net60">Net 60</SelectItem>
                    <SelectItem value="cod">COD (Cash on Delivery)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Items</CardTitle>
            <Button size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="border-0 p-0 shadow-none h-auto">
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paper">Office Paper</SelectItem>
                          <SelectItem value="hdmi">HDMI Cables</SelectItem>
                          <SelectItem value="boxes">Shipping Boxes (Small)</SelectItem>
                          <SelectItem value="tape">Packing Tape</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Description" className="border-0 p-0 shadow-none h-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        defaultValue="10"
                        className="border-0 p-0 shadow-none h-auto text-right w-16 ml-auto"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        defaultValue="3.99"
                        step="0.01"
                        className="border-0 p-0 shadow-none h-auto text-right w-20 ml-auto"
                      />
                    </TableCell>
                    <TableCell className="text-right">$39.90</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                        <MinusIcon className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="border-0 p-0 shadow-none h-auto">
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hdmi">HDMI Cables</SelectItem>
                          <SelectItem value="boxes">Shipping Boxes (Small)</SelectItem>
                          <SelectItem value="tape">Packing Tape</SelectItem>
                          <SelectItem value="staplers">Staplers</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Description" className="border-0 p-0 shadow-none h-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        defaultValue="5"
                        className="border-0 p-0 shadow-none h-auto text-right w-16 ml-auto"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        defaultValue="12.50"
                        step="0.01"
                        className="border-0 p-0 shadow-none h-auto text-right w-20 ml-auto"
                      />
                    </TableCell>
                    <TableCell className="text-right">$62.50</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                        <MinusIcon className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
                <tfoot>
                  <tr className="border-t">
                    <td colSpan={4} className="text-right py-2 font-medium">
                      Subtotal:
                    </td>
                    <td className="text-right py-2 font-medium">$102.40</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right py-2 font-medium">
                      Tax (8%):
                    </td>
                    <td className="text-right py-2 font-medium">$8.19</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right py-2 font-medium">
                      Total:
                    </td>
                    <td className="text-right py-2 font-medium">$110.59</td>
                    <td></td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shipping-address">Shipping Address</Label>
              <Textarea id="shipping-address" placeholder="Enter shipping address" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Enter any additional notes or instructions" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1">
            Save as Draft
          </Button>
          <Button className="flex-1">Create Purchase Order</Button>
        </div>
      </main>
    </div>
  )
}
