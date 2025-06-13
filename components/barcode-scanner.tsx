"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { XIcon } from "lucide-react"

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null
    let animationFrameId: number

    const startScanner = async () => {
      try {
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          setIsScanning(true)
          scanBarcode()
        }
      } catch (err) {
        setError("Camera access denied or not available")
        console.error("Error accessing camera:", err)
      }
    }

    const scanBarcode = () => {
      if (!videoRef.current || !canvasRef.current) return

      const canvas = canvasRef.current
      const video = videoRef.current

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Draw video frame to canvas
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.height = video.videoHeight
        canvas.width = video.videoWidth
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        // In a real implementation, we would use a barcode scanning library here
        // For example, with ZXing or a similar library:
        // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        // const code = zxing.decode(imageData)
        // if (code) {
        //   onScan(code)
        //   stopScanner()
        //   return
        // }

        // For demo purposes, we'll simulate finding a barcode after a few seconds
        if (isScanning) {
          setTimeout(() => {
            // Simulate finding a random barcode
            const mockBarcodes = ["OFF-PAP-001", "ELE-CAB-002", "PKG-BOX-001", "DEV-LAP-001", "DEV-TAB-002"]
            const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)]
            onScan(randomBarcode)
            stopScanner()
          }, 3000)
        }
      }

      // Continue scanning
      animationFrameId = requestAnimationFrame(scanBarcode)
    }

    const stopScanner = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      setIsScanning(false)
    }

    startScanner()

    return () => {
      stopScanner()
    }
  }, [onScan])

  return (
    <Card className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="relative flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 bg-black/50 text-white hover:bg-black/70"
          onClick={onClose}
        >
          <XIcon className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>

        <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" playsInline muted />

        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover opacity-0" />

        {/* Scanning overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="h-64 w-64 border-2 border-white/80 rounded-lg relative">
            <div className="absolute inset-0 border-t-2 border-primary animate-scan" />
          </div>
          <p className="mt-4 text-white text-lg font-medium">{error ? error : "Scanning..."}</p>
        </div>
      </div>

      <div className="bg-black p-4">
        <Button variant="outline" className="w-full text-white border-white hover:bg-white/10" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Card>
  )
}
