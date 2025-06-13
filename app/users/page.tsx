import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeftIcon, PlusIcon, SearchIcon, UserIcon } from "lucide-react"

export default function UsersPage() {
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
          <h1 className="text-lg font-semibold">Users</h1>
          <Link href="/users/add" className="ml-auto">
            <Button size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </Link>
        </div>
      </header>

      <div className="container px-4 py-4">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-9" />
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Sarah Johnson</div>
                        <div className="text-xs text-muted-foreground">sarah@example.com</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                      Active
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Michael Chen</div>
                        <div className="text-xs text-muted-foreground">michael@example.com</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                      Active
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Alex Rodriguez</div>
                        <div className="text-xs text-muted-foreground">alex@example.com</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Staff</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600">
                      Active
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Jamie Smith</div>
                        <div className="text-xs text-muted-foreground">jamie@example.com</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Staff</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-600">
                      On Leave
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Taylor Wilson</div>
                        <div className="text-xs text-muted-foreground">taylor@example.com</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Staff</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-600">
                      Inactive
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
