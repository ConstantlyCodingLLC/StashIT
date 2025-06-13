import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeftIcon, LaptopIcon, PlusIcon, SearchIcon, SmartphoneIcon, TabletIcon } from "lucide-react"

export default function DevicesPage() {
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
          <h1 className="text-lg font-semibold">Devices</h1>
          <Link href="/devices/add" className="ml-auto">
            <Button size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Device
            </Button>
          </Link>
        </div>
      </header>

      <div className="container px-4 py-4">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search devices..." className="pl-9" />
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <LaptopIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">MacBook Pro 16"</div>
                        <div className="text-xs text-muted-foreground">SN: FVFXC2ABCD12 • DEV-LAP-001</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                      Deployed
                    </span>
                  </TableCell>
                  <TableCell className="text-right">Sarah Johnson</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <LaptopIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Dell XPS 13</div>
                        <div className="text-xs text-muted-foreground">SN: 5TGBNH78901 • DEV-LAP-002</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                      Deployed
                    </span>
                  </TableCell>
                  <TableCell className="text-right">Michael Chen</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <TabletIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">iPad Pro 12.9"</div>
                        <div className="text-xs text-muted-foreground">SN: DLXPF987ZYX • DEV-TAB-001</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                      Deployed
                    </span>
                  </TableCell>
                  <TableCell className="text-right">Alex Rodriguez</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <SmartphoneIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">iPhone 14 Pro</div>
                        <div className="text-xs text-muted-foreground">SN: IMEI123456789 • DEV-PHN-001</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-600">
                      In Repair
                    </span>
                  </TableCell>
                  <TableCell className="text-right">Jamie Smith</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <LaptopIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Lenovo ThinkPad X1</div>
                        <div className="text-xs text-muted-foreground">SN: PF45TH12345 • DEV-LAP-003</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-600">
                      Available
                    </span>
                  </TableCell>
                  <TableCell className="text-right">—</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
