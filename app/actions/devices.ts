"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createAuditLog } from "./audit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function addDevice(data: {
  name: string
  deviceType: string
  manufacturer?: string
  model?: string
  serialNumber?: string
  sku?: string
  purchaseDate?: Date
  warrantyExpiry?: Date
  assignedTo?: string
  status?: string
  notes?: string
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Check if device with this serial number already exists
    if (data.serialNumber) {
      const existingDevice = await prisma.device.findFirst({
        where: {
          serialNumber: data.serialNumber,
          businessId,
        },
      })

      if (existingDevice) {
        return { success: false, error: "Device with this serial number already exists" }
      }
    }

    const device = await prisma.device.create({
      data: {
        ...data,
        businessId,
      },
    })

    // Create audit log
    await createAuditLog({
      action: "created",
      itemType: "device",
      itemId: device.id,
      details: JSON.stringify(data),
    })

    revalidatePath("/devices")
    return { success: true, device }
  } catch (error) {
    console.error("Error adding device:", error)
    return { success: false, error: "Failed to add device" }
  }
}

export async function updateDevice(
  id: string,
  data: {
    name?: string
    deviceType?: string
    manufacturer?: string
    model?: string
    serialNumber?: string
    sku?: string
    purchaseDate?: Date
    warrantyExpiry?: Date
    assignedTo?: string
    status?: string
    notes?: string
  },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Ensure the device belongs to the business
    const existingDevice = await prisma.device.findFirst({
      where: {
        id,
        businessId,
      },
    })

    if (!existingDevice) {
      return { success: false, error: "Device not found" }
    }

    // Check if updating to a serial number that already exists
    if (data.serialNumber && data.serialNumber !== existingDevice.serialNumber) {
      const duplicateDevice = await prisma.device.findFirst({
        where: {
          serialNumber: data.serialNumber,
          businessId,
          id: { not: id },
        },
      })

      if (duplicateDevice) {
        return { success: false, error: "Another device with this serial number already exists" }
      }
    }

    const device = await prisma.device.update({
      where: { id },
      data,
    })

    // Create audit log
    await createAuditLog({
      action: "updated",
      itemType: "device",
      itemId: device.id,
      details: JSON.stringify(data),
    })

    revalidatePath("/devices")
    revalidatePath(`/devices/${id}`)
    return { success: true, device }
  } catch (error) {
    console.error("Error updating device:", error)
    return { success: false, error: "Failed to update device" }
  }
}

export async function deleteDevice(id: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Ensure the device belongs to the business
    const existingDevice = await prisma.device.findFirst({
      where: {
        id,
        businessId,
      },
    })

    if (!existingDevice) {
      return { success: false, error: "Device not found" }
    }

    await prisma.device.delete({
      where: { id },
    })

    // Create audit log
    await createAuditLog({
      action: "deleted",
      itemType: "device",
      itemId: id,
      details: JSON.stringify(existingDevice),
    })

    revalidatePath("/devices")
    return { success: true }
  } catch (error) {
    console.error("Error deleting device:", error)
    return { success: false, error: "Failed to delete device" }
  }
}

export async function getDevices(search?: string, deviceType?: string, status?: string, page = 1, limit = 10) {
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
        { serialNumber: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { assignedTo: { contains: search, mode: "insensitive" } },
      ]
    }

    if (deviceType) {
      where.deviceType = deviceType
    }

    if (status) {
      where.status = status
    }

    // Get devices with pagination
    const [devices, total] = await Promise.all([
      prisma.device.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.device.count({ where }),
    ])

    return {
      success: true,
      devices,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    }
  } catch (error) {
    console.error("Error getting devices:", error)
    return { success: false, error: "Failed to get devices" }
  }
}
