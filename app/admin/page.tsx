"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import type { SimulationData } from "@/lib/database"
import { formatCurrency } from "@/lib/formatters"
import { ArrowLeft, CheckCircle, Clock, Users, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [simulations, setSimulations] = useState<SimulationData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    totalValue: 0,
    avgMonthlyPayment: 0,
  })

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const response = await fetch("/api/simulations")
        if (response.ok) {
          const data = await response.json()
          console.log(`Fetched ${data.length} simulations`)

          // Log raw data to inspect
          if (data.length > 0) {
            console.log("First simulation raw data:", data[0])
          }

          setSimulations(data)

          // Calculate stats after setting simulations
          if (data && data.length > 0) {
            // Count accepted proposals
            const acceptedCount = data.filter((s: SimulationData) => s.proposal_accepted).length
            console.log(`Found ${acceptedCount} accepted proposals out of ${data.length} total`)

            // Calculate total property value
            let totalPropertyValue = 0
            data.forEach((sim: SimulationData, index: number) => {
              const propValue = Number(sim.property_value)
              if (isFinite(propValue) && !isNaN(propValue)) {
                totalPropertyValue += propValue
                console.log(
                  `Simulation ${index}: Adding property value ${propValue}, running total: ${totalPropertyValue}`,
                )
              } else {
                console.warn(`Simulation ${index}: Invalid property value: ${sim.property_value}`)
              }
            })

            // Calculate average monthly payment
            let totalMonthlyPayment = 0
            let validPaymentCount = 0
            data.forEach((sim: SimulationData, index: number) => {
              const monthlyPayment = Number(sim.monthly_payment)
              if (isFinite(monthlyPayment) && !isNaN(monthlyPayment)) {
                totalMonthlyPayment += monthlyPayment
                validPaymentCount++
                console.log(
                  `Simulation ${index}: Adding monthly payment ${monthlyPayment}, running total: ${totalMonthlyPayment}`,
                )
              } else {
                console.warn(`Simulation ${index}: Invalid monthly payment: ${sim.monthly_payment}`)
              }
            })

            const avgPayment = validPaymentCount > 0 ? totalMonthlyPayment / validPaymentCount : 0

            const newStats = {
              total: data.length,
              accepted: acceptedCount,
              totalValue: totalPropertyValue,
              avgMonthlyPayment: avgPayment,
            }

            console.log("Final calculated stats:", newStats)
            setStats(newStats)
          }
        } else {
          console.error("Failed to fetch simulations:", response.statusText)
        }
      } catch (error) {
        console.error("Erro ao carregar simulações:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSimulations()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Painel Administrativo</h1>
              <p className="text-gray-600 dark:text-gray-400">Visualize todas as simulações realizadas</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Debug Info - Only in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xs">
            <p className="font-semibold mb-1">Debug Info:</p>
            <p>Total Simulations: {stats.total}</p>
            <p>Accepted Proposals: {stats.accepted}</p>
            <p>Total Value: {stats.totalValue}</p>
            <p>Avg Monthly Payment: {stats.avgMonthlyPayment}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total de Simulações</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Propostas Aceitas</p>
                  <p className="text-2xl font-bold">{stats.accepted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total</p>
                  <p className="text-xl font-bold">{formatCurrency(stats.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Parcela Média</p>
                  <p className="text-xl font-bold">{formatCurrency(stats.avgMonthlyPayment)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simulations Table */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Simulações Realizadas</CardTitle>
            <CardDescription>Lista completa de todas as simulações de financiamento</CardDescription>
          </CardHeader>
          <CardContent>
            {simulations.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Nenhuma simulação encontrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Valor do Imóvel</TableHead>
                      <TableHead>Parcela Mensal</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {simulations.map((simulation) => (
                      <TableRow key={simulation.id}>
                        <TableCell className="font-medium">{simulation.client_name}</TableCell>
                        <TableCell>{simulation.client_email}</TableCell>
                        <TableCell>{formatCurrency(simulation.property_value)}</TableCell>
                        <TableCell>{formatCurrency(simulation.monthly_payment)}</TableCell>
                        <TableCell>{simulation.loan_term_years} anos</TableCell>
                        <TableCell>
                          <Badge
                            variant={simulation.proposal_accepted ? "default" : "secondary"}
                            className={
                              simulation.proposal_accepted
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }
                          >
                            {simulation.proposal_accepted ? "Aceita" : "Pendente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {simulation.created_at ? new Date(simulation.created_at).toLocaleDateString("pt-BR") : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
