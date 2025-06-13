"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createAuditLog } from "./audit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function receiveInventory(data: {
  itemId: string
  quantity: number
  notes?: string
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId
    const userId = session.user.id

    // Ensure the item belongs to the business
    const item = await prisma.inventoryItem.findFirst({
      where: {
        id: data.itemId,
        businessId,
      },
    })

    if (!item) {
      return { success: false, error: "Item not found" }
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        type: "receive",
        quantity: data.quantity,
        notes: data.notes,
        businessId,
        userId,
        itemId: data.itemId,
      },
    })

    // Update item quantity
    await prisma.inventoryItem.update({
      where: { id: data.itemId },
      data: {
        quantity: {
          increment: data.quantity,
        },
      },
    })

    // Create audit log
    await createAuditLog({
      action: "received",
      itemType: "inventory",
      itemId: data.itemId,
      details: JSON.stringify({
        quantity: data.quantity,
        notes: data.notes,
        transactionId: transaction.id,
      }),
    })

    revalidatePath("/inventory")
    revalidatePath(`/inventory/${data.itemId}`)
    revalidatePath("/receive")
    return { success: true, transaction }
  } catch (error) {
    console.error("Error receiving inventory:", error)
    return { success: false, error: "Failed to receive inventory" }
  }
}

export async function deployInventory(data: {
  itemId: string
  quantity: number
  notes?: string
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId
    const userId = session.user.id

    // Ensure the item belongs to the business
    const item = await prisma.inventoryItem.findFirst({
      where: {
        id: data.itemId,
        businessId,
      },
    })

    if (!item) {
      return { success: false, error: "Item not found" }
    }

    // Check if there's enough quantity
    if (item.quantity < data.quantity) {
      return { success: false, error: "Not enough quantity available" }
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        type: "deploy",
        quantity: data.quantity,
        notes: data.notes,
        businessId,
        userId,
        itemId: data.itemId,
      },
    })

    // Update item quantity
    await prisma.inventoryItem.update({
      where: { id: data.itemId },
      data: {
        quantity: {
          decrement: data.quantity,
        },
      },
    })

    // Create audit log
    await createAuditLog({
      action: "deployed",
      itemType: "inventory",
      itemId: data.itemId,
      details: JSON.stringify({
        quantity: data.quantity,
        notes: data.notes,
        transactionId: transaction.id,
      }),
    })

    revalidatePath("/inventory")
    revalidatePath(`/inventory/${data.itemId}`)
    revalidatePath("/deploy")
    return { success: true, transaction }
  } catch (error) {
    console.error("Error deploying inventory:", error)
    return { success: false, error: "Failed to deploy inventory" }
  }
}
