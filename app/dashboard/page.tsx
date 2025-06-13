import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChart3Icon,
  BoxIcon,
  ClipboardListIcon,
  DollarSignIcon,
  FileTextIcon,
  HomeIcon,
  LaptopIcon,
  PackageIcon,
  SettingsIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center justify-between h-14 px-4">
          <h1 className="text-lg font-semibold">StashIT</h1>
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <SettingsIcon className="w-5 h-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No items added yet</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">No inventory value yet</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <CardDescription>No recent activity</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-sm text-muted-foreground">Your recent inventory activities will appear here.</p>
              <Button variant="outline" className="mt-4">
                Start Adding Inventory
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <Link href="/inventory">
            <Button variant="outline" className="w-full justify-start h-auto py-3">
              <BoxIcon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Inventory</div>
                <div className="text-xs text-muted-foreground">View and manage all items</div>
              </div>
            </Button>
          </Link>
          <Link href="/devices">
            <Button variant="outline" className="w-full justify-start h-auto py-3">
              <LaptopIcon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Devices</div>
                <div className="text-xs text-muted-foreground">Manage company devices</div>
              </div>
            </Button>
          </Link>
          <Link href="/receive">
            <Button variant="outline" className="w-full justify-start h-auto py-3">
              <ArrowDownIcon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Receive Inventory</div>
                <div className="text-xs text-muted-foreground">Log incoming items</div>
              </div>
            </Button>
          </Link>
          <Link href="/deploy">
            <Button variant="outline" className="w-full justify-start h-auto py-3">
              <ArrowUpIcon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Deploy Inventory</div>
                <div className="text-xs text-muted-foreground">Ship or use items</div>
              </div>
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          <Link href="/financial">
            <Button variant="outline" className="w-full justify-start h-auto py-3">
              <DollarSignIcon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Financial Reports</div>
                <div className="text-xs text-muted-foreground">View cost and value analysis</div>
              </div>
            </Button>
          </Link>
          <Link href="/audit">
            <Button variant="outline" className="w-full justify-start h-auto py-3">
              <ClipboardListIcon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Audit Trail</div>
                <div className="text-xs text-muted-foreground">Track all inventory changes</div>
              </div>
            </Button>
          </Link>
          <Link href="/suppliers">
            <Button variant="outline" className="w-full justify-start h-auto py-3">
              <TruckIcon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Suppliers</div>
                <div className="text-xs text-muted-foreground">Manage vendor relationships</div>
              </div>
            </Button>
          </Link>
          <Link href="/purchase-orders">
            <Button variant="outline" className="w-full justify-start h-auto py-3">
              <FileTextIcon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Purchase Orders</div>
                <div className="text-xs text-muted-foreground">Create and manage POs</div>
              </div>
            </Button>
          </Link>
          <Link href="/invoices">
            <Button variant="outline" className="w-full justify-start h-auto py-3">
              <FileTextIcon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Invoices</div>
                <div className="text-xs text-muted-foreground">Generate and track invoices</div>
              </div>
            </Button>
          </Link>
          <Link href="/reports">
            <Button variant="outline" className="w-full justify-start h-auto py-3">
              <BarChart3Icon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Reports</div>
                <div className="text-xs text-muted-foreground">View analytics and reports</div>
              </div>
            </Button>
          </Link>
          <Link href="/users">
            <Button variant="outline" className="w-full justify-start h-auto py-3">
              <UsersIcon className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Users</div>
                <div className="text-xs text-muted-foreground">Manage system users</div>
              </div>
            </Button>
          </Link>
        </div>
      </main>

      <nav className="sticky bottom-0 border-t bg-white">
        <div className="grid grid-cols-5 h-16">
          <Link href="/dashboard" className="flex flex-col items-center justify-center">
            <HomeIcon className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/inventory" className="flex flex-col items-center justify-center">
            <BoxIcon className="w-5 h-5" />
            <span className="text-xs mt-1">Inventory</span>
          </Link>
          <Link href="/receive" className="flex flex-col items-center justify-center">
            <PackageIcon className="w-5 h-5" />
            <span className="text-xs mt-1">Receive</span>
          </Link>
          <Link href="/deploy" className="flex flex-col items-center justify-center">
            <ArrowUpIcon className="w-5 h-5" />
            <span className="text-xs mt-1">Deploy</span>
          </Link>
          <Link href="/financial" className="flex flex-col items-center justify-center">
            <DollarSignIcon className="w-5 h-5" />
            <span className="text-xs mt-1">Finance</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
