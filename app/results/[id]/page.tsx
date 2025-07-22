"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import type { SimulationData } from "@/lib/database"
import { formatCurrency } from "@/lib/formatters"
import { generateProposalPDF } from "@/lib/pdf-generator"
import { ArrowLeft, Download, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [simulation, setSimulation] = useState<SimulationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)

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

  const handleAcceptProposal = async () => {
    if (!simulation) return

    // Navigate to signature screen instead of directly accepting
    router.push(`/signature/${simulation.id}`)
  }

  const handleDownloadPDF = () => {
    if (!simulation) return

    const pdf = generateProposalPDF(simulation)
    pdf.save(`proposta-financiamento-${simulation.id}.pdf`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando resultados...</p>
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
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resultado da Simulação</h1>
              <p className="text-gray-600 dark:text-gray-400">Confira os detalhes do seu financiamento</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Client Information */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nome</p>
                <p className="font-semibold">{simulation.client_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-semibold">{simulation.client_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Telefone</p>
                <p className="font-semibold">{simulation.client_phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">CPF</p>
                <p className="font-semibold">{simulation.client_cpf}</p>
              </div>
            </CardContent>
          </Card>

          {/* Property Information */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Dados do Imóvel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Valor do Imóvel</p>
                <p className="font-semibold text-lg">{formatCurrency(simulation.property_value)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Entrada ({simulation.down_payment_percentage}%)
                </p>
                <p className="font-semibold">{formatCurrency(simulation.down_payment_amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Valor Financiado</p>
                <p className="font-semibold">{formatCurrency(simulation.loan_amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Prazo</p>
                <p className="font-semibold">{simulation.loan_term_years} anos</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="text-center">Resumo dos Pagamentos</CardTitle>
              <CardDescription className="text-center">
                Taxa de juros: {simulation.interest_rate}% ao ano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Parcela Mensal</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(simulation.monthly_payment)}
                  </p>
                </div>

                <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total de Juros</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(simulation.total_interest)}
                  </p>
                </div>

                <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total a Pagar</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {formatCurrency(simulation.total_payment)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm md:col-span-2">
            <CardContent className="pt-6">
              {simulation.proposal_accepted ? (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-lg font-semibold">Proposta Aceita!</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sua proposta foi aceita com sucesso. Você pode baixar o PDF novamente se necessário.
                  </p>
                  <Button onClick={handleDownloadPDF} className="gap-2">
                    <Download className="h-4 w-4" />
                    Baixar PDF Novamente
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Gostou da simulação? Aceite a proposta para gerar o documento PDF com todos os detalhes.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={handleAcceptProposal}
                      disabled={isAccepting}
                      className="bg-green-600 hover:bg-green-700 gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {isAccepting ? "Processando..." : "Criar Assinatura e Aceitar"}
                    </Button>
                    <Button variant="outline" onClick={handleDownloadPDF} className="gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Visualizar PDF
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
