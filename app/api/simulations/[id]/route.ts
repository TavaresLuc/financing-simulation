import { type NextRequest, NextResponse } from "next/server"
import { getSimulationById, updateProposalStatus } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const simulation = await getSimulationById(id)

    if (!simulation) {
      return NextResponse.json({ error: "Simulação não encontrada" }, { status: 404 })
    }

    return NextResponse.json(simulation)
  } catch (error) {
    console.error("Erro ao buscar simulação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const { proposal_accepted } = await request.json()

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await updateProposalStatus(id, proposal_accepted)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao atualizar simulação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
