"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Car, CreditCard, User } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

interface VehicleSimulation {
  id: number
  client_name: string
  client_email: string
  client_phone: string
  client_cpf: string
  vehicle_type: string
  knows_model: boolean
  client_cep?: string
  vehicle_year?: number
  vehicle_brand?: string
  vehicle_model?: string
  vehicle_value: number
  purchase_timeline?: string
  seller_type?: string
  down_payment_percentage: number
  down_payment_amount: number
  loan_amount: number
  loan_term_months: number
  interest_rate: number
  monthly_payment: number
  total_payment: number
  total_interest: number
  created_at: string
}

export default function VehicleSimulationResultPage() {
  const params = useParams()
  const router = useRouter()
  const [simulation, setSimulation] = useState<VehicleSimulation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSimulation = async () => {
      try {
        const id = params.id
        const response = await fetch(`/api/vehicle-simulations/${id}`)

        if (!response.ok) {
          throw new Error("Falha ao carregar dados da simulação")
        }

        const data = await response.json()
        setSimulation(data.simulation)
      } catch (error: any) {
        console.error("Error fetching simulation:", error)
        setError(error.message || "Erro ao carregar simulação")
      } finally {
        setLoading(false)
      }
    }

    fetchSimulation()
  }, [params.id])

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getTimelineText = (timeline?: string): string => {
    switch (timeline) {
      case "rapido":
        return "O mais rápido possível (1 semana)"
      case "breve":
        return "Em breve (1 mês)"
      case "este_ano":
        return "Ainda este ano (6 meses)"
      case "pesquisando":
        return "Estou apenas pesquisando"
      default:
        return "Não informado"
    }
  }

  const getSellerTypeText = (sellerType?: string): string => {
    switch (sellerType) {
      case "concessionaria":
        return "Em uma loja concessionária"
      case "particular":
        return "Direto com o Dono(a)"
      case "nao_sei":
        return "Ainda não sei"
      default:
        return "Não informado"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Carregando dados da simulação...</p>
        </div>
      </div>
    )
  }

  if (error || !simulation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Erro</CardTitle>
            <CardDescription>Não foi possível carregar os dados da simulação</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error || "Simulação não encontrada"}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/veiculos")}>Voltar para Simulações</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/veiculos">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resultado da Simulação</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Simulação #{simulation.id}</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Dados Pessoais</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
                <p className="font-medium">{simulation.client_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium">{simulation.client_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
                <p className="font-medium">{simulation.client_phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">CPF</p>
                <p className="font-medium">{simulation.client_cpf}</p>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Veículo */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Dados do Veículo</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tipo</p>
                <p className="font-medium capitalize">{simulation.vehicle_type}</p>
              </div>
              {simulation.vehicle_year && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ano</p>
                  <p className="font-medium">{simulation.vehicle_year}</p>
                </div>
              )}
              {simulation.vehicle_brand && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Marca</p>
                  <p className="font-medium">{simulation.vehicle_brand}</p>
                </div>
              )}
              {simulation.vehicle_model && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Modelo</p>
                  <p className="font-medium">{simulation.vehicle_model}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Valor</p>
                <p className="font-medium">{formatCurrency(simulation.vehicle_value)}</p>
              </div>
              {simulation.client_cep && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CEP</p>
                  <p className="font-medium">{simulation.client_cep}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dados do Vendedor */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">Dados do Vendedor</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Prazo para Compra</p>
                <p className="font-medium">{getTimelineText(simulation.purchase_timeline)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tipo de Vendedor</p>
                <p className="font-medium">{getSellerTypeText(simulation.seller_type)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Data da Simulação</p>
                <p className="font-medium">{formatDate(simulation.created_at)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Financiamento */}
          <Card className="md:col-span-3">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-amber-600" />
                <CardTitle>Detalhes do Financiamento</CardTitle>
              </div>
              <CardDescription>Resumo das condições de financiamento simuladas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Valor do Veículo</p>
                  <p className="text-xl font-bold">{formatCurrency(simulation.vehicle_value)}</p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Valor da Entrada</p>
                  <p className="text-xl font-bold">{formatCurrency(simulation.down_payment_amount)}</p>
                  <p className="text-xs text-gray-500">{simulation.down_payment_percentage}% do valor</p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Valor Financiado</p>
                  <p className="text-xl font-bold">{formatCurrency(simulation.loan_amount)}</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Prazo</p>
                  <p className="text-xl font-bold">{simulation.loan_term_months} meses</p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Taxa de Juros</p>
                  <p className="text-xl font-bold">{simulation.interest_rate}% a.m.</p>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Parcela Mensal</p>
                  <p className="text-xl font-bold">{formatCurrency(simulation.monthly_payment)}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total de Juros</p>
                  <p className="text-xl font-bold">{formatCurrency(simulation.total_interest)}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total a Pagar</p>
                  <p className="text-xl font-bold">{formatCurrency(simulation.total_payment)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/veiculos">
                <Button>Fazer Nova Simulação</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
