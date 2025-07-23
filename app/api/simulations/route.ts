import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("Fetching real estate simulations...")

    const simulations = await sql`
      SELECT 
        id,
        client_name,
        client_email,
        client_phone,
        client_cpf,
        property_value,
        down_payment_percentage,
        down_payment_amount,
        loan_amount,
        loan_term_years,
        interest_rate,
        monthly_payment,
        total_payment,
        total_interest,
        proposal_accepted,
        created_at,
        updated_at
      FROM simulations
      ORDER BY created_at DESC
    `

    console.log(`Found ${simulations.length} real estate simulations`)
    return NextResponse.json(simulations)
  } catch (error) {
    console.error("Error fetching real estate simulations:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch real estate simulations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("Creating new real estate simulation...")
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["client_name", "client_email", "property_value", "loan_term_years"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Helper function to safely convert to number
    const safeNumber = (value: any, defaultValue = 0): number => {
      if (value === null || value === undefined || value === "") return defaultValue
      const num = Number(value)
      return isNaN(num) ? defaultValue : num
    }

    // Convert and validate numeric fields
    const propertyValue = safeNumber(body.property_value)
    const downPaymentPercentage = safeNumber(body.down_payment_percentage, 20)
    const loanTermYears = safeNumber(body.loan_term_years, 30)
    const interestRate = safeNumber(body.interest_rate, 8.5)

    if (propertyValue <= 0) {
      return NextResponse.json({ error: "Property value must be greater than 0" }, { status: 400 })
    }

    // Calculate financial values
    const downPaymentAmount = propertyValue * (downPaymentPercentage / 100)
    const loanAmount = propertyValue - downPaymentAmount
    const monthlyRate = interestRate / 100 / 12
    const totalPayments = loanTermYears * 12

    let monthlyPayment = 0
    if (monthlyRate > 0) {
      monthlyPayment =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1)
    } else {
      monthlyPayment = loanAmount / totalPayments
    }

    const totalPayment = monthlyPayment * totalPayments
    const totalInterest = totalPayment - loanAmount

    const result = await sql`
      INSERT INTO simulations (
        client_name,
        client_email,
        client_phone,
        client_cpf,
        property_value,
        down_payment_percentage,
        down_payment_amount,
        loan_amount,
        loan_term_years,
        interest_rate,
        monthly_payment,
        total_payment,
        total_interest,
        proposal_accepted,
        created_at,
        updated_at
      ) VALUES (
        ${body.client_name},
        ${body.client_email},
        ${body.client_phone || ""},
        ${body.client_cpf || ""},
        ${propertyValue},
        ${downPaymentPercentage},
        ${downPaymentAmount},
        ${loanAmount},
        ${loanTermYears},
        ${interestRate},
        ${monthlyPayment},
        ${totalPayment},
        ${totalInterest},
        ${body.proposal_accepted || false},
        NOW(),
        NOW()
      ) RETURNING id
    `

    console.log("Real estate simulation created successfully:", result[0])

    return NextResponse.json({
      success: true,
      id: result[0].id,
      data: {
        propertyValue,
        downPaymentAmount,
        loanAmount,
        monthlyPayment,
        totalPayment,
        totalInterest,
        interestRate,
        loanTermYears,
      },
    })
  } catch (error) {
    console.error("Error creating real estate simulation:", error)
    return NextResponse.json(
      {
        error: "Failed to create real estate simulation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
