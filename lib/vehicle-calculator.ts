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
  12: 1.29, // 1.29% a.m.
  24: 1.39, // 1.39% a.m.
  36: 1.49, // 1.49% a.m.
  48: 1.59, // 1.59% a.m.
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
  const monthlyPayment = loanAmount > 0 
    ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
      (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1)
    : 0

  const totalPayment = downPaymentAmount + (monthlyPayment * loanTermMonths)
  const totalInterest = totalPayment - vehicleValue

  return {
    vehicleValue,
    downPaymentPercentage,
    downPaymentAmount,
    loanAmount,
    loanTermMonths,
    interestRate,
    monthlyPayment,
    totalPayment,
    totalInterest,
  }
}

export function formatVehicleFinancingForDatabase(
  personalData: any,
  vehicleData: any,
  sellerData: any,
  financingData: any,
  calculationResult: VehicleFinancingResult,
) {
  return {
    client_name: personalData.name,
    client_email: personalData.email,
    client_phone: personalData.phone,
    client_cpf: personalData.cpf,
    vehicle_type: vehicleData.vehicleType,
    knows_model: vehicleData.knowsModel,
    client_cep: vehicleData.cep || null,
    vehicle_year: vehicleData.year ? parseInt(vehicleData.year) : null,
    vehicle_brand: vehicleData.brand || null,
    vehicle_model: vehicleData.model || null,
    vehicle_value: calculationResult.vehicleValue,
    purchase_timeline: sellerData.timeline || null,
    seller_type: sellerData.sellerType || null,
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
