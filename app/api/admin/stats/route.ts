import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("Fetching admin statistics...")

    // Helper function to safely convert to number
    const safeNumber = (value: any): number => {
      if (value === null || value === undefined || value === "") return 0
      const num = Number(value)
      return isNaN(num) ? 0 : num
    }

    // Real Estate Statistics - Completely avoid SQL casting
    let realEstateStats = {
      total: 0,
      totalValue: 0,
      avgValue: 0,
      avgRate: 0,
    }

    try {
      // Get basic count first
      const countResult = await sql`SELECT COUNT(*) as total FROM simulations`
      realEstateStats.total = safeNumber(countResult[0]?.total)

      // Only fetch data if we have records
      if (realEstateStats.total > 0) {
        try {
          // Get all data as strings and process in JavaScript
          const dataResult = await sql`
            SELECT 
              property_value,
              interest_rate
            FROM simulations 
          `

          let totalValue = 0
          let validValueCount = 0
          let totalRate = 0
          let validRateCount = 0

          dataResult.forEach((row) => {
            // Safely parse property_value
            if (row.property_value && row.property_value !== "") {
              const propValue = Number.parseFloat(String(row.property_value))
              if (!isNaN(propValue) && propValue > 0) {
                totalValue += propValue
                validValueCount++
              }
            }

            // Safely parse interest_rate
            if (row.interest_rate && row.interest_rate !== "") {
              const rate = Number.parseFloat(String(row.interest_rate))
              if (!isNaN(rate) && rate > 0) {
                totalRate += rate
                validRateCount++
              }
            }
          })

          realEstateStats.totalValue = totalValue
          realEstateStats.avgValue = validValueCount > 0 ? totalValue / validValueCount : 0
          realEstateStats.avgRate = validRateCount > 0 ? totalRate / validRateCount : 0
        } catch (calcError) {
          console.error("Error calculating real estate averages:", calcError)
          // Keep the count but set averages to 0
        }
      }
    } catch (error) {
      console.error("Error fetching real estate stats:", error)
      realEstateStats = { total: 0, totalValue: 0, avgValue: 0, avgRate: 0 }
    }

    // Vehicle Statistics - Completely avoid SQL casting
    let vehicleStats = {
      total: 0,
      totalValue: 0,
      avgValue: 0,
      avgRate: 0,
    }

    try {
      // Get basic count first
      const countResult = await sql`SELECT COUNT(*) as total FROM veiculos_simulacao`
      vehicleStats.total = safeNumber(countResult[0]?.total)

      // Only fetch data if we have records
      if (vehicleStats.total > 0) {
        try {
          // Get all data as strings and process in JavaScript
          const dataResult = await sql`
            SELECT 
              vehicle_value,
              interest_rate
            FROM veiculos_simulacao 
          `

          let totalValue = 0
          let validValueCount = 0
          let totalRate = 0
          let validRateCount = 0

          dataResult.forEach((row) => {
            // Safely parse vehicle_value
            if (row.vehicle_value && row.vehicle_value !== "") {
              const vehValue = Number.parseFloat(String(row.vehicle_value))
              if (!isNaN(vehValue) && vehValue > 0) {
                totalValue += vehValue
                validValueCount++
              }
            }

            // Safely parse interest_rate
            if (row.interest_rate && row.interest_rate !== "") {
              const rate = Number.parseFloat(String(row.interest_rate))
              if (!isNaN(rate) && rate > 0) {
                totalRate += rate
                validRateCount++
              }
            }
          })

          vehicleStats.totalValue = totalValue
          vehicleStats.avgValue = validValueCount > 0 ? totalValue / validValueCount : 0
          vehicleStats.avgRate = validRateCount > 0 ? totalRate / validRateCount : 0
        } catch (calcError) {
          console.error("Error calculating vehicle averages:", calcError)
          // Keep the count but set averages to 0
        }
      }
    } catch (error) {
      console.error("Error fetching vehicle stats:", error)
      vehicleStats = { total: 0, totalValue: 0, avgValue: 0, avgRate: 0 }
    }

    // FGTS Statistics (simple count only)
    const fgtsStats = {
      total: 0,
    }

    try {
      const fgtsResult = await sql`SELECT COUNT(*) as total FROM fgts_simulacao`
      fgtsStats.total = safeNumber(fgtsResult[0]?.total)
    } catch (error) {
      console.error("Error fetching FGTS stats:", error)
      fgtsStats.total = 0
    }

    const response = {
      realEstate: realEstateStats,
      vehicle: vehicleStats,
      fgts: fgtsStats,
    }

    console.log("Admin statistics fetched successfully:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching admin statistics:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch admin statistics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
