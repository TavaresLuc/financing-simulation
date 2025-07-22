import { type NextRequest, NextResponse } from "next/server"
import { createVehicleSimulation, getAllVehicleSimulations } from "@/lib/vehicle-database"
import {
  calculateVehicleFinancing,
  formatVehicleFinancingForDatabase,
  parseVehicleValue,
} from "@/lib/vehicle-calculator"

export async function POST(request: NextRequest) {
  try {
    console.log("=== Vehicle Simulation API Called ===")

    // Parse request body with error handling
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

    // Validar dados obrigatórios
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

    // Converter valor do veículo para número
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

    // Validar dados de financiamento
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

    // Calcular financiamento
    let calculationResult
    try {
      calculationResult = calculateVehicleFinancing({
        vehicleValue,
        downPaymentPercentage,
        loanTermMonths,
      })
      console.log("Calculation result:", calculationResult)
    } catch (calcError) {
      console.error("Calculation error:", calcError)
      return NextResponse.json(
        {
          success: false,
          error: `Erro no cálculo: ${calcError.message}`,
        },
        { status: 400 },
      )
    }

    // Formatar dados para o banco
    let dbData
    try {
      dbData = formatVehicleFinancingForDatabase(
        personalData,
        vehicleData,
        sellerData,
        { downPaymentPercentage, loanTermMonths },
        calculationResult,
      )
      console.log("Database data formatted:", dbData)
    } catch (formatError) {
      console.error("Data formatting error:", formatError)
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao formatar dados para salvamento",
        },
        { status: 500 },
      )
    }

    // Salvar no banco
    let result
    try {
      result = await createVehicleSimulation(dbData)
      console.log("Simulation saved with ID:", result.id)
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao salvar simulação no banco de dados",
        },
        { status: 500 },
      )
    }

    // Retorno de sucesso
    const response = {
      success: true,
      id: result.id,
      calculationResult,
    }

    console.log("Returning success response:", response)
    return NextResponse.json(response)
  } catch (error: any) {
    console.error("=== Unexpected error in vehicle simulation API ===")
    console.error("Error details:", error)
    console.error("Error stack:", error.stack)

    // Garantir que sempre retornamos JSON válido
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
    console.log("Fetching all vehicle simulations")
    const simulations = await getAllVehicleSimulations()

    return NextResponse.json({
      success: true,
      simulations,
    })
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
