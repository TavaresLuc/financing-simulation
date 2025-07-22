import { type NextRequest, NextResponse } from "next/server"
import { saveFGTSSimulation, getAllFGTSSimulations } from "@/lib/fgts-database"

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

    // Validação dos dados obrigatórios
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

    // Validação do CPF (formato básico)
    const cpfNumbers = cpf.replace(/\D/g, "")
    if (cpfNumbers.length !== 11) {
      return NextResponse.json({ success: false, error: "CPF deve ter 11 dígitos" }, { status: 400 })
    }

    // Validação do telefone (formato básico)
    const telefoneNumbers = telefone.replace(/\D/g, "")
    if (telefoneNumbers.length < 10 || telefoneNumbers.length > 11) {
      return NextResponse.json({ success: false, error: "Telefone deve ter 10 ou 11 dígitos" }, { status: 400 })
    }

    // Validação do nome completo (pelo menos 2 palavras)
    const nomePartes = nome_completo.trim().split(/\s+/)
    if (nomePartes.length < 2) {
      return NextResponse.json(
        { success: false, error: "Nome completo deve conter pelo menos nome e sobrenome" },
        { status: 400 },
      )
    }

    // Validação do RG (mínimo 5 caracteres)
    if (rg.trim().length < 5) {
      return NextResponse.json({ success: false, error: "RG deve ter pelo menos 5 caracteres" }, { status: 400 })
    }

    // Salvar no banco de dados
    try {
      const simulation = await saveFGTSSimulation({
        nome_completo: nome_completo.trim(),
        cpf: cpf.trim(),
        rg: rg.trim(),
        telefone: telefone.trim(),
      })

      console.log("Simulação FGTS salva com sucesso:", simulation.id)

      return NextResponse.json({
        success: true,
        message: "Solicitação de antecipação FGTS enviada com sucesso!",
        data: simulation,
      })
    } catch (dbError) {
      console.error("Erro no banco de dados:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao salvar no banco de dados. Tente novamente.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erro geral na API FGTS:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor. Tente novamente mais tarde.",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    console.log("Buscando todas as simulações FGTS...")

    const simulations = await getAllFGTSSimulations()

    return NextResponse.json({
      success: true,
      data: simulations,
    })
  } catch (error) {
    console.error("Erro ao buscar simulações FGTS:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar simulações no banco de dados",
      },
      { status: 500 },
    )
  }
}
