"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateVehicleFinancing } from "@/lib/vehicle-calculator"

interface FinancingOptionsFormProps {
  vehicleValue: string
  data: {
    downPaymentPercentage: number
    loanTermMonths: number
  }
  onUpdate: (data: any) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting?: boolean
}

export function FinancingOptionsForm({
  vehicleValue,
  data,
  onUpdate,
  onSubmit,
  onBack,
  isSubmitting = false,
}: FinancingOptionsFormProps) {
  const [calculationResult, setCalculationResult] = useState({
    downPaymentAmount: 0,
    loanAmount: 0,
    interestRate: 0,
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
  })

  // Converter valor do veículo de string para número
  const getVehicleValueAsNumber = (): number => {
    if (!vehicleValue) return 0
    return Number.parseFloat(vehicleValue.replace(/[^\d,.-]/g, "").replace(",", "."))
  }

  // Recalcular financiamento quando os parâmetros mudarem
  useEffect(() => {
    try {
      const vehicleValueNumber = getVehicleValueAsNumber()

      if (vehicleValueNumber > 0) {
        const result = calculateVehicleFinancing({
          vehicleValue: vehicleValueNumber,
          downPaymentPercentage: data.downPaymentPercentage,
          loanTermMonths: data.loanTermMonths,
        })

        setCalculationResult(result)
      }
    } catch (error) {
      console.error("Error calculating financing:", error)
    }
  }, [vehicleValue, data.downPaymentPercentage, data.loanTermMonths])

  const handleDownPaymentChange = (value: number[]) => {
    onUpdate({ ...data, downPaymentPercentage: value[0] })
  }

  const handleTermChange = (value: string) => {
    onUpdate({ ...data, loanTermMonths: Number.parseInt(value) })
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Opções de Financiamento</CardTitle>
        <CardDescription>Personalize as condições do seu financiamento</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base">Valor de Entrada</Label>
            <span className="text-lg font-semibold">{formatCurrency(calculationResult.downPaymentAmount)}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>5%</span>
              <span>{data.downPaymentPercentage}%</span>
              <span>95%</span>
            </div>

            <Slider
              value={[data.downPaymentPercentage]}
              min={5}
              max={95}
              step={1}
              onValueChange={handleDownPaymentChange}
              className="my-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Valor do Veículo:</span>
              <p className="font-medium">{vehicleValue}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Valor Financiado:</span>
              <p className="font-medium">{formatCurrency(calculationResult.loanAmount)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base">Prazo de Financiamento</Label>

          <Tabs
            defaultValue={data.loanTermMonths.toString()}
            value={data.loanTermMonths.toString()}
            onValueChange={handleTermChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="12">12x</TabsTrigger>
              <TabsTrigger value="24">24x</TabsTrigger>
              <TabsTrigger value="36">36x</TabsTrigger>
              <TabsTrigger value="48">48x</TabsTrigger>
            </TabsList>

            <TabsContent value="12" className="mt-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Taxa de Juros</p>
                      <p className="font-semibold">{calculationResult.interestRate}% a.m.</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Parcela Mensal</p>
                      <p className="font-semibold">{formatCurrency(calculationResult.monthlyPayment)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total de Juros</p>
                      <p className="font-semibold">{formatCurrency(calculationResult.totalInterest)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total a Pagar</p>
                      <p className="font-semibold">{formatCurrency(calculationResult.totalPayment)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="24" className="mt-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Taxa de Juros</p>
                      <p className="font-semibold">{calculationResult.interestRate}% a.m.</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Parcela Mensal</p>
                      <p className="font-semibold">{formatCurrency(calculationResult.monthlyPayment)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total de Juros</p>
                      <p className="font-semibold">{formatCurrency(calculationResult.totalInterest)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total a Pagar</p>
                      <p className="font-semibold">{formatCurrency(calculationResult.totalPayment)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="36" className="mt-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Taxa de Juros</p>
                      <p className="font-semibold">{calculationResult.interestRate}% a.m.</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Parcela Mensal</p>
                      <p className="font-semibold">{formatCurrency(calculationResult.monthlyPayment)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total de Juros</p>
                      <p className="font-semibold">{formatCurrency(calculationResult.totalInterest)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total a Pagar</p>
                      <p className="font-semibold">{formatCurrency(calculationResult.totalPayment)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="48" className="mt-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Taxa de Juros</p>
                      <p className="font-semibold">{calculationResult.interestRate}% a.m.</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Parcela Mensal</p>
                      <p className="font-semibold">{formatCurrency(calculationResult.monthlyPayment)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total de Juros</p>
                      <p className="font-semibold">{formatCurrency(calculationResult.totalInterest)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total a Pagar</p>
                      <p className="font-semibold">{formatCurrency(calculationResult.totalPayment)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Resumo do Financiamento</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Valor do Veículo</p>
              <p className="font-medium">{vehicleValue}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Valor da Entrada</p>
              <p className="font-medium">{formatCurrency(calculationResult.downPaymentAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Valor Financiado</p>
              <p className="font-medium">{formatCurrency(calculationResult.loanAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Prazo</p>
              <p className="font-medium">{data.loanTermMonths} meses</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Taxa de Juros</p>
              <p className="font-medium">{calculationResult.interestRate}% a.m.</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Parcela Mensal</p>
              <p className="font-medium">{formatCurrency(calculationResult.monthlyPayment)}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Processando..." : "Finalizar Simulação"}
        </Button>
      </CardFooter>
    </Card>
  )
}
