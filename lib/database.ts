import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface SimulationData {
  id?: number
  property_value: number
  down_payment_percentage: number
  down_payment_amount: number
  loan_amount: number
  loan_term_years: number
  interest_rate: number
  monthly_payment: number
  total_payment: number
  total_interest: number
  client_name: string
  client_email: string
  client_phone: string
  client_cpf: string
  proposal_accepted?: boolean
  created_at?: string
  updated_at?: string
}

export async function saveSimulation(data: Omit<SimulationData, "id" | "created_at" | "updated_at">) {
  // Ensure all numeric values are valid numbers
  const sanitizedData = {
    ...data,
    property_value: isNaN(data.property_value) ? 0 : data.property_value,
    down_payment_percentage: isNaN(data.down_payment_percentage) ? 20 : data.down_payment_percentage,
    down_payment_amount: isNaN(data.down_payment_amount) ? 0 : data.down_payment_amount,
    loan_amount: isNaN(data.loan_amount) ? 0 : data.loan_amount,
    loan_term_years: isNaN(data.loan_term_years) ? 30 : data.loan_term_years,
    interest_rate: isNaN(data.interest_rate) ? 12 : data.interest_rate,
    monthly_payment: isNaN(data.monthly_payment) ? 0 : data.monthly_payment,
    total_payment: isNaN(data.total_payment) ? 0 : data.total_payment,
    total_interest: isNaN(data.total_interest) ? 0 : data.total_interest,
  }

  console.log("Saving simulation with sanitized data:", sanitizedData)

  const result = await sql`
    INSERT INTO simulations (
      property_value, down_payment_percentage, down_payment_amount,
      loan_amount, loan_term_years, interest_rate, monthly_payment,
      total_payment, total_interest, client_name, client_email,
      client_phone, client_cpf
    ) VALUES (
      ${sanitizedData.property_value}, ${sanitizedData.down_payment_percentage}, ${sanitizedData.down_payment_amount},
      ${sanitizedData.loan_amount}, ${sanitizedData.loan_term_years}, ${sanitizedData.interest_rate}, ${sanitizedData.monthly_payment},
      ${sanitizedData.total_payment}, ${sanitizedData.total_interest}, ${sanitizedData.client_name}, ${sanitizedData.client_email},
      ${sanitizedData.client_phone}, ${sanitizedData.client_cpf}
    ) RETURNING id
  `
  return result[0]
}

export async function getAllSimulations(): Promise<SimulationData[]> {
  try {
    const result = await sql`
      SELECT * FROM simulations 
      ORDER BY created_at DESC
    `

    // Ensure all numeric fields are properly parsed
    const sanitizedResults = result.map((row: any) => ({
      ...row,
      property_value: Number.parseFloat(row.property_value) || 0,
      down_payment_percentage: Number.parseFloat(row.down_payment_percentage) || 0,
      down_payment_amount: Number.parseFloat(row.down_payment_amount) || 0,
      loan_amount: Number.parseFloat(row.loan_amount) || 0,
      loan_term_years: Number.parseInt(row.loan_term_years) || 0,
      interest_rate: Number.parseFloat(row.interest_rate) || 0,
      monthly_payment: Number.parseFloat(row.monthly_payment) || 0,
      total_payment: Number.parseFloat(row.total_payment) || 0,
      total_interest: Number.parseFloat(row.total_interest) || 0,
    }))

    console.log(`Retrieved and sanitized ${sanitizedResults.length} simulations`)

    return sanitizedResults as SimulationData[]
  } catch (error) {
    console.error("Error in getAllSimulations:", error)
    return []
  }
}

export async function updateProposalStatus(id: number, accepted: boolean) {
  await sql`
    UPDATE simulations 
    SET proposal_accepted = ${accepted}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `
}

export async function getSimulationById(id: number): Promise<SimulationData | null> {
  try {
    const result = await sql`
      SELECT * FROM simulations WHERE id = ${id}
    `

    if (result.length === 0) {
      return null
    }

    // Ensure all numeric fields are properly parsed
    const row = result[0]
    const sanitizedResult = {
      ...row,
      property_value: Number.parseFloat(row.property_value) || 0,
      down_payment_percentage: Number.parseFloat(row.down_payment_percentage) || 0,
      down_payment_amount: Number.parseFloat(row.down_payment_amount) || 0,
      loan_amount: Number.parseFloat(row.loan_amount) || 0,
      loan_term_years: Number.parseInt(row.loan_term_years) || 0,
      interest_rate: Number.parseFloat(row.interest_rate) || 0,
      monthly_payment: Number.parseFloat(row.monthly_payment) || 0,
      total_payment: Number.parseFloat(row.total_payment) || 0,
      total_interest: Number.parseFloat(row.total_interest) || 0,
    }

    return sanitizedResult as SimulationData
  } catch (error) {
    console.error("Error in getSimulationById:", error)
    return null
  }
}
