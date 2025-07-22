export function formatCurrency(value: number): string {
  // Handle invalid numbers
  if (!isFinite(value) || isNaN(value)) {
    return "R$ 0,00"
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value)
}

export function parseCurrency(value: string): number {
  if (!value || typeof value !== "string") return 0

  // Remove currency symbol and spaces, keep only digits, commas, and dots
  let cleanValue = value.replace(/[R$\s]/g, "")

  // Handle empty string
  if (!cleanValue) return 0

  // Replace dots used as thousand separators (but not decimal separators)
  // In Brazilian format: 1.000.000,50 should become 1000000.50
  const parts = cleanValue.split(",")
  if (parts.length === 2) {
    // Has decimal part
    const integerPart = parts[0].replace(/\./g, "") // Remove all dots from integer part
    const decimalPart = parts[1].slice(0, 2) // Keep only first 2 decimal digits
    cleanValue = `${integerPart}.${decimalPart}`
  } else {
    // No decimal part, just remove dots
    cleanValue = cleanValue.replace(/\./g, "")
  }

  const parsed = Number.parseFloat(cleanValue)
  return isNaN(parsed) ? 0 : parsed
}

export function maskCurrency(value: string): string {
  if (!value) return "R$ 0,00"

  // Extract only digits
  const numericValue = value.replace(/\D/g, "")

  // Handle empty string
  if (!numericValue || numericValue === "0") return "R$ 0,00"

  // Convert to number (treating as cents)
  const cents = Number.parseInt(numericValue, 10)
  if (isNaN(cents)) return "R$ 0,00"

  // Convert cents to reais
  const reais = cents / 100

  // Format using Brazilian locale
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(reais)
}

export function maskCPF(value: string): string {
  const numericValue = value.replace(/\D/g, "")
  return numericValue
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1")
}

export function maskPhone(value: string): string {
  const numericValue = value.replace(/\D/g, "")
  return numericValue
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1")
}

export function formatCPF(value: string): string {
  if (!value) return ""
  const digits = value.replace(/\D/g, "")

  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}

export function formatPhone(value: string): string {
  if (!value) return ""
  const digits = value.replace(/\D/g, "")

  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

export function validateCPF(cpf: string): boolean {
  const numericCPF = cpf.replace(/\D/g, "")

  if (numericCPF.length !== 11) return false
  if (/^(\d)\1{10}$/.test(numericCPF)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(numericCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(numericCPF.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(numericCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(numericCPF.charAt(10))) return false

  return true
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
