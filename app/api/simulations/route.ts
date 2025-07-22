import { type NextRequest, NextResponse } from "next/server"
import { saveSimulation, getAllSimulations } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("Received simulation data:", data)

    // Ensure all numeric fields are properly converted to numbers
    const simulationData = {
      property_value: Number(data.propertyValue) || 0,
      down_payment_percentage: Number(data.downPaymentPercentage) || 20,
      down_payment_amount: Number(data.downPaymentAmount) || 0,
      loan_amount: Number(data.loanAmount) || 0,
      loan_term_years: Number(data.loanTermYears) || 30,
      interest_rate: Number(data.interest_rate) || 12.0,
      monthly_payment: Number(data.monthlyPayment) || 0,
      total_payment: Number(data.totalPayment) || 0,
      total_interest: Number(data.totalInterest) || 0,
      client_name: data.clientName || "",
      client_email: data.clientEmail || "",
      client_phone: data.clientPhone || "",
      client_cpf: data.clientCPF || "",
    }

    console.log("Processed simulation data:", simulationData)
    const result = await saveSimulation(simulationData)

    return NextResponse.json({ id: result.id }, { status: 201 })
  } catch (error) {
    console.error("Erro ao salvar simulação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const simulations = await getAllSimulations()
    console.log(`Retrieved ${simulations.length} simulations from database`)

    // Log a sample of the data to verify structure
    if (simulations.length > 0) {
      console.log("Sample simulation data:", {
        id: simulations[0].id,
        property_value: simulations[0].property_value,
        monthly_payment: simulations[0].monthly_payment,
        proposal_accepted: simulations[0].proposal_accepted,
      })
    }

    return NextResponse.json(simulations)
  } catch (error) {
    console.error("Erro ao buscar simulações:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
