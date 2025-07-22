"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import type { SimulationData } from "@/lib/database"
import { formatCurrency } from "@/lib/formatters"
import { ArrowLeft, CheckCircle, Clock, Users, DollarSign, TrendingUp, Home, Car, Banknote } from "lucide-react"
import Link from "next/link"

interface VehicleSimulation {
  id: number
  client_name: string
  client_email: string
  client_phone: string
  vehicle_brand: string
  vehicle_model: string
  vehicle_year: number
  vehicle_value: number
  down_payment_percentage: number
  down_payment_value: number
  financed_amount: number
  loan_term_months: number
  interest_rate: number
  monthly_payment: number
  total_interest: number
  total_amount: number
  proposal_accepted: boolean
  created_at: string
}

interface FGTSSimulation {
  id: number
  client_name: string
  client_email: string
  client_phone: string
  client_cpf: string
  birth_date: string
  fgts_balance: number
  employment_time_months: number
  monthly_salary: number
  requested_amount: number
  interest_rate: number
  loan_term_months: number
  monthly_payment: number
  total_interest: number
  total_amount: number
  proposal_accepted: boolean
  created_at: string
}

export default function AdminPage() {
  const [realEstateSimulations, setRealEstateSimulations] = useState<SimulationData[]>([])
  const [vehicleSimulations, setVehicleSimulations] = useState<VehicleSimulation[]>([])
  const [fgtsSimulations, setFGTSSimulations] = useState<FGTSSimulation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    realEstate: {
      total: 0,
      accepted: 0,
      totalValue: 0,
      avgMonthlyPayment: 0,
    },
    vehicle: {
      total: 0,
      accepted: 0,
      totalValue: 0,
      avgMonthlyPayment: 0,
    },
    fgts: {
      total: 0,
      accepted: 0,
      totalValue: 0,
      avgMonthlyPayment: 0,
    },
  })

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setError(null)

        // Fetch Real Estate Simulations
        try {
          console.log("Fetching real estate simulations...")
          const realEstateResponse = await fetch("/api/simulations")

          if (!realEstateResponse.ok) {
            throw new Error(`Real estate API error: ${realEstateResponse.status}`)
          }

          const contentType = realEstateResponse.headers.get("content-type")
          if (!contentType || !contentType.includes("application/json")) {
            const text = await realEstateResponse.text()
            console.error("Real estate API returned non-JSON:", text.substring(0, 200))
            throw new Error("Real estate API returned invalid JSON")
          }

          const realEstateData = await realEstateResponse.json()
          console.log("Real estate data received:", realEstateData)

          // Ensure data is an array
          const realEstateArray = Array.isArray(realEstateData) ? realEstateData : []
          setRealEstateSimulations(realEstateArray)

          // Calculate real estate stats
          const acceptedCount = realEstateArray.filter((s: SimulationData) => s.proposal_accepted).length
          let totalPropertyValue = 0
          let totalMonthlyPayment = 0
          let validPaymentCount = 0

          realEstateArray.forEach((sim: SimulationData) => {
            const propValue = Number(sim.property_value)
            if (isFinite(propValue) && !isNaN(propValue)) {
              totalPropertyValue += propValue
            }

            const monthlyPayment = Number(sim.monthly_payment)
            if (isFinite(monthlyPayment) && !isNaN(monthlyPayment)) {
              totalMonthlyPayment += monthlyPayment
              validPaymentCount++
            }
          })

          setStats((prev) => ({
            ...prev,
            realEstate: {
              total: realEstateArray.length,
              accepted: acceptedCount,
              totalValue: totalPropertyValue,
              avgMonthlyPayment: validPaymentCount > 0 ? totalMonthlyPayment / validPaymentCount : 0,
            },
          }))
        } catch (error) {
          console.error("Error fetching real estate simulations:", error)
          setRealEstateSimulations([])
        }

        // Fetch Vehicle Simulations
        try {
          console.log("Fetching vehicle simulations...")
          const vehicleResponse = await fetch("/api/vehicle-simulations")

          if (!vehicleResponse.ok) {
            throw new Error(`Vehicle API error: ${vehicleResponse.status}`)
          }

          const contentType = vehicleResponse.headers.get("content-type")
          if (!contentType || !contentType.includes("application/json")) {
            const text = await vehicleResponse.text()
            console.error("Vehicle API returned non-JSON:", text.substring(0, 200))
            throw new Error("Vehicle API returned invalid JSON")
          }

          const vehicleData = await vehicleResponse.json()
          console.log("Vehicle data received:", vehicleData)

          // Ensure data is an array
          const vehicleArray = Array.isArray(vehicleData) ? vehicleData : []
          setVehicleSimulations(vehicleArray)

          // Calculate vehicle stats
          const acceptedCount = vehicleArray.filter((s: VehicleSimulation) => s.proposal_accepted).length
          let totalVehicleValue = 0
          let totalMonthlyPayment = 0
          let validPaymentCount = 0

          vehicleArray.forEach((sim: VehicleSimulation) => {
            const vehicleValue = Number(sim.vehicle_value)
            if (isFinite(vehicleValue) && !isNaN(vehicleValue)) {
              totalVehicleValue += vehicleValue
            }

            const monthlyPayment = Number(sim.monthly_payment)
            if (isFinite(monthlyPayment) && !isNaN(monthlyPayment)) {
              totalMonthlyPayment += monthlyPayment
              validPaymentCount++
            }
          })

          setStats((prev) => ({
            ...prev,
            vehicle: {
              total: vehicleArray.length,
              accepted: acceptedCount,
              totalValue: totalVehicleValue,
              avgMonthlyPayment: validPaymentCount > 0 ? totalMonthlyPayment / validPaymentCount : 0,
            },
          }))
        } catch (error) {
          console.error("Error fetching vehicle simulations:", error)
          setVehicleSimulations([])
        }

        // Fetch FGTS Simulations
        try {
          console.log("Fetching FGTS simulations...")
          const fgtsResponse = await fetch("/api/fgts-simulations")

          if (!fgtsResponse.ok) {
            throw new Error(`FGTS API error: ${fgtsResponse.status}`)
          }

          const contentType = fgtsResponse.headers.get("content-type")
          if (!contentType || !contentType.includes("application/json")) {
            const text = await fgtsResponse.text()
            console.error("FGTS API returned non-JSON:", text.substring(0, 200))
            throw new Error("FGTS API returned invalid JSON")
          }

          const fgtsData = await fgtsResponse.json()
          console.log("FGTS data received:", fgtsData)

          // Ensure data is an array
          const fgtsArray = Array.isArray(fgtsData) ? fgtsData : []
          setFGTSSimulations(fgtsArray)

          // Calculate FGTS stats
          const acceptedCount = fgtsArray.filter((s: FGTSSimulation) => s.proposal_accepted).length
          let totalRequestedAmount = 0
          let totalMonthlyPayment = 0
          let validPaymentCount = 0

          fgtsArray.forEach((sim: FGTSSimulation) => {
            const requestedAmount = Number(sim.requested_amount)
            if (isFinite(requestedAmount) && !isNaN(requestedAmount)) {
              totalRequestedAmount += requestedAmount
            }

            const monthlyPayment = Number(sim.monthly_payment)
            if (isFinite(monthlyPayment) && !isNaN(monthlyPayment)) {
              totalMonthlyPayment += monthlyPayment
              validPaymentCount++
            }
          })

          setStats((prev) => ({
            ...prev,
            fgts: {
              total: fgtsArray.length,
              accepted: acceptedCount,
              totalValue: totalRequestedAmount,
              avgMonthlyPayment: validPaymentCount > 0 ? totalMonthlyPayment / validPaymentCount : 0,
            },
          }))
        } catch (error) {
          console.error("Error fetching FGTS simulations:", error)
          setFGTSSimulations([])
        }
      } catch (error) {
        console.error("General error loading data:", error)
        setError("Erro ao carregar dados do painel administrativo")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Clock className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Erro ao carregar dados</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </div>
      </div>
    )
  }

  const totalStats = {
    total: stats.realEstate.total + stats.vehicle.total + stats.fgts.total,
    accepted: stats.realEstate.accepted + stats.vehicle.accepted + stats.fgts.accepted,
    totalValue: stats.realEstate.totalValue + stats.vehicle.totalValue + stats.fgts.totalValue,
    avgMonthlyPayment:
      (stats.realEstate.avgMonthlyPayment + stats.vehicle.avgMonthlyPayment + stats.fgts.avgMonthlyPayment) / 3,
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

        {/* Overall Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total de Simulações</p>
                  <p className="text-2xl font-bold">{totalStats.total}</p>
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
                  <p className="text-2xl font-bold">{totalStats.accepted}</p>
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
                  <p className="text-xl font-bold">{formatCurrency(totalStats.totalValue)}</p>
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
                  <p className="text-xl font-bold">{formatCurrency(totalStats.avgMonthlyPayment)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Simulações por Categoria</CardTitle>
            <CardDescription>Visualize os dados organizados por tipo de financiamento</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="real-estate" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="real-estate" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Imóveis ({stats.realEstate.total})
                </TabsTrigger>
                <TabsTrigger value="vehicles" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Veículos ({stats.vehicle.total})
                </TabsTrigger>
                <TabsTrigger value="fgts" className="flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  FGTS ({stats.fgts.total})
                </TabsTrigger>
              </TabsList>

              {/* Real Estate Tab */}
              <TabsContent value="real-estate" className="mt-6">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                          <p className="text-2xl font-bold">{stats.realEstate.total}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Aceitas</p>
                          <p className="text-2xl font-bold text-green-600">{stats.realEstate.accepted}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total</p>
                          <p className="text-lg font-bold">{formatCurrency(stats.realEstate.totalValue)}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Parcela Média</p>
                          <p className="text-lg font-bold">{formatCurrency(stats.realEstate.avgMonthlyPayment)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {realEstateSimulations.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Nenhuma simulação de imóvel encontrada</p>
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
                          {realEstateSimulations.map((simulation) => (
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
                                {simulation.created_at
                                  ? new Date(simulation.created_at).toLocaleDateString("pt-BR")
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Vehicles Tab */}
              <TabsContent value="vehicles" className="mt-6">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                          <p className="text-2xl font-bold">{stats.vehicle.total}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Aceitas</p>
                          <p className="text-2xl font-bold text-green-600">{stats.vehicle.accepted}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total</p>
                          <p className="text-lg font-bold">{formatCurrency(stats.vehicle.totalValue)}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Parcela Média</p>
                          <p className="text-lg font-bold">{formatCurrency(stats.vehicle.avgMonthlyPayment)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {vehicleSimulations.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Nenhuma simulação de veículo encontrada</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Veículo</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Entrada</TableHead>
                            <TableHead>Parcela</TableHead>
                            <TableHead>Prazo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vehicleSimulations.map((simulation) => (
                            <TableRow key={simulation.id}>
                              <TableCell className="font-medium">{simulation.client_name}</TableCell>
                              <TableCell>{simulation.client_email}</TableCell>
                              <TableCell>
                                {simulation.vehicle_brand} {simulation.vehicle_model} {simulation.vehicle_year}
                              </TableCell>
                              <TableCell>{formatCurrency(simulation.vehicle_value)}</TableCell>
                              <TableCell>{formatCurrency(simulation.down_payment_value)}</TableCell>
                              <TableCell>{formatCurrency(simulation.monthly_payment)}</TableCell>
                              <TableCell>{simulation.loan_term_months} meses</TableCell>
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
                                {simulation.created_at
                                  ? new Date(simulation.created_at).toLocaleDateString("pt-BR")
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* FGTS Tab */}
              <TabsContent value="fgts" className="mt-6">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                          <p className="text-2xl font-bold">{stats.fgts.total}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Aceitas</p>
                          <p className="text-2xl font-bold text-green-600">{stats.fgts.accepted}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total</p>
                          <p className="text-lg font-bold">{formatCurrency(stats.fgts.totalValue)}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Parcela Média</p>
                          <p className="text-lg font-bold">{formatCurrency(stats.fgts.avgMonthlyPayment)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {fgtsSimulations.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Nenhuma simulação de FGTS encontrada</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Saldo FGTS</TableHead>
                            <TableHead>Valor Solicitado</TableHead>
                            <TableHead>Parcela</TableHead>
                            <TableHead>Prazo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fgtsSimulations.map((simulation) => (
                            <TableRow key={simulation.id}>
                              <TableCell className="font-medium">{simulation.client_name}</TableCell>
                              <TableCell>{simulation.client_email}</TableCell>
                              <TableCell>{simulation.client_cpf}</TableCell>
                              <TableCell>{formatCurrency(simulation.fgts_balance)}</TableCell>
                              <TableCell>{formatCurrency(simulation.requested_amount)}</TableCell>
                              <TableCell>{formatCurrency(simulation.monthly_payment)}</TableCell>
                              <TableCell>{simulation.loan_term_months} meses</TableCell>
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
                                {simulation.created_at
                                  ? new Date(simulation.created_at).toLocaleDateString("pt-BR")
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
