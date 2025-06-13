"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createAuditLog } from "./audit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function addSupplier(data: {
  name: string
  contactName?: string
  contactTitle?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  taxId?: string
  paymentTerms?: string
  notes?: string
  status?: string
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    const supplier = await prisma.supplier.create({
      data: {
        ...data,
        businessId,
      },
    })

    // Create audit log
    await createAuditLog({
      action: "created",
      itemType: "supplier",
      itemId: supplier.id,
      details: JSON.stringify(data),
    })

    revalidatePath("/suppliers")
    return { success: true, supplier }
  } catch (error) {
    console.error("Error adding supplier:", error)
    return { success: false, error: "Failed to add supplier" }
  }
}

export async function updateSupplier(
  id: string,
  data: {
    name?: string
    contactName?: string
    contactTitle?: string
    email?: string
    phone?: string
    address?: string
    website?: string
    taxId?: string
    paymentTerms?: string
    notes?: string
    status?: string
  },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Ensure the supplier belongs to the business
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        id,
        businessId,
      },
    })

    if (!existingSupplier) {
      return { success: false, error: "Supplier not found" }
    }

    const supplier = await prisma.supplier.update({
      where: { id },
      data,
    })

    // Create audit log
    await createAuditLog({
      action: "updated",
      itemType: "supplier",
      itemId: supplier.id,
      details: JSON.stringify(data),
    })

    revalidatePath("/suppliers")
    revalidatePath(`/suppliers/${id}`)
    return { success: true, supplier }
  } catch (error) {
    console.error("Error updating supplier:", error)
    return { success: false, error: "Failed to update supplier" }
  }
}

export async function deleteSupplier(id: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Ensure the supplier belongs to the business
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        id,
        businessId,
      },
    })

    if (!existingSupplier) {
      return { success: false, error: "Supplier not found" }
    }

    await prisma.supplier.delete({
      where: { id },
    })

    // Create audit log
    await createAuditLog({
      action: "deleted",
      itemType: "supplier",
      itemId: id,
      details: JSON.stringify(existingSupplier),
    })

    revalidatePath("/suppliers")
    return { success: true }
  } catch (error) {
    console.error("Error deleting supplier:", error)
    return { success: false, error: "Failed to delete supplier" }
  }
}

export async function getSuppliers(search?: string, status?: string, page = 1, limit = 10) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId
    const skip = (page - 1) * limit

    // Build the where clause
    const where: any = { businessId }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { contactName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    if (status) {
      where.status = status
    }

    // Get suppliers with pagination
    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.supplier.count({ where }),
    ])

    return {
      success: true,
      suppliers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    }
  } catch (error) {
    console.error("Error getting suppliers:", error)
    return { success: false, error: "Failed to get suppliers" }
  }
}
