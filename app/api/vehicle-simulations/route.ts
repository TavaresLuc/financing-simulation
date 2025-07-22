import { type NextRequest, NextResponse } from "next/server"
import { createVehicleSimulation } from "@/lib/vehicle-database"
import {
  calculateVehicleFinancing,
  formatVehicleFinancingForDatabase,
  parseVehicleValue,
} from "@/lib/vehicle-calculator"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    console.log("=== Vehicle Simulation API Called ===")

    let body: any
    try {
      body = await request.json()
      console.log("Received request body:", JSON.stringify(body, null, 2))
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
        },
        { status: 400 },
      )
    }

    const { personalData, vehicleData, sellerData, financingData } = body

    // Validate required data
    if (!personalData?.name || !personalData?.email || !personalData?.phone || !personalData?.cpf) {
      console.error("Missing personal data:", personalData)
      return NextResponse.json(
        {
          success: false,
          error: "Dados pessoais incompletos",
        },
        { status: 400 },
      )
    }

    if (!vehicleData?.vehicleType || !vehicleData?.vehicleValue) {
      console.error("Missing vehicle data:", vehicleData)
      return NextResponse.json(
        {
          success: false,
          error: "Dados do veículo incompletos",
        },
        { status: 400 },
      )
    }

    // Parse vehicle value
    let vehicleValue: number
    try {
      vehicleValue = parseVehicleValue(vehicleData.vehicleValue.toString())
      console.log("Parsed vehicle value:", vehicleValue)

      if (isNaN(vehicleValue) || vehicleValue <= 0) {
        throw new Error("Valor inválido")
      }
    } catch (error) {
      console.error("Vehicle value parsing error:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Valor do veículo inválido",
        },
        { status: 400 },
      )
    }

    // Validate financing data
    const downPaymentPercentage = Number(financingData?.downPaymentPercentage) || 20
    const loanTermMonths = Number(financingData?.loanTermMonths) || 24

    if (downPaymentPercentage < 5 || downPaymentPercentage > 95) {
      return NextResponse.json(
        {
          success: false,
          error: "Percentual de entrada deve estar entre 5% e 95%",
        },
        { status: 400 },
      )
    }

    if (![12, 24, 36, 48].includes(loanTermMonths)) {
      return NextResponse.json(
        {
          success: false,
          error: "Prazo deve ser 12, 24, 36 ou 48 meses",
        },
        { status: 400 },
      )
    }

    console.log("Calculating financing with:", {
      vehicleValue,
      downPaymentPercentage,
      loanTermMonths,
    })

    // Calculate financing
    const calculationResult = calculateVehicleFinancing({
      vehicleValue,
      downPaymentPercentage,
      loanTermMonths,
    })
    console.log("Calculation result:", calculationResult)

    // Format data for database
    const dbData = formatVehicleFinancingForDatabase(
      personalData,
      vehicleData,
      sellerData,
      { downPaymentPercentage, loanTermMonths },
      calculationResult,
    )
    console.log("Database data formatted:", dbData)

    // Save to database
    const result = await createVehicleSimulation(dbData)
    console.log("Simulation saved with ID:", result.id)

    return NextResponse.json({
      success: true,
      id: result.id,
      calculationResult,
    })
  } catch (error: any) {
    console.error("=== Unexpected error in vehicle simulation API ===")
    console.error("Error details:", error)
    console.error("Error stack:", error.stack)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    console.log("Fetching all vehicle simulations...")
    const simulations = await sql`
      SELECT 
        id,
        client_name,
        client_email,
        client_phone,
        client_cpf,
        vehicle_type,
        vehicle_brand,
        vehicle_model,
        vehicle_year,
        vehicle_value,
        down_payment_percentage,
        down_payment_amount,
        loan_amount,
        loan_term_months,
        interest_rate,
        monthly_payment,
        total_payment,
        total_interest,
        proposal_accepted,
        created_at
      FROM veiculos_simulacao 
      ORDER BY created_at DESC 
      LIMIT 100
    `

    console.log(`Found ${simulations.length} vehicle simulations`)
    return NextResponse.json(simulations)
  } catch (error: any) {
    console.error("Error fetching vehicle simulations:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar simulações",
      },
      { status: 500 },
    )
  }
}
