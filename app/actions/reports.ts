"use server"

import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getInventoryValueReport(period = "month", categoryId?: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Build the where clause
    const where: any = { businessId }

    if (categoryId) {
      where.categoryId = categoryId
    }

    // Get inventory items
    const items = await prisma.inventoryItem.findMany({
      where,
      include: {
        category: true,
      },
    })

    // Calculate total inventory value
    const totalValue = items.reduce((sum, item) => {
      const itemValue = (item.costPrice || 0) * item.quantity
      return sum + itemValue
    }, 0)

    // Calculate value by category
    const valueByCategory: Record<string, { name: string; value: number }> = {}

    items.forEach((item) => {
      const categoryName = item.category?.name || "Uncategorized"
      const categoryId = item.category?.id || "uncategorized"
      const itemValue = (item.costPrice || 0) * item.quantity

      if (!valueByCategory[categoryId]) {
        valueByCategory[categoryId] = { name: categoryName, value: 0 }
      }

      valueByCategory[categoryId].value += itemValue
    })

    // Get top items by value
    const topItems = [...items]
      .sort((a, b) => {
        const aValue = (a.costPrice || 0) * a.quantity
        const bValue = (b.costPrice || 0) * b.quantity
        return bValue - aValue
      })
      .slice(0, 10)
      .map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        unitCost: item.costPrice || 0,
        totalValue: (item.costPrice || 0) * item.quantity,
      }))

    return {
      success: true,
      totalValue,
      valueByCategory: Object.values(valueByCategory),
      topItems,
    }
  } catch (error) {
    console.error("Error getting inventory value report:", error)
    return { success: false, error: "Failed to get inventory value report" }
  }
}

export async function getCostAnalysisReport(period = "month", categoryId?: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Determine date range based on period
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "week":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 3)
        break
      case "year":
        startDate = new Date(now)
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 1)
    }

    // Build the where clause for purchase orders
    const poWhere: any = {
      businessId,
      date: { gte: startDate },
    }

    // Get purchase orders in the period
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where: poWhere,
      include: {
        supplier: true,
        items: {
          include: {
            item: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    // Calculate total expenses
    const totalExpenses = purchaseOrders.reduce((sum, po) => sum + po.total, 0)

    // Calculate expenses by supplier
    const expensesBySupplier: Record<string, { name: string; amount: number }> = {}

    purchaseOrders.forEach((po) => {
      const supplierId = po.supplier.id
      const supplierName = po.supplier.name

      if (!expensesBySupplier[supplierId]) {
        expensesBySupplier[supplierId] = { name: supplierName, amount: 0 }
      }

      expensesBySupplier[supplierId].amount += po.total
    })

    // Calculate expenses by category
    const expensesByCategory: Record<string, { name: string; amount: number }> = {}

    purchaseOrders.forEach((po) => {
      po.items.forEach((item) => {
        const categoryId = item.item.category?.id || "uncategorized"
        const categoryName = item.item.category?.name || "Uncategorized"

        if (!expensesByCategory[categoryId]) {
          expensesByCategory[categoryId] = { name: categoryName, amount: 0 }
        }

        expensesByCategory[categoryId].amount += item.total
      })
    })

    return {
      success: true,
      totalExpenses,
      expensesBySupplier: Object.values(expensesBySupplier),
      expensesByCategory: Object.values(expensesByCategory),
      period,
    }
  } catch (error) {
    console.error("Error getting cost analysis report:", error)
    return { success: false, error: "Failed to get cost analysis report" }
  }
}

export async function getProfitMarginReport(period = "month", categoryId?: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Build the where clause
    const where: any = { businessId }

    if (categoryId) {
      where.categoryId = categoryId
    }

    // Get inventory items with cost and selling prices
    const items = await prisma.inventoryItem.findMany({
      where,
      include: {
        category: true,
      },
    })

    // Calculate profit margins by item
    const itemMargins = items
      .filter((item) => item.costPrice && item.sellingPrice) // Only include items with both prices
      .map((item) => {
        const costPrice = item.costPrice || 0
        const sellingPrice = item.sellingPrice || 0
        const margin = costPrice > 0 ? ((sellingPrice - costPrice) / sellingPrice) * 100 : 0

        return {
          id: item.id,
          name: item.name,
          sku: item.sku,
          costPrice,
          sellingPrice,
          margin,
          categoryId: item.category?.id || "uncategorized",
          categoryName: item.category?.name || "Uncategorized",
        }
      })

    // Calculate average margin by category
    const marginsByCategory: Record<string, { name: string; items: number; avgMargin: number }> = {}

    itemMargins.forEach((item) => {
      const categoryId = item.categoryId
      const categoryName = item.categoryName

      if (!marginsByCategory[categoryId]) {
        marginsByCategory[categoryId] = { name: categoryName, items: 0, avgMargin: 0 }
      }

      marginsByCategory[categoryId].items += 1
      marginsByCategory[categoryId].avgMargin += item.margin
    })

    // Calculate the average
    Object.values(marginsByCategory).forEach((category) => {
      if (category.items > 0) {
        category.avgMargin = category.avgMargin / category.items
      }
    })

    // Get top items by margin
    const topItemsByMargin = [...itemMargins].sort((a, b) => b.margin - a.margin).slice(0, 10)

    // Calculate overall average margin
    const overallMargin =
      itemMargins.length > 0 ? itemMargins.reduce((sum, item) => sum + item.margin, 0) / itemMargins.length : 0

    return {
      success: true,
      overallMargin,
      marginsByCategory: Object.values(marginsByCategory),
      topItemsByMargin,
    }
  } catch (error) {
    console.error("Error getting profit margin report:", error)
    return { success: false, error: "Failed to get profit margin report" }
  }
}
