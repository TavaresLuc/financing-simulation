"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, Download, FileText, Home, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface PDFSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  clientName: string
  simulationId: number
  onDownloadAgain?: () => void
}

export function PDFSuccessModal({ isOpen, onClose, clientName, simulationId, onDownloadAgain }: PDFSuccessModalProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [showCountdown, setShowCountdown] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Start countdown after 3 seconds
      const timer = setTimeout(() => {
        setShowCountdown(true)
        setCountdown(5)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (showCountdown && countdown === 0) {
      handleViewResults()
    }
  }, [showCountdown, countdown])

  const handleViewResults = () => {
    onClose()
    router.push(`/results/${simulationId}`)
  }

  const handleNewSimulation = () => {
    onClose()
    router.push("/")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-0 shadow-2xl">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Proposta Assinada com Sucesso!
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
            Olá, <strong>{clientName}</strong>! Sua proposta de financiamento foi assinada digitalmente e o PDF foi
            gerado com sucesso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Success Details */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">Documento Processado</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  O PDF da sua proposta foi assinado digitalmente e está sendo baixado automaticamente.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Próximos Passos:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Verifique o arquivo PDF baixado</li>
              <li>• Guarde o documento em local seguro</li>
              <li>• Aguarde contato da nossa equipe</li>
              <li>• Prepare a documentação necessária</li>
            </ul>
          </div>

          {/* Auto redirect info */}
          {showCountdown && (
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Redirecionando para os resultados em{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">{countdown}</span> segundos...
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {onDownloadAgain && (
              <Button
                variant="outline"
                onClick={onDownloadAgain}
                className="flex-1 gap-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Download className="h-4 w-4" />
                Baixar Novamente
              </Button>
            )}
            <Button onClick={handleViewResults} className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700">
              <ArrowRight className="h-4 w-4" />
              Ver Resultados
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={handleNewSimulation}
            className="w-full gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <Home className="h-4 w-4" />
            Nova Simulação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
