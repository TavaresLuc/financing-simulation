// Modular data service for admin panel operations
export interface AdminDataService {
  fetchRealEstateData(): Promise<RealEstateSimulation[]>
  fetchVehicleData(): Promise<VehicleSimulation[]>
  fetchFGTSData(): Promise<FGTSSimulation[]>
  fetchStats(): Promise<AdminStats>
}

export interface RealEstateSimulation {
  id: number | string
  client_name?: string
  client_email?: string
  client_phone?: string
  client_cpf?: string
  property_value?: string | number
  down_payment_percentage?: string | number
  down_payment_amount?: string | number
  loan_amount?: string | number
  loan_term_years?: string | number
  interest_rate?: string | number
  monthly_payment?: string | number
  total_payment?: string | number
  total_interest?: string | number
  proposal_accepted?: boolean
  created_at: string
  updated_at?: string
}

export interface VehicleSimulation {
  id: number | string
  client_name?: string
  client_email?: string
  client_phone?: string
  client_cpf?: string
  vehicle_type?: string
  vehicle_brand?: string
  vehicle_model?: string
  vehicle_year?: string | number
  vehicle_value?: string | number
  down_payment_percentage?: string | number
  down_payment_amount?: string | number
  loan_amount?: string | number
  loan_term_months?: string | number
  interest_rate?: string | number
  monthly_payment?: string | number
  total_payment?: string | number
  total_interest?: string | number
  proposal_accepted?: boolean
  created_at: string
  updated_at?: string
}

export interface FGTSSimulation {
  id: number | string
  nome_completo?: string
  cpf?: string
  rg?: string
  telefone?: string
  created_at: string
  updated_at?: string
}

export interface AdminStats {
  realEstate: {
    total: number
    totalValue: number
    avgValue: number
    avgRate: number
  }
  vehicle: {
    total: number
    totalValue: number
    avgValue: number
    avgRate: number
  }
  fgts: {
    total: number
  }
}

class AdminDataServiceImpl implements AdminDataService {
  private async fetchWithErrorHandling(url: string, name: string): Promise<any> {
    try {
      console.log(`Fetching ${name} from ${url}...`)
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error(`${name} API returned non-JSON response:`, text.substring(0, 200))
        throw new Error(`${name} API returned invalid response format`)
      }

      const data = await response.json()
      console.log(`${name} API response:`, data)
      return data
    } catch (error) {
      console.error(`Error fetching ${name}:`, error)
      throw error
    }
  }

  async fetchRealEstateData(): Promise<RealEstateSimulation[]> {
    try {
      const data = await this.fetchWithErrorHandling("/api/simulations", "Real Estate")
      if (Array.isArray(data)) {
        return data
      } else if (data.error) {
        console.error("Real Estate API error:", data.error)
        return []
      } else {
        console.warn("Unexpected real estate data format:", data)
        return []
      }
    } catch (error) {
      console.error("Failed to fetch real estate data:", error)
      return []
    }
  }

  async fetchVehicleData(): Promise<VehicleSimulation[]> {
    try {
      const data = await this.fetchWithErrorHandling("/api/vehicle-simulations", "Vehicle")
      if (Array.isArray(data)) {
        return data
      } else if (data.error) {
        console.error("Vehicle API error:", data.error)
        return []
      } else {
        console.warn("Unexpected vehicle data format:", data)
        return []
      }
    } catch (error) {
      console.error("Failed to fetch vehicle data:", error)
      return []
    }
  }

  async fetchFGTSData(): Promise<FGTSSimulation[]> {
    try {
      const data = await this.fetchWithErrorHandling("/api/fgts-simulations", "FGTS")
      if (Array.isArray(data)) {
        return data
      } else if (data.error) {
        console.error("FGTS API error:", data.error)
        return []
      } else {
        console.warn("Unexpected FGTS data format:", data)
        return []
      }
    } catch (error) {
      console.error("Failed to fetch FGTS data:", error)
      return []
    }
  }

  async fetchStats(): Promise<AdminStats> {
    try {
      const data = await this.fetchWithErrorHandling("/api/admin/stats", "Stats")
      if (data && !data.error && data.realEstate && data.vehicle && data.fgts) {
        return data
      } else {
        console.warn("Stats API returned error or invalid format:", data)
        // Return fallback stats
        return {
          realEstate: { total: 0, totalValue: 0, avgValue: 0, avgRate: 0 },
          vehicle: { total: 0, totalValue: 0, avgValue: 0, avgRate: 0 },
          fgts: { total: 0 },
        }
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
      // Return fallback stats
      return {
        realEstate: { total: 0, totalValue: 0, avgValue: 0, avgRate: 0 },
        vehicle: { total: 0, totalValue: 0, avgValue: 0, avgRate: 0 },
        fgts: { total: 0 },
      }
    }
  }
}

export const adminDataService = new AdminDataServiceImpl()
