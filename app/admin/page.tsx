"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, AlertCircle } from "lucide-react"
import HeaderPages from "@/components/header"
import { AdminStatisticsCards } from "@/components/admin/admin-statistics-cards"
import { AdminDataTables } from "@/components/admin/admin-data-tables"
import {
  adminDataService,
  type RealEstateSimulation,
  type VehicleSimulation,
  type FGTSSimulation,
  type AdminStats,
} from "@/lib/admin-data-service"
import { AdminUtils } from "@/lib/admin-utils"

export default function AdminPage() {
  const [realEstateData, setRealEstateData] = useState<RealEstateSimulation[]>([])
  const [vehicleData, setVehicleData] = useState<VehicleSimulation[]>([])
  const [fgtsData, setFGTSData] = useState<FGTSSimulation[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("Starting admin data fetch...")

      // Use Promise.allSettled to handle partial failures gracefully
      const results = await Promise.allSettled([
        adminDataService.fetchRealEstateData(),
        adminDataService.fetchVehicleData(),
        adminDataService.fetchFGTSData(),
        adminDataService.fetchStats(),
      ])

      // Handle Real Estate data
      if (results[0].status === "fulfilled") {
        setRealEstateData(results[0].value)
        console.log(`Loaded ${results[0].value.length} real estate simulations`)
      } else {
        console.error("Failed to fetch real estate data:", results[0].reason)
        setRealEstateData([])
      }

      // Handle Vehicle data
      if (results[1].status === "fulfilled") {
        setVehicleData(results[1].value)
        console.log(`Loaded ${results[1].value.length} vehicle simulations`)
      } else {
        console.error("Failed to fetch vehicle data:", results[1].reason)
        setVehicleData([])
      }

      // Handle FGTS data
      if (results[2].status === "fulfilled") {
        setFGTSData(results[2].value)
        console.log(`Loaded ${results[2].value.length} FGTS simulations`)
      } else {
        console.error("Failed to fetch FGTS data:", results[2].reason)
        setFGTSData([])
      }

      // Handle Stats data
      if (results[3].status === "fulfilled") {
        setStats(results[3].value)
        console.log("Loaded statistics:", results[3].value)
      } else {
        console.error("Failed to fetch stats:", results[3].reason)
        // Create fallback stats based on actual data counts
        setStats(
          AdminUtils.createFallbackStats(
            results[0].status === "fulfilled" ? results[0].value.length : 0,
            results[1].status === "fulfilled" ? results[1].value.length : 0,
            results[2].status === "fulfilled" ? results[2].value.length : 0,
          ),
        )
      }

      console.log("Data fetching completed successfully")
    } catch (error) {
      console.error("Error in fetchData:", error)
      setError("Erro ao carregar dados do painel administrativo")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderPages />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Carregando dados...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderPages />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Painel Administrativo</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie todas as simulações e estatísticas</p>
          </div>
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        {stats && <AdminStatisticsCards stats={stats} />}

        {/* Data Tables */}
        <AdminDataTables realEstateData={realEstateData} vehicleData={vehicleData} fgtsData={fgtsData} />
      </div>
    </div>
  )
}
