"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2Icon } from "lucide-react"
import { setupBusiness } from "@/app/actions/business"
import { toast } from "@/components/ui/use-toast"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    address: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    confirmPassword: "",
    currency: "USD",
    taxRate: 0,
    fiscalYearStart: "jan",
  })

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.businessName || !formData.businessType) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }
    } else if (step === 2) {
      if (!formData.adminName || !formData.adminEmail || !formData.adminPassword) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      if (formData.adminPassword !== formData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please make sure your passwords match",
          variant: "destructive",
        })
        return
      }
    }

    setStep(step + 1)
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleComplete = async () => {
    setLoading(true)

    try {
      const result = await setupBusiness({
        businessName: formData.businessName,
        businessType: formData.businessType,
        address: formData.address,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
        currency: formData.currency,
        taxRate: Number(formData.taxRate),
        fiscalYearStart: formData.fiscalYearStart,
      })

      if (result.success) {
        toast({
          title: "Setup complete!",
          description: "Your StashIT system is ready to use",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Setup failed",
          description: result.error || "An error occurred during setup",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during setup:", error)
      toast({
        title: "Setup failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to StashIT</CardTitle>
          <CardDescription>Let's set up your inventory system</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-type">Business Type</Label>
                <Select value={formData.businessType} onValueChange={(value) => handleChange("businessType", value)}>
                  <SelectTrigger id="business-type">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="wholesale">Wholesale</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your business address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Admin Name</Label>
                <Input
                  id="admin-name"
                  placeholder="Enter your name"
                  value={formData.adminName}
                  onChange={(e) => handleChange("adminName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.adminEmail}
                  onChange={(e) => handleChange("adminEmail", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Create Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.adminPassword}
                  onChange={(e) => handleChange("adminPassword", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                    <SelectItem value="AUD">AUD ($)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => handleChange("taxRate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fiscal-year">Fiscal Year Start</Label>
                <Select
                  value={formData.fiscalYearStart}
                  onValueChange={(value) => handleChange("fiscalYearStart", value)}
                >
                  <SelectTrigger id="fiscal-year">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jan">January</SelectItem>
                    <SelectItem value="feb">February</SelectItem>
                    <SelectItem value="mar">March</SelectItem>
                    <SelectItem value="apr">April</SelectItem>
                    <SelectItem value="may">May</SelectItem>
                    <SelectItem value="jun">June</SelectItem>
                    <SelectItem value="jul">July</SelectItem>
                    <SelectItem value="aug">August</SelectItem>
                    <SelectItem value="sep">September</SelectItem>
                    <SelectItem value="oct">October</SelectItem>
                    <SelectItem value="nov">November</SelectItem>
                    <SelectItem value="dec">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-green-100 p-3">
                  <CheckCircle2Icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium">You're all set!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your StashIT inventory system is ready to use. You can now start adding your inventory items,
                  suppliers, and more.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="flex w-full gap-2">
            {step > 1 && step < 4 && (
              <Button variant="outline" onClick={handlePrevious} className="flex-1">
                Back
              </Button>
            )}
            {step < 3 && (
              <Button onClick={handleNext} className="flex-1">
                Next
              </Button>
            )}
            {step === 3 && (
              <Button onClick={handleComplete} className="flex-1">
                Complete Setup
              </Button>
            )}
            {step === 4 && (
              <Button onClick={handleComplete} className="flex-1" disabled={loading}>
                {loading ? "Setting up your system..." : "Go to Dashboard"}
              </Button>
            )}
          </div>
          <div className="flex justify-center gap-1 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === step ? "bg-primary" : i < step ? "bg-primary/50" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
