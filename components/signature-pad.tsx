"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Check, Pen } from "lucide-react"

interface SignaturePadProps {
  onSignatureChange: (signature: string | null) => void
  className?: string
}

export function SignaturePad({ onSignatureChange, className = "" }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Set drawing styles
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Fill with white background (always white for signature)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let clientX: number, clientY: number

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let clientX: number, clientY: number

    if ("touches" in e) {
      e.preventDefault()
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()

    if (!hasSignature) {
      setHasSignature(true)
    }
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    const canvas = canvasRef.current
    if (!canvas) return

    // Convert to data URL and notify parent
    const signatureData = canvas.toDataURL("image/png")
    onSignatureChange(signatureData)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    setHasSignature(false)
    onSignatureChange(null)
  }

  return (
    <Card
      className={`${className} shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg transition-all duration-300`}
    >
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-gray-900 dark:text-white">
          <Pen className="h-5 w-5" />
          Criar Assinatura
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Desenhe sua assinatura no espaço abaixo usando o mouse ou toque
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg cursor-crosshair bg-white shadow-inner transition-colors"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasSignature && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-gray-400 dark:text-gray-500 text-sm transition-colors">
                Clique e arraste para desenhar sua assinatura
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={clearSignature}
            disabled={!hasSignature}
            className="gap-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Limpar
          </Button>
        </div>

        {hasSignature && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" />
              <span className="text-sm">Assinatura criada com sucesso!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
