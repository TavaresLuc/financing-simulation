import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    console.log("=== Vehicle Simulations API - POST ===")

    const body = await request.json()
    console.log("Received body:", JSON.stringify(body, null, 2))

    // Validate required fields
    if (!body.personalData?.name) {
      return NextResponse.json({ success: false, error: "Nome é obrigatório" }, { status: 400 })
    }

    if (!body.personalData?.email) {
      return NextResponse.json({ success: false, error: "Email é obrigatório" }, { status: 400 })
    }

    if (!body.vehicleData?.vehicleValue) {
      return NextResponse.json({ success: false, error: "Valor do veículo é obrigatório" }, { status: 400 })
    }

    // Helper function to safely convert to number
    const safeNumber = (value: any, defaultValue = 0): number => {
      if (value === null || value === undefined || value === "") {
        return defaultValue
      }

      if (typeof value === "string") {
        // Remove currency formatting
        const cleanValue = value.replace(/[R$\s.,]/g, "")
        const numValue = Number.parseFloat(cleanValue)
        return isNaN(numValue) ? defaultValue : numValue / 100 // Assuming cents
      }

      const numValue = Number(value)
      return isNaN(numValue) ? defaultValue : numValue
    }

    // Parse vehicle value from currency format
    const parseVehicleValue = (value: string): number => {
      if (!value) return 0

      // Remove R$, spaces, and convert comma to dot
      const cleanValue = value
        .replace(/R\$\s?/g, "")
        .replace(/\./g, "")
        .replace(",", ".")

      const numValue = Number.parseFloat(cleanValue)
      return isNaN(numValue) ? 0 : numValue
    }

    const vehicleValue = parseVehicleValue(body.vehicleData.vehicleValue)
    const downPaymentPercentage = safeNumber(body.financingData?.downPaymentPercentage, 20)
    const loanTermMonths = safeNumber(body.financingData?.loanTermMonths, 24)

    // Calculate financing details
    const downPaymentAmount = vehicleValue * (downPaymentPercentage / 100)
    const loanAmount = vehicleValue - downPaymentAmount
    const interestRate = 2.5 // 2.5% per month
    const monthlyPayment =
      (loanAmount * (interestRate / 100) * Math.pow(1 + interestRate / 100, loanTermMonths)) /
      (Math.pow(1 + interestRate / 100, loanTermMonths) - 1)
    const totalPayment = monthlyPayment * loanTermMonths + downPaymentAmount
    const totalInterest = totalPayment - vehicleValue

    console.log("Calculated values:", {
      vehicleValue,
      downPaymentAmount,
      loanAmount,
      monthlyPayment,
      totalPayment,
      totalInterest,
    })

    // Insert into database
    const result = await sql`
      INSERT INTO veiculos_simulacao (
        client_name,
        client_email,
        client_phone,
        client_cpf,
        vehicle_type,
        knows_model,
        client_cep,
        vehicle_year,
        vehicle_brand,
        vehicle_model,
        vehicle_value,
        seller_type,
        down_payment_percentage,
        loan_term_months,
        down_payment_amount,
        loan_amount,
        interest_rate,
        monthly_payment,
        total_payment,
        total_interest,
        created_at,
        updated_at
      ) VALUES (
        ${body.personalData.name},
        ${body.personalData.email},
        ${body.personalData.phone || ""},
        ${body.personalData.cpf || ""},
        ${body.vehicleData.vehicleType || "carro"},
        ${body.vehicleData.knowsModel || false},
        ${body.vehicleData.cep || ""},
        ${body.vehicleData.year || ""},
        ${body.vehicleData.brand || ""},
        ${body.vehicleData.model || ""},
        ${vehicleValue},
        ${body.sellerData?.sellerType || ""},
        ${downPaymentPercentage},
        ${loanTermMonths},
        ${downPaymentAmount},
        ${loanAmount},
        ${interestRate},
        ${monthlyPayment},
        ${totalPayment},
        ${totalInterest},
        NOW(),
        NOW()
      ) RETURNING id
    `

    console.log("Database insert result:", result)

    if (result && result.length > 0) {
      const simulationId = result[0].id
      console.log("Simulation created with ID:", simulationId)

      return NextResponse.json({
        success: true,
        id: simulationId,
        message: "Simulação criada com sucesso",
      })
    } else {
      throw new Error("Falha ao criar simulação")
    }
  } catch (error: any) {
    console.error("=== Vehicle Simulations API Error ===")
    console.error("Error details:", error)
    console.error("Stack trace:", error.stack)

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor. Tente novamente.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    console.log("=== Vehicle Simulations API - GET ===")

    const result = await sql`
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
        created_at,
        updated_at
      FROM veiculos_simulacao 
      ORDER BY created_at DESC
    `

    console.log(`Retrieved ${result.length} vehicle simulations`)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("=== Vehicle Simulations GET Error ===")
    console.error("Error details:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch vehicle simulations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
