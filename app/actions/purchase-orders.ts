"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createAuditLog } from "./audit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createPurchaseOrder(data: {
  supplierId: string
  date: Date
  expectedDelivery?: Date
  paymentTerms?: string
  shippingAddress?: string
  notes?: string
  items: Array<{
    itemId: string
    quantity: number
    unitPrice: number
    description?: string
  }>
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Generate PO number
    const poCount = await prisma.purchaseOrder.count({
      where: { businessId },
    })
    const poNumber = `PO-${new Date().getFullYear()}-${(poCount + 1).toString().padStart(3, "0")}`

    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

    // Get business tax rate
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { taxRate: true },
    })
    const taxRate = business?.taxRate || 0
    const tax = subtotal * (taxRate / 100)
    const total = subtotal + tax

    // Create purchase order with items
    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        poNumber,
        date: data.date,
        expectedDelivery: data.expectedDelivery,
        paymentTerms: data.paymentTerms,
        shippingAddress: data.shippingAddress,
        notes: data.notes,
        subtotal,
        tax,
        total,
        businessId,
        supplierId: data.supplierId,
        items: {
          create: data.items.map((item) => ({
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
            description: item.description,
            itemId: item.itemId,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Create audit log
    await createAuditLog({
      action: "created",
      itemType: "purchaseOrder",
      itemId: purchaseOrder.id,
      details: JSON.stringify({
        poNumber,
        supplierId: data.supplierId,
        total,
      }),
    })

    revalidatePath("/purchase-orders")
    return { success: true, purchaseOrder }
  } catch (error) {
    console.error("Error creating purchase order:", error)
    return { success: false, error: "Failed to create purchase order" }
  }
}

export async function updatePurchaseOrderStatus(id: string, status: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Ensure the PO belongs to the business
    const existingPO = await prisma.purchaseOrder.findFirst({
      where: {
        id,
        businessId,
      },
    })

    if (!existingPO) {
      return { success: false, error: "Purchase order not found" }
    }

    const purchaseOrder = await prisma.purchaseOrder.update({
      where: { id },
      data: { status },
    })

    // Create audit log
    await createAuditLog({
      action: "updated",
      itemType: "purchaseOrder",
      itemId: purchaseOrder.id,
      details: JSON.stringify({
        status,
        previousStatus: existingPO.status,
      }),
    })

    revalidatePath("/purchase-orders")
    revalidatePath(`/purchase-orders/${id}`)
    return { success: true, purchaseOrder }
  } catch (error) {
    console.error("Error updating purchase order status:", error)
    return { success: false, error: "Failed to update purchase order status" }
  }
}

export async function receivePurchaseOrder(
  id: string,
  data: {
    items: Array<{
      itemId: string
      quantity: number
    }>
  },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId
    const userId = session.user.id

    // Ensure the PO belongs to the business
    const purchaseOrder = await prisma.purchaseOrder.findFirst({
      where: {
        id,
        businessId,
      },
      include: {
        items: true,
      },
    })

    if (!purchaseOrder) {
      return { success: false, error: "Purchase order not found" }
    }

    // Process each item
    for (const item of data.items) {
      // Create transaction
      await prisma.transaction.create({
        data: {
          type: "receive",
          quantity: item.quantity,
          notes: `Received from PO: ${purchaseOrder.poNumber}`,
          businessId,
          userId,
          itemId: item.itemId,
          purchaseOrderId: id,
        },
      })

      // Update inventory quantity
      await prisma.inventoryItem.update({
        where: {
          id: item.itemId,
          businessId,
        },
        data: {
          quantity: {
            increment: item.quantity,
          },
        },
      })
    }

    // Update PO status
    // Check if all items are fully received
    const allItemsReceived = purchaseOrder.items.every((poItem) => {
      const receivedItem = data.items.find((item) => item.itemId === poItem.itemId)
      return receivedItem && receivedItem.quantity >= poItem.quantity
    })

    const newStatus = allItemsReceived ? "received" : "partial"

    await prisma.purchaseOrder.update({
      where: { id },
      data: { status: newStatus },
    })

    // Create audit log
    await createAuditLog({
      action: "received",
      itemType: "purchaseOrder",
      itemId: id,
      details: JSON.stringify({
        items: data.items,
        status: newStatus,
      }),
    })

    revalidatePath("/purchase-orders")
    revalidatePath(`/purchase-orders/${id}`)
    revalidatePath("/inventory")
    return { success: true }
  } catch (error) {
    console.error("Error receiving purchase order:", error)
    return { success: false, error: "Failed to receive purchase order" }
  }
}
