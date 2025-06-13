import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftIcon, DownloadIcon, PrinterIcon } from "lucide-react"

export default function FinancialPage() {
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
          <h1 className="text-lg font-semibold">Financial Reports</h1>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="icon">
              <PrinterIcon className="h-4 w-4" />
              <span className="sr-only">Print</span>
            </Button>
            <Button variant="outline" size="icon">
              <DownloadIcon className="h-4 w-4" />
              <span className="sr-only">Export</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select defaultValue="month">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="office">Office Supplies</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="packaging">Packaging</SelectItem>
              <SelectItem value="devices">Devices</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,856.78</div>
              <p className="text-xs text-muted-foreground">+5.2% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,320.50</div>
              <p className="text-xs text-muted-foreground">-2.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Depletions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,845.25</div>
              <p className="text-xs text-muted-foreground">+8.7% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">Inventory Value</TabsTrigger>
            <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
            <TabsTrigger value="profit">Profit Margins</TabsTrigger>
          </TabsList>
          <TabsContent value="inventory" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Inventory Valuation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Chart showing inventory valuation over time would appear here
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium">Inventory Value by Category</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Office Supplies</span>
                        <span className="font-medium">$8,245.30</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "33%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Electronics</span>
                        <span className="font-medium">$6,780.25</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "27%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Devices</span>
                        <span className="font-medium">$5,890.50</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "24%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Packaging</span>
                        <span className="font-medium">$3,940.73</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "16%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cost" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-sm text-muted-foreground">Chart showing cost trends over time would appear here</p>
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium">Top Expenses by Supplier</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Acme Supplies</span>
                        <span className="font-medium">$1,845.30</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "42%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>TechWorld</span>
                        <span className="font-medium">$1,250.75</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "29%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>BoxCo Packaging</span>
                        <span className="font-medium">$780.50</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "18%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Office Plus</span>
                        <span className="font-medium">$443.95</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "11%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="profit" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profit Margin Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Chart showing profit margins by category would appear here
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium">Profit Margins by Category</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Electronics</span>
                        <span className="font-medium">42%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "42%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Devices</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Office Supplies</span>
                        <span className="font-medium">28%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Packaging</span>
                        <span className="font-medium">22%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "22%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Items by Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Item</th>
                    <th className="text-left py-3 font-medium">Quantity</th>
                    <th className="text-left py-3 font-medium">Unit Cost</th>
                    <th className="text-left py-3 font-medium">Total Value</th>
                    <th className="text-left py-3 font-medium">Profit Margin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">MacBook Pro 16"</td>
                    <td className="py-3">5</td>
                    <td className="py-3">$1,899.00</td>
                    <td className="py-3">$9,495.00</td>
                    <td className="py-3">32%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">iPad Pro 12.9"</td>
                    <td className="py-3">8</td>
                    <td className="py-3">$999.00</td>
                    <td className="py-3">$7,992.00</td>
                    <td className="py-3">38%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Dell XPS 13</td>
                    <td className="py-3">3</td>
                    <td className="py-3">$1,299.00</td>
                    <td className="py-3">$3,897.00</td>
                    <td className="py-3">28%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">iPhone 14 Pro</td>
                    <td className="py-3">4</td>
                    <td className="py-3">$899.00</td>
                    <td className="py-3">$3,596.00</td>
                    <td className="py-3">35%</td>
                  </tr>
                  <tr>
                    <td className="py-3">Office Paper (Bulk)</td>
                    <td className="py-3">124</td>
                    <td className="py-3">$3.99</td>
                    <td className="py-3">$494.76</td>
                    <td className="py-3">42%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
