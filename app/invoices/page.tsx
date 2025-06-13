import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeftIcon, FilterIcon, PlusIcon, SearchIcon } from "lucide-react"

export default function InvoicesPage() {
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
          <h1 className="text-lg font-semibold">Invoices</h1>
          <Link href="/invoices/create" className="ml-auto">
            <Button size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </Link>
        </div>
      </header>

      <div className="container px-4 py-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search invoices..." className="pl-9" />
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
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Link href="/invoices/INV-2023-001" className="font-medium text-primary hover:underline">
                      INV-2023-001
                    </Link>
                  </TableCell>
                  <TableCell>ABC Corporation</TableCell>
                  <TableCell>Jun 5, 2023</TableCell>
                  <TableCell>Jun 20, 2023</TableCell>
                  <TableCell>$1,245.50</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                      Paid
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
                    <Link href="/invoices/INV-2023-002" className="font-medium text-primary hover:underline">
                      INV-2023-002
                    </Link>
                  </TableCell>
                  <TableCell>XYZ Ltd</TableCell>
                  <TableCell>Jun 8, 2023</TableCell>
                  <TableCell>Jun 23, 2023</TableCell>
                  <TableCell>$2,780.25</TableCell>
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
                    <Link href="/invoices/INV-2023-003" className="font-medium text-primary hover:underline">
                      INV-2023-003
                    </Link>
                  </TableCell>
                  <TableCell>123 Industries</TableCell>
                  <TableCell>Jun 10, 2023</TableCell>
                  <TableCell>Jun 25, 2023</TableCell>
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
                    <Link href="/invoices/INV-2023-004" className="font-medium text-primary hover:underline">
                      INV-2023-004
                    </Link>
                  </TableCell>
                  <TableCell>Smith & Co</TableCell>
                  <TableCell>May 25, 2023</TableCell>
                  <TableCell>Jun 9, 2023</TableCell>
                  <TableCell>$1,450.30</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-600">
                      Overdue
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
                    <Link href="/invoices/INV-2023-005" className="font-medium text-primary hover:underline">
                      INV-2023-005
                    </Link>
                  </TableCell>
                  <TableCell>Global Enterprises</TableCell>
                  <TableCell>Jun 12, 2023</TableCell>
                  <TableCell>Jun 27, 2023</TableCell>
                  <TableCell>$3,150.00</TableCell>
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
