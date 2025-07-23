import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("Fetching FGTS simulations...")

    const simulations = await sql`
      SELECT 
        id,
        nome_completo,
        cpf,
        rg,
        telefone,
        created_at,
        updated_at
      FROM fgts_simulacao 
      ORDER BY created_at DESC
    `

    console.log(`Found ${simulations.length} FGTS simulations`)
    return NextResponse.json(simulations)
  } catch (error) {
    console.error("Error fetching FGTS simulations:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch FGTS simulations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("Creating new FGTS simulation...")
    const body = await request.json()

    // Validate required fields based on the form structure
    const requiredFields = ["nome_completo", "cpf", "rg", "telefone"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const result = await sql`
      INSERT INTO fgts_simulacao (
        nome_completo,
        cpf,
        rg,
        telefone,
        created_at,
        updated_at
      ) VALUES (
        ${body.nome_completo},
        ${body.cpf},
        ${body.rg},
        ${body.telefone},
        NOW(),
        NOW()
      ) RETURNING id
    `

    console.log("FGTS simulation created successfully:", result[0])

    return NextResponse.json({
      success: true,
      id: result[0].id,
      message: "FGTS simulation created successfully",
    })
  } catch (error) {
    console.error("Error creating FGTS simulation:", error)
    return NextResponse.json(
      {
        error: "Failed to create FGTS simulation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
