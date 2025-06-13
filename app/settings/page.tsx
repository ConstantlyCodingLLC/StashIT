"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeftIcon, LogOutIcon, TrashIcon, UsersIcon } from "lucide-react"
import { clearBusinessData, updateBusinessSettings } from "@/app/actions/business"
import { toast } from "@/components/ui/use-toast"
import { signOut, useSession } from "next-auth/react"

export default function SettingsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    phone: "",
    email: "",
    lowStockAlerts: true,
    autoOrderSuggestions: true,
    lowStockThreshold: 10,
  })

  // Load business settings
  useEffect(() => {
    const loadBusinessSettings = async () => {
      if (!session?.user?.businessId) return

      try {
        // In a real app, you'd fetch this from an API endpoint
        // For now, we'll just use placeholder data
        setFormData({
          businessName: "Your Business Name",
          address: "123 Business St, City, Country",
          phone: "+1 234 567 8900",
          email: "contact@yourbusiness.com",
          lowStockAlerts: true,
          autoOrderSuggestions: true,
          lowStockThreshold: 10,
        })
      } catch (error) {
        console.error("Error loading business settings:", error)
        toast({
          title: "Error",
          description: "Failed to load business settings",
          variant: "destructive",
        })
      }
    }

    loadBusinessSettings()
  }, [session])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveSettings = async () => {
    if (!session?.user?.businessId) return

    setIsSaving(true)
    try {
      const result = await updateBusinessSettings(session.user.businessId, {
        name: formData.businessName,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        lowStockAlerts: formData.lowStockAlerts,
        autoOrderSuggestions: formData.autoOrderSuggestions,
        lowStockThreshold: formData.lowStockThreshold,
      })

      if (result.success) {
        toast({
          title: "Settings saved",
          description: "Your business settings have been updated",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    if (!session?.user?.businessId) return

    setIsResetting(true)
    try {
      const result = await clearBusinessData(session.user.businessId)

      if (result.success) {
        toast({
          title: "Data reset",
          description: "All business data has been cleared",
        })

        // Sign out and redirect to onboarding
        await signOut({ redirect: false })
        router.push("/onboarding")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reset data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error resetting data:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
      setResetDialogOpen(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

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
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Business Information</CardTitle>
            <CardDescription>Update your business details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter your business address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory Settings</CardTitle>
            <CardDescription>Configure inventory preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="low-stock">Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify when items are running low</p>
              </div>
              <Switch
                id="low-stock"
                checked={formData.lowStockAlerts}
                onCheckedChange={(checked) => handleChange("lowStockAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-order">Auto Order Suggestions</Label>
                <p className="text-sm text-muted-foreground">Suggest reordering low stock items</p>
              </div>
              <Switch
                id="auto-order"
                checked={formData.autoOrderSuggestions}
                onCheckedChange={(checked) => handleChange("autoOrderSuggestions", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="low-threshold">Low Stock Threshold</Label>
              <Input
                id="low-threshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) => handleChange("lowStockThreshold", Number.parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                Items with quantity below this number will be marked as low stock
              </p>
            </div>

            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Management</CardTitle>
            <CardDescription>Manage system settings and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/users">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <UsersIcon className="w-4 h-4" />
                Manage Users
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
              onClick={() => setResetDialogOpen(true)}
            >
              <TrashIcon className="w-4 h-4" />
              Reset All Data
            </Button>

            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOutIcon className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your inventory data, suppliers, purchase orders, and settings. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} disabled={isResetting} className="bg-red-500 hover:bg-red-600">
              {isResetting ? "Resetting..." : "Yes, Reset Everything"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
