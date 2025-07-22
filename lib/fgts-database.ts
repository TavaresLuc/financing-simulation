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
    console.log("Salvando simulação FGTS:", data)

    const result = await sql`
      INSERT INTO fgts_simulacao (nome_completo, cpf, rg, telefone)
      VALUES (${data.nome_completo}, ${data.cpf}, ${data.rg}, ${data.telefone})
      RETURNING *
    `

    console.log("Simulação FGTS salva com sucesso:", result[0])
    return result[0] as FGTSSimulation
  } catch (error) {
    console.error("Erro ao salvar simulação FGTS:", error)
    throw new Error("Erro ao salvar simulação FGTS no banco de dados")
  }
}

export async function getFGTSSimulation(id: number): Promise<FGTSSimulation | null> {
  try {
    console.log("Buscando simulação FGTS com ID:", id)

    const result = await sql`
      SELECT * FROM fgts_simulacao WHERE id = ${id}
    `

    if (result.length === 0) {
      console.log("Simulação FGTS não encontrada")
      return null
    }

    console.log("Simulação FGTS encontrada:", result[0])
    return result[0] as FGTSSimulation
  } catch (error) {
    console.error("Erro ao buscar simulação FGTS:", error)
    throw new Error("Erro ao buscar simulação FGTS no banco de dados")
  }
}

export async function getAllFGTSSimulations(): Promise<FGTSSimulation[]> {
  try {
    console.log("Buscando todas as simulações FGTS")

    const result = await sql`
      SELECT * FROM fgts_simulacao 
      ORDER BY created_at DESC
    `

    console.log(`Encontradas ${result.length} simulações FGTS`)
    return result as FGTSSimulation[]
  } catch (error) {
    console.error("Erro ao buscar simulações FGTS:", error)
    throw new Error("Erro ao buscar simulações FGTS no banco de dados")
  }
}
