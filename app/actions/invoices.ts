"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createAuditLog } from "./audit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createInvoice(data: {
  customerName: string
  date: Date
  dueDate: Date
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

    // Generate invoice number
    const invoiceCount = await prisma.invoice.count({
      where: { businessId },
    })
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(invoiceCount + 1).toString().padStart(3, "0")}`

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

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerName: data.customerName,
        date: data.date,
        dueDate: data.dueDate,
        notes: data.notes,
        subtotal,
        tax,
        total,
        businessId,
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
      itemType: "invoice",
      itemId: invoice.id,
      details: JSON.stringify({
        invoiceNumber,
        customerName: data.customerName,
        total,
      }),
    })

    revalidatePath("/invoices")
    return { success: true, invoice }
  } catch (error) {
    console.error("Error creating invoice:", error)
    return { success: false, error: "Failed to create invoice" }
  }
}

export async function updateInvoiceStatus(id: string, status: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Ensure the invoice belongs to the business
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id,
        businessId,
      },
    })

    if (!existingInvoice) {
      return { success: false, error: "Invoice not found" }
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status },
    })

    // Create audit log
    await createAuditLog({
      action: "updated",
      itemType: "invoice",
      itemId: invoice.id,
      details: JSON.stringify({
        status,
        previousStatus: existingInvoice.status,
      }),
    })

    revalidatePath("/invoices")
    revalidatePath(`/invoices/${id}`)
    return { success: true, invoice }
  } catch (error) {
    console.error("Error updating invoice status:", error)
    return { success: false, error: "Failed to update invoice status" }
  }
}
