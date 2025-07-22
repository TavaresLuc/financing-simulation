import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface FGTSSimulation {
  id?: number
  nome_completo: string
  cpf: string
  rg: string
  telefone: string
  created_at?: Date
  updated_at?: Date
}

export async function saveFGTSSimulation(
  data: Omit<FGTSSimulation, "id" | "created_at" | "updated_at">,
): Promise<FGTSSimulation> {
  try {
    const result = await sql`
      INSERT INTO fgts_simulacao (nome_completo, cpf, rg, telefone)
      VALUES (${data.nome_completo}, ${data.cpf}, ${data.rg}, ${data.telefone})
      RETURNING *
    `

    return result[0] as FGTSSimulation
  } catch (error) {
    console.error("Erro ao salvar simulação FGTS:", error)
    throw new Error("Erro ao salvar simulação FGTS")
  }
}

export async function getFGTSSimulation(id: number): Promise<FGTSSimulation | null> {
  try {
    const result = await sql`
      SELECT * FROM fgts_simulacao WHERE id = ${id}
    `

    return (result[0] as FGTSSimulation) || null
  } catch (error) {
    console.error("Erro ao buscar simulação FGTS:", error)
    throw new Error("Erro ao buscar simulação FGTS")
  }
}

export async function getAllFGTSSimulations(): Promise<FGTSSimulation[]> {
  try {
    const result = await sql`
      SELECT * FROM fgts_simulacao 
      ORDER BY created_at DESC
    `

    return result as FGTSSimulation[]
  } catch (error) {
    console.error("Erro ao buscar simulações FGTS:", error)
    throw new Error("Erro ao buscar simulações FGTS")
  }
}
