"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { formatCurrency } from "@/lib/formatters"
import { ArrowLeft, Download, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Simulation {
  id: string
  propertyValue: number
  downPaymentPercentage: number
  downPaymentAmount: number
  loanAmount: number
  loanTermYears: number
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCPF: string
  createdAt: string
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [simulation, setSimulation] = useState<Simulation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSimulation = async () => {
      try {
        const response = await fetch(`/api/simulations/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setSimulation(data)
        } else {
          setError("Simulação não encontrada")
        }
      } catch (err) {
        setError("Erro ao carregar simulação")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSimulation()
  }, [params.id])

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/simulations/${params.id}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `simulacao-${params.id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        alert("Erro ao gerar PDF")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao baixar PDF")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando simulação...</p>
        </div>
      </div>
    )
  }

  if (error || !simulation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link href="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/simulation">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                Resultado da Simulação
              </h1>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">
                Confira os detalhes do seu financiamento
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Client and Property Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Client Data */}
          <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <FileText className="h-5 w-5" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nome</p>
                <p className="font-semibold text-gray-900 dark:text-white">{simulation.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-semibold text-gray-900 dark:text-white">{simulation.clientEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Telefone</p>
                <p className="font-semibold text-gray-900 dark:text-white">{simulation.clientPhone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">CPF</p>
                <p className="font-semibold text-gray-900 dark:text-white">{simulation.clientCPF}</p>
              </div>
            </CardContent>
          </Card>

          {/* Property Data */}
          <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Dados do Imóvel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Valor do Imóvel</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(simulation.propertyValue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Entrada ({simulation.downPaymentPercentage}%)
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(simulation.downPaymentAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Valor Financiado</p>
                <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(simulation.loanAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Prazo</p>
                <p className="font-semibold text-gray-900 dark:text-white">{simulation.loanTermYears} anos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900 dark:text-white">Resumo dos Pagamentos</CardTitle>
            <p className="text-gray-600 dark:text-gray-300">Taxa de juros: 12% ao ano</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Monthly Payment */}
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">Parcela Mensal</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {formatCurrency(simulation.monthlyPayment)}
                </p>
              </div>

              {/* Total Interest */}
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">Total de Juros</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(simulation.totalInterest)}
                </p>
              </div>

              {/* Total Payment */}
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">Total a Pagar</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  {formatCurrency(simulation.totalPayment)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Gostou da simulação? Aceite a proposta para gerar o documento PDF com todos os detalhes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/signature/${simulation.id}`}>
              <Button className="w-full sm:w-auto h-12 px-8 text-lg font-semibold bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-5 w-5" />
                Criar Assinatura e Aceitar
              </Button>
            </Link>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="w-full sm:w-auto h-12 px-8 text-lg font-semibold bg-transparent"
            >
              <Download className="mr-2 h-5 w-5" />
              Visualizar PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
