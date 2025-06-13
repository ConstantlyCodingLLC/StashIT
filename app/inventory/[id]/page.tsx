import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeftIcon, EditIcon, TrashIcon } from "lucide-react"

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  // This would normally fetch the item based on the ID
  const item = {
    id: params.id,
    name: "Office Paper",
    sku: "OFF-PAP-001",
    category: "Office Supplies",
    quantity: 124,
    minQuantity: 20,
    cost: 3.99,
    selling: 5.99,
    location: "Shelf A3",
    supplier: "Acme Supplies",
    description: "Premium quality A4 office paper, 80gsm, suitable for all printers and copiers.",
    lastReceived: "2023-06-01",
    lastDeployed: "2023-06-10",
  }

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
          <h1 className="text-lg font-semibold">Item Details</h1>
          <div className="ml-auto flex gap-2">
            <Link href={`/inventory/${params.id}/edit`}>
              <Button variant="ghost" size="icon">
                <EditIcon className="w-5 h-5" />
                <span className="sr-only">Edit</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-red-500">
              <TrashIcon className="w-5 h-5" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{item.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">SKU</p>
                <p>{item.sku}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p>{item.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Quantity</p>
                <p className="font-semibold">{item.quantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Minimum Quantity</p>
                <p>{item.minQuantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost Price</p>
                <p>${item.cost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Selling Price</p>
                <p>${item.selling.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Location</p>
                <p>{item.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Default Supplier</p>
                <p>{item.supplier}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm">{item.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Jun 10, 2023</TableCell>
                  <TableCell>Deployed</TableCell>
                  <TableCell>-10</TableCell>
                  <TableCell className="text-right">124</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jun 5, 2023</TableCell>
                  <TableCell>Deployed</TableCell>
                  <TableCell>-15</TableCell>
                  <TableCell className="text-right">134</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jun 1, 2023</TableCell>
                  <TableCell>Received</TableCell>
                  <TableCell>+50</TableCell>
                  <TableCell className="text-right">149</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>May 25, 2023</TableCell>
                  <TableCell>Deployed</TableCell>
                  <TableCell>-25</TableCell>
                  <TableCell className="text-right">99</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>May 15, 2023</TableCell>
                  <TableCell>Received</TableCell>
                  <TableCell>+100</TableCell>
                  <TableCell className="text-right">124</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Link href="/receive" className="flex-1">
            <Button variant="outline" className="w-full">
              Receive More
            </Button>
          </Link>
          <Link href="/deploy" className="flex-1">
            <Button className="w-full">Deploy Item</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
