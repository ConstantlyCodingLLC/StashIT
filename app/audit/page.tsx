import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeftIcon, DownloadIcon, FilterIcon, SearchIcon } from "lucide-react"

export default function AuditPage() {
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
          <h1 className="text-lg font-semibold">Audit Trail</h1>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button variant="outline" size="icon">
              <DownloadIcon className="h-4 w-4" />
              <span className="sr-only">Export</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search audit logs..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Action type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="create">Item Created</SelectItem>
              <SelectItem value="update">Item Updated</SelectItem>
              <SelectItem value="delete">Item Deleted</SelectItem>
              <SelectItem value="receive">Item Received</SelectItem>
              <SelectItem value="deploy">Item Deployed</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="7days">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-medium">Jun 13, 2023</div>
                    <div className="text-xs text-muted-foreground">10:23 AM</div>
                  </TableCell>
                  <TableCell>Sarah Johnson</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                      Received
                    </span>
                  </TableCell>
                  <TableCell>Office Paper</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-medium">Jun 13, 2023</div>
                    <div className="text-xs text-muted-foreground">09:45 AM</div>
                  </TableCell>
                  <TableCell>Michael Chen</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-600">
                      Updated
                    </span>
                  </TableCell>
                  <TableCell>HDMI Cables</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-medium">Jun 12, 2023</div>
                    <div className="text-xs text-muted-foreground">04:12 PM</div>
                  </TableCell>
                  <TableCell>Alex Rodriguez</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-purple-50 text-purple-600">
                      Deployed
                    </span>
                  </TableCell>
                  <TableCell>MacBook Pro 16"</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-medium">Jun 12, 2023</div>
                    <div className="text-xs text-muted-foreground">02:30 PM</div>
                  </TableCell>
                  <TableCell>Jamie Smith</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-600">
                      Created
                    </span>
                  </TableCell>
                  <TableCell>iPad Pro 12.9"</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-medium">Jun 11, 2023</div>
                    <div className="text-xs text-muted-foreground">11:15 AM</div>
                  </TableCell>
                  <TableCell>Sarah Johnson</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-600">
                      Deleted
                    </span>
                  </TableCell>
                  <TableCell>USB Flash Drives</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-medium">Jun 10, 2023</div>
                    <div className="text-xs text-muted-foreground">03:45 PM</div>
                  </TableCell>
                  <TableCell>Michael Chen</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                      Received
                    </span>
                  </TableCell>
                  <TableCell>Shipping Boxes (Small)</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
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
          <Button variant="ghost" size="sm" className="px-4">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
