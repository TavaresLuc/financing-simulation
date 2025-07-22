import { validateCalculationInputs, validateCalculationResults } from "./validation"

export interface MortgageCalculation {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  downPaymentAmount: number
  loanAmount: number
}

export function calculateMortgage(
  propertyValue: number,
  downPaymentPercentage: number,
  loanTermYears: number,
  annualInterestRate = 12,
): MortgageCalculation {
  // Validate inputs
  const inputValidation = validateCalculationInputs(propertyValue, downPaymentPercentage, loanTermYears)
  if (!inputValidation.isValid) {
    throw new Error(inputValidation.errors.join("; "))
  }

  const downPaymentAmount = (propertyValue * downPaymentPercentage) / 100
  const loanAmount = propertyValue - downPaymentAmount

  const monthlyInterestRate = annualInterestRate / 100 / 12
  const numberOfPayments = loanTermYears * 12

  // Calculate monthly payment using the standard mortgage formula
  let monthlyPayment: number

  if (monthlyInterestRate === 0) {
    monthlyPayment = loanAmount / numberOfPayments
  } else {
    const factor = Math.pow(1 + monthlyInterestRate, numberOfPayments)
    monthlyPayment = (loanAmount * monthlyInterestRate * factor) / (factor - 1)
  }

  const totalPayment = monthlyPayment * numberOfPayments + downPaymentAmount
  const totalInterest = monthlyPayment * numberOfPayments - loanAmount

  const result = {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    downPaymentAmount: Math.round(downPaymentAmount * 100) / 100,
    loanAmount: Math.round(loanAmount * 100) / 100,
  }

  // Validate results
  const resultValidation = validateCalculationResults(result)
  if (!resultValidation.isValid) {
    throw new Error(`Erro nos cálculos: ${resultValidation.errors.join("; ")}`)
  }

  return result
}
