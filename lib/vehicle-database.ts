import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface VehicleSimulation {
  id?: number
  client_name: string
  client_email: string
  client_phone: string
  client_cpf: string
  vehicle_type: string
  knows_model: boolean
  client_cep?: string
  vehicle_year?: number | null
  vehicle_brand?: string
  vehicle_model?: string
  vehicle_value: number
  purchase_timeline?: string
  seller_type?: string
  down_payment_percentage: number
  down_payment_amount: number
  loan_amount: number
  loan_term_months: number
  interest_rate: number
  monthly_payment: number
  total_payment: number
  total_interest: number
  proposal_accepted?: boolean
  created_at?: string
  updated_at?: string
}

export async function createVehicleSimulation(
  data: Omit<VehicleSimulation, "id" | "created_at" | "updated_at">,
): Promise<{ id: number }> {
  try {
    console.log("Saving vehicle simulation:", data)

    // Validar dados críticos
    if (!data.client_name || !data.client_email || !data.client_phone || !data.client_cpf) {
      throw new Error("Dados pessoais incompletos")
    }

    if (!data.vehicle_type || isNaN(data.vehicle_value) || data.vehicle_value <= 0) {
      throw new Error("Dados do veículo incompletos ou inválidos")
    }

    const result = await sql`
      INSERT INTO veiculos_simulacao (
        client_name, client_email, client_phone, client_cpf,
        vehicle_type, knows_model, client_cep, vehicle_year, vehicle_brand, vehicle_model, vehicle_value,
        purchase_timeline, seller_type,
        down_payment_percentage, down_payment_amount, loan_amount, loan_term_months,
        interest_rate, monthly_payment, total_payment, total_interest
      ) VALUES (
        ${data.client_name}, ${data.client_email}, ${data.client_phone}, ${data.client_cpf},
        ${data.vehicle_type}, ${data.knows_model}, ${data.client_cep || null}, ${data.vehicle_year || null}, 
        ${data.vehicle_brand || null}, ${data.vehicle_model || null}, ${data.vehicle_value},
        ${data.purchase_timeline || null}, ${data.seller_type || null},
        ${data.down_payment_percentage}, ${data.down_payment_amount}, ${data.loan_amount}, ${data.loan_term_months},
        ${data.interest_rate}, ${data.monthly_payment}, ${data.total_payment}, ${data.total_interest}
      )
      RETURNING id
    `

    console.log("Vehicle simulation saved with ID:", result[0].id)
    return { id: result[0].id }
  } catch (error) {
    console.error("Error creating vehicle simulation:", error)
    throw error
  }
}

export async function getVehicleSimulation(id: number): Promise<VehicleSimulation | null> {
  try {
    const result = await sql`
      SELECT * FROM veiculos_simulacao WHERE id = ${id}
    `

    if (result.length === 0) {
      return null
    }

    return result[0] as VehicleSimulation
  } catch (error) {
    console.error("Error fetching vehicle simulation:", error)
    throw error
  }
}

export async function getAllVehicleSimulations(): Promise<VehicleSimulation[]> {
  try {
    const result = await sql`
      SELECT * FROM veiculos_simulacao ORDER BY created_at DESC
    `

    return result as VehicleSimulation[]
  } catch (error) {
    console.error("Error fetching vehicle simulations:", error)
    throw error
  }
}
