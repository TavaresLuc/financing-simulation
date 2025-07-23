import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Home, Car, CreditCard } from "lucide-react"
import type { RealEstateSimulation, VehicleSimulation, FGTSSimulation } from "@/lib/admin-data-service"
import { AdminUtils } from "@/lib/admin-utils"

interface AdminDataTablesProps {
  realEstateData: RealEstateSimulation[]
  vehicleData: VehicleSimulation[]
  fgtsData: FGTSSimulation[]
}

export function AdminDataTables({ realEstateData, vehicleData, fgtsData }: AdminDataTablesProps) {
  return (
    <Tabs defaultValue="imoveis" className="space-y-4">
      <TabsList>
        <TabsTrigger value="imoveis">
          <Home className="w-4 h-4 mr-2" />
          Imóveis ({realEstateData.length})
        </TabsTrigger>
        <TabsTrigger value="veiculos">
          <Car className="w-4 h-4 mr-2" />
          Veículos ({vehicleData.length})
        </TabsTrigger>
        <TabsTrigger value="fgts">
          <CreditCard className="w-4 h-4 mr-2" />
          FGTS ({fgtsData.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="imoveis">
        <Card>
          <CardHeader>
            <CardTitle>Simulações de Financiamento Imobiliário</CardTitle>
            <CardDescription>Lista de todas as simulações de imóveis realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            {realEstateData.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma simulação de imóvel encontrada</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Valor do Imóvel</TableHead>
                    <TableHead>Valor do Empréstimo</TableHead>
                    <TableHead>Taxa de Juros</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {realEstateData.map((simulation) => (
                    <TableRow key={simulation.id}>
                      <TableCell className="font-mono">{AdminUtils.formatId(simulation.id)}</TableCell>
                      <TableCell>{simulation.client_name || "N/A"}</TableCell>
                      <TableCell>{simulation.client_email || "N/A"}</TableCell>
                      <TableCell>{AdminUtils.formatCurrency(simulation.property_value)}</TableCell>
                      <TableCell>{AdminUtils.formatCurrency(simulation.loan_amount)}</TableCell>
                      <TableCell>
                        {simulation.interest_rate ? AdminUtils.formatPercentage(simulation.interest_rate) : "N/A"}
                      </TableCell>
                      <TableCell>{AdminUtils.formatDate(simulation.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="veiculos">
        <Card>
          <CardHeader>
            <CardTitle>Simulações de Financiamento de Veículos</CardTitle>
            <CardDescription>Lista de todas as simulações de veículos realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            {vehicleData.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma simulação de veículo encontrada</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Valor do Veículo</TableHead>
                    <TableHead>Valor do Empréstimo</TableHead>
                    <TableHead>Taxa de Juros</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicleData.map((simulation) => (
                    <TableRow key={simulation.id}>
                      <TableCell className="font-mono">{AdminUtils.formatId(simulation.id)}</TableCell>
                      <TableCell>{simulation.client_name || "N/A"}</TableCell>
                      <TableCell>{simulation.client_email || "N/A"}</TableCell>
                      <TableCell>{AdminUtils.formatCurrency(simulation.vehicle_value)}</TableCell>
                      <TableCell>{AdminUtils.formatCurrency(simulation.loan_amount)}</TableCell>
                      <TableCell>
                        {simulation.interest_rate ? AdminUtils.formatPercentage(simulation.interest_rate) : "N/A"}
                      </TableCell>
                      <TableCell>{AdminUtils.formatDate(simulation.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="fgts">
        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Antecipação FGTS</CardTitle>
            <CardDescription>Lista de todas as solicitações de antecipação FGTS</CardDescription>
          </CardHeader>
          <CardContent>
            {fgtsData.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma solicitação FGTS encontrada</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>RG</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Última Atualização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fgtsData.map((simulation) => (
                    <TableRow key={simulation.id}>
                      <TableCell className="font-mono">{AdminUtils.formatId(simulation.id)}</TableCell>
                      <TableCell>{simulation.nome_completo || "N/A"}</TableCell>
                      <TableCell>{simulation.cpf || "N/A"}</TableCell>
                      <TableCell>{simulation.rg || "N/A"}</TableCell>
                      <TableCell>{simulation.telefone || "N/A"}</TableCell>
                      <TableCell>{AdminUtils.formatDate(simulation.created_at)}</TableCell>
                      <TableCell>{AdminUtils.formatDate(simulation.updated_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
