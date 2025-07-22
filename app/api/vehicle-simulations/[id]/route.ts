import { type NextRequest, NextResponse } from "next/server"
import { getVehicleSimulation } from "@/lib/vehicle-database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const simulation = await getVehicleSimulation(id)

    if (!simulation) {
      return NextResponse.json({ error: "Simulação não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ simulation })
  } catch (error) {
    console.error("Error fetching vehicle simulation:", error)
    return NextResponse.json({ error: "Erro ao buscar simulação" }, { status: 500 })
  }
}
