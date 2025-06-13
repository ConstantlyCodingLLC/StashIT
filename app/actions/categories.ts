"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createAuditLog } from "./audit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function addCategory(data: {
  name: string
  description?: string
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Check if category with this name already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: data.name,
        businessId,
      },
    })

    if (existingCategory) {
      return { success: false, error: "Category with this name already exists" }
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        businessId,
      },
    })

    // Create audit log
    await createAuditLog({
      action: "created",
      itemType: "category",
      itemId: category.id,
      details: JSON.stringify(data),
    })

    revalidatePath("/inventory")
    return { success: true, category }
  } catch (error) {
    console.error("Error adding category:", error)
    return { success: false, error: "Failed to add category" }
  }
}

export async function updateCategory(
  id: string,
  data: {
    name?: string
    description?: string
  },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Ensure the category belongs to the business
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        businessId,
      },
    })

    if (!existingCategory) {
      return { success: false, error: "Category not found" }
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    })

    // Create audit log
    await createAuditLog({
      action: "updated",
      itemType: "category",
      itemId: category.id,
      details: JSON.stringify(data),
    })

    revalidatePath("/inventory")
    return { success: true, category }
  } catch (error) {
    console.error("Error updating category:", error)
    return { success: false, error: "Failed to update category" }
  }
}

export async function deleteCategory(id: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Ensure the category belongs to the business
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        businessId,
      },
    })

    if (!existingCategory) {
      return { success: false, error: "Category not found" }
    }

    // Check if category is in use
    const itemCount = await prisma.inventoryItem.count({
      where: {
        categoryId: id,
        businessId,
      },
    })

    if (itemCount > 0) {
      return { success: false, error: "Cannot delete category that is in use" }
    }

    await prisma.category.delete({
      where: { id },
    })

    // Create audit log
    await createAuditLog({
      action: "deleted",
      itemType: "category",
      itemId: id,
      details: JSON.stringify(existingCategory),
    })

    revalidatePath("/inventory")
    return { success: true }
  } catch (error) {
    console.error("Error deleting category:", error)
    return { success: false, error: "Failed to delete category" }
  }
}

export async function getCategories() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    const categories = await prisma.category.findMany({
      where: { businessId },
      orderBy: { name: "asc" },
    })

    return { success: true, categories }
  } catch (error) {
    console.error("Error getting categories:", error)
    return { success: false, error: "Failed to get categories" }
  }
}
