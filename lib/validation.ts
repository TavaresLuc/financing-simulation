export function validateCalculationInputs(
  propertyValue: number,
  downPaymentPercentage: number,
  loanTermYears: number,
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Property value validation
  if (!propertyValue || !isFinite(propertyValue) || propertyValue <= 0) {
    errors.push("Valor do imóvel deve ser um número válido maior que zero")
  }

  if (propertyValue > 50000000) {
    errors.push("Valor do imóvel não pode exceder R$ 50.000.000")
  }

  // Down payment validation
  if (
    !downPaymentPercentage ||
    !isFinite(downPaymentPercentage) ||
    downPaymentPercentage < 0 ||
    downPaymentPercentage > 100
  ) {
    errors.push("Percentual de entrada deve estar entre 0% e 100%")
  }

  if (downPaymentPercentage < 20) {
    errors.push("Entrada mínima deve ser de 20%")
  }

  // Loan term validation
  if (!loanTermYears || !isFinite(loanTermYears) || loanTermYears <= 0) {
    errors.push("Prazo do financiamento deve ser maior que zero")
  }

  if (loanTermYears > 50) {
    errors.push("Prazo máximo é de 50 anos")
  }

  // Cross-validation
  const downPaymentAmount = (propertyValue * downPaymentPercentage) / 100
  const loanAmount = propertyValue - downPaymentAmount

  if (loanAmount <= 0) {
    errors.push("Valor financiado deve ser maior que zero")
  }

  if (loanAmount < 10000) {
    errors.push("Valor mínimo para financiamento é R$ 10.000")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateCalculationResults(calculation: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!calculation) {
    errors.push("Resultado do cálculo é inválido")
    return { isValid: false, errors }
  }

  // Check each calculation result
  const fields = [
    { name: "monthlyPayment", label: "Parcela mensal" },
    { name: "totalPayment", label: "Valor total" },
    { name: "totalInterest", label: "Total de juros" },
    { name: "downPaymentAmount", label: "Valor da entrada" },
    { name: "loanAmount", label: "Valor financiado" },
  ]

  fields.forEach((field) => {
    const value = calculation[field.name]
    if (!isFinite(value) || isNaN(value) || value < 0) {
      errors.push(`${field.label} contém valor inválido: ${value}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}
