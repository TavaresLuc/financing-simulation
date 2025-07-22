import { type NextRequest, NextResponse } from "next/server"
import { createVehicleSimulation, getAllVehicleSimulations } from "@/lib/vehicle-database"
import { calculateVehicleFinancing, formatVehicleFinancingForDatabase } from "@/lib/vehicle-calculator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received request body:", body)

    const { personalData, vehicleData, sellerData, financingData } = body

    // Validar dados obrigatórios
    if (!personalData?.name || !personalData?.email || !personalData?.phone || !personalData?.cpf) {
      return NextResponse.json({ 
        success: false, 
        error: "Dados pessoais incompletos" 
      }, { status: 400 })
    }

    if (!vehicleData?.vehicleType || !vehicleData?.vehicleValue) {
      return NextResponse.json({ 
        success: false, 
        error: "Dados do veículo incompletos" 
      }, { status: 400 })
    }

    // Converter valor do veículo para número
    let vehicleValue: number
    try {
      const cleanValue = vehicleData.vehicleValue.toString().replace(/[^\d,.-]/g, "").replace(",", ".")
      vehicleValue = Number.parseFloat(cleanValue)
      
      if (isNaN(vehicleValue) || vehicleValue <= 0) {
        throw new Error("Valor inválido")
      }
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: "Valor do veículo inválido" 
      }, { status: 400 })
    }

    // Calcular financiamento
    const calculationResult = calculateVehicleFinancing({
      vehicleValue,
      downPaymentPercentage: Number(financingData.downPaymentPercentage) || 20,
      loanTermMonths: Number(financingData.loanTermMonths) || 24,
    })

    // Formatar dados para o banco
    const dbData = formatVehicleFinancingForDatabase(
      personalData,
      vehicleData,
      sellerData,
      financingData,
      calculationResult,
    )

    // Salvar no banco
    const result = await createVehicleSimulation(dbData)

    return NextResponse.json({
      success: true,
      id: result.id,
      calculationResult,
    })

  } catch (error: any) {
    console.error("Error in vehicle simulation API:", error)
    
    // Garantir que sempre retornamos JSON válido
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Erro interno do servidor" 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const simulations = await getAllVehicleSimulations()
    return NextResponse.json({ 
      success: true, 
      simulations 
    })
  } catch (error: any) {
    console.error("Error fetching vehicle simulations:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Erro ao buscar simulações" 
    }, { status: 500 })
  }
}
