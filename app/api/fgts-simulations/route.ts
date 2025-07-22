import { type NextRequest, NextResponse } from "next/server"
import { saveFGTSSimulation, getAllFGTSSimulations } from "@/lib/fgts-database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validação dos dados
    const { nome_completo, cpf, rg, telefone } = body

    if (!nome_completo || !cpf || !rg || !telefone) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Validação do CPF (formato básico)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    if (!cpfRegex.test(cpf)) {
      return NextResponse.json({ error: "CPF deve estar no formato 000.000.000-00" }, { status: 400 })
    }

    // Validação do telefone (formato básico)
    const telefoneRegex = /^$$\d{2}$$\s\d{4,5}-\d{4}$/
    if (!telefoneRegex.test(telefone)) {
      return NextResponse.json({ error: "Telefone deve estar no formato (00) 00000-0000" }, { status: 400 })
    }

    // Validação do nome completo (pelo menos 2 palavras)
    const nomePartes = nome_completo.trim().split(" ")
    if (nomePartes.length < 2) {
      return NextResponse.json({ error: "Nome completo deve conter pelo menos nome e sobrenome" }, { status: 400 })
    }

    // Salvar no banco de dados
    const simulation = await saveFGTSSimulation({
      nome_completo: nome_completo.trim(),
      cpf: cpf.trim(),
      rg: rg.trim(),
      telefone: telefone.trim(),
    })

    return NextResponse.json({
      success: true,
      message: "Solicitação de antecipação FGTS enviada com sucesso!",
      data: simulation,
    })
  } catch (error) {
    console.error("Erro na API FGTS:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor. Tente novamente.",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
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
        error: "Erro ao buscar simulações",
      },
      { status: 500 },
    )
  }
}
