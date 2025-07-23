import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Car, CreditCard, Users } from "lucide-react"
import type { AdminStats } from "@/lib/admin-data-service"
import { AdminUtils } from "@/lib/admin-utils"

interface AdminStatisticsCardsProps {
  stats: AdminStats
}

export function AdminStatisticsCards({ stats }: AdminStatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Imóveis</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.realEstate.total}</div>
          <p className="text-xs text-muted-foreground">
            Valor médio: {AdminUtils.formatCurrency(stats.realEstate.avgValue)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Veículos</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.vehicle.total}</div>
          <p className="text-xs text-muted-foreground">
            Valor médio: {AdminUtils.formatCurrency(stats.vehicle.avgValue)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">FGTS</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.fgts.total}</div>
          <p className="text-xs text-muted-foreground">Solicitações de antecipação</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.realEstate.total + stats.vehicle.total + stats.fgts.total}</div>
          <p className="text-xs text-muted-foreground">Todas as simulações</p>
        </CardContent>
      </Card>
    </div>
  )
}
