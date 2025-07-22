import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received simulation data:", body)

    // Validate required fields
    const requiredFields = [
      "property_value",
      "down_payment_percentage",
      "down_payment_amount",
      "loan_amount",
      "loan_term_years",
      "interest_rate",
      "monthly_payment",
      "total_payment",
      "total_interest",
      "client_name",
      "client_email",
      "client_phone",
      "client_cpf",
    ]

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json({ success: false, error: `Campo obrigatório ausente: ${field}` }, { status: 400 })
      }
    }

    // Insert into database
    const result = await sql`
      INSERT INTO simulations (
        property_value,
        down_payment_percentage,
        down_payment_amount,
        loan_amount,
        loan_term_years,
        interest_rate,
        monthly_payment,
        total_payment,
        total_interest,
        client_name,
        client_email,
        client_phone,
        client_cpf,
        created_at
      ) VALUES (
        ${body.property_value},
        ${body.down_payment_percentage},
        ${body.down_payment_amount},
        ${body.loan_amount},
        ${body.loan_term_years},
        ${body.interest_rate},
        ${body.monthly_payment},
        ${body.total_payment},
        ${body.total_interest},
        ${body.client_name},
        ${body.client_email},
        ${body.client_phone},
        ${body.client_cpf},
        NOW()
      ) RETURNING id
    `

    const simulationId = result[0]?.id

    if (!simulationId) {
      throw new Error("Falha ao obter ID da simulação")
    }

    console.log("Simulation saved with ID:", simulationId)

    return NextResponse.json({
      success: true,
      id: simulationId,
      message: "Simulação salva com sucesso",
    })
  } catch (error) {
    console.error("Error saving simulation:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    console.log("Fetching all real estate simulations...")
    const simulations = await sql`
      SELECT 
        id,
        property_value,
        down_payment_percentage,
        down_payment_amount,
        loan_amount,
        loan_term_years,
        interest_rate,
        monthly_payment,
        total_payment,
        total_interest,
        client_name,
        client_email,
        client_phone,
        client_cpf,
        proposal_accepted,
        created_at
      FROM simulations 
      ORDER BY created_at DESC 
      LIMIT 100
    `

    console.log(`Found ${simulations.length} real estate simulations`)
    return NextResponse.json(simulations)
  } catch (error) {
    console.error("Error fetching simulations:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
