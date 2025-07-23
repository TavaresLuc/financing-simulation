// Utility functions for admin panel operations
export class AdminUtils {
  static formatId(id: number | string | undefined): string {
    if (!id) return "N/A"
    const idStr = String(id)
    return idStr.length > 8 ? `${idStr.slice(0, 8)}...` : idStr
  }

  static formatDate(dateString: string | undefined): string {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Data inválida"
    }
  }

  static formatCurrency(value: string | number | undefined): string {
    if (!value) return "R$ 0,00"
    const numValue = typeof value === "string" ? Number.parseFloat(value) : value
    if (isNaN(numValue)) return "R$ 0,00"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue)
  }

  static formatPercentage(value: string | number | undefined): string {
    if (!value) return "0%"
    const numValue = typeof value === "string" ? Number.parseFloat(value) : value
    if (isNaN(numValue)) return "0%"
    return `${numValue.toFixed(2)}%`
  }

  static safeNumber(value: any, defaultValue = 0): number {
    if (value === null || value === undefined || value === "") return defaultValue
    const num = Number(value)
    return isNaN(num) ? defaultValue : num
  }

  static validateRequiredFields(data: any, requiredFields: string[]): string | null {
    for (const field of requiredFields) {
      if (!data[field]) {
        return `Campo obrigatório ausente: ${field}`
      }
    }
    return null
  }

  static sanitizeNumericValue(value: any): number {
    if (typeof value === "string") {
      // Remove currency formatting and convert to number
      const cleanValue = value.replace(/[R$\s.,]/g, "")
      const numValue = Number.parseFloat(cleanValue)
      return isNaN(numValue) ? 0 : numValue
    }
    const numValue = Number(value)
    return isNaN(numValue) ? 0 : numValue
  }

  static createFallbackStats(realEstateCount = 0, vehicleCount = 0, fgtsCount = 0) {
    return {
      realEstate: { total: realEstateCount, totalValue: 0, avgValue: 0, avgRate: 0 },
      vehicle: { total: vehicleCount, totalValue: 0, avgValue: 0, avgRate: 0 },
      fgts: { total: fgtsCount },
    }
  }
}
