import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    console.log("Recebendo solicitação FGTS...")

    let body
    try {
      body = await request.json()
      console.log("Dados recebidos:", body)
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos enviados",
        },
        { status: 400 },
      )
    }

    // Validate required data
    const { nome_completo, cpf, rg, telefone } = body

    if (!nome_completo?.trim()) {
      return NextResponse.json({ success: false, error: "Nome completo é obrigatório" }, { status: 400 })
    }

    if (!cpf?.trim()) {
      return NextResponse.json({ success: false, error: "CPF é obrigatório" }, { status: 400 })
    }

    if (!rg?.trim()) {
      return NextResponse.json({ success: false, error: "RG é obrigatório" }, { status: 400 })
    }

    if (!telefone?.trim()) {
      return NextResponse.json({ success: false, error: "Telefone é obrigatório" }, { status: 400 })
    }

    // Basic CPF validation
    const cpfNumbers = cpf.replace(/\D/g, "")
    if (cpfNumbers.length !== 11) {
      return NextResponse.json({ success: false, error: "CPF deve ter 11 dígitos" }, { status: 400 })
    }

    // Basic phone validation
    const telefoneNumbers = telefone.replace(/\D/g, "")
    if (telefoneNumbers.length < 10 || telefoneNumbers.length > 11) {
      return NextResponse.json({ success: false, error: "Telefone deve ter 10 ou 11 dígitos" }, { status: 400 })
    }

    // Full name validation
    const nomePartes = nome_completo.trim().split(/\s+/)
    if (nomePartes.length < 2) {
      return NextResponse.json(
        { success: false, error: "Nome completo deve conter pelo menos nome e sobrenome" },
        { status: 400 },
      )
    }

    // RG validation
    if (rg.trim().length < 5) {
      return NextResponse.json({ success: false, error: "RG deve ter pelo menos 5 caracteres" }, { status: 400 })
    }

    // Generate unique ID
    const simulationId = uuidv4()

    // Insert into database with only the columns that exist
    const result = await sql`
      INSERT INTO fgts_simulacao (
        id,
        nome_completo,
        cpf,
        rg,
        telefone,
        created_at,
        updated_at
      ) VALUES (
        ${simulationId},
        ${nome_completo},
        ${cpf},
        ${rg},
        ${telefone},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    console.log("Simulação FGTS salva com sucesso:", result[0])

    const response = {
      id: simulationId,
      nomeCompleto: nome_completo,
      cpf: cpf,
      rg: rg,
      telefone: telefone,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Erro geral na API FGTS:", error)
    return NextResponse.json(
      {
        error: "Failed to create FGTS simulation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    console.log("Fetching all FGTS simulations...")

    // Only select columns that actually exist in the fgts_simulacao table
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
      LIMIT 100
    `

    console.log(`Found ${simulations.length} FGTS simulations`)
    return NextResponse.json(simulations)
  } catch (error) {
    console.error("Error fetching FGTS simulations:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar simulações no banco de dados",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
