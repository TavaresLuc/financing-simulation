"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { SignaturePad } from "@/components/signature-pad"
import { PDFSuccessModal } from "@/components/pdf-success-modal"
import type { SimulationData } from "@/lib/database"
import { formatCurrency } from "@/lib/formatters"
import { generateProposalPDFWithSignature } from "@/lib/pdf-generator"
import { ArrowLeft, FileText, Download } from "lucide-react"
import Link from "next/link"

export default function SignaturePage() {
  const params = useParams()
  const router = useRouter()
  const [simulation, setSimulation] = useState<SimulationData | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    const fetchSimulation = async () => {
      try {
        const response = await fetch(`/api/simulations/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setSimulation(data)
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("Erro ao carregar simulação:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchSimulation()
    }
  }, [params.id, router])

  const handleConfirmSignature = async () => {
    if (!simulation || !signature) return

    setIsProcessing(true)

    try {
      // Update proposal status
      const response = await fetch(`/api/simulations/${simulation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal_accepted: true }),
      })

      if (response.ok) {
        // Generate and download PDF with signature
        const pdf = generateProposalPDFWithSignature(simulation, signature)
        pdf.save(`proposta-financiamento-assinada-${simulation.id}.pdf`)

        // Show success modal instead of alert
        setShowSuccessModal(true)
      } else {
        throw new Error("Erro ao aceitar proposta")
      }
    } catch (error) {
      console.error("Erro:", error)
      // Use a more elegant error display
      setShowErrorModal(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadAgain = () => {
    if (!simulation || !signature) return

    const pdf = generateProposalPDFWithSignature(simulation, signature)
    pdf.save(`proposta-financiamento-assinada-${simulation.id}.pdf`)
  }

  const [showErrorModal, setShowErrorModal] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!simulation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Simulação não encontrada</p>
          <Link href="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/results/${simulation.id}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assinatura Digital</h1>
              <p className="text-gray-600 dark:text-gray-400">Crie sua assinatura para finalizar a proposta</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Proposal Summary */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resumo da Proposta
              </CardTitle>
              <CardDescription>Confirme os dados antes de assinar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Cliente</p>
                  <p className="font-semibold">{simulation.client_name}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">CPF</p>
                  <p className="font-semibold">{simulation.client_cpf}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Valor do Imóvel</p>
                  <p className="font-semibold">{formatCurrency(simulation.property_value)}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Entrada</p>
                  <p className="font-semibold">{formatCurrency(simulation.down_payment_amount)}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Valor Financiado</p>
                  <p className="font-semibold">{formatCurrency(simulation.loan_amount)}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Prazo</p>
                  <p className="font-semibold">{simulation.loan_term_years} anos</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Parcela Mensal</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(simulation.monthly_payment)}
                  </p>
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <p className="font-semibold mb-2">Termos Importantes:</p>
                <ul className="space-y-1">
                  <li>• Taxa de juros: {simulation.interest_rate}% ao ano</li>
                  <li>• Proposta válida por 30 dias</li>
                  <li>• Sujeito à aprovação de crédito</li>
                  <li>• Documentação completa necessária</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Signature Pad */}
          <div className="space-y-6">
            <SignaturePad onSignatureChange={setSignature} />

            {/* Action Buttons */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Ao confirmar, você aceita todos os termos da proposta e autoriza a geração do documento PDF
                      assinado.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/results/${simulation.id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        Cancelar
                      </Button>
                    </Link>
                    <Button
                      onClick={handleConfirmSignature}
                      disabled={!signature || isProcessing}
                      className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {isProcessing ? "Processando..." : "Confirmar e Baixar PDF"}
                    </Button>
                  </div>

                  {!signature && (
                    <p className="text-center text-sm text-amber-600 dark:text-amber-400">
                      ⚠️ Crie sua assinatura acima para continuar
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Modal */}
        <PDFSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          clientName={simulation.client_name}
          simulationId={simulation.id!}
          onDownloadAgain={handleDownloadAgain}
        />

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white dark:bg-gray-800">
              <CardHeader className="text-center">
                <CardTitle className="text-red-600 dark:text-red-400">Erro ao Processar</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Ocorreu um erro ao processar sua assinatura. Tente novamente.
                </p>
                <Button onClick={() => setShowErrorModal(false)} className="w-full">
                  Tentar Novamente
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
