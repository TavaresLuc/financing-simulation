export interface MortgageCalculation {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  downPaymentAmount: number
  loanAmount: number
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function calculateMortgage(
  propertyValue: number,
  downPaymentPercentage: number,
  loanTermYears: number,
  annualInterestRate: number,
): MortgageCalculation {
  // Validate inputs
  if (!propertyValue || propertyValue <= 0) {
    throw new Error("Valor do imóvel deve ser maior que zero")
  }

  if (!downPaymentPercentage || downPaymentPercentage < 0 || downPaymentPercentage > 100) {
    throw new Error("Percentual de entrada deve estar entre 0 e 100")
  }

  if (!loanTermYears || loanTermYears <= 0) {
    throw new Error("Prazo do financiamento deve ser maior que zero")
  }

  if (!annualInterestRate || annualInterestRate <= 0) {
    throw new Error("Taxa de juros deve ser maior que zero")
  }

  // Calculate values
  const downPaymentAmount = (propertyValue * downPaymentPercentage) / 100
  const loanAmount = propertyValue - downPaymentAmount
  const monthlyInterestRate = annualInterestRate / 100 / 12
  const numberOfPayments = loanTermYears * 12

  // Calculate monthly payment using the standard mortgage formula
  const monthlyPayment =
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)

  const totalPayment = monthlyPayment * numberOfPayments
  const totalInterest = totalPayment - loanAmount

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    downPaymentAmount: Math.round(downPaymentAmount * 100) / 100,
    loanAmount: Math.round(loanAmount * 100) / 100,
  }
}

export function validateMortgageInputs(
  propertyValue: number,
  downPaymentPercentage: number,
  loanTermYears: number,
  annualInterestRate: number,
): ValidationResult {
  const errors: string[] = []

  if (!propertyValue || propertyValue <= 0) {
    errors.push("Valor do imóvel deve ser maior que zero")
  } else if (propertyValue < 50000) {
    errors.push("Valor mínimo do imóvel é R$ 50.000")
  } else if (propertyValue > 10000000) {
    errors.push("Valor máximo do imóvel é R$ 10.000.000")
  }

  if (!downPaymentPercentage || downPaymentPercentage < 10) {
    errors.push("Entrada mínima é 10%")
  } else if (downPaymentPercentage > 80) {
    errors.push("Entrada máxima é 80%")
  }

  if (!loanTermYears || loanTermYears < 5) {
    errors.push("Prazo mínimo é 5 anos")
  } else if (loanTermYears > 35) {
    errors.push("Prazo máximo é 35 anos")
  }

  if (!annualInterestRate || annualInterestRate <= 0) {
    errors.push("Taxa de juros deve ser maior que zero")
  } else if (annualInterestRate > 50) {
    errors.push("Taxa de juros muito alta")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
