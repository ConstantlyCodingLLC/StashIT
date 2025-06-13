"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateOrderPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    })
