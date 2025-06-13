"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
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

export default function Home() {
  const router = useRouter()

  // In a real app, we would check if the user is already set up
  const isSetup = false

  useEffect(() => {
    // If already set up, redirect to dashboard
    if (isSetup) {
      router.push("/dashboard")
    }
  }, [isSetup, router])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center justify-between h-14 px-4">
          <h1 className="text-lg font-semibold">Inventory System</h1>
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
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">Across 12 categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,856</div>
              <p className="text-xs text-muted-foreground">+5.2% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <ArrowDownIcon className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Received 24 units</p>
                  <p className="text-xs text-muted-foreground">Office Supplies - Paper</p>
                </div>
                <div className="text-xs text-muted-foreground">2h ago</div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <ArrowUpIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Deployed 12 units</p>
                  <p className="text-xs text-muted-foreground">Electronics - Cables</p>
                </div>
                <div className="text-xs text-muted-foreground">5h ago</div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <LaptopIcon className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Added new device</p>
                  <p className="text-xs text-muted-foreground">MacBook Pro 16"</p>
                </div>
                <div className="text-xs text-muted-foreground">Yesterday</div>
              </div>
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
          <Link href="/" className="flex flex-col items-center justify-center">
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
