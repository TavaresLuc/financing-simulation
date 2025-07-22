import { notFound } from "next/navigation"
import { neon } from "@neondatabase/serverless"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { formatCurrency, formatCPF, formatPhone } from "@/lib/formatters"
import Link from "next/link"
import { ArrowLeft, FileText, User, Home, Calculator } from "lucide-react"

const sql = neon(process.env.DATABASE_URL!)

interface SimulationData {
  id: number
  property_value: number
  down_payment_percentage: number
  down_payment_amount: number
  loan_amount: number
  loan_term_years: number
  interest_rate: number
  monthly_payment: number
  total_payment: number
  total_interest: number
  client_name: string
  client_email: string
  client_phone: string
  client_cpf: string
  created_at: string
}

async function getSimulation(id: string): Promise<SimulationData | null> {
  try {
    const result = await sql`
      SELECT * FROM simulations 
      WHERE id = ${id}
      LIMIT 1
    `

    if (result.length === 0) {
      return null
    }

    return result[0] as SimulationData
  } catch (error) {
    console.error("Error fetching simulation:", error)
    return null
  }
}

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const simulation = await getSimulation(params.id)

  if (!simulation) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/simulation" className="flex items-center mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Voltar</span>
            </Link>
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Resultado da Simulação
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Confira os detalhes do seu financiamento</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Client Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
                <p className="font-semibold">{simulation.client_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-semibold">{simulation.client_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
                <p className="font-semibold">{formatPhone(simulation.client_phone)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">CPF</p>
                <p className="font-semibold">{formatCPF(simulation.client_cpf)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Property Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Dados do Imóvel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Valor do Imóvel</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(simulation.property_value)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Entrada ({simulation.down_payment_percentage}%)
                </p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(simulation.down_payment_amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Valor Financiado</p>
                <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  {formatCurrency(simulation.loan_amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Prazo</p>
                <p className="font-semibold">
                  {simulation.loan_term_years} anos ({simulation.loan_term_years * 12} meses)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center">
              <Calculator className="h-5 w-5" />
              Resumo dos Pagamentos
            </CardTitle>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Taxa de juros: {simulation.interest_rate}% ao ano
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">Parcela Mensal</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {formatCurrency(simulation.monthly_payment)}
                </p>
              </div>
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">Total de Juros</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(simulation.total_interest)}
                </p>
              </div>
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">Total a Pagar</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {formatCurrency(simulation.total_payment)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/signature/${simulation.id}`}>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              <FileText className="mr-2 h-4 w-4" />
              Assinar e Gerar PDF
            </Button>
          </Link>
          <Link href="/simulation">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <Calculator className="mr-2 h-4 w-4" />
              Nova Simulação
            </Button>
          </Link>
        </div>

        {/* Simulation Info */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Simulação #{simulation.id} criada em {new Date(simulation.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  )
}
