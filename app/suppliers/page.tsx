import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeftIcon, PlusIcon, SearchIcon, TruckIcon } from "lucide-react"

export default function SuppliersPage() {
  const hasSuppliers = false // This would be determined by checking if there are suppliers in the database

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
          <h1 className="text-lg font-semibold">Suppliers</h1>
          <Link href="/suppliers/add" className="ml-auto">
            <Button size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </Link>
        </div>
      </header>

      <div className="container px-4 py-4">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search suppliers..." className="pl-9" />
        </div>

        <Card className="overflow-hidden">
          {!hasSuppliers ? (
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <TruckIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No suppliers yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Add your suppliers to keep track of vendor information, payment terms, and contact details.
              </p>
              <Link href="/suppliers/add">
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Your First Supplier
                </Button>
              </Link>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">{/* The existing table would go here when there are suppliers */}</div>
          )}
        </Card>
      </div>
    </div>
  )
}
