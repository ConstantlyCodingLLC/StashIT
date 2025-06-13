import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeftIcon, FilterIcon, PlusIcon, SearchIcon } from "lucide-react"

export default function PurchaseOrdersPage() {
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
          <h1 className="text-lg font-semibold">Purchase Orders</h1>
          <Link href="/purchase-orders/create" className="ml-auto">
            <Button size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              Create PO
            </Button>
          </Link>
        </div>
      </header>

      <div className="container px-4 py-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search purchase orders..." className="pl-9" />
          </div>
          <Button variant="outline" size="icon" className="sm:order-last">
            <FilterIcon className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="partial">Partially Received</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Link href="/purchase-orders/PO-2023-001" className="font-medium text-primary hover:underline">
                      PO-2023-001
                    </Link>
                  </TableCell>
                  <TableCell>Acme Supplies</TableCell>
                  <TableCell>Jun 10, 2023</TableCell>
                  <TableCell>$1,245.50</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                      Received
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Link href="/purchase-orders/PO-2023-002" className="font-medium text-primary hover:underline">
                      PO-2023-002
                    </Link>
                  </TableCell>
                  <TableCell>TechWorld</TableCell>
                  <TableCell>Jun 12, 2023</TableCell>
                  <TableCell>$3,780.25</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-600">
                      Partially Received
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Link href="/purchase-orders/PO-2023-003" className="font-medium text-primary hover:underline">
                      PO-2023-003
                    </Link>
                  </TableCell>
                  <TableCell>BoxCo Packaging</TableCell>
                  <TableCell>Jun 15, 2023</TableCell>
                  <TableCell>$845.75</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-600">
                      Sent
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Link href="/purchase-orders/PO-2023-004" className="font-medium text-primary hover:underline">
                      PO-2023-004
                    </Link>
                  </TableCell>
                  <TableCell>Office Plus</TableCell>
                  <TableCell>Jun 18, 2023</TableCell>
                  <TableCell>$450.30</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-purple-50 text-purple-600">
                      Draft
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Link href="/purchase-orders/PO-2023-005" className="font-medium text-primary hover:underline">
                      PO-2023-005
                    </Link>
                  </TableCell>
                  <TableCell>Global Tech Distributors</TableCell>
                  <TableCell>Jun 20, 2023</TableCell>
                  <TableCell>$2,150.00</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-600">
                      Cancelled
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="flex items-center justify-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="px-4 font-medium">
            1
          </Button>
          <Button variant="ghost" size="sm" className="px-4">
            2
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
