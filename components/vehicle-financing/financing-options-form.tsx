"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { calculateVehicleFinancing, parseVehicleValue } from "@/lib/vehicle-calculator"

interface FinancingOptionsFormProps {
  vehicleValue: string
  data: {
    downPaymentPercentage: number
    loanTermMonths: number
  }
  onUpdate: (data: any) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

export function FinancingOptionsForm({
  vehicleValue,
  data,
  onUpdate,
  onSubmit,
  onBack,
  isSubmitting,
}: FinancingOptionsFormProps) {
  const [calculations, setCalculations] = useState({
    downPaymentAmount: 0,
    loanAmount: 0,
    interestRate: 0,
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
  })

  // Função para converter valor do veículo para número
  const getVehicleValueAsNumber = (value: string): number => {
    if (!value) return 0
    return parseVehicleValue(value)
  }

  // Recalcular sempre que os dados mudarem
  useEffect(() => {
    const numericVehicleValue = getVehicleValueAsNumber(vehicleValue)

    console.log("Calculating with:", {
      vehicleValue: numericVehicleValue,
      downPaymentPercentage: data.downPaymentPercentage,
      loanTermMonths: data.loanTermMonths,
    })

    if (numericVehicleValue > 0) {
      const result = calculateVehicleFinancing({
        vehicleValue: numericVehicleValue,
        downPaymentPercentage: data.downPaymentPercentage,
        loanTermMonths: data.loanTermMonths,
      })

      console.log("Calculation result:", result)
      setCalculations(result)
    } else {
      setCalculations({
        downPaymentAmount: 0,
        loanAmount: 0,
        interestRate: 0,
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
      })
    }
  }, [vehicleValue, data.downPaymentPercentage, data.loanTermMonths])

  const handleDownPaymentChange = (value: number[]) => {
    const newPercentage = value[0]
    onUpdate({
      ...data,
      downPaymentPercentage: newPercentage,
    })
  }

  const handleTermChange = (months: number) => {
    onUpdate({
      ...data,
      loanTermMonths: months,
    })
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const numericVehicleValue = getVehicleValueAsNumber(vehicleValue)
  const isValidValue = numericVehicleValue > 0

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Opções de Financiamento</CardTitle>
        <p className="text-center text-muted-foreground">Personalize as condições do seu financiamento</p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Valor de Entrada */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Valor de Entrada</h3>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {formatCurrency(calculations.downPaymentAmount)}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>5%</span>
              <span>50%</span>
              <span>95%</span>
            </div>
            <Slider
              value={[data.downPaymentPercentage]}
              onValueChange={handleDownPaymentChange}
              max={95}
              min={5}
              step={5}
              className="w-full"
              disabled={!isValidValue}
            />
            <div className="text-center text-sm text-muted-foreground">{data.downPaymentPercentage}% de entrada</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Valor do Veículo:</span>
              <div className="font-semibold">{formatCurrency(numericVehicleValue)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Valor Financiado:</span>
              <div className="font-semibold">{formatCurrency(calculations.loanAmount)}</div>
            </div>
          </div>
        </div>

        {/* Prazo de Financiamento */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Prazo de Financiamento</h3>
          <div className="grid grid-cols-4 gap-2">
            {[12, 24, 36, 48].map((months) => (
              <Button
                key={months}
                variant={data.loanTermMonths === months ? "default" : "outline"}
                onClick={() => handleTermChange(months)}
                disabled={!isValidValue}
                className="h-12"
              >
                {months}x
              </Button>
            ))}
          </div>
        </div>

        {/* Resumo dos Cálculos */}
        {isValidValue && (
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Taxa de Juros</span>
                <div className="text-lg font-semibold">{calculations.interestRate.toFixed(2)}% a.m.</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Parcela Mensal</span>
                <div className="text-lg font-semibold">{formatCurrency(calculations.monthlyPayment)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <span className="text-sm text-muted-foreground">Total de Juros</span>
                <div className="text-lg font-semibold text-orange-600">
                  {formatCurrency(calculations.totalInterest)}
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Total a Pagar</span>
                <div className="text-lg font-semibold text-green-600">{formatCurrency(calculations.totalPayment)}</div>
              </div>
            </div>
          </div>
        )}

        {!isValidValue && (
          <div className="text-center text-muted-foreground py-8">
            <p>Informe o valor do veículo para ver as opções de financiamento</p>
          </div>
        )}

        {/* Botões de Navegação */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting || !isValidValue} className="min-w-[120px]">
            {isSubmitting ? "Finalizando..." : "Finalizar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
