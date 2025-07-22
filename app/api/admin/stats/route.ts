import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("Fetching admin statistics...")

    // Initialize default stats
    let realEstateStats = { total: 0, approved: 0, total_value: 0, avg_payment: 0 }
    let vehicleStats = { total: 0, approved: 0, total_value: 0, avg_payment: 0 }
    let fgtsStats = { total: 0, approved: 0, total_value: 0, avg_payment: 0 }

    // Get real estate simulations stats
    try {
      const realEstateResult = await sql`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN proposal_accepted = true THEN 1 END) as approved,
          COALESCE(SUM(CASE WHEN property_value IS NOT NULL AND property_value != '' THEN property_value::numeric ELSE 0 END), 0) as total_value,
          COALESCE(AVG(CASE WHEN monthly_payment IS NOT NULL AND monthly_payment != '' THEN monthly_payment::numeric ELSE NULL END), 0) as avg_payment
        FROM simulations
      `
      if (realEstateResult && realEstateResult[0]) {
        realEstateStats = realEstateResult[0]
      }
      console.log("Real estate stats:", realEstateStats)
    } catch (error) {
      console.error("Error fetching real estate stats:", error)
    }

    // Get vehicle simulations stats
    try {
      const vehicleResult = await sql`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN proposal_accepted = true THEN 1 END) as approved,
          COALESCE(SUM(CASE WHEN vehicle_value IS NOT NULL AND vehicle_value != '' THEN vehicle_value::numeric ELSE 0 END), 0) as total_value,
          COALESCE(AVG(CASE WHEN monthly_payment IS NOT NULL AND monthly_payment != '' THEN monthly_payment::numeric ELSE NULL END), 0) as avg_payment
        FROM veiculos_simulacao
      `
      if (vehicleResult && vehicleResult[0]) {
        vehicleStats = vehicleResult[0]
      }
      console.log("Vehicle stats:", vehicleStats)
    } catch (error) {
      console.error("Error fetching vehicle stats:", error)
    }

    // Get FGTS simulations stats
    try {
      const fgtsResult = await sql`
        SELECT 
          COUNT(*) as total,
          0 as approved,
          COALESCE(SUM(CASE WHEN valor_antecipacao IS NOT NULL AND valor_antecipacao != '' THEN valor_antecipacao::numeric ELSE 0 END), 0) as total_value,
          COALESCE(AVG(CASE WHEN valor_antecipacao IS NOT NULL AND valor_antecipacao != '' THEN valor_antecipacao::numeric ELSE NULL END), 0) as avg_payment
        FROM fgts_simulacao
      `
      if (fgtsResult && fgtsResult[0]) {
        fgtsStats = fgtsResult[0]
      }
      console.log("FGTS stats:", fgtsStats)
    } catch (error) {
      console.error("Error fetching FGTS stats:", error)
    }

    // Calculate totals safely
    const totalSimulations =
      Number(realEstateStats.total || 0) + Number(vehicleStats.total || 0) + Number(fgtsStats.total || 0)
    const totalApproved =
      Number(realEstateStats.approved || 0) + Number(vehicleStats.approved || 0) + Number(fgtsStats.approved || 0)
    const totalValue =
      Number(realEstateStats.total_value || 0) +
      Number(vehicleStats.total_value || 0) +
      Number(fgtsStats.total_value || 0)

    // Calculate weighted average payment safely
    let avgPayment = 0
    const realEstateAvg = Number(realEstateStats.avg_payment || 0)
    const vehicleAvg = Number(vehicleStats.avg_payment || 0)
    const fgtsAvg = Number(fgtsStats.avg_payment || 0)
    const realEstateTotal = Number(realEstateStats.total || 0)
    const vehicleTotal = Number(vehicleStats.total || 0)
    const fgtsTotal = Number(fgtsStats.total || 0)

    if (totalSimulations > 0) {
      const totalPayments = realEstateAvg * realEstateTotal + vehicleAvg * vehicleTotal + fgtsAvg * fgtsTotal
      avgPayment = totalPayments / totalSimulations
    }

    const stats = {
      total: totalSimulations,
      approved: totalApproved,
      totalValue: totalValue,
      avgPayment: avgPayment,
      categories: {
        realEstate: {
          total: Number(realEstateStats.total || 0),
          approved: Number(realEstateStats.approved || 0),
          totalValue: Number(realEstateStats.total_value || 0),
          avgPayment: Number(realEstateStats.avg_payment || 0),
        },
        vehicle: {
          total: Number(vehicleStats.total || 0),
          approved: Number(vehicleStats.approved || 0),
          totalValue: Number(vehicleStats.total_value || 0),
          avgPayment: Number(vehicleStats.avg_payment || 0),
        },
        fgts: {
          total: Number(fgtsStats.total || 0),
          approved: Number(fgtsStats.approved || 0),
          totalValue: Number(fgtsStats.total_value || 0),
          avgPayment: Number(fgtsStats.avg_payment || 0),
        },
      },
    }

    console.log("Final admin stats:", stats)
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch admin statistics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
