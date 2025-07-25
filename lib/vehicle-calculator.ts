export interface VehicleFinancingParams {
  vehicleValue: number
  downPaymentPercentage: number
  loanTermMonths: number
}

export interface VehicleFinancingResult {
  vehicleValue: number
  downPaymentPercentage: number
  downPaymentAmount: number
  loanAmount: number
  loanTermMonths: number
  interestRate: number
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
}

// Taxas de juros baseadas no prazo
const INTEREST_RATES = {
  12: 1.39, // 1.39% a.m.
  24: 1.49, // 1.49% a.m.
  36: 1.59, // 1.59% a.m.
  48: 1.69, // 1.69% a.m.
}

export function calculateVehicleFinancing(params: VehicleFinancingParams): VehicleFinancingResult {
  const { vehicleValue, downPaymentPercentage, loanTermMonths } = params

  // Validar parâmetros
  if (vehicleValue <= 0) {
    throw new Error("Valor do veículo deve ser maior que zero")
  }

  if (downPaymentPercentage < 0 || downPaymentPercentage > 100) {
    throw new Error("Percentual de entrada deve estar entre 0 e 100")
  }

  if (![12, 24, 36, 48].includes(loanTermMonths)) {
    throw new Error("Prazo deve ser 12, 24, 36 ou 48 meses")
  }

  // Calcular valores
  const downPaymentAmount = (vehicleValue * downPaymentPercentage) / 100
  const loanAmount = vehicleValue - downPaymentAmount
  const interestRate = INTEREST_RATES[loanTermMonths as keyof typeof INTEREST_RATES]

  // Calcular parcela usando fórmula de juros compostos
  const monthlyInterestRate = interestRate / 100
  const monthlyPayment =
    loanAmount > 0
      ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
        (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1)
      : 0

  const totalPayment = downPaymentAmount + monthlyPayment * loanTermMonths
  const totalInterest = totalPayment - vehicleValue

  return {
    vehicleValue,
    downPaymentPercentage,
    downPaymentAmount: Math.round(downPaymentAmount * 100) / 100,
    loanAmount: Math.round(loanAmount * 100) / 100,
    loanTermMonths,
    interestRate,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  }
}

// Função auxiliar para converter valor brasileiro para número
export function parseVehicleValue(value: string): number {
  if (!value) return 0

  // Remove todos os caracteres não numéricos exceto vírgula e ponto
  let cleanValue = value.replace(/[^\d,.-]/g, "")

  // Se contém vírgula, assume formato brasileiro (R$ 50.000,00)
  if (cleanValue.includes(",")) {
    // Remove pontos (separadores de milhares) e substitui vírgula por ponto
    cleanValue = cleanValue.replace(/\./g, "").replace(",", ".")
  }

  const numericValue = Number.parseFloat(cleanValue)
  return isNaN(numericValue) ? 0 : numericValue
}

export function formatVehicleFinancingForDatabase(
  personalData: any,
  vehicleData: any,
  sellerData: any,
  financingData: any,
  calculationResult: VehicleFinancingResult,
) {
  console.log("Formatting data for database:")
  console.log("Personal data:", personalData)
  console.log("Vehicle data:", vehicleData)
  console.log("Seller data:", sellerData)
  console.log("Financing data:", financingData)
  console.log("Calculation result:", calculationResult)

  return {
    client_name: personalData.name, // Make sure we're using the correct field name
    client_email: personalData.email,
    client_phone: personalData.phone,
    client_cpf: personalData.cpf,
    vehicle_type: vehicleData.vehicleType,
    knows_model: vehicleData.knowsModel,
    client_cep: vehicleData.cep || null,
    vehicle_year: vehicleData.year ? Number.parseInt(vehicleData.year) : null,
    vehicle_brand: vehicleData.brand || null,
    vehicle_model: vehicleData.model || null,
    vehicle_value: calculationResult.vehicleValue,
    purchase_timeline: sellerData?.timeline || null,
    seller_type: sellerData?.sellerType || null,
    down_payment_percentage: calculationResult.downPaymentPercentage,
    down_payment_amount: calculationResult.downPaymentAmount,
    loan_amount: calculationResult.loanAmount,
    loan_term_months: calculationResult.loanTermMonths,
    interest_rate: calculationResult.interestRate,
    monthly_payment: calculationResult.monthlyPayment,
    total_payment: calculationResult.totalPayment,
    total_interest: calculationResult.totalInterest,
  }
}
