"use server"

import { hash } from "bcryptjs"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createAuditLog } from "./audit"

export interface BusinessSetupData {
  businessName: string
  businessType: string
  address: string
  adminName: string
  adminEmail: string
  adminPassword: string
  currency: string
  taxRate: number
  fiscalYearStart: string
}

export async function setupBusiness(data: BusinessSetupData) {
  try {
    // Create the business
    const business = await prisma.business.create({
      data: {
        name: data.businessName,
        businessType: data.businessType,
        address: data.address,
        currency: data.currency,
        taxRate: data.taxRate,
        fiscalYearStart: data.fiscalYearStart,
        settings: {
          create: {
            lowStockAlerts: true,
            autoOrderSuggestions: true,
            lowStockThreshold: 10,
          },
        },
      },
    })

    // Create the admin user
    const hashedPassword = await hash(data.adminPassword, 10)
    await prisma.user.create({
      data: {
        name: data.adminName,
        email: data.adminEmail,
        password: hashedPassword,
        role: "admin",
        businessId: business.id,
      },
    })

    // Create default categories
    const defaultCategories = ["Office Supplies", "Electronics", "Packaging", "Furniture"]
    await prisma.category.createMany({
      data: defaultCategories.map((name) => ({
        name,
        businessId: business.id,
      })),
    })

    return { success: true, businessId: business.id }
  } catch (error) {
    console.error("Error setting up business:", error)
    return { success: false, error: "Failed to set up business" }
  }
}

export async function clearBusinessData(businessId: string) {
  try {
    // Delete all business data in the correct order to respect foreign key constraints
    await prisma.$transaction([
      prisma.auditLog.deleteMany({ where: { businessId } }),
      prisma.invoiceItem.deleteMany({
        where: { invoice: { businessId } },
      }),
      prisma.invoice.deleteMany({ where: { businessId } }),
      prisma.purchaseOrderItem.deleteMany({
        where: { purchaseOrder: { businessId } },
      }),
      prisma.transaction.deleteMany({ where: { businessId } }),
      prisma.purchaseOrder.deleteMany({ where: { businessId } }),
      prisma.device.deleteMany({ where: { businessId } }),
      prisma.inventoryItem.deleteMany({ where: { businessId } }),
      prisma.supplier.deleteMany({ where: { businessId } }),
      prisma.category.deleteMany({ where: { businessId } }),
      prisma.businessSettings.delete({ where: { businessId } }),
      // Don't delete users - just keep the admin
      prisma.business.delete({ where: { id: businessId } }),
    ])

    return { success: true }
  } catch (error) {
    console.error("Error clearing business data:", error)
    return { success: false, error: "Failed to clear business data" }
  }
}

export async function updateBusinessSettings(data: {
  name?: string
  businessType?: string
  address?: string
  currency?: string
  taxRate?: number
  fiscalYearStart?: string
  lowStockAlerts?: boolean
  autoOrderSuggestions?: boolean
  lowStockThreshold?: number
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if user has admin role
    if (session.user.role !== "admin") {
      return { success: false, error: "Only admins can update business settings" }
    }

    const businessId = session.user.businessId
    const now = new Date().toISOString()

    // Update business details
    const businessUpdates = []
    const businessValues = [businessId]
    let paramIndex = 2

    if (data.name !== undefined) {
      businessUpdates.push(`name = $${paramIndex++}`)
      businessValues.push(data.name)
    }
    if (data.businessType !== undefined) {
      businessUpdates.push(`business_type = $${paramIndex++}`)
      businessValues.push(data.businessType)
    }
    if (data.address !== undefined) {
      businessUpdates.push(`address = $${paramIndex++}`)
      businessValues.push(data.address)
    }
    if (data.currency !== undefined) {
      businessUpdates.push(`currency = $${paramIndex++}`)
      businessValues.push(data.currency)
    }
    if (data.taxRate !== undefined) {
      businessUpdates.push(`tax_rate = $${paramIndex++}`)
      businessValues.push(data.taxRate)
    }
    if (data.fiscalYearStart !== undefined) {
      businessUpdates.push(`fiscal_year_start = $${paramIndex++}`)
      businessValues.push(data.fiscalYearStart)
    }

    // Add updated timestamp
    businessUpdates.push(`updated_at = $${paramIndex++}`)
    businessValues.push(now)

    if (businessUpdates.length > 1) {
      // More than just the timestamp update
      const businessUpdateQuery = `
        UPDATE businesses
        SET ${businessUpdates.join(", ")}
        WHERE id = $1
        RETURNING *
      `

      await sql.query(businessUpdateQuery, businessValues)
    }

    // Update business settings
    const settingsUpdates = []
    const settingsValues = [businessId]
    paramIndex = 2

    if (data.lowStockAlerts !== undefined) {
      settingsUpdates.push(`low_stock_alerts = $${paramIndex++}`)
      settingsValues.push(data.lowStockAlerts)
    }
    if (data.autoOrderSuggestions !== undefined) {
      settingsUpdates.push(`auto_order_suggestions = $${paramIndex++}`)
      settingsValues.push(data.autoOrderSuggestions)
    }
    if (data.lowStockThreshold !== undefined) {
      settingsUpdates.push(`low_stock_threshold = $${paramIndex++}`)
      settingsValues.push(data.lowStockThreshold)
    }

    if (settingsUpdates.length > 0) {
      const settingsUpdateQuery = `
        UPDATE business_settings
        SET ${settingsUpdates.join(", ")}
        WHERE business_id = $1
        RETURNING *
      `

      await sql.query(settingsUpdateQuery, settingsValues)
    }

    // Create audit log
    await createAuditLog({
      action: "updated",
      itemType: "business",
      itemId: businessId,
      details: JSON.stringify(data),
    })

    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    console.error("Error updating business settings:", error)
    return { success: false, error: "Failed to update business settings" }
  }
}

export async function getBusinessSettings() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Get business and settings
    const businessResult = await sql`
      SELECT * FROM businesses
      WHERE id = ${businessId}
    `

    const settingsResult = await sql`
      SELECT * FROM business_settings
      WHERE business_id = ${businessId}
    `

    if (businessResult.rows.length === 0) {
      return { success: false, error: "Business not found" }
    }

    const business = businessResult.rows[0]
    const settings = settingsResult.rows[0] || {}

    return {
      success: true,
      business,
      settings,
    }
  } catch (error) {
    console.error("Error getting business settings:", error)
    return { success: false, error: "Failed to get business settings" }
  }
}
