import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeftIcon, BoxIcon, PlusIcon, SearchIcon } from "lucide-react"

export default function InventoryPage() {
  const hasItems = false // This would be determined by checking if there are items in the database

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center h-14 px-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Inventory</h1>
          <Link href="/inventory/add" className="ml-auto">
            <Button size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </Link>
        </div>
      </header>

      <div className="container px-4 py-4">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="pl-9" />
        </div>

        <Card className="overflow-hidden">
          {!hasItems ? (
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <BoxIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No inventory items yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Start by adding your first inventory item. You can add details like quantity, cost, and location.
              </p>
              <Link href="/inventory/add">
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Your First Item
                </Button>
              </Link>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">{/* The existing table would go here when there are items */}</div>
          )}
        </Card>
      </div>
    </div>
  )
}
